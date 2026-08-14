"use client";
import { TasksListMobile } from "./mobile/TasksListMobile";
import { TasksListDesktop } from "./desktop/TasksListDesktop";

export function TasksList() {
  return (
    <>
      <div className="lg:hidden"><TasksListMobile /></div>
      <div className="hidden lg:block"><TasksListDesktop /></div>
    </>
  );
}
