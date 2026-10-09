import { type NextRequest, NextResponse as res } from "next/server";
import { cookies } from "next/headers";
import dotenv from "dotenv";
import { GraphCredentials } from "@/BACKEND/types";
import { storeConfig } from "@/BACKEND/services/config-store.service";
import { CustomApiError } from "@/BACKEND/utils/CustomErrorBuilder";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const env = formData.get("env") as File;
        console.log(env);
        if (!env) throw new CustomApiError({
            code: "NO_FILE_UPLOAD",
            message: "No .env file uploaded",
            status: 400
        });

        const credentials: GraphCredentials = dotenv.parse(await env.text());

        if (!credentials.TENANT_ID || !credentials.CLIENT_ID || !credentials.CLIENT_SECRET) {
            throw new CustomApiError({
                code: "INVALID_FILE_FORMAT",
                message: "Invalid .env file format",
                hint: "Double-check credentials file content. Required fields are TENANT_ID, CLIENT_ID, CLIENT_SECRET",
                status: 400
            })
        }

        const sessionId = crypto.randomUUID();
        storeConfig(sessionId, credentials);

        const cookieStore = await cookies();
        
        cookieStore.set("sessionId", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 60,
            path: "/"
        });

        return res.json({ status: 201 });
    } catch (error: any) {
        return res.json(error, { status: error instanceof CustomApiError ? error.status : 500 });
    }
}