import { FC } from "react"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react"

import { currentProfile, db } from "@/lib"
import { ServerHeader } from '@/components/server/server-header'
import { ServerSection } from "@/components/server/server-section"
import { ServerSearch } from "@/components/server/server-search"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ServerChannel } from "@/components/server/server-channel"
import { ServerMember } from "@/components/server/server-member"

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}

export const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  })
  if (!server) return redirect('/')

  const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)

  const members = server?.members.filter(member => member.profileId !== profile.id);

  const role = server.members.find(member => member.profileId === profile.id)?.role


  return (
    <div className='flex flex-col h-full text-primary w-full font-dark dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={[
            {
              label: 'Text Channels',
              type: 'channel',
              data: textChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Voice Channels",
              type: 'channel',
              data: audioChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Video Channels",
              type: 'channel',
              data: videoChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: 'Members',
              type: 'member',
              data: members?.map(member => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role]
              }))
            }
          ]} />
          <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection label="Text Channels" channelType={ChannelType.TEXT} role={role} sectionType="channels" />
              <div className="space-y-[2px]">
                {textChannels.map(channel => (
                  <ServerChannel server={server} channel={channel} role={role} key={channel.id} />
                ))}
              </div>
            </div>
          )}
          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection label="Voice Channels" channelType={ChannelType.AUDIO} role={role} sectionType="channels" />
              <div className="space-y-[2px]">
                {audioChannels.map(channel => (
                  <ServerChannel server={server} channel={channel} role={role} key={channel.id} />
                ))}
              </div>
            </div>
          )}
          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection label="Video Channels" channelType={ChannelType.VIDEO} role={role} sectionType="channels" />
              <div className="space-y-[2px]">
                {videoChannels.map(channel => (
                  <ServerChannel server={server} channel={channel} key={channel.id} role={role} />
                ))}
              </div>
            </div>
          )}
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection label="Members" sectionType="members" server={server} role={role} />
              <div className="space-y-[2px]">
                {members.map(member => (
                  <ServerMember key={member.id} member={member} server={server} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
