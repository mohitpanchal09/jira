"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Loader, PlusIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { useModalStore } from "@/store/modalStore";
import useParamsHook from "@/hooks/useParams";
import axios from "axios";
import useSWR from "swr";
import DataFilters from "./DataFilters";
import { Status } from "@/types";
import DataTable from "./DataTable";
import DataKanban from "./DataKanban";
import { axiosInstance } from "@/lib/axios";
import DataCalendar from "./DataCalendar";
import { useSession } from "next-auth/react";

type TaskFilter = {
  status?: Status | null;
  assigneeId?: number;
  dueDate?: string;
  projectId?: number;
};

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function TaskViewSwitcher({
  hideProjectFilter,
  hideAssigneeFilter,
}: TaskViewSwitcherProps) {
  const [filters, setFilters] = useState<TaskFilter>({});
  const { data: session } = useSession();
  const workspaceId = useParamsHook().workspaceId;
  const isMyTaskPage = !useParamsHook().projectId;
  const { openTasktModal } = useModalStore();
  const params = useParamsHook();
  const projectId = params.projectId || filters.projectId;

  const queryKey = useMemo(() => {
    const q = new URLSearchParams();
    if (filters.status) q.append("status", filters.status);
    if (filters.dueDate) q.append("dueDate", filters.dueDate);

    if (isMyTaskPage) {
      if (filters.projectId) q.append("projectId", filters.projectId.toString());
      if (session?.user?.id) q.append("assigneeId", String(session.user.id));
      return `/api/workspace/${workspaceId}/tasks?${q.toString()}`;
    } else {
      if (filters.assigneeId) q.append("assigneeId", filters.assigneeId.toString());
      return `/api/project/${projectId}/tasks?${q.toString()}`;
    }
  }, [filters, workspaceId, session, isMyTaskPage, projectId]);

  const { data, error, isLoading, mutate } = useSWR(queryKey, fetcher, {
    revalidateOnFocus: true,
  });

  const tasks = data?.tasks || [];

  const updateTasksBulk = async (
    updates: { id: string | number; status: Status; position: number }[]
  ) => {
    try {
      await axiosInstance.post("/task/bulk-update", updates);
      mutate(); // revalidate data after update
    } catch (error) {
      console.error("Failed to update tasks:", error);
    }
  };

  const onKanbanChange = useCallback(
    (tasks: { id: string | number; status: Status; position: number }[]) => {
      updateTasksBulk(tasks);
    },
    [mutate]
  );

  return (
    <Tabs className="flex-1 w-full border rounded-lg" defaultValue="table">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size={"sm"}
            className="w-full lg:w-auto"
            onClick={openTasktModal}
          >
            <PlusIcon className="size-4 mr-2" />
            New Task
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilters
          filters={filters}
          setFilters={setFilters}
          hideProjectFilter={hideProjectFilter}
          hideAssigneeFilter={hideAssigneeFilter}
        />
        <Separator className="my-4" />
        {isLoading ? (
          <div className="w-full flex items-center justify-center py-12">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">Failed to load tasks.</div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable data={tasks} title="Tasks" />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value="calender" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
