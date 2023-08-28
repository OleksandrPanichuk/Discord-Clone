import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { FC } from 'react'

interface UserAvatarProps {
  src?: string
  className?: string
}

export const UserAvatar: FC<UserAvatarProps> = ({ src, className }) => {
  return (
    <Avatar className={cn('h-7 w-7 md:w-10 md:h-10', className)}>
      <AvatarImage src={src} />
    </Avatar>
  )
}
