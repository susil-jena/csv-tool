
import Sidebar from "../clientComponents/Sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <div>
        <div>
          <Sidebar />
        </div> 
         <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 h-[90vh]">
            <div>{children}</div>
          </div>
        </div>
      </div>

  );
}