import { GraphCredentials, NormalizedStudent } from "../types";
import { removeClient, sendJobUpdate, sendLogUpdate } from "./client-store.service";
import { processSingleStudent } from "./process-single-student.service";

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

export async function processStudents(
    jobId: string,
    students: NormalizedStudent[],
    credentials: GraphCredentials
) {
    console.log("Started processing students");

    try {
        for (const student of students) {
            sendJobUpdate(jobId, {
                email: student.email,
                status: "processing",
                message: "Processing student entry..."
            });

            try {
                await processSingleStudent(jobId, student, credentials, sleep);

                sendJobUpdate(jobId, {
                    email: student.email,
                    status: "success",
                    miessage: "Licenses removed successfully"
                });
                sendLogUpdate(jobId, `Revoked all licenses from student ${student.email}`, "success");
            } catch (error) {
                sendJobUpdate(jobId, {
                    email: student.email,
                    status: "error",
                    message: error instanceof Error ? error.message : "Unknown error"
                });
                sendLogUpdate(jobId, `Failed to remove licenses from student ${student.email}`, "error")
            }
        }
        
        sendJobUpdate(jobId, {
            type: "complete"
        });
        sendLogUpdate(jobId, "Finished the process", "success");
    } catch (error) {
        console.error(error);
        removeClient(jobId);
    }
}