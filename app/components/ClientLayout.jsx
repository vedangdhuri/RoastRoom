"use client";

import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

const ClientLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f1f22",
            color: "#f9f5f8",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#0e0e10",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff6e84",
              secondary: "#0e0e10",
            },
          },
        }}
      />
    </>
  );
};

export default ClientLayout;
