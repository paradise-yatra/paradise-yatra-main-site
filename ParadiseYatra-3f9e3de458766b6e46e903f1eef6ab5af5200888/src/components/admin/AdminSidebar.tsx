"use client";

import { 
  BarChart3, 
  FolderOpen, 
  Settings, 
  FileText, 
  Mountain, 
  Calendar, 
  Star, 
  Compass,
  ChevronDown,
  ChevronRight,
  LogOut,
  Map,
  HelpCircle
} from "lucide-react";
import Image from "next/image";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
  onLogout?: () => void;
}

const AdminSidebar = ({ 
  activeSection, 
  setActiveSection, 
  expandedSections, 
  toggleSection,
  onLogout
}: AdminSidebarProps) => {
  // Removed unused showSubMenu state

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "addons",
      label: "CONTENT MANAGEMENT",
      icon: null,
      hasSubmenu: false,
      hasNotification: false,
      isHeader: true,
    },
    {
      id: "hero-section",
      label: "Hero Section",
      icon: BarChart3,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "footer",
      label: "Footer",
      icon: Settings,
      hasSubmenu: false,
      hasNotification: false,
    },

    {
      id: "testimonials",
      label: "Testimonials",
      icon: Star,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "cta-section",
      label: "CTA Section",
      icon: Settings,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "stats",
      label: "Statistics",
      icon: BarChart3,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "addons2",
      label: "PACKAGE MANAGEMENT",
      icon: null,
      hasSubmenu: false,
      hasNotification: false,
      isHeader: true,
    },
    {
      id: "popular-destinations",
      label: "Popular Destinations",
      icon: Mountain,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "premium-packages",
      label: "Premium Packages",
      icon: Star,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "adventure-packages",
      label: "Adventure Packages",
      icon: Compass,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "holiday-types",
      label: "Holiday Types",
      icon: Calendar,
      hasSubmenu: false,
      hasNotification: false,
    },

    {
      id: "fixed-departures",
      label: "Fixed Departures",
      icon: Calendar,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "itinerary",
      label: "Itinerary Management",
      icon: Map,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "trending-destinations",
      label: "Trending Destinations",
      icon: Mountain,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "recently-booked",
      label: "Recently Booked",
      icon: Calendar,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "addons3",
      label: "CONTENT & SEO",
      icon: null,
      hasSubmenu: false,
      hasNotification: false,
      isHeader: true,
    },
    {
      id: "blogs",
      label: "Blog",
      icon: FileText,
      hasSubmenu: true,
      hasNotification: false,
      subItems: [
        { id: "create-blog", label: "Create Blog" },
        { id: "all-blogs", label: "All Blogs" },
      ],
    },
    {
      id: "menu",
      label: "Menu",
      icon: FolderOpen,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "seo",
      label: "SEO",
      icon: Settings,
      hasSubmenu: false,
      hasNotification: false,
    },
    {
      id: "faq",
      label: "FAQ Management",
      icon: HelpCircle,
      hasSubmenu: false,
      hasNotification: false,
    },
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === "addons") return; // Don't do anything for header
    
    if (menuItems.find(item => item.id === itemId)?.hasSubmenu) {
      toggleSection(itemId);
    } else {
      setActiveSection(itemId);
    }
  };

  return (
    <div className="w-64 p-2 m-2 bg-blue-900 text-white min-h-screen flex flex-col rounded-lg">
      {/* Logo and Title */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div>
            <Image src="/headerLogo.png" alt="logo" width={100} height={100} className="bg-white/50 backdrop-blur-sm rounded-full items-center justify-center object-contain w-25 h-25" />
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.isHeader ? (
              <div className="text-blue-300 text-sm font-semibold uppercase tracking-wider py-2">
                {item.label}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full hover:cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.label}</span>
                    {item.hasNotification && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  {item.hasSubmenu && (
                    <span className="text-sm">
                      {expandedSections.has(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>

                {/* Submenu for Blog */}
                {item.hasSubmenu && expandedSections.has(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveSection("blogs");
                          // Pass the submenu action to the parent component
                          if (subItem.id === "create-blog") {
                            // We'll handle this in the AdminPage component
                            window.dispatchEvent(new CustomEvent('blogAction', { detail: 'create' }));
                          }
                        }}
                        className={`w-full text-left px-3 py-2 hover:cursor-pointer rounded-lg transition-colors ${
                          activeSection === "blogs"
                            ? "bg-blue-700 text-white"
                            : "text-gray-300 hover:bg-blue-800 hover:text-white"
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-300 hover:cursor-pointer hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar; 