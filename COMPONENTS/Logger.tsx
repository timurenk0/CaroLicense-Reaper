'use client'

import { LogRow } from '@/utils/types';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react'

const Logger = ({
    logRows
}: {
    logRows: LogRow[]
}) => {
    const [showLogs, setShowLogs] = useState(false);

    const levelColors: Record<string, string> = {
        "success": "text-green-600",
        "warn": "text-amber-600",
        "info": "text-indigo-600",
        "error": "text-red-600"
    }
  
  return (
    <div>
        <Button
            hidden={showLogs}
            onClick={() => setShowLogs(true)}
            startIcon={<ArrowDownward />}
            fullWidth
            variant="contained"
            color="inherit"
        >Show Logs</Button>

        <div hidden={!showLogs} className="bg-gray-200 h-full flex flex-col overflow-hidden">
            <div className="bg-gray-400 py-1 px-2 flex justify-between items-center w-full">
                <p className="font-semibold shrink-0">Logger</p>
                <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={() => setShowLogs(false)}
                    startIcon={<ArrowUpward />}
                >Hide Logs</Button>
            </div>

            <div className="p-2 flex-1 overflow-y-auto overflow-x-clip flex flex-col gap-y-2">
                {logRows.length > 0 ? logRows.map((lr, idx) => (
                    <p key={idx}>
                        <b className={`font-bold ${levelColors[lr.level]}`}>&gt;[{lr.level.toUpperCase()}] </b>
                        {lr.message} - {lr.timestamp}
                    </p>
                )) : (
                    <i>&gt; No logs yet... (Start the process from the menu on the left)</i>
                )}
            </div>
        </div>
    </div>
  )
}

export default Logger