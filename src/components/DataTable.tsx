"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskDate from "./TaskDate";
import {
  Calendar,
  ChartCandlestick,
  FolderPen,
  MoreVertical,
  PanelsTopLeft,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // adjust path as needed
import ProjectAvatar from "./ProjectAvatar";
import MemberAvatar from "./MemberAvatar";
import TaskActions from "./TaskActions";
import { getStatusLabel } from "./TaskStatus";

type Props = {
  data: any[];
  title: string;
  permission?:{
    permission:boolean,
    message:string
  }
};

const ITEMS_PER_PAGE = 5;

function DataTable({ data, title,permission }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-2">
                <FolderPen size={16} color="black" />
                <span>Task Name</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <PanelsTopLeft size={16} color="black" />
                <span>Project</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <UsersRound size={16} color="black" />
                <span>Assignee</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Calendar size={16} color="black" />
                <span>Due Date</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <ChartCandlestick size={16} color="black" />
                <span>Status</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ProjectAvatar name={task.project.name} />
                  <span>{task.project.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MemberAvatar name={task.assignee.username} />
                  <span>{task.assignee.username}</span>
                </div>
              </TableCell>

              <TableCell>
                <TaskDate value={task.dueDate} />
              </TableCell>
              <TableCell>{getStatusLabel(task.status,"rounded-md")}</TableCell>
              <TableCell>
                <TaskActions
                  id={task.id}
                  projectId={task.projectId}
                  task={task}
                  roles={task.userRoles}
                >
                  <Button variant={"ghost"} className="size-8 p-0">
                    <MoreVertical className="size-4" />
                  </Button>
                </TaskActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}

export default DataTable;
