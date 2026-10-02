import normalizeStudents from "@/BACKEND/services/normalize-students.service";
import { CustomApiError } from "@/BACKEND/utils/CustomErrorBuilder";
import { parse } from "csv-parse/sync";
import { type NextRequest, NextResponse as res } from "next/server"


type StudentsCSV = any & { "Email Address": string };

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const csv = formData.get("csv") as File;
        if (!csv) throw new CustomApiError({
            code: "NO_FILE_UPLOAD",
            message: "No .csv file uploaded",
            status: 400
        });

        console.log("csv", csv);

        const rows: StudentsCSV[] = parse(await csv.text(), {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true
        });

        console.log("rows", rows);

        if (!rows[0] || !("Email Address" in rows[0])) throw new CustomApiError({
            code: "INVALID_FILE_FORMAT",
            message: "Invalid .csv file format",
            hint: "Double-check credentials file content. Required fields are TENANT_ID, CLIENT_ID, CLIENT_SECRET",
            status: 400
        });

        const ids = rows.map((r, idx) => !r["Email Address"] ? idx+2 : null).filter(r => r !== null);

        console.log("ids", ids);

        if (ids.length > 0) throw new CustomApiError({
            code: "CORRUPT_FILE",
            message: "Corrupt .csv file",
            hint: `Row${ids.length > 1 ? "s" : ""} ${ids.length > 1 ? `${ids.slice(0, -1).join(", ")} and ${ids[ids.length-1]}` : ids[0]} ${ids.length > 1 ? "have" : "has"} empty "Email Address" value`,
            status: 400
        });

        const students = normalizeStudents(rows);

        console.log("students", students);

        return res.json({
            filename: csv.name,
            size: csv.size,
            students
        }, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error instanceof CustomApiError) {
            return res.json(
                error,
                { status: error.status }
            )
        }
    
        return res.json(
            {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred"
            },
            { status: 500 }
        )
    }
}