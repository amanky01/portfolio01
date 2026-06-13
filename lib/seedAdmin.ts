import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../models/Admin'
import { hashPassword } from './password'

dotenv.config({ path: '.env' })

const RAW_URI = process.env.MONGODB_URI!

function encodedURI(uri: string): string {
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+?)@(.+)$/)
    if (!match) return uri
    const [, proto, user, pass, rest] = match
    return `${proto}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${rest}`
  } catch {
    return uri
  }
}

const MONGODB_URI = encodedURI(RAW_URI)
const MONGODB_DB = process.env.MONGODB_DB || 'portfolio'

/**
 * Seeds or updates the admin account in MongoDB.
 * Uses SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD from env (seed-only, not used at login runtime).
 *
 * Example:
 *   SEED_ADMIN_EMAIL=you@site.com SEED_ADMIN_PASSWORD='your-strong-password' npm run seed:admin
 */
async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Missing seed credentials.')
    console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, then run: npm run seed:admin')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('SEED_ADMIN_PASSWORD must be at least 8 characters.')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
  console.log(`Connected to MongoDB → db: "${MONGODB_DB}"`)

  const passwordHash = await hashPassword(password)
  const admin = await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  console.log(`✅ Admin account ready for: ${admin.email}`)
  console.log('   Password stored as bcrypt hash in the Admin collection.')
  process.exit(0)
}

seedAdmin().catch(err => {
  console.error(err)
  process.exit(1)
})
