import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeMarketImage } from "@/lib/ai/analyzer";
import { canUpload } from "@/lib/plans";
import { Plan } from "@/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    // Get user with plan
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const plan = user.plan as Plan;

    // Check daily upload limit
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const uploadsToday = await prisma.analysis.count({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
    });

    if (!canUpload(plan, uploadsToday)) {
      const planLimits: Record<Plan, number> = {
        basic: 20,
        elite: Infinity,
      };
      return NextResponse.json(
        {
          error: `Daily analysis limit reached. Your ${plan} plan allows ${planLimits[plan]} analyses per day. Upgrade for more.`,
          code: "LIMIT_REACHED",
        },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Validate file size
    if (imageFile.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run AI analysis
    const analysisResult = await analyzeMarketImage(buffer, imageFile.type);

    // Save to database
    const saved = await prisma.analysis.create({
      data: {
        userId,
        imageUrl: `upload_${Date.now()}_${imageFile.name}`, // In production, store in S3/Cloudflare
        recommendation: analysisResult.recommendation,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
        marketType: analysisResult.marketType,
        signals: JSON.stringify(analysisResult.signals),
      },
    });

    // Return result (strip confidence for free users)
    const response = {
      id: saved.id,
      recommendation: saved.recommendation,
      confidence: analysisResult.confidence, // Always send, client handles display
      reasoning: saved.reasoning,
      marketType: saved.marketType,
      signals: analysisResult.signals,
      createdAt: saved.createdAt.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
