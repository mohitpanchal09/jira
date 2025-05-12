"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Loader, PlusIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { useModalStore } from "@/store/modalStore";
import useParamsHook from "@/hooks/useParams";
import axios from "axios";
import DataFilters from "./DataFilters";
import { Status } from "@/types";
import DataTable from "./DataTable";

type TaskFilter = {
  status?: Status | null;
  assigneeId?: number;
  dueDate?: string;
};

function TaskViewSwitcher() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<TaskFilter>({});
  const { openTasktModal } = useModalStore();
  const params = useParamsHook();
  const projectId = params.projectId;

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const query = new URLSearchParams();

        if (filters.status) query.append("status", filters.status);
        if (filters.assigneeId) query.append("assigneeId", filters.assigneeId.toString());
        if (filters.dueDate) query.append("dueDate", filters.dueDate);

        const res = await axios.get(`/api/project/${projectId}/tasks?${query.toString()}`);
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, filters]);

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
        <DataFilters filters={filters} setFilters={setFilters} />
        <Separator className="my-4" />
        {loading ? (
          <div className="w-full flex items-center justify-center py-12">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable data={tasks} title="Tasks"/>
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calender" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
