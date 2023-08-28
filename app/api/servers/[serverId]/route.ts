import { currentProfile, db } from '@/lib'
import { NextResponse } from 'next/server'
import { utapi } from 'uploadthing/server'


export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    const { name, image } = await req.json()

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        name, image
      }
    })

    return NextResponse.json(server)
  } catch (err) {
    console.log('[SERVER_PATCH]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    // TODO: delete all files in messages from cloud
    const server = await db.server.findUnique({
      where: {
        id: params?.serverId,
        profileId: profile.id
      },
      include: {
        channels: {
          include: {
            messages: true
          }
        }
      }
    })


    if (server?.channels) {
      server?.channels?.forEach((channel) => {
        if (channel?.messages?.length) {
          channel.messages.forEach(async message => {
            if (message?.file?.key) {
              try {
                await utapi.deleteFiles([message.file.key])
              } catch { }
            }
          })
        }
      })
    }


    try {
      if (server?.image?.key) {
        await utapi.deleteFiles([server.image.key])
      }
    } catch { }


    await db.server.delete({
      where: {
        id: params?.serverId,
        profileId: profile.id
      }
    })

    return NextResponse.json({ message: "Server successfully deleted" })
  } catch (err) {
    console.log('[SERVER_DELETE]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
