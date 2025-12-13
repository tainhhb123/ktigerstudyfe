import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
