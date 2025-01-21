import { z } from 'zod'

export const signUpSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6).max(10)
})
export const signInSchema = z.object({

    email: z.string().email(),
    password: z.string().min(6).max(10)
})
export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(10),
})