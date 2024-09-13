import { AvatarDropdown } from "@/components/layout/avatar-dropdown";
import { Logo } from "@/components/layout/logo";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return <div className=" fixed flex-col w-full">
      <div className="fixed h-16 w-full border-b flex items-center justify-between px-10 bg-white">
        <div className="flex md:hidden">
          <MobileSidebar session={session} />
        </div>
        <div className="hidden md:block w-10">
          <Logo/>
        </div>
        <AvatarDropdown session={session} />
      </div>
      <div className="flex flex-row h-screen pt-16 items-start">
        <div className="hidden md:block h-full">
          <Sidebar session={session} />
        </div>
        <main className="w-full max-w-full md:max-w-[calc(100vw-200px)]">
          {children}
        </main>
      </div>
    </div>
}
