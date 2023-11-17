"use client";
import { useSession } from "next-auth/react";
import SignIn from "../sign-in";
import { UserAvatar } from "../user-avatar";
import SignOut from "../sign-out";
import { Spinner } from 'flowbite-react';

export default function LoginBtn() {
  const { status, data: session } = useSession();
  if (status === "loading") return <Spinner />;
  if (status === "unauthenticated") return <SignIn />;
  return (
    <div className="grid grid-flow-col gap-4">
      <UserAvatar
        src={session?.user?.image as string}
        alt={session?.user?.name as string}
        fallback={session?.user?.name as string}
      />
      <SignOut />
    </div>
  );
}
