import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/payload-generated-schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URI,
  },
})
