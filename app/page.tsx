"use client"

import CSVUploadForm from "@/COMPONENTS/CSVUploadForm";
import { ServerError, StudentRow } from "@/utils/types";
import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

const Dashboard = () => {
  const [err, setErr] = useState<ServerError | null>(null);
  const [studentRows, setStudentRows] = useState<StudentRow[]> ([]);

  return (
    <>
      <div className="grid grid-cols-2 gap-8" hidden={!!err}>
        <section className="flex flex-col">
          <p>You've successfully logged in!</p>

          <CSVUploadForm setStudentRows={setStudentRows} setErr={setErr} />

          <div className="my-4 flex justify-end">
            <Button
              disabled={studentRows.length === 0}
              variant="outlined"
              color="success"
              endIcon={<Send />}
              // onClick={mutation}
            >Start</Button>
          </div>


        </section>
      </div>
    </>
  )
}

export default Dashboard;