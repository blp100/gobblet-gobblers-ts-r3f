import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gobblet Gobbler",
  description: "Created by po-cheng-yeh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
