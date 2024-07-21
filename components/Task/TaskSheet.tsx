"use client";
import { ReactElement, useRef, useState } from "react";
import UpVoteButton from "./UpVoteButton";
import TaskContent from "./TaskContent";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export default function TaskSheet(props: Props): ReactElement {
  const { buttonRef } = props;
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button ref={buttonRef} className="hidden" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when youre done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              {/* <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" /> */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              {/* <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" /> */}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
