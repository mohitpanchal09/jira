"use client";

import { useEffect, useState } from "react";
import useParamsHook from "@/hooks/useParams";
import axios from "axios";
import { CreateTaskForm } from "./CreateTaskForm";
import { Card, CardContent } from "./ui/card";
import { Loader } from "lucide-react";

type Props = {};

export default function CreateTaskFormWrapper({}: Props) {
  const params = useParamsHook();
  const workspaceId = Number(params.workspaceId);
  const [loading, setLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState<any>([]);
  const [memberOptions, setMemberOptions] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projects, members] = await Promise.all([
          axios.get(`/api/workspace/${params.workspaceId}/projects`),
          axios.get(`/api/workspace/${params.workspaceId}/members`),
        ]);

        setProjectOptions(
          projects.data.projects.map((project: any) => ({
            id: project.id,
            name: project.name,
            image: project.image,
          }))
        );

        setMemberOptions(
          members.data.members.map((member: any) => ({
            id: member.user.id,
            name: member.user.username,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (workspaceId) {
      fetchData();
    }
  }, [workspaceId]);

  if (loading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
}
