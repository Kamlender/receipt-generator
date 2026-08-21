import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "80G Receipt Generator | JEEVANKRITI FOUNDATION",
  description:
    "Generate 80G donation receipts for JEEVANKRITI FOUNDATION. Internal tool for authorized staff.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#f8fafc',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#f8fafc',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
