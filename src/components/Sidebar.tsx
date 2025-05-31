import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import WorkspaceSwitcherWrapper from "./WorkspaceSwitcherWrapper";
import Projects from "./Projects";
import ProfileButton from "./ProfileButton";

type Props = {};

function Sidebar({}: Props) {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full flex flex-col justify-between">
      <div>
        <Link href={"/"} className="flex items-center">
         <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L20 8V16L12 20L4 16V8L12 4Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 4V20" stroke="white" strokeWidth="2" />
                  <path d="M4 8L20 16" stroke="white" strokeWidth="2" />
                  <path d="M20 8L4 16" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                Trek<span className="text-blue-600">Flow</span>
              </span>
            </div>
        </Link>
        <Separator className="my-4" />
        <WorkspaceSwitcherWrapper />
        <Separator className="my-4" />
        <Navigation />
        <Separator className="my-4" />
        <Projects />
      </div>
      <ProfileButton />
    </aside>
  );
}

export default Sidebar;
