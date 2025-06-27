"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
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


// LoginForm-Komponente
function LoginForm({
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    showVerifyNotice,
    resent,
    onSubmit,
    onShowReset,
    onResendVerification
}: {
    email: string,
    setEmail: (v: string) => void,
    password: string,
    setPassword: (v: string) => void,
    error: string,
    loading: boolean,
    showVerifyNotice: boolean,
    resent: boolean,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onShowReset: () => void,
    onResendVerification: () => void
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                        id="email"
                        type="text"
                        disabled={loading}
                        placeholder="E-Mail"
                        required
                        value={email}
                        onChange={e => { setEmail(e.target.value); }}
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600 bg-transparent border-0 p-0" onClick={onShowReset}>
                            Forgot your password?
                        </button>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        disabled={loading}
                        value={password}
                        onChange={e => { setPassword(e.target.value); }}
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {showVerifyNotice && (
                        <div className="text-yellow-600 text-sm mt-2">
                            Your email address is not verified yet.<br />
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onResendVerification} disabled={loading || resent}>
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
    )
}

// PasswordResetForm-Komponente
function PasswordResetForm({
    resetEmail,
    setResetEmail,
    resetMessage,
    loading,
    onSubmit,
    onBack
}: {
    resetEmail: string,
    setResetEmail: (v: string) => void,
    resetMessage: string,
    loading: boolean,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onBack: () => void
}) {
    return (
        <form onSubmit={onSubmit}>
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
                    <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                        Back to login
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showVerifyNotice, setShowVerifyNotice] = useState(false)
    const [resent, setResent] = useState(false)
    const [showReset, setShowReset] = useState(false)
    const [resetEmail, setResetEmail] = useState("")
    const [resetMessage, setResetMessage] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setShowVerifyNotice(false)
        setResent(false)

        // Login
        try {
            const auth = getAuth(firebaseApp)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            if (!user.emailVerified) {
                setShowVerifyNotice(true)
                setError("Please verify your email address before logging in.")
                await auth.signOut()
                return
            }
            router.push("/Workflows")
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
                setError("Fehler beim Senden der Verifizierungs-E-Mail.")
            }
        } catch {
            setError("Fehler beim Senden der Verifizierungs-E-Mail.")
        } finally {
            setLoading(false)
        }
    }

    async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setResetMessage("")
        setError("")
        try {
            const auth = getAuth(firebaseApp)
            await sendPasswordResetEmail(auth, resetEmail)
            setResetMessage("If an account with this email exists, a password reset email has been sent.")
        } catch {
            setResetMessage("Error sending password reset email.")
        } finally {
            setLoading(false)
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
                        <PasswordResetForm
                            resetEmail={resetEmail}
                            setResetEmail={setResetEmail}
                            resetMessage={resetMessage}
                            loading={loading}
                            onSubmit={handlePasswordReset}
                            onBack={() => { setShowReset(false); setResetMessage(""); }}
                        />
                    ) : (
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            error={error}
                            loading={loading}
                            showVerifyNotice={showVerifyNotice}
                            resent={resent}
                            onSubmit={handleSubmit}
                            onShowReset={() => setShowReset(true)}
                            onResendVerification={handleResendVerification}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}