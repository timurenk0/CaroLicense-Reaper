import { NextResponse } from "next/server";
import { NormalizedStudent } from "../types";

const clients = new Map<string, ReadableStreamDefaultController<Uint8Array>>();
const pendingJobs = new Map<string, NormalizedStudent[]>();
const encoder = new TextEncoder();

type Level = "info" | "success" | "warn" | "error";

export function registerJob(jobId: string, students: NormalizedStudent[]) {
    console.log(`JOB ${jobId} REGISTERED`);
    pendingJobs.set(jobId, students);
}

export function addClient(clientId: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    console.log(`CLIENT ${clientId} ADDED`);
    clients.set(clientId, controller);
}

export function removeClient(clientId: string) {
    console.log(`CLIENT ${clientId} REMOVED`);
    clients.delete(clientId);
}

export function sendJobUpdate(jobId: string, data: unknown) {
    const controller = clients.get(jobId);
    if (!controller) return;

    try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch {
        clients.delete(jobId);
    }
}

export function sendLogUpdate(jobId: string, message: string, level: Level = "info") {
    sendJobUpdate(jobId, {
        type: "log",
        level, message,
        timestamp: new Date().toTimeString().slice(0, 8)
    });
} 