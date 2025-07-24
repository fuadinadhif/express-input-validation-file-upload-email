import { NextFunction, Request, Response } from "express";

import { memcachedClient } from "@/configs/memcached.config.js";
import { prisma } from "@/configs/prisma.config.js";
import logger from "@/utils/logger.js";

export async function getAllUsers(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const cacheKey = "users";
    const cachedResult = await memcachedClient.get(cacheKey);

    if (cachedResult.value) {
      logger.info("From cached data");
      const cachedUsers = JSON.parse(cachedResult.value.toString());
      return response.status(200).json(cachedUsers);
    }

    logger.info("From database");
    const users = await prisma.user.findMany();

    await memcachedClient.set(cacheKey, JSON.stringify(users), {
      expires: 120,
    });

    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
