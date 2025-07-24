import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { prisma } from "@/configs/prisma.config.js";
import logger from "@/utils/logger.js";

async function seed() {
  try {
    logger.info(`Seed started...`);

    /* -------------------------- Delete previous data -------------------------- */
    logger.info(`Delete all previous data...`);
    await prisma.user.deleteMany();
    logger.info(`All previous data has been deleted`);

    /* ----------------------------- Create new data ---------------------------- */
    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const password = await bcrypt.hash("newpass", 10);
      const profilePic = faker.image.avatar();

      logger.info(`Creating ${firstName} data...`);

      await prisma.user.create({
        data: { firstName, lastName, email, password, profilePic },
      });
    }

    logger.info(`Seeding data finished successfully`);
  } catch (error) {
    logger.error(`Seed failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
