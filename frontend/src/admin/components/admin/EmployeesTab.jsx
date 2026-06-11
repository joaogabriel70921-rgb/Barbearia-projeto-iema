import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService.js";

const STATUS_INFO = {
  online: { variant: "default", label: "Disponível" },
  trabalhando: { variant: "secondary", label: "Ocupado" },
  pausado: { variant: "outline", label: "Em pausa" },
  offline: { variant: "outline", label: "Offline" }
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  position: "",
  specialties: "",
  status: "offline"
};

function EmployeesTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await adminService.employees.list();
      setEmployees(list.filter((e) => e.active));
    } catch (e) {
      setError(e?.message || "Não foi possível carregar os funcionários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDialog = (employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        password: "",
        position: employee.position,
        specialties: (employee.specialties || []).join(", "),
        status: employee.status
      });
    } else {
      setEditingEmployee(null);
      setFormData(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Nome e email são obrigatórios");
      return;
    }
    if (!editingEmployee && !formData.password.trim()) {
      toast.error("Defina uma senha para o novo funcionário");
      return;
    }
    setSaving(true);
    const specialties = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      if (editingEmployee) {
        await adminService.employees.update(editingEmployee.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          position: formData.position.trim(),
          specialties
        });
        if (formData.status !== editingEmployee.status) {
          await adminService.employees.setStatus(editingEmployee.id, formData.status);
        }
        toast.success("Dados do funcionário atualizados!");
      } else {
        await adminService.employees.create({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          position: formData.position.trim() || "Barbeiro",
          specialties
        });
        toast.success("Funcionário criado com sucesso!");
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      toast.error("Erro ao salvar funcionário", { description: e?.message || "Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.employees.remove(id);
      toast.success("Funcionário desativado com sucesso");
      await load();
    } catch (e) {
      toast.error("Erro ao remover funcionário", { description: e?.message || "Tente novamente." });
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando funcionários…</div>;
  }
  if (error) {
    return <div className="py-16 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
        <Button variant="outline" onClick={load}>Tentar novamente</Button>
      </div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-foreground">Funcionários</h2>
          <p className="text-muted-foreground">Gerencie a equipe da barbearia</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Funcionário
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.length === 0 ? <Card className="border-border/50 bg-card md:col-span-2 lg:col-span-3">
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum funcionário cadastrado
            </CardContent>
          </Card> : employees.map((employee) => {
    const statusInfo = STATUS_INFO[employee.status] || STATUS_INFO.offline;
    return <Card key={employee.id} className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {employee.photo ? <img
      src={employee.photo}
      alt={employee.name}
      className="w-12 h-12 rounded-full border-2 border-primary/30"
    /> : <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {employee.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>}
                    <div>
                      <CardTitle className="text-base text-foreground">{employee.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{employee.position}</CardDescription>
                    </div>
                  </div>
                  <Badge
      variant={statusInfo.variant}
      className={statusInfo.variant === "default" ? "bg-primary text-primary-foreground" : ""}
    >
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-foreground">Especialidades</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.specialties.length > 0 ? employee.specialties.map((specialty, idx) => <Badge key={idx} variant="outline" className="border-primary/30 text-foreground">
                        {specialty}
                      </Badge>) : <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-foreground">Contato</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.email}{employee.phone ? ` · ${employee.phone}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
      size="sm"
      variant="outline"
      className="flex-1 border-border/50 hover:bg-primary hover:text-primary-foreground"
      onClick={() => openDialog(employee)}
    >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
      size="sm"
      variant="outline"
      className="border-border/50 hover:bg-destructive hover:text-destructive-foreground"
      onClick={() => handleDelete(employee.id)}
    >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>;
  })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Editar Funcionário" : "Novo Funcionário"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do funcionário
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
    id="name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
    id="email"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
    id="phone"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  />
              </div>
            </div>
            {!editingEmployee && <div>
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
    id="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  />
            </div>}
            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input
    id="position"
    value={formData.position}
    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
  />
            </div>
            <div>
              <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
              <Input
    id="specialties"
    value={formData.specialties}
    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
  />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
    value={formData.status}
    onValueChange={(value) => setFormData({ ...formData, status: value })}
  >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Disponível</SelectItem>
                  <SelectItem value="trabalhando">Ocupado</SelectItem>
                  <SelectItem value="pausado">Em pausa</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : editingEmployee ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  EmployeesTab
};
