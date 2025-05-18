import { Status } from "@/types";

export const getStatusLabel = (status: Status,className?:string) => {
  console.log("🚀 ~ getStatusLabel ~ className:", className)
  const baseClasses = `text-sm text-white ${className ? className: "rounded-full"} py-1 px-4`;

  switch (status) {
    case Status.BACKLOG:
      return (
        <span className={`${baseClasses} bg-gray-500`}>
          Backlog
        </span>
      );
    case Status.TODO:
      return (
        <span className={`${baseClasses} bg-blue-500`}>
          To Do
        </span>
      );
    case Status.IN_PROGRESS:
      return (
        <span className={`${baseClasses} bg-yellow-500`}>
          In Progress
        </span>
      );
    case Status.IN_REVIEW:
      return (
        <span className={`${baseClasses} bg-purple-500`}>
          In Review
        </span>
      );
    case Status.DONE:
      return (
        <span className={`${baseClasses} bg-green-500`}>
          Done
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-zinc-400`}>
          Unknown
        </span>
      );
  }
};
