import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake Auth Server",
  description: "A Fake Auth Server for E2E Testing scenario",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
