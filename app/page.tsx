"use client"

import CSVUploadForm from "@/COMPONENTS/CSVUploadForm";
import ErrorCard from "@/COMPONENTS/ErrorCard";
import Logger from "@/COMPONENTS/Logger";
import StudentsList from "@/COMPONENTS/StudentsList";
import { LogRow, ServerError, StudentRow } from "@/utils/types";
import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

const Dashboard = () => {
  const [err, setErr] = useState<ServerError | null>(null);
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [logRows, setLogRows] = useState<LogRow[]>([]);
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

      const res = await fetch("/api/start", {
        method: "POST",
        body: JSON.stringify({
          students: studentRows
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data);
        return;
      }

      const { jobId } = data;

      const eventSource = new EventSource(`/api/jobs/${jobId}/events`);

      const start = performance.now();
      eventSource.onmessage = (e) => {
        const update = JSON.parse(e.data);
        console.log("Student update:", update);

        if (update.type === "log") {
          setLogRows(current => [
            ...current,
            {
              level: update.level,
              message: update.message,
              timestamp: update.timestamp
            }
          ]);

        }
        
        setStudentRows(current => current.map(c => c.email === update.email ? {
          ...c,
          status: update.status,
          message: update.message
        }: c));

        if (update.type === "complete") {
          eventSource.close();
          const end = performance.now();
          setExecTime(end-start);
        }
      }
    } catch (error) {
      console.error(error); 
      return;
    }
  }

  console.log(studentRows);
  
  return (
    <main className="p-4 h-full min-h-0 overflow-hidden flex flex-col">
      <div className="h-full min-h-0 flex flex-col">
        <div className="grid grid-cols-2 gap-8 h-full min-h-0" hidden={!!err}>
          <section className="flex flex-col min-h-0 h-full">
            <p>You've successfully logged in!</p>

            <CSVUploadForm setStudentRows={setStudentRows} setErr={setErr} />

            <div className="my-4 flex justify-end">
              <Button
                disabled={studentRows.length === 0}
                variant="outlined"
                color="success"
                endIcon={<Send />}
                onClick={mutation}
              >Start</Button>
            </div>

            <div className="flex-1 min-h-0">
              <StudentsList studentRows={studentRows} execTime={execTime} />
            </div>

          </section>

          <section className="flex flex-col min-h-0 h-full">
            <Logger logRows={logRows} setLogRows={setLogRows} />
          </section>
        </div>
        
        {err && (
          <ErrorCard error={err} onClose={setErr} />
        )}
      </div>
    </main>
  )
}

export default Dashboard;