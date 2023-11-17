"use client";
import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
export default function SignIn() {
  return (
    <Button onClick={() => signIn()}>
      <GithubIcon className="mr-2 h-4 w-4" /> Login with GitHub
    </Button>
  );
}
