"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


import { FileUpload } from '@/components/file-upload/file-upload'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks'

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  image: z.object({
    url: z.string().min(1, {
      message: "Server image is required."
    }),
    key: z.string()
  })
})

export function EditServerModal() {
  const { onClose, isOpen, type, data } = useModal()
  const { server } = data

  const form = useForm({
    defaultValues: {
      name: '',
      image: {
        url: '',
        key: ''
      },
    },
    resolver: zodResolver(formSchema)
  })

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name)
      form.setValue('image', server.image)
    }
  }, [server, form])

  const isLoading = form.formState.isSubmitting

  const isModalOpen = isOpen && type === 'editServer'
  const router = useRouter()



  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values)

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


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white dark:text-white dark:bg-zinc-800 text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500 dark:text-zinc-400'>
            Give your server a personality with a name and an image. You can always change it late.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className={'space-y-8 px-6'}>
              <div className='flex items-center text-center justify-center'>
                <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="serverImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70' >Server Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className={'border border-zinc-400 dark:border-zinc-900 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0'}
                        placeholder='Enter server name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 dark:bg-zinc-900 px-6 py-4'>
              <Button disabled={isLoading} variant={'primary'}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}
