'use client'

import { UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export const NavigationUserButton = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])
	if (!mounted) return null
	return (
		<UserButton
			afterSignOutUrl="/"
			appearance={{
				elements: {
					avatarBox: 'h-[48px] w-[48px]',
				
					userButtonPopoverCard: 'dark:bg-zinc-800 dark:text-white ',
					userButtonPopoverActionButtonText: 'dark:text-white',
					userButtonPopoverActionButtonIcon: 'dark:text-white',
					userButtonPopoverFooter: 'hidden',
					userPreviewSecondaryIdentifier: 'dark:text-white'
				}
			}}
		/>
	)
}
