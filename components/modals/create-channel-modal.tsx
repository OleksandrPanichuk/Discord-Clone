"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import qs from 'query-string'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/hooks'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectValue } from '@/components/ui/select'
import { ChannelType } from '@prisma/client'
import { useEffect } from 'react'

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required."
  }).refine(name => name !== 'general', { message: "Channel name cannot be 'general'" }),
  type: z.nativeEnum(ChannelType)
})

export function CreateChannelModal() {
  const params = useParams()


  const { onClose, isOpen, type, data } = useModal()
  const isModalOpen = isOpen && type === 'createChannel'
  const { channelType } = data

  const router = useRouter()


  const form = useForm({
    defaultValues: {
      name: '',
      type: channelType || ChannelType.TEXT
    },
    resolver: zodResolver(formSchema)
  })

  const isLoading = form.formState.isSubmitting
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: params?.serverId
        }
      })
      await axios.post(url, values)

      form.reset()
      router.refresh()
      onClose()
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }


  useEffect(() => {
    if (channelType) form.setValue('type', channelType)
    else form.setValue('type', ChannelType.TEXT)
  }, [channelType, form])


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white  dark:bg-zinc-800 dark:text-white text-black  p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className={'space-y-8 px-6'}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold  text-zinc-500 dark:text-white' >Channel Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className={'border border-zinc-400 dark:border-zinc-900 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0'}
                        placeholder='Enter channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name='type' render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-xs font-bold  text-zinc-500 dark:text-white' >Channel type</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='border border-zinc-400 dark:border-zinc-900 focus:ring-0 dark:text-white text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ChannelType).map(type => (
                        <SelectItem key={type} value={type} className='capitalize'>{type.toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter className='bg-gray-100 dark:bg-zinc-900 px-6 py-4'>
              <Button disabled={isLoading} variant={'primary'}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}
