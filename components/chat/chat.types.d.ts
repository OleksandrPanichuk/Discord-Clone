import { z } from "zod";

export const formSchema = z.object({
  content: z.string().min(1),
})

export type TypeForm = z.infer<typeof formSchema>



export interface ChatInputProps {
  apiUrl: string
  name: string
  type: "conversation" | "channel"
  query: Record<string, any>
}


export interface ChatHeaderProps {
  serverId: string
  name: string
  type: "channel" | "conversation"
  imageUrl?: string
}