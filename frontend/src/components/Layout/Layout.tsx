import React from "react";
import Navbar from "../Navbar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={"flex flex-col w-screen min-h-screen "}>
      <Navbar />
      <div className={"grow flex flex-col pb-10 px-10 h-[calc(100vh_-_100px] p- overflow-y-scroll"}>{children}</div>
      <Toaster />
    </div>
  );
}

export default Layout;
