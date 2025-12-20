import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserIcon,
  DocsIcon,
  PencilIcon,
} from "../../icons";
import { useSidebar } from "../../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  isHeader?: boolean; // For section headers
};
const ACTIVE_COLOR = "bg-[#FFE8DC] text-[#FF6B35]";

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin",
  },
  // === QUẢN LÍ TÀI LIỆU (Note: Phát triển sau) ===
  // {
  //   name: "Quản lí tài liệu",
  //   icon: <span></span>,
  //   isHeader: true,
  // },
  // {
  //   icon: <DocsIcon />,
  //   name: "Tài liệu học viên",
  //   path: "/admin/tailieuhocvien",
  // },
  // {
  //   icon: <DocsIcon />,
  //   name: "Báo cáo tài liệu",
  //   path: "/admin/baocaotailieu",
  // },
  {
    name: "Quản lí học viên",
    icon: <span></span>,
    isHeader: true,
  },
  {
    icon: <UserIcon />,
    name: "Danh sách học viên",
    path: "/admin/thongtinhocvien",
  },
  {
    icon: <UserIcon />,
    name: "Tiến trình học tập",
    path: "/admin/tientrinhhocvien",
  },
  {
    name: "Quản lí nội dung",
    icon: <span></span>,
    isHeader: true,
  },
  {
    icon: <PencilIcon />,
    name: "Quản lí bài học",
    path: "/admin/danhsachbaihoc",
  },
  {
    icon: <DocsIcon />,
    name: "Quản lí đề thi TOPIK",
    subItems: [
      { name: "Danh sách đề thi", path: "/admin/exams", pro: false, new: true },
      { name: "Tạo đề thi mới", path: "/admin/exams/create", pro: false },
    ],
  },
  
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/admin/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/admin/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/admin/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/admin/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/admin/alerts", pro: false },
  //     { name: "Avatar", path: "/admin/avatars", pro: false },
  //     { name: "Badge", path: "/admin/badge", pro: false },
  //     { name: "Buttons", path: "/admin/buttons", pro: false },
  //     { name: "Images", path: "/admin/images", pro: false },
  //     { name: "Videos", path: "/admin/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={`${menuType}-${index}-${nav.name}`}>
          {nav.isHeader ? (
            (isExpanded || isHovered || isMobileOpen) && (
              <div className="px-3 py-2 mt-4 mb-1">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#BDBDBD', letterSpacing: '0.05em' }}>
                  {nav.name}
                </h3>
              </div>
            )
          ) : nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group w-full ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? ACTIVE_COLOR
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`flex-shrink-0 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-[#FF6B35]"
                    : "text-gray-500"
                }`}
                style={{ width: '24px', height: '24px' }}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text flex-1 text-left text-[15px] font-medium">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`flex-shrink-0 w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-[#FF6B35]"
                      : "text-gray-500"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group w-full ${
                  isActive(nav.path) ? ACTIVE_COLOR : "menu-item-inactive"
                }`}
              >
                <span
                  className={`flex-shrink-0 ${
                    isActive(nav.path)
                      ? "text-[#FF6B35]"
                      : "text-gray-500"
                  }`}
                  style={{ width: '24px', height: '24px' }}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex-1 text-left text-[15px] font-medium">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? ACTIVE_COLOR
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <span className="text-[14px]">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className="ml-auto px-2 py-0.5 rounded text-xs font-medium uppercase"
                            style={{ 
                              backgroundColor: isActive(subItem.path) ? '#FF6B35' : '#FFE8DC',
                              color: isActive(subItem.path) ? '#FFFFFF' : '#FF6B35'
                            }}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className="ml-auto px-2 py-0.5 rounded text-xs font-medium uppercase"
                            style={{ 
                              backgroundColor: isActive(subItem.path) ? '#FF6B35' : '#FFE8DC',
                              color: isActive(subItem.path) ? '#FFFFFF' : '#FF6B35'
                            }}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      style={{ backgroundColor: '#FFFFFF', borderColor: '#BDBDBD' }}
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <h1 className="text-2xl font-bold tracking-tight">
              <span style={{ color: '#FF6B35' }}>K-Tiger</span>
              <span style={{ color: '#4CAF50' }}>Study</span>
            </h1>
          ) : (
            <h1 className="text-3xl font-bold" style={{ color: '#FF6B35' }}>
              K
            </h1>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col">
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
