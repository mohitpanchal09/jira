"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
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
          <div className="flex items-center gap-2">
            <Button variant="secondary" asChild>
              <Link href={pathname==='/sign-in'?'sign-up':'/sign-in'}>
             
              {pathname==="/sign-in" ? "sign-up":"sign-in"}
              </Link>
              </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-">
          {children}
        </div>
      </div>
    </main>
  );
}
