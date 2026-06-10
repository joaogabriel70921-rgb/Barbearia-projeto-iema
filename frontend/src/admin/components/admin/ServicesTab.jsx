import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService.js";

function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await adminService.services.list());
    } catch (e) {
      setError(e?.message || "Não foi possível carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDialog = (service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price
      });
    } else {
      setEditingService(null);
      setFormData({ name: "", description: "", duration: 30, price: 0 });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Informe o nome do serviço");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description,
        duration: Number(formData.duration) || 0,
        price: Number(formData.price) || 0
      };
      if (editingService) {
        await adminService.services.update(editingService.id, payload);
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await adminService.services.create(payload);
        toast.success("Serviço criado com sucesso!");
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      toast.error("Erro ao salvar serviço", { description: e?.message || "Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.services.remove(id);
      toast.success("Serviço desativado");
      await load();
    } catch (e) {
      toast.error("Erro ao remover serviço", { description: e?.message || "Tente novamente." });
    }
  };

  const toggleStatus = async (svc) => {
    try {
      await adminService.services.toggleActive(svc.id);
      toast.success(svc.active ? "Serviço desativado" : "Serviço ativado");
      await load();
    } catch (e) {
      toast.error("Erro ao alterar status", { description: e?.message || "Tente novamente." });
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando serviços…</div>;
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
          <h2 className="text-foreground">Serviços</h2>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? <Card className="border-border/50 bg-card">
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum serviço cadastrado
            </CardContent>
          </Card> : services.map((service) => <Card key={service.id} className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">{service.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                  </div>
                  <Badge
    variant={service.active ? "default" : "outline"}
    className={service.active ? "bg-primary text-primary-foreground" : ""}
  >
                    {service.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium mb-1 text-foreground">Duração</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration} minutos
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 text-foreground">Preço</p>
                    <p className="text-sm text-primary font-medium">
                      R$ {service.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 text-foreground">Funcionários</p>
                    <p className="text-sm text-muted-foreground">
                      {service.employeeCount} profissionais
                    </p>
                  </div>
                  <div className="flex gap-2 items-end">
                    <Button
    size="sm"
    variant="outline"
    className="border-border/50 hover:bg-primary hover:text-primary-foreground"
    onClick={() => toggleStatus(service)}
  >
                      {service.active ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
    size="sm"
    variant="outline"
    className="border-border/50 hover:bg-primary hover:text-primary-foreground"
    onClick={() => openDialog(service)}
  >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
    size="sm"
    variant="outline"
    className="border-border/50 hover:bg-destructive hover:text-destructive-foreground"
    onClick={() => handleDelete(service.id)}
  >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do serviço
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
    id="name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
    id="description"
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
    id="duration"
    type="number"
    value={formData.duration}
    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
  />
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
    id="price"
    type="number"
    step="0.01"
    value={formData.price}
    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
  />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : editingService ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  ServicesTab
};
