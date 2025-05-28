import { Task } from "@/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { mutate } from "swr";

type Props = {
  task: Task;
  userRoles:string[]
};

function TaskDescription({ task ,userRoles}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const [pending, setPending] = useState(false);

  const handleSave = async () => {
    try {
      setPending(true);
      const payload = {
        ...task,
        description: value,
      };
      await axios.post("/api/task", payload); // update task on the server
      await mutate(`/api/task/${task.id}`);
      toast.success("Description updated")
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update description")

      console.error("Failed to update description", error);
    } finally {
      setPending(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(task.description); // reset to original value
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
       {userRoles.includes('ADMIN') &&  <Button
          size="sm"
          variant="secondary"
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
        >
          {isEditing ? <XIcon /> : <PencilIcon className="size-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>}
      </div>

      <Separator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description"
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={pending}
          />
          <Button
            className="w-fit ml-auto"
            size="sm"
            onClick={handleSave}
            disabled={pending}
          >
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">No description found</span>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskDescription;
