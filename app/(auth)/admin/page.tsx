"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import RiIcon from "@/app/components/ui/RiIcon";
import UserDetail from "./components/UserDetail";
import SignOutButton from "./components/SignOutButton";

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const initialsFor = (u: Doc<"user">) =>
  ((u.firstName?.[0] ?? "") + (u.lastName?.[0] ?? "")).toUpperCase() || (u.email?.[0] ?? "?").toUpperCase();

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12">
        <div className="space-y-2 animate-pulse">
          <div className="h-8 w-56 bg-zinc-200 rounded-lg" />
          <div className="h-4 w-80 max-w-full bg-zinc-200 rounded" />
        </div>
        <div className="mt-8 space-y-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-white border border-zinc-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
          <RiIcon className="ri-shield-user-line text-2xl" />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-zinc-900">Access restricted</h1>
        <p className="mt-1 text-sm text-zinc-500">
          This area is limited to administrators only. Sign in with an admin account to continue.
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const isAdmin = useQuery(api.admin.isAdmin);
  const users = useQuery(api.admin.getAllUsers);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const list = users ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((u) =>
      `${u.firstName ?? ""} ${u.lastName ?? ""} ${u.email}`.toLowerCase().includes(q),
    );
  }, [users, search]);

  const selected = selectedUserId
    ? (users ?? []).find((u) => u.userId === selectedUserId) ?? null
    : null;

  if (isAdmin === undefined) return <AdminSkeleton />;
  if (isAdmin === false) return <AccessDenied />;

  if (selected) {
    return <UserDetail user={selected} onBack={() => setSelectedUserId(null)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Manage users, balances and access codes</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white">
              <RiIcon className="ri-shield-check-line text-xs" />
              Admin
            </span>
            <SignOutButton />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Users</h2>
              <p className="text-sm text-zinc-500">
                {filtered.length} of {(users ?? []).length} accounts
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <RiIcon className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email"
                className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            {users === undefined ? (
              <div className="divide-y divide-zinc-100 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-11 h-11 rounded-full bg-zinc-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-zinc-200 rounded" />
                      <div className="h-3 w-56 bg-zinc-200 rounded" />
                    </div>
                    <div className="hidden sm:block space-y-2 text-right">
                      <div className="h-3 w-24 ml-auto bg-zinc-200 rounded" />
                      <div className="h-3 w-16 ml-auto bg-zinc-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <RiIcon className="ri-user-search-line text-xl" />
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-900">No users found</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {search ? "Try a different search term." : "No users have signed up yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filtered.map((u) => {
                  const linked = !!u.userId;
                  return (
                    <button
                      key={u._id}
                      type="button"
                      disabled={!linked}
                      onClick={() => linked && setSelectedUserId(u.userId!)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                        linked
                          ? "hover:bg-zinc-50 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center text-sm font-semibold shrink-0">
                        {initialsFor(u)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-900 truncate">
                            {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email}
                          </p>
                          {!linked && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 uppercase shrink-0">
                              Not linked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                      </div>
                      <div className="hidden sm:block text-right shrink-0">
                        <p className="text-xs font-medium text-zinc-600">{u.country || "—"}</p>
                        <p className="text-[11px] text-zinc-400">Joined {formatDate(u._creationTime)}</p>
                      </div>
                      <RiIcon className="ri-arrow-right-s-line text-zinc-300 text-lg shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
