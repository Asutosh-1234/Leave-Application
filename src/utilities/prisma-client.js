import { PrismaClient } from '../../generated/prisma/client.ts'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import ENV from './env.js'

const adapter = new PrismaMariaDb(ENV.MYSQL_DB_URL)
const prisma = new PrismaClient({ adapter })

export default prisma
