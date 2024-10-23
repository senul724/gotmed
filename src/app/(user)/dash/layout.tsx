import "flatpickr/dist/flatpickr.min.css";
import "@/styles/globals.css";
import Sidebar from "@/components/dash/Sidebar";
import Header from "@/components/dash/Header";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { FaHistory } from "react-icons/fa";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="flex">
            <Sidebar menuGroup={menuGroups} />
            <div className="relative flex flex-1 flex-col lg:ml-72.5">
              <Header />
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: <IoHomeOutline size={20} />,
        label: "Home ",
        route: "/dash",
      },
      {
        icon: <FaHistory size={20} />,
        label: "history",
        route: "/dash/history",
      },
      {
        icon: <IoMdAddCircle size={20} />,
        label: "Add Request",
        route: "/request",
      },
    ],
  },
];
