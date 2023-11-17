"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface Props {
  title?: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export default function Confirm(props: Props) {
  const { title, description, cancelText, actionText, onAction, children } = props;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {description || "You cannot undo this action."}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>
            {actionText || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
