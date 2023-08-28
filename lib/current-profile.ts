import { auth } from '@clerk/nextjs'
import { db } from '@/lib'
import { Profile } from '@prisma/client'

export const currentProfile = async (): Promise<Profile | null> => {
  const { userId } = auth()
  if (!userId) return null

  const profile = db.profile.findUnique({
    where: {
      userId
    }
  })

  return profile
}