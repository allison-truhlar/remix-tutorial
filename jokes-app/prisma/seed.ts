import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// Neither of the below work with the original ts-node command from the tutorial
//Original issue I was facing with ts-node: https://github.com/TypeStrong/ts-node/issues/1997
//tsx as a replacement for ts-node: https://stackoverflow.com/questions/65097694/to-load-an-es-module-set-type-module-in-the-package-json-or-use-the-mjs-e
//(second response)

// Workaround for bun from https://github.com/prisma/prisma/issues/21324#issuecomment-1751945478
//This version works for bun prisma/seed.ts (bunx prisma db seed) (bun v.1.0.25)
//Or for npx tsx prisma/seed.ts
try {
  await Promise.all(
    getJokes().map((joke) => {
      return db.joke.create({ data: joke });
    })
  );
  console.log("after create");
  const count = await db.joke.count();
  console.log(`There are ${count} jokes in the database.`);
} catch (error) {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
}

// // See https://github.com/oven-sh/bun/issues/3137
// // This version works with tsx primsa/seed.ts, but not bunx (v.1.0.25)
// async function seed() {
//   console.log("start seed function");
//   await Promise.all(
//     getJokes().map((joke) => {
//       console.log("another joke");
//       return db.joke.create({ data: joke });
//     })
//   );
//   console.log("after create");
//   const count = await db.joke.count();
//   console.log(`There are ${count} jokes in the database.`);
// }

// seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}
