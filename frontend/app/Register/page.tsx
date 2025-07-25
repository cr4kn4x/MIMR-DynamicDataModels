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


import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import InputValidated from "@/components/my_ui/InputValidated"
import { zod_email, zod_password } from "@/lib/inputValidation"
import { apiCallWrapper } from "@/lib/api/ApiCallWrapper"
import { getUserRegistrationStatus } from "@/lib/api/AuthApi"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog"
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog"




export default function Page() {
    const router = useRouter()

    // login data 
    const [email, set_email] = useState("")
    const [email_valid, set_email_valid] = useState(false)

    const [password, set_password] = useState("")
    const [password_valid, set_password_valid] = useState(false)

    const [password_confirmed, set_password_confirmed] = useState("")

    const [loading, set_loading] = useState(false)
    const [show_email_hint, set_show_email_hint] = useState(false)


    const [email_pending_dialog_open, set_email_pending_dialog_open] = useState(false)
    const [already_registered_dialog_open, set_already_registered_dialog_open] = useState(false)
    const [signup_ok_dialog_open, set_signup_ok_dialog_open] = useState(false)






    async function handle_register(form_data: FormData) {
        set_loading(true)

        try {
            const email = form_data.get("email")?.toString()
            const password = form_data.get("password")?.toString()
            const password_confirmed = form_data.get("password_confirmed")?.toString()

            if (password == null || email == null) {
                toast.error("Email or Password is empty!", { description: "Please try again", richColors: true })
                return
            }

            if (password !== password_confirmed) {
                toast.error("Passwords do not match!", { richColors: true })
                return
            }



            // fetch the registrations status (required)
            const registration_status = await apiCallWrapper(getUserRegistrationStatus(email), toast, "Failed to fetch registration status")
            if (!registration_status) { return }


            if (registration_status.registered === true) {
                if (registration_status.email_confirmed === true) {
                    set_already_registered_dialog_open(true)
                    return
                }
                else {
                    set_email_pending_dialog_open(true)
                }
                return
            }
            else {
                // user is not registerd at all 
                await register_user_via_email(email, password)
            }
        }
        catch (e: any) {
            toast.error("Unexpected error occurred", { richColors: true })
        }
        finally {
            set_loading(false)
        }
    }


    async function handle_resend_verification() {
        set_loading(true)

        try {
            await register_user_via_email(email, password)
        }
        catch (e: any) {
            toast.error("Unexpected Error occurred", { richColors: true })
        }
        finally {
            set_loading(false)
        }
    }


    const register_user_via_email = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({ email: email, password: password })

            if (error) {
                toast.error("Error occured", { description: error.message, richColors: true })
                return
            }
            else {
                set_signup_ok_dialog_open(true)

                set_email("")
                set_password("")
                set_password_confirmed("")
                return
            }
        }
        catch (e: any) {
            toast.error("Unexpected error occured. Registration failed", { description: e.message, richColors: true })
        }
    }



    return (
        <div className="w-screen h-screen flex items-center justify-center">


            <AlertDialog open={email_pending_dialog_open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pending E-Mail Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            This E-Mail is already registered but not confirmed. Do you want to resend a new confirmation email to {email}?
                            Consider that this will invalidate the previous sent confirmation email.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { set_email_pending_dialog_open(false) }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { handle_resend_verification() }}>Resend Verification Email</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={already_registered_dialog_open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>This E-Mail is already registered</AlertDialogTitle>
                        <AlertDialogDescription>
                            This E-Mail is already registered. You will be redirected to the Login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => { router.push("/Login") }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <AlertDialog open={signup_ok_dialog_open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Registration Successful</AlertDialogTitle>
                        <AlertDialogDescription>
                            You sucessfully registered to MIMR! Please check your E-Mail {email} and click the link in the confirmation mail we just sent you to complete the registration.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { set_signup_ok_dialog_open(false); router.push("/Login") }}>OK</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


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
                    <form action={handle_register}>
                        <div className="grid gap-2">

                            <Label htmlFor="email">E-Mail</Label>
                            <InputValidated
                                id="email"
                                name="email"
                                type="text"
                                placeholder="E-Mail"
                                value={email}
                                onChange={(e) => { set_email(e.target.value) }}

                                required
                                set_input_valid={set_email_valid}
                                zod={zod_email}
                            />


                            <Label htmlFor="password" className="mt-4">Password</Label>
                            <InputValidated
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => { set_password(e.target.value) }}
                                required
                                set_input_valid={set_password_valid}
                                zod={zod_password}
                            />


                            <Label htmlFor="password_confirmed">Confirm Password</Label>
                            <Input
                                id="password_confirmed"
                                name="password_confirmed"
                                type="password"
                                placeholder="Retype your password"
                                value={password_confirmed}
                                onChange={(e) => { set_password_confirmed(e.target.value) }}
                                required
                            />
                            {(password_confirmed.length > 0 && password_confirmed != password) ? (
                                <span>
                                    <span className="text-sm text-red-500">Passwords dont match...</span>
                                </span>
                            ) : null}
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={loading || (!password_valid || !email_valid)}>
                            Register
                        </Button>

                    </form>
                </CardContent>

                <CardFooter className="grid gap-2">
                    {show_email_hint && (
                        <div className="text-xs mt-2">
                            <div>
                                <span>We've sent a verification email to your address. Please check your inbox and follow the instructions to complete your registration. </span>
                                <span className="text-yellow-400">
                                    If you don't see the email, check your spam folder. If you still haven't received it after a few minutes, try registering again.
                                </span>
                            </div>
                        </div>
                    )}

                </CardFooter>
            </Card>
        </div>
    )
}