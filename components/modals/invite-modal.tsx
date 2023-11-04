'use client'
import { CheckIcon, Copy, RefreshCw } from 'lucide-react'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useModal, useOrigin } from '@/hooks'
import { useState } from 'react'
import axios from 'axios'
import { Server } from '@prisma/client'

export function InviteModal() {
	const [copied, setCopied] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { onClose, isOpen, type, data, onOpen } = useModal()
	const isModalOpen = isOpen && type === 'invite'

	const origin = useOrigin()

	const { server } = data

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl)
		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, 3000)
	}

	const onNew = async () => {
		try {
			setIsLoading(true)
			const res = await axios.patch<Server>(
				`/api/servers/${server?.id}/invite-code`
			)
			onOpen('invite', { server: res?.data })
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-zinc-800 dark:text-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Invite Friends
					</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
						Server Invite Link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							disabled={isLoading}
							className="border border-zinc-400 dark:border-zinc-900 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={inviteUrl}
						/>
						<Button
							disabled={isLoading}
							className={'dark:bg-background dark:text-white'}
							size={'icon'}
							onClick={onCopy}
						>
							{copied ? (
								<CheckIcon className="w-4 h-4" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>
					<Button
						onClick={onNew}
						disabled={isLoading}
						variant={'link'}
						size="sm"
						className="text-xs text-zinc-500 mt-4 dark:text-zinc-400"
					>
						Generate a new link
						<RefreshCw className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
