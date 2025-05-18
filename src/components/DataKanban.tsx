import { Status, Task } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";

type Props = {
  data: Task[];
  onChange: (
    tasks: { id: string | number; position: number; status: Status }[]
  ) => void;
};

const boards: Status[] = [
  Status.BACKLOG,
  Status.TODO,
  Status.IN_PROGRESS,
  Status.IN_REVIEW,
  Status.DONE,
];

type TasksState = {
  [key in Status]: Task[];
};

function DataKanban({ data, onChange }: Props) {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [Status.BACKLOG]: [],
      [Status.TODO]: [],
      [Status.IN_PROGRESS]: [],
      [Status.IN_REVIEW]: [],
      [Status.DONE]: [],
    };
    data.forEach((task: Task) => {
      initialTasks[task.status].push(task);
    });
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as Status].sort((a, b) => a.position - b.position);
    });
    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TasksState = {
      [Status.BACKLOG]: [],
      [Status.TODO]: [],
      [Status.IN_PROGRESS]: [],
      [Status.IN_REVIEW]: [],
      [Status.DONE]: [],
    };
    data.forEach((task: Task) => {
      newTasks[task.status as Status].push(task);
    });
    Object.keys(newTasks).forEach((status) => {
      newTasks[status as Status].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks)

  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as Status;
      const destinationStatus = destination.droppableId as Status;

      let updatePayload: {
        id: string | number;
        position: number;
        status: Status;
      }[] = [];
      setTasks((prev) => {
        const newTasks = { ...prev };

        //remove task from source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);
        if (!movedTask) {
          console.log("No task found at the source index");
          return prev;
        }
        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destinationColumn = [...newTasks[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = destinationColumn;

        updatePayload = [];
        updatePayload.push({
          id: updatedMovedTask.id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_00_000),
        });
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.id !== updatedMovedTask.id) {
            const newPosition = Math.min((index + 1) * 1000, 1_00_000);
            if (task.position !== newPosition) {
              updatePayload.push({
                id: task.id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });
        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_00_000);
              if (task.position !== newPosition) {
                updatePayload.push({
                  id: task.id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }
        return newTasks;
      });
      onChange(updatePayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.id}
                        index={index}
                        draggableId={String(task.id)}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default DataKanban;
