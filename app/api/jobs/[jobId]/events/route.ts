import { addClient, removeClient } from "@/BACKEND/services/client-store.service";
import { getJob } from "@/BACKEND/services/job-store.service";
import { processStudents } from "@/BACKEND/services/process-students.service";
import { CustomApiError } from "@/BACKEND/utils/CustomErrorBuilder";
import { type NextRequest, NextResponse } from "next/server";


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;

        let controllerRef: ReadableStreamDefaultController<Uint8Array> | undefined;

        const stream = new ReadableStream<Uint8Array>({
            start(controller) {
                controllerRef = controller;

                addClient(jobId, controller);

                const job = getJob(jobId);
                if (!job) throw new CustomApiError({
                    code: "JOB_INSTANCE_NOT_FOUND",
                    message: "Passed jobId is not associated with any pending job",
                    hint: "The reference jobId may be expired. Try refreshing the page and start again",
                    status: 404
                });

                processStudents(jobId, job.students, job.credentials).catch(err => console.error(`Job ${jobId} failed`, err));
            },
            cancel() {
                removeClient(jobId);
            }
        });

        req.signal.addEventListener("abort", () => {
            removeClient(jobId);

            try {
                controllerRef?.close();
            } catch (error) {
                console.error(error); 
            }
        });

        

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transformation",
                "Connection": "keep-alive"
            }
        });
    } catch (error) {
        console.error(error);
    }
}