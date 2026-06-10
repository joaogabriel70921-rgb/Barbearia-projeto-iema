import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, DollarSign, CheckCircle2, XCircle, UserX, Users, AlertCircle } from "lucide-react";
import { adminService } from "../../../services/adminService.js";

const STATUS_LABEL = {
  online: "Disponível",
  trabalhando: "Ocupado",
  pausado: "Em pausa",
  offline: "Offline",
};

function DashboardTab() {
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      adminService.dashboard.todayAppointments(),
      adminService.employees.list(),
    ])
      .then(([apts, emps]) => {
        if (!active) return;
        setAppointments(apts);
        setEmployees(emps);
      })
      .catch((e) => active && setError(e?.message || "Não foi possível carregar o dashboard."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const todayAppointments = appointments;
  const confirmedToday = todayAppointments.filter((a) => a.status === "confirmado");
  const completedToday = todayAppointments.filter((a) => a.status === "concluido");
  const cancelledToday = todayAppointments.filter((a) => a.status === "cancelado");
  const noShowToday = todayAppointments.filter((a) => a.status === "nao_compareceu");
  const todayRevenue = completedToday.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  const estimatedRevenue = confirmedToday.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  const availableEmployees = employees.filter((e) => e.status === "online").length;
  const busyEmployees = employees.filter((e) => e.status === "trabalhando").length;

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando dashboard…</div>;
  }
  if (error) {
    return <div className="py-16 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
      </div>;
  }

  return <div className="space-y-6">
      <div>
        <h2 className="text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Resumo de hoje - {(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedToday.length} confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Receita Realizada
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +R$ {estimatedRevenue.toFixed(2)} estimado
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Serviços Concluídos
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completedToday.length}</div>
            <p className="text-xs text-muted-foreground">
              de {todayAppointments.length} agendados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Cancelamentos
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{cancelledToday.length}</div>
            <p className="text-xs text-muted-foreground">
              hoje
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Não Compareceu
            </CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{noShowToday.length}</div>
            <p className="text-xs text-muted-foreground">
              faltas hoje
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Funcionários Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{availableEmployees + busyEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {availableEmployees} disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Status dos Funcionários</CardTitle>
          <CardDescription className="text-muted-foreground">Disponibilidade atual da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum funcionário cadastrado
            </p> : <div className="space-y-4">
            {employees.map((employee) => <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-3">
                  {employee.photo ? <img
    src={employee.photo}
    alt={employee.name}
    className="w-11 h-11 rounded-full border-2 border-primary/30"
  /> : <div className="w-11 h-11 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {employee.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>}
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <Badge
    variant={employee.status === "online" ? "default" : employee.status === "trabalhando" ? "secondary" : "outline"}
    className={employee.status === "online" ? "bg-primary text-primary-foreground" : ""}
  >
                  {STATUS_LABEL[employee.status] || employee.status}
                </Badge>
              </div>)}
          </div>}
        </CardContent>
      </Card>
    </div>;
}
export {
  DashboardTab
};
