import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/__generated__/client'
import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config";
// import dotenv from 'dotenv'
// import { expand } from 'dotenv-expand'

// const envConfig = dotenv.config()
// expand(envConfig)

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    console.log(process.env.POSTGRES_URI)
    const adapter = new PrismaPg({
      connectionString: process.env.POSTGRES_URI as string,
    });
    super({ adapter });
  }
}
