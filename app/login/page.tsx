"use client"

import { ServerError } from "@/utils/types";
import { Button } from "@mui/material";
import { useState } from "react";

const LoginPage = () => {
    const [err, setErr] = useState<ServerError | null>(null);

    const mutation = async (file: File | undefined) => {
        try {
            if (!file) throw new Error("No .env file uploaded");

            const formData = new FormData();
            formData.set("env", file);

            const res = await fetch("/api/login", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                setErr(data.error);
                throw new Error(data.error.message);
            }

            return data;            
        } catch (error) {
            console.error(error);
        }
    }
    
    
    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const uploadedFile = e.target.files[0];
        await mutation(uploadedFile);
    }
  
  return (
    <div className="flex justify-center items-center">
        <div className="border rounded p-8 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Login Form</h1>
            <p>Upload .env file with provided credentials to login</p>
        
            <div>
                <Button component="label" variant="outlined">
                    Choose .env
                    <input type="file" accept=".env" hidden onChange={handleInput} />
                </Button>
            </div>
        </div>
    </div>
  )
}

export default LoginPage;