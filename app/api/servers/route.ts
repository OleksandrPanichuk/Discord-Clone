import { NextResponse } from "next/server";

import { currentProfile, db } from "@/lib";
import { v4 as uuidv4 } from 'uuid'
import { MemberRole } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { name, image } = await req.json()
    const profile = await currentProfile()

    if (!profile) return new NextResponse("Unauthorized", { status: 401 })

    const server = await db.server.create({
      data: {
        name,
        image,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id
            }
          ]
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN
            }
          ]
        }
      }
    })
    return NextResponse.json(server);
  } catch (err) {
    console.log("[SERVER_POST]", err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}