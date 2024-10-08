import { redirectToSignIn } from "@clerk/nextjs"
import { currentProfile, db, getOrCreateConversation } from "@/lib"
import { redirect } from "next/navigation"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { MediaRoom } from "@/components/media-room"

interface MemberIdPageProps {
  params: {
    serverId: string
    memberId: string
  },
  searchParams: {
    video?: boolean
  }
}


const ConversationPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) return redirectToSignIn()

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) return redirect(`/`)

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

  if (!conversation) return redirect(`/servers/${params.serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne


  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader imageUrl={otherMember.profile.imageUrl} name={otherMember.profile.name} type="conversation" serverId={params.serverId} />
      {!searchParams?.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id
            }}
          />
          <ChatInput name={otherMember.profile.name} type="conversation" apiUrl="/api/socket/direct-messages" query={{
            conversationId: conversation.id
          }} />
        </>
      )}
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
    </div>
  )
}

export default ConversationPage