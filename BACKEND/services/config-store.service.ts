import { GraphCredentials } from "../types"

type Session = {
    credentials: GraphCredentials,
    expiresAt: number
}

const sessions = new Map<string, Session>();

export function storeConfig(
    sessionId: string,
    credentials: GraphCredentials,
    ttlMs = 30 * 60 * 1000
) {
    sessions.set(sessionId, {
        credentials,
        expiresAt: Date.now() + ttlMs
    });
}

export function getConfig(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() >= session.expiresAt) {
        sessions.delete(sessionId);
        return null;
    }

    return session.credentials;
}