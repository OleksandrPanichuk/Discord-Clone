"use client"
import { Member } from "@prisma/client"
import { ElementRef, FC, Fragment, useRef } from "react"
import { Loader2, ServerCrash } from "lucide-react"
import { format } from 'date-fns'


import { ChatWelcome } from "@/components/chat/chat-welcome"
import { ChatItem } from "@/components/chat/chat-item"
import { useChatQuery, useChatScroll, useChatSocket } from "@/hooks"
import { MessageWithMemberWithProfile } from "@/types"


const DATE_FORMAT = 'd MMM yyyy, HH:mm'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: "channelId" | 'conversationId'
  paramValue: string
  type: "channel" | "conversation"
}

export const ChatMessages: FC<ChatMessagesProps> = ({ name, member, chatId, socketQuery, socketUrl, paramKey, paramValue, type, apiUrl }) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })
  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0
  })

  if (status === 'loading') {
    return <div className="flex flex-col flex-1 justify-center items-center">
      <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4 dark:text-zinc-400" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
    </div>
  }

  if (status === 'error') {
    return <div className="flex flex-col flex-1 justify-center items-center">
      <ServerCrash className="h-7 w-7 text-zinc-500 my-4 dark:text-zinc-400" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong</p>
    </div>
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (
        <ChatWelcome type={type} name={name} />
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500  animate-spin my-4" />
          ) : <button onClick={() => fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">Load previous messages</button>}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                message={message}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                currentMember={member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt} />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
