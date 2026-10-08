"use client"

import { ServerError, StudentRow } from "@/utils/types"
import { Button, Tooltip } from "@mui/material"
import { FindInPage, UploadFile } from "@mui/icons-material"
import { useState } from "react"

const CSVUploadForm = ({
    setStudentRows,
    setErr
}: {
    setStudentRows: (rows: StudentRow[]) => void,
    setErr: (err: ServerError | null) => void
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setFile(e.target.files[0]);
    }

    const mutation = async () => {
        try {
            if (!file) {
                setShowTooltip(true);
                return;
            }

            setShowTooltip(false);

            const formData = new FormData();
            formData.append("csv", file);

            const res = await fetch("/api/upload-csv", {
                method: "POST",
                body: formData
            });

            console.log(res);

            const data = await res.json();
            if (!res.ok) {
                setErr(data as ServerError);
                setStudentRows([]);
                setFile(null);
                throw new Error(data.message);
            }

            console.log("data", data);
            setStudentRows(data.students);

            return data;
        } catch (error) {
            console.error(error);
            return
        }
    }
  
  return (
    <div className="py-2 px-4 rounded-lg bg-gray-400/25">
        <p className="mb-4">Upload students .csv file</p>
        <div className="flex justify-between">
            <Button component="label" variant="outlined" startIcon={<FindInPage />}>
                Choose .csv
                <input type="file" accept=".csv" hidden onChange={handleInput} />
            </Button>

            <Tooltip
                title="Please select a .csv file first"
                open={showTooltip}
                onClick={() => setShowTooltip(false)}
            >
                <Button
                    startIcon={<UploadFile />}
                    variant="outlined"
                    size="small"
                    onClick={() => mutation()}
                >Upload</Button>
            </Tooltip>
        </div>
        <p className="mb-2">Selected: <i>{file ? file.name : "nothing"}</i></p>
    </div>
  )
}

export default CSVUploadForm