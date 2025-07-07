import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import NotificationDropdown from "../../components/header/NotificationDropdown";
import UserDropdown from "../../components/header/UserDropdown";
import { ChatBot } from "../../icons";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <Link
              to="/documents"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              title="Tài liệu"
            >
              <FileText className="w-5 h-5 text-gray-700" />
            </Link>
         
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* <!-- Dark Mode Toggler --> */}
            <NotificationDropdown />
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
