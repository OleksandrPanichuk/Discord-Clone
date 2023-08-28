"use client"

import { MessageWithMemberWithProfile } from "@/types"
import { Member, MemberRole } from "@prisma/client"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { z } from 'zod'
import axios from "axios"
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"


import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import Image from "next/image"
import { cn } from "@/lib/utils"

import { Form, FormControl, FormItem, FormField } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks"

interface ChatItemProps {
  message: MessageWithMemberWithProfile
  timestamp: string
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const formSchema = z.object({
  content: z.string().min(1)
})

const roleIconMap = {
  'GUEST': null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

export const ChatItem: FC<ChatItemProps> = ({ message, timestamp, currentMember, isUpdated, socketQuery, socketUrl }) => {
  const [isEditing, setIsEditing] = useState(false)
  const { onOpen } = useModal()


  const { id, content, member, file, deleted } = message
  const { profile, role } = member

  const fileType = file?.url?.split('.').pop()

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !file?.url

  const isPDF = fileType === 'pdf' && file?.url
  const isImage = !isPDF && file?.url


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content
    }
  })

  const params = useParams()
  const router = useRouter()

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  useEffect(() => {
    form.reset({
      content
    })
  }, [content, form])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        setIsEditing(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })
      await axios.patch(url, values)

      form.reset()
      setIsEditing(false)

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                {profile.name}
              </p>
              <ActionTooltip label={role}>
                {roleIconMap[role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <a href={file.url}
              target="_blank"
              rel='noopener noreferrer'
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
              <Image fill src={file.url} alt="content" className="object-cover" />
            </a>
          )}
          {isPDF && (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={file.url}
                target="_black"
                rel="noopener noreferrer"
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                PDF File
              </a>
            </div>
          )}
          {!file?.url && !isEditing && (
            <p className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300",
              deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
              )}
            </p>
          )}
          {!file?.url && isEditing && (
            <Form {...form}>
              <form className="flex items-center w-full gap-x-2 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name='content' render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          disabled={isLoading}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited message" {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
                <Button disabled={isLoading} size={'sm'} variant={'primary'} >Save</Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">Press escape to cancel, enter to save</span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash onClick={() => onOpen('deleteMessage', { apiUrl: `${socketUrl}/${id}`, query: socketQuery })} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
