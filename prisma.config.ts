import "dotenv/config";
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import { defineConfig, env } from "prisma/config";

const envConfig = dotenv.config()
expand(envConfig)

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("POSTGRES_URI"),
  },
});
