"use client";

import { usePathname } from "next/navigation";
import { useSmartsupp } from "./useSmartsupp";

const ENABLED_ROUTES = [
    "/support",
];

export default function SmartsuppTrigger() {
    const pathname = usePathname();
    const { open } = useSmartsupp();

    const enabled = ENABLED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    if (!enabled) return null;

    return (
        <button
            onClick={open}
            className="w-full py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-200">
            Start Chat
        </button>
    );
}
