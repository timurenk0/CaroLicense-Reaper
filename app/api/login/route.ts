import { type NextRequest, NextResponse as res } from "next/server";
import dotenv from "dotenv";
import { GraphCredentials } from "@/BACKEND/types";
import { getConfig, storeConfig } from "@/BACKEND/services/config-store.service";
import { CustomApiError } from "@/BACKEND/utils/CustomErrorBuilder";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const env = formData.get("env") as File;
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

        const configId = crypto.randomUUID();
        storeConfig(configId, credentials);

        return res.json(configId, { status: 201 });
    } catch (error) {
        return res.json(error);
    }
}