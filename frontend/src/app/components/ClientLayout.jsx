// app/components/ClientLayout.jsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hiddenPaths = [
    "/chat",
    "/admin",
    "/admin/analytics",
    "/admin/dashboard",
    "/admin/intents",
    "/admin/feedback"
  ];

  const shouldHideFooter = hiddenPaths.includes(pathname) || pathname.startsWith("/admin/edit");

  return (
    <>
      <Navbar />
      <ToastContainer position="bottom-right" />
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}
