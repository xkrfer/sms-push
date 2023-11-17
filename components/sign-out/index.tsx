"use client";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";


export default function SignOut() {
  return (
    <Button onClick={() => signOut()}>
      <LogOutIcon className="mr-2 h-4 w-4" /> Logout
    </Button>
  );
}
