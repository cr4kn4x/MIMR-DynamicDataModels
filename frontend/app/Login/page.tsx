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
import React, { useState } from "react"


import firebaseApp from "@/lib/firebase"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"


export default function LoginPage() {
    const router = useRouter()

    const [email, set_email] = useState("")
    const [password, set_password] = useState("")
    const [error, set_error] = useState("")
    const [loading, set_loading] = useState(false)
  
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        set_loading(true)
        set_error("")

        // Prevent auto-fill error
        const form = e.currentTarget
        let email_ = email 
        let password_ = password 

        if(email_ == ""){
            email_ = (form.elements.namedItem("email") as HTMLInputElement)?.value
        }
        if(password_ == ""){
            password_ = (form.elements.namedItem("password") as HTMLInputElement)?.value
        }


        // try to login
        try {
            const auth = getAuth(firebaseApp)
            await signInWithEmailAndPassword(auth, email_, password_)

            // redirect after successful login
            router.push("/DataModels")
        }
        catch(err: any){
            set_error(err.message)
        }
        finally {
            set_loading(false)
        }
    }


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your E-Mail and password below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild><Link href="/Register">Register</Link></Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {handleSubmit(e)}}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">E-Mail</Label>
                                <Input 
                                    id="email" type="text" 
                                    disabled={loading}
                                    placeholder="E-Mail" required 
                                    onChange={(e) => {set_email(e.target.value); set_error("")}} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password" type="password" required 
                                    disabled={loading}
                                    onChange={(e) => {set_password(e.target.value); set_error("")}}/>
                                    {error && <div className="text-red-500 text-sm">{error}</div>}
                            </div>
                            <div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}