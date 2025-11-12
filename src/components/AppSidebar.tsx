import { 
  LayoutDashboard, 
  UserPlus, 
  Stethoscope, 
  Pill, 
  CreditCard, 
  Users, 
  Package, 
  Settings,
  Activity
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: LayoutDashboard,
    roles: ["admin", "doctor", "pharmacist", "receptionist", "staff"]
  },
  { 
    title: "Pendaftaran", 
    url: "/registration", 
    icon: UserPlus,
    roles: ["receptionist", "admin"]
  },
  { 
    title: "Pemeriksaan", 
    url: "/examination", 
    icon: Stethoscope,
    roles: ["doctor", "admin"]
  },
  { 
    title: "Resep & Apotek", 
    url: "/pharmacy", 
    icon: Pill,
    roles: ["pharmacist", "admin"]
  },
  { 
    title: "Pembayaran", 
    url: "/payment", 
    icon: CreditCard,
    roles: ["staff", "admin"]
  },
  { 
    title: "Data Pasien", 
    url: "/patients", 
    icon: Users,
    roles: ["admin", "receptionist"]
  },
  { 
    title: "Data Obat", 
    url: "/medicines", 
    icon: Package,
    roles: ["admin", "pharmacist"]
  },
  { 
    title: "Pengguna", 
    url: "/users", 
    icon: Settings,
    roles: ["admin"]
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground">Klinik Sentosa</h2>
                <p className="text-xs text-muted-foreground">Sistem Informasi</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className="hover:bg-sidebar-accent transition-base"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
