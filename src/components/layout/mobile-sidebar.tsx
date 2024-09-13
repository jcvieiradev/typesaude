"use client"

import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Sidebar } from "./sidebar";
import { Session } from "next-auth";
import { useState } from "react";
import { Logo } from "./logo";

interface MobileSidebarProps {
  session: Session;
}

export function MobileSidebar({ session }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  return <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetTitle><Logo/></SheetTitle>
        <SheetDescription> </SheetDescription>
        <Sidebar session={session} closeSideMenu={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  
}
