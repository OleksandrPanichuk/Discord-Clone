'use client'

import { FC } from 'react'

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { useTheme } from 'next-themes'

import Picker, { Theme } from 'emoji-picker-react'

interface EmojiPickerProps {
	onChange: (value: string) => void
}

export const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
	const { resolvedTheme } = useTheme()

	const currentTheme = (resolvedTheme || 'light') as keyof typeof themeMap

	const themeMap = {
		dark: Theme.DARK,
		light: Theme.LIGHT
	}

	const theme = themeMap[currentTheme]
	return (
		<Popover>
			<PopoverTrigger>
				<Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
			</PopoverTrigger>
			<PopoverContent
				side="right"
				
				className="bg-transparent border-none shadow-none drop-shadow-none mb-16 -mr-6"
			>
				<Picker
					height={350}
          width={280}
					onEmojiClick={(data) => onChange(data.emoji)}
					theme={theme}
				/>
			</PopoverContent>
		</Popover>
	)
}
