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
import React, { useEffect, useState } from "react"


import { createClient } from "@/utils/supabase/client"
const supabase = createClient()


import { toast } from "sonner"
import InputValidated from "@/components/my_ui/InputValidated"
import { zod_email } from "@/lib/inputValidation"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"
import { getUserRegistrationStatus } from "@/lib/api/AuthApi"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"





export default function Page() {
    const router = useRouter()

    const [show_password_reset, set_show_password_reset] = useState(false)

    const [email, set_email] = useState("")
    const [email_valid, set_email_valid] = useState(false)

    const [reset_password_email, set_reset_password_email] = useState<string>("")
    const [reset_password_email_valid, set_reset_password_email_valid] = useState(false)

    const [password, set_password] = useState("")

    const [loading, set_loading] = useState(false)

    const [password_reset_sent_dialog_open, set_password_reset_sent_dialog_open] = useState(false)

    const [email_pending_dialog_open, set_email_pending_dialog_open] = useState(false)


    async function handle_password_reset(form_data: FormData) {
        set_loading(true)

        try {
            const email = form_data.get("email")?.toString()

            if(!email){
                toast.error("Email can not be empty!")
                return
            }

            const {data, error} = await supabase.auth.resetPasswordForEmail(email)

            if(error){
                toast.error("Error occured", {description: error.message, richColors: true})
                return
            }
            else {
                set_password_reset_sent_dialog_open(true)
                return
            }

        }
        catch (e: any) {
            toast.error("Unexpected error occurred", { description: e.message || "unkown error", richColors: true })
        }
        finally {
            set_loading(false)
        }
    }


    async function handle_login(form_data: FormData) {
        set_loading(true)

        try {
            const email = form_data.get("email")?.toString()
            const password = form_data.get("password")?.toString()

            if (email == null || password == null) {
                toast.error("Email or Password is empty", { description: "Please try again", richColors: true })
                return
            }


            const registration_status = await apiCallWrapper(getUserRegistrationStatus(email), toast, "Failed to fetch registration status")
            if (!registration_status) { return }


            if (registration_status.registered) {
                if (registration_status.email_confirmed) {
                    login_email_pass(email, password)
                }
                else {
                    set_email_pending_dialog_open(true)
                    return
                }
            }
            else {
                toast.error("This E-Mail is not registered", { richColors: true })
            }
        }
        catch (e: any) {
            toast.error("Unexpected error occurred", { description: e.message || "unkown error", richColors: true })
        }
        finally {
            set_loading(false)
        }
    }


    const login_email_pass = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })

            if (error) {
                toast.error("Login failed", { description: error.message, richColors: true })
                return
            }
            else {
                toast.success("Login successful", { description: "You will be redirected...", richColors: true })
                router.push("/DataModels")
            }
        }
        catch (e: any) {
            toast.error("Unexpected error occurred", { description: e.message || "unkown error", richColors: true })
        }
    }




    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <AlertDialog open={email_pending_dialog_open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pending E-Mail Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            This E-Mail is already registered but not confirmed. Please check your inbox {email} and click the link in the confirmation email.
                            To request a new confirmation email you can register again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { set_email_pending_dialog_open(false) }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { router.push("/Register") }}>Register again</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={password_reset_sent_dialog_open}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Password Reset requested</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        If the account you specified exists in our system, you will receive an email that contains instructions to reset your password. Please check your inbox {reset_password_email}.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => { set_password_reset_sent_dialog_open(false); router.push("/Login") }}>Continue</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        {!show_password_reset?("Enter your E-Mail and password below to login to your account"): "Enter your E-Mail to request a password reset email"}
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild><Link href="/Register">Register</Link></Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {show_password_reset ? (
                        <form action={handle_password_reset}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="reset-email">E-Mail</Label>
                                    <InputValidated
                                        zod={zod_email}
                                        name="email"
                                        id="email"
                                        type="text"
                                        disabled={loading}
                                        placeholder="E-Mail"
                                        required

                                        value={reset_password_email}
                                        onChange={e => { set_reset_password_email(e.target.value) }}

                                        set_input_valid={set_reset_password_email_valid}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2 mt-2">
                                    <Button type="submit" className="w-full" disabled={loading || (!reset_password_email_valid)}>
                                        Send Password Reset
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full" onClick={()=>{set_show_password_reset(false)}} disabled={loading}>
                                        Back to login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    ) :
                        <form action={handle_login}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-Mail</Label>
                                    <InputValidated
                                        zod={zod_email}
                                        name="email"
                                        id="email"
                                        type="text"
                                        disabled={loading}
                                        placeholder="E-Mail"
                                        required

                                        value={email}
                                        onChange={e => { set_email(e.target.value) }}

                                        set_input_valid={set_email_valid}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <button type="button" className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600 bg-transparent border-0 p-0" onClick={() => { set_show_password_reset(true) }}>
                                            Forgot your password?
                                        </button>
                                    </div>

                                    <Input
                                        name="password"
                                        id="password"
                                        type="password"
                                        disabled={loading}
                                        placeholder="Password"
                                        required
                                        value={password}
                                        onChange={e => { set_password(e.target.value) }}
                                    />
                                </div>


                                <div>
                                    <Button type="submit" className="w-full" disabled={loading || (!email_valid || !(password.length > 0))}>
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    }
                </CardContent>
            </Card>
        </div>
    )

}



