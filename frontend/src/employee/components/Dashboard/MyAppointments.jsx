import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Play, CheckCircle2, UserX } from "lucide-react";
import { format, parseISO } from "date-fns";
function MyAppointments({
  appointments,
  onStart,
  onComplete,
  onCancel,
  onNoShow
}) {
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterDate, setFilterDate] = useState("hoje");
  const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
  const filteredAppointments = appointments.filter((apt) => {
    const statusMatch = filterStatus === "todos" || apt.status === filterStatus;
    let dateMatch = true;
    if (filterDate === "hoje") {
      dateMatch = apt.data === today;
    } else if (filterDate === "semana") {
      const aptDate = parseISO(apt.data);
      const weekFromNow = /* @__PURE__ */ new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      dateMatch = aptDate <= weekFromNow;
    }
    return statusMatch && dateMatch;
  });
  const getStatusBadge = (status) => {
    const variants = {
      "pendente": "secondary",
      "confirmado": "default",
      "em andamento": "default",
      "conclu\xEDdo": "outline",
      "cancelado": "destructive",
      "n\xE3o compareceu": "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };
  const getActions = (appointment) => {
    if (appointment.status === "confirmado") {
      return <div className="flex gap-2">
          <Button
        size="sm"
        className="bg-primary hover:bg-primary/90 text-barbershop-dark"
        onClick={() => onStart(appointment.id)}
      >
            <Play className="mr-1 h-3 w-3" />
            Iniciar
          </Button>
          <Button
        size="sm"
        variant="outline"
        className="border-destructive text-destructive hover:bg-destructive hover:text-white"
        onClick={() => onCancel(appointment.id)}
      >
            Cancelar
          </Button>
        </div>;
    }
    if (appointment.status === "em andamento") {
      return <div className="flex gap-2">
          <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => onComplete(appointment.id)}
      >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Concluir
          </Button>
          <Button
        size="sm"
        variant="outline"
        className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
        onClick={() => onNoShow(appointment.id)}
      >
            <UserX className="mr-1 h-3 w-3" />
            Não Compareceu
          </Button>
        </div>;
    }
    return null;
  };
  return <div className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Meus Agendamentos</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Gerencie seus atendimentos confirmados
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={filterDate} onValueChange={(value) => setFilterDate(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="proximos">Próximos Dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="em andamento">Em Andamento</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {filteredAppointments.length}{" "}
            {filteredAppointments.length === 1 ? "agendamento" : "agendamentos"}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum agendamento encontrado
                  </TableCell>
                </TableRow> : filteredAppointments.map((apt) => <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.cliente.nome}</TableCell>
                    <TableCell>{apt.servico.nome}</TableCell>
                    <TableCell>
                      {format(parseISO(apt.data), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{apt.horario}</TableCell>
                    <TableCell>{getStatusBadge(apt.status)}</TableCell>
                    <TableCell>{getActions(apt)}</TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
export {
  MyAppointments
};
