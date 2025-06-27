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

// Extrahiere RegisterForm-Komponente
function RegisterForm({
    email,
    setEmail,
    password1,
    setPassword1,
    password2,
    setPassword2,
    error,
    loading,
    showVerifyNotice,
    resent,
    onSubmit,
    onResendVerification
}: {
    email: string,
    setEmail: (v: string) => void,
    password1: string,
    setPassword1: (v: string) => void,
    password2: string,
    setPassword2: (v: string) => void,
    error: string,
    loading: boolean,
    showVerifyNotice: boolean,
    resent: boolean,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onResendVerification: () => void
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" type="text" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password_1">Password</Label>
                    <Input id="password_1" type="password" value={password1} onChange={e => setPassword1(e.target.value)} required disabled={loading} />

                    <Label htmlFor="password_2">Confirm Password</Label>
                    <Input id="password_2" type="password" value={password2} onChange={e => setPassword2(e.target.value)} required disabled={loading} />

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {showVerifyNotice && (
                        <div className="text-yellow-600 text-sm mt-2">
                            Please verify your email address. We have sent you an email.<br />
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onResendVerification} disabled={loading || resent}>
                                Resend verification email
                            </Button>
                            {resent && <div className="text-green-600 text-xs mt-1">Verification email sent again.</div>}
                        </div>
                    )}
                </div>
                <div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        Register
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default function RegisterPage() {
    const router = useRouter()

    // State-Namen vereinheitlichen
    const [email, setEmail] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showVerifyNotice, setShowVerifyNotice] = useState(false)
    const [resent, setResent] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setShowVerifyNotice(false)
        setResent(false)

        if (password1 !== password2) {
            setError("Passwords don't match!")
            setLoading(false)
            return
        }
        try {
            const auth = getAuth(firebaseApp)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password1)
            await sendEmailVerification(userCredential.user)
            setShowVerifyNotice(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleResendVerification() {
        setLoading(true)
        setError("")
        setResent(false)
        try {
            const auth = getAuth(firebaseApp)
            const user = auth.currentUser
            if (user && !user.emailVerified) {
                await sendEmailVerification(user)
                setResent(true)
            } else {
                setError("Error sending verification email.")
            }
        } catch {
            setError("Error sending verification email.")
        } finally {
            setLoading(false)
        }
    }

    return (
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
                    <RegisterForm
                        email={email}
                        setEmail={setEmail}
                        password1={password1}
                        setPassword1={setPassword1}
                        password2={password2}
                        setPassword2={setPassword2}
                        error={error}
                        loading={loading}
                        showVerifyNotice={showVerifyNotice}
                        resent={resent}
                        onSubmit={handleSubmit}
                        onResendVerification={handleResendVerification}
                    />
                </CardContent>
            </Card>
        </div>
    )
}