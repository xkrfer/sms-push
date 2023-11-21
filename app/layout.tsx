import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./provider";
import MainNav from "@/components/main-nav";
import UserNav from "@/components/user-nav";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "SMS",
  description: "SMS",
  icons: [
    {
      rel: "icon",
      href: "/favicon.svg",
      url: "",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="border-b">
              <div className="container mx-auto">
                <div className="flex items-center justify-between py-4">
                  <MainNav />
                  <UserNav />
                </div>
              </div>
            </div>
            <div className="container mx-auto py-6">{children}</div>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
