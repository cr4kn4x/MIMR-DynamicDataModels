"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { useState } from "react"

import firebaseApp from "@/lib/firebase"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"

export default function RegisterPage() {

    const router = useRouter()
    
        const [email, set_email] = useState("")
        const [password_1, set_password_1] = useState("")
        const [password_2, set_password_2] = useState("")
        
        const [error, set_error] = useState("")
        const [loading, set_loading] = useState(false)
      
        
        async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            set_loading(true)
            set_error("")
    
            // Prevent auto-fill error
            const form = e.currentTarget
            let email_safe = email 
            let passsword_1_safe = password_1
            let passsword_2_safe = password_2
        
            if(email_safe == ""){
                email_safe = (form.elements.namedItem("email") as HTMLInputElement)?.value
            }
            
            if(password_1 == ""){
                passsword_1_safe = (form.elements.namedItem("password_1") as HTMLInputElement)?.value
            }

            if(password_2 == ""){
                passsword_2_safe = (form.elements.namedItem("password_2") as HTMLInputElement)?.value
            }

            if(passsword_1_safe != passsword_2_safe){
                set_error("Passwords don't match!")
                set_loading(false)
                return
            }

            
            try {
                const auth = getAuth(firebaseApp)
                const userCredential = await createUserWithEmailAndPassword(auth, email_safe, passsword_1_safe)
                await sendEmailVerification(userCredential.user)

                // redirect after successful login
                // router.push("/DataModels")
            }
            catch(err: any){
                set_error(err.message)
            }
            finally {
                set_loading(false)
            }
        }

    return(
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Enter a valid E-Mail and password below to register an account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild><Link href="/Login">Login</Link></Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {handleSubmit(e)}}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-Mail</Label>
                                <Input id="email" type="text" placeholder="E-Mail" onChange={(e) => {set_email(e.target.value)}} required disabled={loading} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_1">Password</Label>
                                <Input id="password_1" type="password" onChange={(e)=>{set_password_1(e.target.value)}} required disabled={loading} />

                                <Label htmlFor="password_2">Confirm Password</Label>
                                <Input id="password_2" type="password" onChange={(e)=>{set_password_2(e.target.value)}} required disabled={loading} />

                                {error && <div className="text-red-500 text-sm">{error}</div>}
                            </div>

                            <div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    Register
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}