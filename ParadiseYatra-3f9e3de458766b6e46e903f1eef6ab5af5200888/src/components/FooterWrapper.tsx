"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
    const pathname = usePathname();

    // List of routes where the footer should be hidden
    const hideFooterRoutes = ["/login", "/signup"];

    if (hideFooterRoutes.includes(pathname)) {
        return null;
    }

    return <Footer />;
}
