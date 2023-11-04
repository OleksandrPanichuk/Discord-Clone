import { getAuth } from '@clerk/nextjs/server'
import { db } from '@/lib'
import { Profile } from '@prisma/client'
import { NextApiRequest } from 'next'

export const currentProfilePages = async (req: NextApiRequest): Promise<Profile | null> => {
  const { userId } = getAuth(req)
  if (!userId) return null

  const profile = db.profile.findUnique({
    where: {
      userId
    }
  })

  return profile
}