import { useState } from "react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UsersRound,
  Scissors,
  BarChart3,
  User,
  Menu
} from "lucide-react";
import { DashboardTab } from "./admin/DashboardTab";
import { AppointmentsTab } from "./admin/AppointmentsTab";
import { EmployeesTab } from "./admin/EmployeesTab";
import { ClientsTab } from "./admin/ClientsTab";
import { ServicesTab } from "./admin/ServicesTab";
import { ReportsTab } from "./admin/ReportsTab";
import { ProfileTab } from "./admin/ProfileTab";
import { useAuth } from "../../contexts/AuthContext.jsx";
function AdminDashboard({ initialTab = "dashboard", importMode = false, onLogout }) {
  const { user } = useAuth();
  const adminName = user?.name || "Administrador";
  const adminInitials = adminName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const tabs = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { value: "appointments", label: "Agendamentos", icon: Calendar },
    { value: "employees", label: "Funcion\xE1rios", icon: Users },
    { value: "clients", label: "Clientes", icon: UsersRound },
    { value: "services", label: "Servi\xE7os", icon: Scissors },
    { value: "reports", label: "Relat\xF3rios", icon: BarChart3 },
    { value: "profile", label: "Perfil", icon: User }
  ];
  const safeInitialTab = tabs.some((tab) => tab.value === initialTab) ? initialTab : "dashboard";
  const [activeTab, setActiveTab] = useState(safeInitialTab);
  return <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Scissors className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground">Painel Administrativo</h1>
              </div>
              <p className="text-sm text-primary">Barbearia Clássica</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {adminInitials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{adminName}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {
    /* Navigation for Desktop */
  }
          <TabsList className="hidden lg:grid w-full grid-cols-7 gap-1.5 h-auto mb-8 bg-card border border-border/50 p-1.5 rounded-xl">
            {tabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.value;
    return <TabsTrigger
      key={tab.value}
      value={tab.value}
      className="relative flex items-center justify-center gap-2 py-2.5 h-auto text-sm font-medium transition-colors data-[state=active]:text-primary-foreground"
    >
                  {isActive && (
                    <motion.span
                      layoutId="adminTabIndicator"
                      className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{tab.label}</span>
                </TabsTrigger>;
  })}
          </TabsList>

          {
    /* Navigation for Mobile - Dropdown Select */
  }
          <div className="lg:hidden mb-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-card border-border/50 h-12">
                <div className="flex items-center gap-2">
                  <Menu className="h-4 w-4 text-primary" />
                  <SelectValue>
                    {tabs.find((t) => t.value === activeTab)?.label}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {tabs.map((tab) => {
    const Icon = tab.icon;
    return <SelectItem key={tab.value} value={tab.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </div>
                    </SelectItem>;
  })}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeesTab />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}
export {
  AdminDashboard
};
