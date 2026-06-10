import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { CheckCircle2, XCircle, Clock, Calendar, Trash2, AlertCircle } from "lucide-react";
import { parseISO, format } from "date-fns";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService.js";

const STATUS_INFO = {
  pendente: { variant: "secondary", label: "Pendente" },
  confirmado: { variant: "default", label: "Confirmado" },
  em_andamento: { variant: "default", label: "Em andamento" },
  concluido: { variant: "outline", label: "Concluído" },
  cancelado: { variant: "destructive", label: "Cancelado" },
  nao_compareceu: { variant: "destructive", label: "Não Compareceu" }
};

function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAppointments(await adminService.appointments.list());
    } catch (e) {
      setError(e?.message || "Não foi possível carregar os agendamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await adminService.appointments.setStatus(id, status);
      toast.success("Status do agendamento atualizado!");
      await load();
    } catch (e) {
      toast.error("Erro ao atualizar status", { description: e?.message || "Tente novamente." });
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    setProcessing(true);
    try {
      await adminService.appointments.remove(selectedAppointment.id);
      toast.success("Agendamento excluído");
      setDialogOpen(false);
      setSelectedAppointment(null);
      await load();
    } catch (e) {
      toast.error("Erro ao excluir", { description: e?.message || "Tente novamente." });
    } finally {
      setProcessing(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== "all" && apt.status !== statusFilter) return false;
    if (dateFilter !== "all" && apt.date !== dateFilter) return false;
    return true;
  });
  const uniqueDates = [...new Set(appointments.map((apt) => apt.date))].sort();

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando agendamentos…</div>;
  }
  if (error) {
    return <div className="py-16 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
        <Button variant="outline" onClick={load}>Tentar novamente</Button>
      </div>;
  }

  return <div className="space-y-6">
      <div>
        <h2 className="text-foreground">Agendamentos</h2>
        <p className="text-muted-foreground">Gerencie todos os agendamentos</p>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] bg-card border-border/50">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
            <SelectItem value="nao_compareceu">Não Compareceu</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[200px] bg-card border-border/50">
            <SelectValue placeholder="Filtrar por data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as datas</SelectItem>
            {uniqueDates.map((date) => <SelectItem key={date} value={date}>
                {format(parseISO(date), "dd/MM/yyyy")}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Agendamentos</CardTitle>
          <CardDescription className="text-muted-foreground">
            {filteredAppointments.length} agendamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum agendamento encontrado
                  </TableCell>
                </TableRow> : filteredAppointments.map((apt) => {
    const statusInfo = STATUS_INFO[apt.status] || { variant: "outline", label: apt.status };
    const isOpen = apt.status === "pendente" || apt.status === "confirmado";
    return <TableRow key={apt.id} className="border-border/30">
                    <TableCell className="text-foreground">{apt.client.name}</TableCell>
                    <TableCell className="text-foreground">{apt.employee.name}</TableCell>
                    <TableCell className="text-foreground">{apt.serviceNames}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(apt.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{apt.time}</TableCell>
                    <TableCell className="text-primary font-medium">R$ {(apt.totalPrice || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
      variant={statusInfo.variant}
      className={statusInfo.variant === "default" ? "bg-primary text-primary-foreground" : ""}
    >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {apt.status === "pendente" && <Button
      size="sm"
      variant="ghost"
      title="Confirmar"
      onClick={() => changeStatus(apt.id, "confirmado")}
    >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>}
                        {apt.status === "confirmado" && <Button
      size="sm"
      variant="ghost"
      title="Concluir"
      onClick={() => changeStatus(apt.id, "concluido")}
    >
                            <Clock className="h-4 w-4" />
                          </Button>}
                        {isOpen && <>
                            <Button
      size="sm"
      variant="ghost"
      title="Cancelar"
      onClick={() => changeStatus(apt.id, "cancelado")}
    >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
      size="sm"
      variant="ghost"
      title="Não compareceu"
      onClick={() => changeStatus(apt.id, "nao_compareceu")}
    >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </>}
                        <Button
      size="sm"
      variant="ghost"
      title="Excluir"
      onClick={() => {
        setSelectedAppointment(apt);
        setDialogOpen(true);
      }}
    >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>;
  })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {processing ? "Excluindo…" : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  AppointmentsTab
};
