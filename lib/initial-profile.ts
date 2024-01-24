
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { Profile } from '@prisma/client'
import { db } from "@/lib";

export const initialProfile = async (): Promise<Profile> => {
  const user = await currentUser();
  if (!user) throw redirectToSignIn()

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  })

  if (profile) return profile;

  const username = user.firstName ?  `${user.firstName} ${user.lastName ?? ''}` : user.username ?? user.emailAddresses[0].emailAddress.split('@')[0]

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: username,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  })

  return newProfile
}