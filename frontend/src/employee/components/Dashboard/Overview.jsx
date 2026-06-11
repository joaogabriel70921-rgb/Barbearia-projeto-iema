import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
function Overview({ employee, todayAppointments, newAppointments, completedToday, onStatusChange }) {
  const allTodayAppointments = [...todayAppointments, ...newAppointments];
  const nextAppointment = allTodayAppointments.filter((apt) => apt.status === "confirmado" || apt.status === "pendente").sort((a, b) => a.horario.localeCompare(b.horario))[0];
  const pendingCount = newAppointments.filter((apt) => apt.status === "pendente").length;
  const confirmedCount = todayAppointments.filter(
    (apt) => apt.status === "confirmado" || apt.status === "em andamento"
  ).length;
  const getStatusColor = (status) => {
    const colors = {
      online: "bg-green-500",
      trabalhando: "bg-blue-500",
      pausado: "bg-yellow-500",
      offline: "bg-gray-500"
    };
    return colors[status];
  };
  const getStatusLabel = (status) => {
    const labels = {
      online: "Dispon\xEDvel",
      trabalhando: "Em atendimento",
      pausado: "Em pausa",
      offline: "Offline"
    };
    return labels[status];
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">Bem-vindo, {employee.nome}!</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {format(/* @__PURE__ */ new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(employee.status)}`} />
            <span className="text-sm font-medium">{getStatusLabel(employee.status)}</span>
          </div>
          <Select value={employee.status} onValueChange={(value) => onStatusChange(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Disponível</SelectItem>
              <SelectItem value="trabalhando">Em atendimento</SelectItem>
              <SelectItem value="pausado">Em pausa</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando confirmação</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Para hoje</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Atendimentos hoje</p>
          </CardContent>
        </Card>
      </div>

      {nextAppointment && <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg md:text-xl">
              <Users className="h-5 w-5 text-primary" />
              Próximo Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold text-lg md:text-xl">{nextAppointment.cliente.nome}</p>
                  {nextAppointment.cliente.telefone && <p className="text-sm text-muted-foreground">{nextAppointment.cliente.telefone}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Serviço</p>
                    <p className="font-semibold">{nextAppointment.servico.nome}</p>
                    <p className="text-sm text-muted-foreground">R$ {nextAppointment.servico.preco.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-semibold text-primary text-lg">{nextAppointment.horario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duração</p>
                      <p className="font-semibold">{nextAppointment.servico.duracao} min</p>
                    </div>
                  </div>
                </div>
                {nextAppointment.cliente.observacoes && <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-muted-foreground mb-1">⚠️ Observações Importantes</p>
                    <p className="text-sm font-medium">{nextAppointment.cliente.observacoes}</p>
                  </div>}
              </div>
              <Badge
    variant={nextAppointment.status === "pendente" ? "secondary" : "default"}
    className="text-xs self-start"
  >
                {nextAppointment.status}
              </Badge>
            </div>
          </CardContent>
        </Card>}
    </div>;
}
export {
  Overview
};
