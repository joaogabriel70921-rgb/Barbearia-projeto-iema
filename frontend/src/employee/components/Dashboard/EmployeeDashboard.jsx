import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Overview } from "./Overview";
import { NewAppointments } from "./NewAppointments";
import { MyAppointments } from "./MyAppointments";
import { AvailabilityNew } from "./AvailabilityNew";
import { ProfileNew } from "./ProfileNew";
import { employeeService } from "../../../services/employeeService.js";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Home,
  Bell,
  Calendar,
  Clock,
  User,
  LogOut,
  Scissors
} from "lucide-react";
function EmployeeDashboard({ employee: initialEmployee, onLogout }) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [newAppointments, setNewAppointments] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  // Carrega a agenda do funcionário e divide em pendentes / outros / concluídos de hoje.
  // Reutilizado após cada ação (aceitar, recusar, sugerir...) para refletir o backend.
  const loadAppointments = useCallback(async () => {
    const apts = await employeeService.listAppointments();
    const today = format(new Date(), "yyyy-MM-dd");
    setNewAppointments(apts.filter((a) => a.statusRaw === "pendente"));
    setConfirmedAppointments(apts.filter((a) => a.statusRaw !== "pendente"));
    setCompletedToday(
      apts.filter((a) => a.statusRaw === "concluido" && a.data === today).length
    );
  }, []);

  const loadAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    try {
      setAvailability(await employeeService.getAvailability());
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments().catch(() => {
      toast.error("Não foi possível carregar os agendamentos");
    });
    loadAvailability().catch(() => {
      toast.error("Não foi possível carregar a disponibilidade");
    });
  }, [loadAppointments, loadAvailability]);
  const handleStatusChange = async (status) => {
    const prev = employee;
    setEmployee({ ...employee, status }); // atualização otimista
    try {
      const saved = await employeeService.setStatus(status);
      setEmployee(saved);
    } catch (e) {
      setEmployee(prev); // reverte em caso de erro
      toast.error("N\xE3o foi poss\xEDvel alterar o status", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleAcceptAppointment = async (id) => {
    const apt = newAppointments.find((a) => a.id === id);
    try {
      await employeeService.accept(id);
      await loadAppointments();
      toast.success("Agendamento aceito!", {
        description: apt ? `O agendamento de ${apt.cliente.nome} foi confirmado.` : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel aceitar o agendamento", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleRejectAppointment = async (id) => {
    const apt = newAppointments.find((a) => a.id === id);
    try {
      await employeeService.reject(id);
      await loadAppointments();
      toast.error("Agendamento recusado", {
        description: apt ? `O agendamento de ${apt.cliente.nome} foi recusado.` : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel recusar o agendamento", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleSuggestTime = async (appointmentId, newDate, newTime, message) => {
    const apt = newAppointments.find((a) => a.id === appointmentId);
    try {
      await employeeService.suggestTime(appointmentId, { date: newDate, time: newTime, message });
      await loadAppointments();
      toast.success("Sugest\xE3o enviada!", {
        description: apt
          ? `Sua sugest\xE3o de novo hor\xE1rio foi enviada para ${apt.cliente.nome}.`
          : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel sugerir o hor\xE1rio", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
      throw e; // mantém o modal aberto para o usuário corrigir
    }
  };
  const handleStartAppointment = async (id) => {
    const apt = confirmedAppointments.find((a) => a.id === id);
    try {
      await employeeService.start(id); // confirmado → em_andamento
      await loadAppointments();
      toast.success("Atendimento iniciado", {
        description: apt ? `Atendimento de ${apt.cliente.nome} em andamento.` : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel iniciar o atendimento", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleCompleteAppointment = async (id) => {
    const apt = confirmedAppointments.find((a) => a.id === id);
    try {
      await employeeService.complete(id); // em_andamento → concluido
      await loadAppointments();
      toast.success("Atendimento conclu\xEDdo!", {
        description: apt ? `Atendimento de ${apt.cliente.nome} finalizado.` : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel concluir o atendimento", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleCancelAppointment = async (id) => {
    const apt = confirmedAppointments.find((a) => a.id === id);
    try {
      await employeeService.reject(id); // confirmado → cancelado (reusa o endpoint reject)
      await loadAppointments();
      toast.error("Agendamento cancelado", {
        description: apt ? `O agendamento de ${apt.cliente.nome} foi cancelado.` : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel cancelar o agendamento", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleNoShowAppointment = async (id) => {
    const apt = confirmedAppointments.find((a) => a.id === id);
    try {
      await employeeService.noShow(id); // em_andamento → nao_compareceu
      await loadAppointments();
      toast.warning("Cliente marcado como ausente", {
        description: apt ? `${apt.cliente.nome} foi marcado como n\xE3o compareceu.` : undefined
      });
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel marcar como ausente", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    }
  };
  const handleUpdateEmployee = async (updatedEmployee) => {
    // Lança em caso de erro — o ProfileNew trata o toast de erro.
    const saved = await employeeService.updateMe(updatedEmployee);
    setEmployee(saved);
    return saved;
  };
  const handleUpdateAvailability = async (updatedAvailability) => {
    // Lança em caso de erro — o AvailabilityNew trata o toast de erro.
    const saved = await employeeService.updateAvailability(updatedAvailability);
    setAvailability(saved);
    return saved;
  };
  const today = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = confirmedAppointments.filter((apt) => {
    return apt.data === today;
  });
  const todayNewAppointments = newAppointments.filter((apt) => {
    return apt.data === today;
  });
  return <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur shadow-sm">
        <div className="container max-w-7xl flex h-16 items-center justify-between px-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-barbershop-dark" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-foreground">Barbearia Premium</h1>
              <p className="text-xs text-muted-foreground">Painel do Funcionário</p>
            </div>
            {
    /* Status mobile - visível apenas em telas pequenas */
  }
            <div className="md:hidden flex items-center gap-2 px-2 py-1 rounded-full border border-border bg-muted/50">
              <div
    className={`w-2 h-2 rounded-full ${employee.status === "online" ? "bg-green-500 animate-pulse" : employee.status === "trabalhando" ? "bg-blue-500 animate-pulse" : employee.status === "pausado" ? "bg-yellow-500" : "bg-gray-400"}`}
  />
              <span className="text-[10px] font-medium">
                {employee.status === "online" ? "Dispon\xEDvel" : employee.status === "trabalhando" ? "Atendendo" : employee.status === "pausado" ? "Pausa" : "Off"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{employee.nome}</p>
                <p className="text-xs text-muted-foreground">{employee.cargo}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50">
                <div
    className={`w-2.5 h-2.5 rounded-full ${employee.status === "online" ? "bg-green-500 animate-pulse" : employee.status === "trabalhando" ? "bg-blue-500 animate-pulse" : employee.status === "pausado" ? "bg-yellow-500" : "bg-gray-400"}`}
  />
                <span className="text-xs font-medium">
                  {employee.status === "online" ? "Dispon\xEDvel" : employee.status === "trabalhando" ? "Em Atendimento" : employee.status === "pausado" ? "Em Pausa" : "Offline"}
                </span>
              </div>
            </div>
            <Avatar className="ring-2 ring-primary/20">
              <AvatarImage src={employee.foto} alt={employee.nome} />
              <AvatarFallback className="bg-primary text-barbershop-dark font-semibold">
                {employee.nome.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <Button
    variant="ghost"
    size="icon"
    onClick={onLogout}
    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
    title="Sair"
  >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl py-6 px-4">
        <Tabs defaultValue="inicio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted p-1 h-auto">
            <TabsTrigger
    value="inicio"
    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-0 data-[state=active]:bg-primary data-[state=active]:text-barbershop-dark transition-all"
  >
              <Home className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Início</span>
            </TabsTrigger>
            <TabsTrigger
    value="novos"
    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-0 data-[state=active]:bg-primary data-[state=active]:text-barbershop-dark transition-all relative"
  >
              <Bell className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Novos</span>
              {newAppointments.length > 0 && <span className="absolute top-0 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-semibold animate-pulse">
                  {newAppointments.length}
                </span>}
            </TabsTrigger>
            <TabsTrigger
    value="agendamentos"
    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-0 data-[state=active]:bg-primary data-[state=active]:text-barbershop-dark transition-all"
  >
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Agendamentos</span>
              <span className="text-xs sm:text-sm sm:hidden">Agenda</span>
            </TabsTrigger>
            <TabsTrigger
    value="horarios"
    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-0 data-[state=active]:bg-primary data-[state=active]:text-barbershop-dark transition-all"
  >
              <Clock className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Horários</span>
            </TabsTrigger>
            <TabsTrigger
    value="perfil"
    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-0 data-[state=active]:bg-primary data-[state=active]:text-barbershop-dark transition-all"
  >
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inicio">
            <Overview
    employee={employee}
    todayAppointments={todayAppointments}
    newAppointments={todayNewAppointments}
    completedToday={completedToday}
    onStatusChange={handleStatusChange}
  />
          </TabsContent>

          <TabsContent value="novos">
            <NewAppointments
    appointments={newAppointments}
    onAccept={handleAcceptAppointment}
    onReject={handleRejectAppointment}
    onSuggestTime={handleSuggestTime}
  />
          </TabsContent>

          <TabsContent value="agendamentos">
            <MyAppointments
    appointments={confirmedAppointments}
    onStart={handleStartAppointment}
    onComplete={handleCompleteAppointment}
    onCancel={handleCancelAppointment}
    onNoShow={handleNoShowAppointment}
  />
          </TabsContent>

          <TabsContent value="horarios">
            {availabilityLoading || !availability ? <div className="py-12 text-center text-muted-foreground">
                Carregando disponibilidade…
              </div> : <AvailabilityNew
    availability={availability}
    onUpdate={handleUpdateAvailability}
  />}
          </TabsContent>

          <TabsContent value="perfil">
            <ProfileNew employee={employee} onUpdate={handleUpdateEmployee} />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}
export {
  EmployeeDashboard
};
