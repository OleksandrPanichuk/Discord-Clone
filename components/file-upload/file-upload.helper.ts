"use server"

import { utapi } from "uploadthing/server"

export const deleteImage = async (key: string) => {
  await utapi.deleteFiles([key])
}