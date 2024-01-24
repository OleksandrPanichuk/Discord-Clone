'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { LogOut, Settings } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'

export const NavigationUserButton = () => {
	const [mounted, setMounted] = useState(false)

	const { user } = useUser()
	const { signOut, openUserProfile } = useClerk()
	const router = useRouter()

	useEffect(() => {
		setMounted(true)
	}, [])
	if (!user || !mounted) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button>
					<Image
						src={user.imageUrl}
						alt={user.primaryEmailAddress?.emailAddress!}
						width={48}
						height={48}
						className="rounded-full"
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top">
				<div className="flex items-center gap-2 p-2">
					<Image
						width={32}
						height={32}
						className={'rounded-full'}
						src={user.imageUrl}
						alt={user.primaryEmailAddress?.emailAddress!}
					/>
					<div>
						<h4>{user.fullName}</h4>
						<p className="text-xs font-medium leading-none">
							{user.emailAddresses[0].emailAddress}
						</p>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex items-center gap-2 mb-1"
					onClick={() => openUserProfile()}
				>
					<Settings />
					Manage account
				</DropdownMenuItem>
				<DropdownMenuItem
					className="flex items-center gap-2"
					onClick={() => signOut(() => router.push('/'))}
				>
					<LogOut />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
	// return (
	// 	<UserButton
	// 		afterSignOutUrl="/"
	// 		appearance={{
	// 			elements: {
	// 				avatarBox: 'h-[48px] w-[48px]',

	// 				userButtonPopoverCard: 'dark:bg-zinc-800 dark:text-white ',
	// 				userButtonPopoverActionButtonText: 'dark:text-white',
	// 				userButtonPopoverActionButtonIcon: 'dark:text-white',
	// 				userButtonPopoverFooter: 'hidden',
	// 				userPreviewSecondaryIdentifier: 'dark:text-white'
	// 			}
	// 		}}
	// 	/>
	// )
}
