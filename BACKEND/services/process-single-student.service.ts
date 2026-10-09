import { Client } from "@microsoft/microsoft-graph-client";
import { GraphCredentials, NormalizedStudent } from "../types";
import { createGraphClient } from "./graph-client.service";
import { sendLogUpdate } from "./client-store.service";

const licenses = {
    "Microsoft Power Automate Free": "f30db892-07e9-47e9-837c-80727f46fd3d",
    "Office 365 A1 for Students": "314c4481-f395-4525-be8b-2ec4bb1e9d91",
    "Microsoft 365 Apps for Students": "c32f9321-a627-406d-a114-1f9c81aaafac"
};

export async function processSingleStudent(
    jobId: string,
    student: NormalizedStudent,
    credentials: GraphCredentials,
    sleep: (ms: number) => Promise<unknown>,
    client = createGraphClient(credentials)
) {
    try {
        const studentData = (await fetchStudentId(jobId, client, student.email));

        if (!studentData || !studentData.value || !studentData.value.length) {
            console.log(studentData);
            throw new Error(`Student "${student.email}" was not found in Microsoft Graph`);
        }

        const studentId = studentData.value[0].id;

        await removeLicenses(jobId, client, studentId, student.email, sleep);
    } catch (error) {
        
    }
}

async function fetchStudentId(jobId: string, client: Client, email: string) {
    try {
        const studentData = await client.api(`/users$filter=mail eq '${email}'`).get();
        sendLogUpdate(jobId, `Fetched user ID for student "${email}"`);

        return studentData;
    } catch (error) {
        console.error("[GRAPH_ERROR] Failed to fetch email:", email);
        console.error(error);

        sendLogUpdate(jobId, `Failed to fetch user ID for student "${email}"`, "warn");
        return null;
    }
}

async function removeLicenses(
    jobId: string,
    client: Client,
    id: string,
    email: string,
    sleep: (ms: number) => Promise<unknown>
) {
    for (const [name, license] of Object.entries(licenses)) {
        console.log(`\n\n[GRAPH_INFO] Run for license "${license}"`);

        try {
            await graphRetry(
                () => client
                        .api(`/users/${id}/assignLicense`)
                        .post({
                            addLicenses: [],
                            removeLicenses: [license]
                        }),
                sleep
            );

            console.log(`\n[GRAPH_SUCCESS] License "${license}" removed for user "${id}"`);
            sendLogUpdate(jobId, `Removed "${name}" license for student "${email}"`);

            await sleep(1000);
        } catch (error: any) {
            console.error(error);
            const message = error.message || "";

            if (message.includes("User does not have a corresponding license")) {
                console.log(`\n[GRAPH_WARN] License "${license}" not assigend to user "${id}, skipping..."`);
                sendLogUpdate(jobId, `Student "${email}" is missing "${license}" license. Skipping...`, "warn");
                continue;
            }

            throw error;
        }
    }
}

async function graphRetry(
    func: () => Promise<void>,
    sleep: (ms: number) => Promise<unknown>,
    retries = 6,
    delay = 5000
) {
    try {
        return await func();
    } catch (error: any) {
        const code =error.code || "";
        const message =error.message || "";

        if (
            retries > 0 &&
            (code === "Directory_ConcurrencyViolation" || message.includes("concurrent requests"))
        ) {
            console.log(`\n[GRAPH_RETRY] Concurrency error. Waiting ${delay}ms (${retries} retries left)`);
            await sleep(delay);

            return graphRetry(func, sleep, retries-1, delay*1.2);
        }

        throw error;
    }
}