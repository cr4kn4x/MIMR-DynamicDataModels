import { z } from "zod"


export const zod_email = z.string().email({ message: "Invalid E-Mail" })

export const zod_password = z.string().min(8, { message: "Must be at least 8 characters" }).max(128, "Password exceeds max length of 512 characters")



