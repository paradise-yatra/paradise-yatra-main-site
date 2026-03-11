"use client";

import { usePathname } from "next/navigation";
import { LazyFooter, LazyNewsletterSubscribe } from "./lazy-components";

export default function FooterWrapper() {
    const pathname = usePathname();

    // List of routes where the footer should be hidden
    const hideFooterRoutes = ["/login", "/signup"];
    const hideFooterPrefixes = ["/admin"];

    if (
        hideFooterRoutes.includes(pathname) ||
        hideFooterPrefixes.some((prefix) => pathname.startsWith(prefix))
    ) {
        return null;
    }

    return (
        <>
            <LazyNewsletterSubscribe />
            <LazyFooter />
        </>
    );
}
