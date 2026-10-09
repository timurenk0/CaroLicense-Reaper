import { storeJob } from "@/BACKEND/services/job-store.service";
import { cookies } from "next/headers";
import { CustomApiError } from "@/BACKEND/utils/CustomErrorBuilder";
import { randomUUID } from "crypto";
import { type NextRequest, NextResponse as res } from "next/server";
import { getConfig } from "@/BACKEND/services/config-store.service";
import { NormalizedStudent } from "@/BACKEND/types";


export async function POST(req: NextRequest) {
    try {
        const { students } = await req.json() as { students: NormalizedStudent[] };        
        if (!students || students.length < 1) throw new CustomApiError({
            code: "EMPTY_STUDENT_LIST",
            message: "Uploaded file has no student data",
            status: 400
        });

        const jobId = randomUUID();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("sessionId");
        if (!sessionId) throw new CustomApiError({
            code: "SESSION_NOT_FOUND",
            message: "User unauthorized",
            hint: "Try refreshing page and uploading .env file again",
            status: 401
        });

        const credentials = getConfig(sessionId.value);
        if (!credentials) throw new CustomApiError({
            code: "CREDENTIALS_NOT_FOUND",
            message: "No associated credentials found",
            hint: "Try refreshing page and uploading .env file again",
            status: 404
        });

        storeJob(jobId, {
            credentials,
            students
        });

        return res.json({ jobId }, { status: 202 });
    } catch (error) {
        return res.json(error, { status: 500 }); 
    }
}