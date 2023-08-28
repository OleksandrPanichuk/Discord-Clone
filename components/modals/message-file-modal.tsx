"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'

import { FileUpload } from '@/components/file-upload/file-upload'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks'

const formSchema = z.object({
  file: z.object({
    url: z.string().min(1, {
      message: "Server image is required."
    }),
    key: z.string()
  })
})

export function MessageFileModal() {
  const { isOpen, onClose, type, data } = useModal()
  const { query, apiUrl } = data

  const isModalOpen = isOpen && type === 'messageFile'
  const form = useForm({
    defaultValues: {
      file: {
        url: '',
        key: ''
      },
    },
    resolver: zodResolver(formSchema)
  })
  const isLoading = form.formState.isSubmitting


  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl ?? '',
        query: query
      })
      await axios.post(url, { ...values, content: values.file.url })

      form.reset()
      router.refresh()
      handleClose()
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
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Add an attachment
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className={'space-y-8 px-6'}>
              <div className='flex items-center text-center justify-center'>
                <FormField control={form.control} name="file" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="messageFile"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant={'primary'}>Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
