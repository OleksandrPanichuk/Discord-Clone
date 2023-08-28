import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from '@/types';
import { currentProfilePages, db } from '@/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') return res.status(405).json({ message: "Method not allowed" })

  try {
    const profile = await currentProfilePages(req)

    if (!profile) return res.status(401).json({ error: "Unauthorized" })

    const { content, file } = req.body
    const { conversationId } = req.query

    if (!content) return res.status(400).json({ error: "Message is required" })



    if (!conversationId) return res.status(400).json({ error: "Conversation ID missing" })


    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id
            }
          },
          {
            memberTwo: {
              profileId: profile.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
    if (!conversation) return res.status(404).json({ message: "Conversation not found" })

    const member = conversation?.memberOne.profileId === profile.id ? conversation.memberOne : conversation?.memberTwo

    if (!member) return res.status(404).json({ message: "Member not found" })

    const message = await db.directMessage.create({
      data: {
        content,
        file,
        conversationId: conversationId as string,
        memberId: member.id
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })

    const channelKey = `chat:${conversationId}:messages`
    res?.socket?.server?.io?.emit(channelKey, message)
    return res.status(200).json(message)
  } catch (err) {
    console.log("[DIRECT_MESSAGES_POST]", err);
    return res.status(500).json({ message: "Internal Error" })
  }
}