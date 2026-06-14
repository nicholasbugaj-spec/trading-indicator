import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const codes = [
  // Single-use elite codes (for friends / influencers)
  { code: "GOAT2025",   plan: "elite", usesLeft: 1   },
  { code: "SHARPBETS",  plan: "elite", usesLeft: 1   },
  { code: "WINNER100",  plan: "elite", usesLeft: 1   },
  { code: "INSIDER",    plan: "elite", usesLeft: 1   },
  { code: "EDGECLUB",   plan: "elite", usesLeft: 1   },
  // Multi-use elite codes (for promotions)
  { code: "LAUNCH50",   plan: "elite", usesLeft: 50  },
  { code: "BETSMARTER", plan: "elite", usesLeft: 100 },
  // Unlimited basic codes
  { code: "FREEBASIC",  plan: "basic", usesLeft: null },
  { code: "TRYME",      plan: "basic", usesLeft: null },
];

async function main() {
  console.log("Seeding discount codes...");
  for (const c of codes) {
    await prisma.discountCode.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        plan: c.plan,
        usesLeft: c.usesLeft ?? null,
        active: true,
      },
    });
    console.log(`  ✓ ${c.code} (${c.plan}, uses: ${c.usesLeft ?? "unlimited"})`);
  }
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
