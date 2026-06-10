import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { parseISO, format } from "date-fns";
import { adminService } from "../../../services/adminService.js";

function ReportsTab() {
  const [period, setPeriod] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [apts, emps, srvs] = await Promise.all([
        adminService.appointments.list(),
        adminService.employees.list(),
        adminService.services.list()
      ]);
      setAppointments(apts);
      setEmployees(emps);
      setServices(srvs);
    } catch (e) {
      setError(e?.message || "Não foi possível carregar os relatórios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filterByPeriod = () => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    if (period === "today") return appointments.filter((a) => a.date === today);
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appointments.filter((a) => parseISO(a.date) >= weekAgo);
    }
    if (period === "month") {
      const ym = today.slice(0, 7);
      return appointments.filter((a) => (a.date || "").startsWith(ym));
    }
    return appointments;
  };

  const filtered = filterByPeriod();
  const totalAppointments = filtered.length;
  const completedAppointments = filtered.filter((a) => a.status === "concluido").length;
  const cancelledAppointments = filtered.filter((a) => a.status === "cancelado").length;
  const noShowAppointments = filtered.filter((a) => a.status === "nao_compareceu").length;
  const totalRevenue = filtered
    .filter((a) => a.status === "concluido")
    .reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  const pct = (n) => (totalAppointments ? ((n / totalAppointments) * 100).toFixed(1) : "0.0");

  const employeePerformance = employees.map((employee) => {
    const appts = filtered.filter((a) => a.employee.id === employee.id);
    const completed = appts.filter((a) => a.status === "concluido");
    return {
      name: employee.name,
      appointments: appts.length,
      completed: completed.length,
      revenue: completed.reduce((sum, a) => sum + (a.totalPrice || 0), 0)
    };
  });

  const serviceStats = services
    .map((service) => {
      const appts = filtered.filter((a) => a.services.some((s) => s.id === service.id));
      const completed = appts.filter((a) => a.status === "concluido");
      return {
        name: service.name,
        total: appts.length,
        completed: completed.length,
        revenue: completed.length * (service.price || 0)
      };
    })
    .sort((a, b) => b.total - a.total);

  const chartData = employeePerformance.map((emp) => ({
    name: emp.name.split(" ")[0],
    Receita: emp.revenue
  }));

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando relatórios…</div>;
  }
  if (error) {
    return <div className="py-16 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
      </div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-foreground">Relatórios</h2>
          <p className="text-muted-foreground">Análise de desempenho e estatísticas</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[200px] bg-card border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="all">Todo Período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total de Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">{completedAppointments} concluídos</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">de {completedAppointments} serviços</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Cancelamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{cancelledAppointments}</div>
            <p className="text-xs text-muted-foreground">{pct(cancelledAppointments)}% do total</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{noShowAppointments}</div>
            <p className="text-xs text-muted-foreground">{pct(noShowAppointments)}% do total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Receita por Funcionário</CardTitle>
          <CardDescription className="text-muted-foreground">Comparativo de desempenho da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} stroke="var(--border)" />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} stroke="var(--border)" />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--foreground)"
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="Receita" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Desempenho por Funcionário</CardTitle>
            <CardDescription className="text-muted-foreground">Estatísticas individuais</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Atendimentos</TableHead>
                  <TableHead>Concluídos</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeePerformance.map((emp) => <TableRow key={emp.name} className="border-border/30">
                    <TableCell className="text-foreground">{emp.name}</TableCell>
                    <TableCell className="text-foreground">{emp.appointments}</TableCell>
                    <TableCell className="text-foreground">{emp.completed}</TableCell>
                    <TableCell className="text-primary font-medium">R$ {emp.revenue.toFixed(2)}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Serviços Mais Populares</CardTitle>
            <CardDescription className="text-muted-foreground">Ranking de serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Concluídos</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceStats.map((srv) => <TableRow key={srv.name} className="border-border/30">
                    <TableCell className="text-foreground">{srv.name}</TableCell>
                    <TableCell className="text-foreground">{srv.total}</TableCell>
                    <TableCell className="text-foreground">{srv.completed}</TableCell>
                    <TableCell className="text-primary font-medium">R$ {srv.revenue.toFixed(2)}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>;
}
export {
  ReportsTab
};
