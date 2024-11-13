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
          <Image src="/logo.svg" alt="logo" height={56} width={152} />
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
