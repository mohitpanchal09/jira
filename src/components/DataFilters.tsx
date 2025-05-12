"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ListChecksIcon, UsersRound } from "lucide-react";
import { Status } from "@/types";
import useParamsHook from "@/hooks/useParams";
import axios from "axios";
import MemberAvatar from "./MemberAvatar";
import DatePicker from "./DatePicker";

interface DataFiltersProps {
  filters: {
    status?: Status | null;
    assigneeId?: number | null;
    dueDate?: string | null;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

function DataFilters({ filters, setFilters }: DataFiltersProps) {
  const [memberOptions, setMemberOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParamsHook();
  const workspaceId = Number(params.workspaceId);

  useEffect(() => {
    async function fetchData() {
      try {
        const membersRes = await axios.get(`/api/workspace/${params.workspaceId}/members`);
        setMemberOptions(
          membersRes.data.members.map((member: any) => ({
            id: member.user.id,
            name: member.user.username,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    }

    if (workspaceId) {
      fetchData();
    }
  }, [workspaceId]);

  const onStatusChange = (value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      status: value === "all" ? null : (value as Status),
    }));
  };

  const onAssigneeChange = (value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      assigneeId: value === "all" ? null : Number(value),
    }));
  };

  const onDueDateChange = (date: Date | undefined) => {
    setFilters((prev: any) => ({
      ...prev,
      dueDate: date ? date.toISOString() : null,
    }));
  };

  const { status, assigneeId, dueDate } = filters;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Status Filter */}
      <Select defaultValue={status ?? "all"} onValueChange={onStatusChange}>
        <SelectTrigger>
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={Status.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={Status.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={Status.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={Status.TODO}>Todo</SelectItem>
          <SelectItem value={Status.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Assignee Filter */}
      <Select
        defaultValue={assigneeId?.toString() ?? "all"}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger>
          <div className="flex items-center pr-2">
            <UsersRound className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {memberOptions.map((member: any) => (
            <SelectItem key={member.id} value={member.id.toString()}>
              <div className="flex items-center gap-2">
                <MemberAvatar name={member.name} />
                <span>{member.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Due Date Filter */}
      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={onDueDateChange}
      />
    </div>
  );
}

export default DataFilters;
