"use client"

import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'


import { FC } from "react"
import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { deleteImage } from './file-upload.helper'


interface FileUploadProps {
  onChange: ({ url, key }: { url?: string, key?: string }) => void
  endpoint: 'serverImage' | 'messageFile'
  value: {
    url: string
    key: string
  }
}

export const FileUpload: FC<FileUploadProps> = ({ onChange, value, endpoint }) => {
  const fileType = value?.url?.split('.').pop()



  if (value?.url && fileType !== 'pdf') {
    return (
      <div className='h-20 w-20 relative'>
        <Image src={value.url} alt='upload' className='rounded-full' fill />
        <button onClick={() => {
          deleteImage(value.key)
          onChange({ key: '', url: '' })
        }} className={'bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'} type={'button'}>
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }
  if (value?.url && fileType === 'pdf') {
    return (
      <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value.url}
          target="_black"
          rel="noopener noreferrer"
          className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
          {value?.url?.slice(0, 50)}
        </a>
        <button onClick={() => {
          deleteImage(value.key)
          onChange({ key: '', url: '' })
        }} className={'bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'} type={'button'}>
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone  endpoint={endpoint} onClientUploadComplete={(res) => {
      onChange({ url: res?.[0].url, key: res?.[0].key })
    }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}
