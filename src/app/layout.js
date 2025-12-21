import "./globals.css";

export const metadata = {
  title: "LS Builder",
  description: "GUI based Logstash pipeline builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
