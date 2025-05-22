// app/components/WorkspaceSwitcherWrapper.tsx
'use client'
import useSWR from 'swr';
import WorkspaceSwitcher, { Workspace } from "./WorkspaceSwitcher";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkspaceSwitcherWrapper() {
  const { data: workspaces, error, isLoading } = useSWR('/api/workspace', fetcher);

  if (error) return <div>Failed to load workspaces</div>;
  if (isLoading) return <div></div>;

  return <WorkspaceSwitcher workspaces={workspaces.workspaces || []} />;
}