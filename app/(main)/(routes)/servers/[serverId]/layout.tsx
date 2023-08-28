import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'

import { ServerSidebar } from '@/components/server/server-sidebar'
import { currentProfile, db } from '@/lib'

const ServerIdLayout = async ({ children, params }: { children: ReactNode, params: { serverId: string } }) => {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (!server) return redirect('/')

  return (
    <div className='h-full'>
      <div className={'hidden-md-flex h-full z-20 flex-col w-60 inset-y-0 fixed'}>
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  )
}

export default ServerIdLayout