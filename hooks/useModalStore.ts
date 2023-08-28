import { Channel, ChannelType, Server } from '@prisma/client'
import { create } from 'zustand'

export type ModalType = "createServer" | 'invite' | 'editServer' | 'members' | 'createChannel' | 'leaveServer' | 'deleteServer' | 'deleteChannel' | 'editChannel' | 'messageFile' | 'deleteMessage'

interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

interface ModalData {
  server?: Server
  channelType?: ChannelType
  channel?: Channel
  apiUrl?: string
  query?: Record<string, any>
}


export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}))