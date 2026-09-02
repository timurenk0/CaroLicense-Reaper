import { NormalizedStudent } from "../types";

export default function normalizeStudents(
    studentsList: Array<{ "ID's"?: string, "Email Address": string }>
): NormalizedStudent[] {
    return studentsList.map(s => ({
        id: s["ID's"] || "N/A",
        email: s["Email Address"],
        status: "pending"
    }));
}