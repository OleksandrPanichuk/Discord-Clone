import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"


import { currentProfile, db } from "@/lib"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChannelType } from "@prisma/client"
import { MediaRoom } from "@/components/media-room"

interface ChannelIdPageProps {
  params: {
    channelId: string
    serverId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  })

  if (!channel || !member) return redirect(`/`);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader type="channel" name={channel.name} serverId={channel.serverId} />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages member={member} name={channel.name} type='channel' apiUrl={'/api/messages'} socketUrl="/api/socket/messages" socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
            paramKey='channelId'
            paramValue={channel.id}
            chatId={channel.id}
          />
          <ChatInput name={channel.name} type={"channel"} apiUrl={'/api/socket/messages'} query={{
            channelId: channel.id,
            serverId: channel.serverId
          }} />
        </>
      )}
      {channel.type === ChannelType.AUDIO && <MediaRoom chatId={channel.id} video={false} audio={true} />}
      {channel.type === ChannelType.VIDEO && <MediaRoom chatId={channel.id} video={true} audio={true} />}
    </div>
  )
}

export default ChannelIdPage