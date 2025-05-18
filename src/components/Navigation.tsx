"use client"
import { GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import useParamsHook from "@/hooks/useParams";


const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircleFill,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const pathname = usePathname()
  const workspaceId = useParamsHook().workspaceId

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
         const fullHref =
    item.href === "/" 
      ? `/workspaces/${workspaceId}` 
      : `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={fullHref} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
