"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function Enroll2FAPage() {
    const [qr_code, set_qr_code] = useState<string | null>(null)

    const [factorId, setFactorId] = useState<string | null>(null)
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)


    const router = useRouter()

    const handle_enroll = async () => {
        setLoading(true)
        setErrorMsg(null)


        const res = await supabase.auth.getSession()
        

        useEffect(()=>{

        }, [])
        
        supabase.auth.onAuthStateChange((e) => {
            
        })
        


        try {
            const { data: mfa_list_data, error: list_error } = await supabase.auth.mfa.listFactors()

            if(mfa_list_data?.totp && list_error == null){
                const verified_mfa = mfa_list_data.totp.find(mfa => mfa.status === "verified")
                
                if(verified_mfa) {
                    toast.info("You already have a verified TOTP", {richColors: true, description: "You will be redirected..."})
                    router.push("/Login")
                }
            }

            
  
            // If any factor is already verified, stop the process
            const verified = mfa_list_data?.all.find(mfa => mfa.status === "verified")
            if (verified) {
                setErrorMsg("You already have a verified MFA factor enabled.")
                setLoading(false)
                return
            }

            // Unenroll unverified default factor if exists
            const defaultUnverified = mfa_list_data?.all.find(mfa => mfa.friendly_name === "default" && mfa.status === "unverified");
            if (defaultUnverified) {
                const { error: unenroll_error } = await supabase.auth.mfa.unenroll({ factorId: defaultUnverified.id });
                if (unenroll_error) throw unenroll_error;
            }

            // Enroll new TOTP factor
            const { data: enroll_mfa_data, error: enroll_error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "default" });
            if (enroll_error) throw enroll_error;
            if (enroll_mfa_data) {
                set_qr_code(enroll_mfa_data.totp.qr_code);
                setFactorId(enroll_mfa_data.id);
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Unknown error during 2FA enrollment.");
        }
        setLoading(false);
    }

    /*
    const handleVerify = async () => {
        if (!factorId) {
            setErrorMsg("No factorId found. Please enroll first.")
            return
        }
        setLoading(true)
        setErrorMsg(null)
        try {
            const { error } = await supabase.auth.mfa.verify({ factorId, code })
            if (error) {
                setErrorMsg(error.message)
                toast.error("Invalid code", { description: error.message })
            } else {
                setSuccess(true)
                toast.success("2FA enabled!")
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Unknown error")
            toast.error("Error verifying code", { description: err.message })
        }
        setLoading(false)
    }
    */
   
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="w-full max-w-96">
                <CardHeader>
                    <CardTitle>Enable Two-Factor Authentication (2FA)</CardTitle>
                    <CardDescription>
                        To secure your account we highly recommend enabling 2-FA with a TOTP app like Google Authenticator.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {

                    }
                    {!qr_code ? (
                        <div className="grid gap-2">
                            <Button onClick={handle_enroll} disabled={loading} className="w-full">
                                Enable 2FA
                            </Button>
                            {errorMsg && <div className="text-xs text-red-500 mt-2">{errorMsg}</div>}
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label>Scan this QR code with Google Authenticator or any TOTP app:</Label>
                            <img src={qr_code} alt="2FA QR Code" className="mb-4 mx-auto" />
                            <Label htmlFor="totp_code">Enter code from app</Label>
                            <Input
                                id="totp_code"
                                type="text"
                                placeholder="123456"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                disabled={loading || success}
                            />
                            <Button onClick={()=>{/*handleVerify*/}} disabled={loading || success} className="w-full mt-2">
                                Verify & Enable
                            </Button>
                            {errorMsg && <div className="text-xs text-red-500 mt-2">{errorMsg}</div>}
                            {success && <div className="text-xs text-green-600 mt-2">2FA is now enabled for your account!</div>}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-gray-500">
                        You can skip this step if you want to enable 2FA later in your account settings.
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}