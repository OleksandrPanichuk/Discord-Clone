"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import qs from 'query-string'
import axios from "axios"


import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { useModal } from "@/hooks"
import { EmojiPicker } from "@/components/emoji-picker"


import { ChatInputProps, TypeForm, formSchema } from "./chat.types.d"
import { useRouter } from "next/navigation"





export const ChatInput: FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
  const form = useForm<TypeForm>({
    defaultValues: {
      content: ''
    },
    resolver: zodResolver(formSchema)
  })
  const isLoading = form.formState.isSubmitting

  const router = useRouter()

  const { onOpen } = useModal()

  const onSubmit = async (values: TypeForm) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })
      await axios.post(url, values)

      form.reset()
      router.refresh()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'content'}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button type="button" onClick={() => onOpen('messageFile', { apiUrl, query })} className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    disabled={isLoading}
                    placeholder={`Message ${type === 'channel' ? '#' + name : name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker onChange={(emoji:string) => field.onChange(`${field.value}${emoji}`)} />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
