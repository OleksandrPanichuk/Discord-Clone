"use client"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'



import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks'
import { Button } from '@/components/ui/button'


export function DeleteServerModal() {
  const [isLoading, setIsLoading] = useState(false)
  const { onClose, isOpen, type, data } = useModal()

  const { server } = data
  const isModalOpen = isOpen && type === 'deleteServer'

  const router = useRouter()

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/servers/${server?.id}`)
      onClose()
      router.refresh()
      router.push('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white dark:bg-zinc-800 dark:text-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Server
          </DialogTitle>
          <DialogDescription className={'text-center text-zinc-500 dark:text-zinc-400'} >
            Are you sure you want to do this? <br />
            <span className='text-indigo-500 font-semibold'>{server?.name}</span> will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 dark:bg-zinc-900 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} onClick={onClose} variant={'ghost'}>Cancel</Button>
            <Button disabled={isLoading} variant={'primary'} onClick={onClick}>Confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
