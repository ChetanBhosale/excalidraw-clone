

import { z } from "zod";


export const ISignupSchema = z.object({
    email: z.string().email(),
    password : z.string().min(8),
    name : z.string().min(1),
})

export const ICreateRoomSchema = z.object({
    name : z.string().min(1),
    slug : z.string().min(1),
})