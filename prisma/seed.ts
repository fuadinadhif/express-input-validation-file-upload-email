import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { prisma } from "@/configs/prisma.config.js";

async function seed() {
  try {
    console.info(`Seed started...`);

    /* -------------------------- Delete previous data -------------------------- */
    console.info(`\nDelete all previous data...`);
    await prisma.user.deleteMany();
    console.info(`All previous data has been deleted\n`);

    /* ----------------------------- Create new data ---------------------------- */
    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const password = await bcrypt.hash("newpass", 10);
      const profilePic = faker.image.avatar();

      console.info(`Creating ${firstName} data...`);

      await prisma.user.create({
        data: { firstName, lastName, email, password, profilePic },
      });
    }

    console.info(`\nSeeding data finished successfully`);
  } catch (error) {
    console.error(`Seed failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
