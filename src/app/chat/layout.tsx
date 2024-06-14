import NavBar from "@/components/nav_bar";
import SideBar from "@/components/side_bar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="flex">
          <SideBar />
          {children}
        </div>
      </body>
    </html>
  );
}
