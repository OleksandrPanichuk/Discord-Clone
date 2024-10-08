import { Hash } from "lucide-react"
import { FC } from "react"

import { MobileToggle } from "@/components/mobile-toggle"
import { UserAvatar } from "@/components/user-avatar"
import { SocketIndicator } from "@/components/socket-indicator"
import { ChatHeaderProps } from "./chat.types.d"
import { ChatVideoButton } from "./chat-video-button"





export const ChatHeader: FC<ChatHeaderProps> = ({ serverId, name, type, imageUrl }) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 ">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center gap-x-1">
        {type === 'conversation' && (
          <ChatVideoButton />
        )}
        <SocketIndicator />
      </div>
    </div>
  )
}
