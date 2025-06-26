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
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth"


export default function LoginPage() {
    const router = useRouter()

    const [email, set_email] = useState("")
    const [password, set_password] = useState("")
    const [error, set_error] = useState("")
    const [loading, set_loading] = useState(false)
    const [showVerifyNotice, setShowVerifyNotice] = useState(false)
    const [resent, setResent] = useState(false)
    const [showReset, setShowReset] = useState(false)
    const [resetEmail, setResetEmail] = useState("")
    const [resetMessage, setResetMessage] = useState("")
  
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        set_loading(true)
        set_error("")
        setShowVerifyNotice(false)
        setResent(false)

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
            const userCredential = await signInWithEmailAndPassword(auth, email_, password_)
            const user = userCredential.user
            if (!user.emailVerified) {
                setShowVerifyNotice(true)
                set_error("Please verify your email address before logging in.")
                await auth.signOut()
                return
            }
            // redirect after successful login
            router.push("/Workflows")
        }
        catch(err: any){
            set_error(err.message)
        }
        finally {
            set_loading(false)
        }
    }

    async function handleResendVerification() {
        set_loading(true)
        set_error("")
        setResent(false)
        try {
            const auth = getAuth(firebaseApp)
            const user = auth.currentUser
            if (user && !user.emailVerified) {
                await sendEmailVerification(user)
                setResent(true)
            } else {
                set_error("Fehler beim Senden der Verifizierungs-E-Mail.")
            }
        } catch (err: any) {
            set_error("Fehler beim Senden der Verifizierungs-E-Mail.")
        } finally {
            set_loading(false)
        }
    }

    async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        set_loading(true)
        setResetMessage("")
        set_error("")
        try {
            const auth = getAuth(firebaseApp)
            await sendPasswordResetEmail(auth, resetEmail)
            setResetMessage("If an account with this email exists, a password reset email has been sent.")
        } catch (err: any) {
            setResetMessage("Error sending password reset email.")
        } finally {
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
                    {showReset ? (
                        <form onSubmit={handlePasswordReset}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="reset-email">E-Mail</Label>
                                    <Input
                                        id="reset-email"
                                        type="text"
                                        placeholder="E-Mail"
                                        value={resetEmail}
                                        onChange={e => setResetEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {resetMessage && <div className="text-yellow-600 text-sm">{resetMessage}</div>}
                                <div className="flex flex-col gap-2 mt-2">
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        Send password reset email
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full" onClick={() => { setShowReset(false); setResetMessage(""); }}>
                                        Back to login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    ) : (
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
                                        <button type="button" className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600 bg-transparent border-0 p-0" onClick={() => setShowReset(true)}>
                                            Forgot your password?
                                        </button>
                                    </div>
                                    <Input
                                        id="password" type="password" required 
                                        disabled={loading}
                                        onChange={(e) => {set_password(e.target.value); set_error("")}}/>
                                    {error && <div className="text-red-500 text-sm">{error}</div>}
                                    {showVerifyNotice && (
                                        <div className="text-yellow-600 text-sm mt-2">
                                            Your email address is not verified yet.<br />
                                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleResendVerification} disabled={loading || resent}>
                                                Resend verification email
                                            </Button>
                                            {resent && <div className="text-green-600 text-xs mt-1">Verification email sent again.</div>}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}