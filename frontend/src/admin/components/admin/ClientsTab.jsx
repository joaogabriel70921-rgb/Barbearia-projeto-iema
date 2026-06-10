import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Eye, Edit, Trash2, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { parseISO, format } from "date-fns";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService.js";

function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [cli, apts] = await Promise.all([
        adminService.clients.list(),
        adminService.appointments.list()
      ]);
      setClients(cli.filter((c) => c.active));
      setAppointments(apts);
    } catch (e) {
      setError(e?.message || "Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clientAppointments = (clientId) => appointments.filter((a) => a.client.id === clientId);
  const getClientAppointmentsCount = (clientId) => clientAppointments(clientId).length;
  const getClientTotalSpent = (clientId) =>
    clientAppointments(clientId)
      .filter((a) => a.status === "concluido")
      .reduce((sum, a) => sum + (a.totalPrice || 0), 0);

  const handleView = (client) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
  };
  const handleEdit = (client) => {
    setSelectedClient(client);
    setEditFormData({ name: client.name, phone: client.phone, email: client.email });
    setEditDialogOpen(true);
  };
  const handleDelete = (client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      await adminService.clients.remove(selectedClient.id);
      toast.success("Cliente desativado");
      setDeleteDialogOpen(false);
      setSelectedClient(null);
      await load();
    } catch (e) {
      toast.error("Erro ao remover cliente", { description: e?.message || "Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      await adminService.clients.update(selectedClient.id, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone
      });
      toast.success("Dados do cliente atualizados!");
      setEditDialogOpen(false);
      setSelectedClient(null);
      await load();
    } catch (e) {
      toast.error("Erro ao salvar cliente", { description: e?.message || "Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando clientes…</div>;
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
        <h2 className="text-foreground">Clientes Cadastrados</h2>
        <p className="text-muted-foreground">Gerencie os clientes da barbearia</p>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Clientes</CardTitle>
          <CardDescription className="text-muted-foreground">{clients.length} cliente(s) cadastrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Agendamentos</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum cliente cadastrado
                  </TableCell>
                </TableRow> : clients.map((client) => <TableRow key={client.id} className="border-border/30">
                    <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground">{client.phone || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell className="text-foreground">{getClientAppointmentsCount(client.id)}</TableCell>
                    <TableCell className="text-primary font-medium">R$ {getClientTotalSpent(client.id).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleView(client)} className="hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(client)} className="hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(client)} className="hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Visualizar Cliente */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-foreground">Detalhes do Cliente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Informações completas do cliente
            </DialogDescription>
          </DialogHeader>
          {selectedClient && <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome</p>
                  <p className="text-foreground font-medium">{selectedClient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                  <p className="text-foreground font-medium">{selectedClient.phone || "—"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-medium">{selectedClient.email}</p>
                </div>
              </div>

              <Separator className="bg-border/30" />

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/30 bg-secondary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {getClientAppointmentsCount(selectedClient.id)}
                        </p>
                        <p className="text-sm text-muted-foreground">Agendamentos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/30 bg-secondary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          R$ {getClientTotalSpent(selectedClient.id).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Gasto</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="text-foreground mb-3">Histórico de Agendamentos</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {clientAppointments(selectedClient.id).length === 0 ? <p className="text-sm text-muted-foreground">Nenhum agendamento.</p> : clientAppointments(selectedClient.id).map((apt) => <div
    key={apt.id}
    className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/20"
  >
                      <div>
                        <p className="text-sm text-foreground font-medium">
                          {format(parseISO(apt.date), "dd/MM/yyyy")} - {apt.time}
                        </p>
                        <p className="text-xs text-muted-foreground">{apt.serviceNames}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary font-medium">R$ {(apt.totalPrice || 0).toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs">
                          {apt.status}
                        </Badge>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="border-border/50">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Cliente */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Cliente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-foreground">Nome</Label>
              <Input
    id="edit-name"
    value={editFormData.name || ""}
    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
    className="bg-input-background border-border/50"
  />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-foreground">Telefone</Label>
              <Input
    id="edit-phone"
    value={editFormData.phone || ""}
    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
    className="bg-input-background border-border/50"
  />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-foreground">Email</Label>
              <Input
    id="edit-email"
    type="email"
    value={editFormData.email || ""}
    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
    className="bg-input-background border-border/50"
  />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-border/50" disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
              {saving ? "Salvando…" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Excluir Cliente */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tem certeza que deseja desativar o cliente <strong className="text-foreground">{selectedClient?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-border/50" disabled={saving}>
              Cancelar
            </Button>
            <Button
    variant="destructive"
    onClick={confirmDelete}
    className="bg-destructive text-destructive-foreground"
    disabled={saving}
  >
              {saving ? "Removendo…" : "Desativar Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  ClientsTab
};
