import { StudentRow } from "@/utils/types"
import { Done, Error, Pending, QueryBuilder, Timelapse } from "@mui/icons-material";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const StudentsList = ({
    studentRows,
    execTime
}: {
    studentRows: StudentRow[],
    execTime: number
}) => {
    const processedCount = studentRows.filter(s => s.status === "success" || s.status === "error").length;

    const statusIcons: Record<string, React.ReactNode> = {
        "pending": <Pending color="disabled" />,
        "processing": <QueryBuilder color="warning" />,
        "success": <Done color="success" />,
        "error": <Error color="error" />
    };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
        <p className="bg-gray-200 px-2">
            Student List (Processed: {processedCount}/{studentRows.length})
            |
            Finished in {execTime === 0 ? <Timelapse /> : (execTime/1000).toFixed(2)}s
        </p>
        <TableContainer component={Paper} className="flex-1 min-h-0" sx={{ overflow: "auto" }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>GH Number</TableCell>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {studentRows.map((s, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{idx+1}</TableCell>
                            <TableCell>{s.id}</TableCell>
                            <TableCell>{s.email}</TableCell>
                            <TableCell>{statusIcons[s.status] || "idi naxuy (edge case)"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default StudentsList