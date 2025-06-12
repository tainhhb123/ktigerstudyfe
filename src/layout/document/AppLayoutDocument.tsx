// src/layout/document/AppLayoutDocument.tsx
import { ThemeProvider } from "../../context/ThemeContext";
import { SidebarProvider } from "../../context/SidebarContext";
import { Outlet } from "react-router-dom";
import DocumentSidebar from "./DocumentSidebar";
import DocumentHeader from "./DocumentHeader";
import DocumentBackdrop from "./DocumentBackdrop";
// import DocumentSidebarWidget from "./DocumentSidebarWidget";


function DocumentLayoutContent() {
  // const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar width, expand on large */}
      <div className="flex-shrink-0 w-[90px] lg:w-[290px]">
        <DocumentSidebar />
        <DocumentBackdrop />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <DocumentHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* <DocumentSidebarWidget /> */}
    </div>
  );
}

export default function AppLayoutDocument() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <DocumentLayoutContent />
      </SidebarProvider>
    </ThemeProvider>
  );
}