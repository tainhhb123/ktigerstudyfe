// src/layout/AppLayout.tsx
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router-dom";
import AppHeader from "./AdminAppHeader";
import AppSidebar from "./AdminAppSidebar";
import Backdrop from "./AdminBackdrop";

// Dashboard layout content that reads sidebar state
function DashboardLayoutContent() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex" style={{ backgroundColor: '#FFF8F0' }}>
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <main className="p-4 mx-auto max-w-[1536px] md:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

// Wrap with context provider
export default function AppLayout() {
  return (
    <SidebarProvider>
      <DashboardLayoutContent />
    </SidebarProvider>
  );
}