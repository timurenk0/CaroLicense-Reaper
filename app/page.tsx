"use client"

import CSVUploadForm from "@/COMPONENTS/CSVUploadForm";
import ErrorCard from "@/COMPONENTS/ErrorCard";
import Logger from "@/COMPONENTS/Logger";
import StudentsList from "@/COMPONENTS/StudentsList";
import { ServerError, StudentRow } from "@/utils/types";
import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

const Dashboard = () => {
  const [err, setErr] = useState<ServerError | null>(null);
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [execTime, setExecTime] = useState(0);


  const mutation = async () => {
    try {
      if (!studentRows || studentRows.length === 0) {
        setErr({
          code: "EMPTY_STUDENT_ROWS_ERROR",
          message: "Student data not found",
          hint: "Double-check",
          status: 400
        });
        return
      }


    } catch (error) {
      
    }
  }

  console.error(err);

  return (
    <>
      <section className="grid grid-cols-2 gap-8 h-full min-h-0" hidden={!!err}>
        <div className="flex flex-col">
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

          <div className="flex-1">
            <StudentsList studentRows={studentRows} execTime={execTime} />
          </div>

        </div>

        <div className="flex flex-col">
          <Logger logRows={[]} />
        </div>
      </section>
      
      {err && (
        <ErrorCard error={err} onClose={setErr} />
      )}
    </>
  )
}

export default Dashboard;