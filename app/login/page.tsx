"use client"

import { ServerError } from "@/utils/types";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorCard from "@/COMPONENTS/ErrorCard";

const LoginPage = () => {
    const router = useRouter();
    
    const [err, setErr] = useState<ServerError | null>(null);
    
    const mutation = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("env", file);

            const res = await fetch("/api/login", {
                method: "POST",
                body: formData
            });

            console.log(res);
            
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                setErr(data);
                throw new Error(data);
            }

            router.push("/");
            return data;
        } catch (error) {
            console.error(error);
            return error
        }
    }
    
  
  return (
    <div className="flex justify-center items-center">
        <div className="border rounded p-8 flex flex-col gap-4" hidden={!!err}>
            <h1 className="text-2xl font-bold">Login Form</h1>
            <p>Upload .env file with provided credentials to login</p>
        
            <div>
                <Button component="label" variant="outlined">
                    Choose .env
                    <input type="file" accept=".env" hidden onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files;
                        if (!files || files.length < 1) {
                            e.target.files = null;
                            return;
                        }

                        await mutation(files[0] as File);
                    }} />
                </Button>
            </div>
        </div>

        {err && (
            <ErrorCard error={err} onClose={setErr} />
        )}
    </div>
  )
}

export default LoginPage;