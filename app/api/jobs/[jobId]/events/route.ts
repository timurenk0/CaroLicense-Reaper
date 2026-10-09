import { addClient, removeClient } from "@/BACKEND/services/client-store.service";
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