"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FC, ReactNode } from 'react'

interface ActionTooltipProps {
  label: string
  children: ReactNode
  side?: "top" | 'right' | 'bottom' | 'left'
  align?: "start" | 'center' | 'end'
}

export const ActionTooltip: FC<ActionTooltipProps> = ({ label, children, side, align }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className='font-semibold text-sm capitalize'>{label.toLowerCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
