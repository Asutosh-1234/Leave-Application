import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import ENV from './src/utilities/env'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: ENV.MYSQL_DB_URL!,
  },
})
