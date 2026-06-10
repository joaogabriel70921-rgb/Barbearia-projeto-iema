import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { User, Mail, Phone, Briefcase, Award, Edit2, Plus, X, Save, Instagram, Youtube, TrendingUp, Users, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { ThemeToggle } from "../../../components/ThemeToggle.jsx";
function ProfileNew({ employee, onUpdate }) {
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee);
  const [showAddSpecialty, setShowAddSpecialty] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar perfil", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    } finally {
      setSaving(false);
    }
  };
  const addSpecialty = () => {
    if (!newSpecialty.trim()) {
      toast.error("Digite uma especialidade v\xE1lida");
      return;
    }
    if (formData.especialidades.includes(newSpecialty.trim())) {
      toast.error("Esta especialidade j\xE1 existe");
      return;
    }
    setFormData({
      ...formData,
      especialidades: [...formData.especialidades, newSpecialty.trim()]
    });
    setNewSpecialty("");
    setShowAddSpecialty(false);
    toast.success("Especialidade adicionada");
  };
  const removeSpecialty = (specialty) => {
    setFormData({
      ...formData,
      especialidades: formData.especialidades.filter((s) => s !== specialty)
    });
    toast.success("Especialidade removida");
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Meu Perfil</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e profissionais
          </p>
        </div>
        {!isEditing ? <Button
    onClick={() => setIsEditing(true)}
    className="bg-primary hover:bg-primary/90 text-barbershop-dark"
  >
            <Edit2 className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button> : <div className="flex gap-2">
            <Button variant="outline" disabled={saving} onClick={() => {
    setFormData(employee);
    setIsEditing(false);
  }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Salvando…" : "Salvar Alterações"}
            </Button>
          </div>}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {
    /* Coluna Esquerda - Avatar e Info Básica */
  }
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                  <AvatarImage src={employee.foto} alt={employee.nome} />
                  <AvatarFallback className="text-2xl bg-primary text-barbershop-dark font-bold">
                    {employee.nome.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && <Button variant="outline" size="sm">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>}
                <div className="text-center w-full">
                  <h3 className="text-xl font-bold">{employee.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{employee.cargo}</p>
                  <Badge
    variant={employee.status === "online" ? "default" : "secondary"}
    className="text-xs"
  >
                    {employee.status === "online" ? "Dispon\xEDvel" : employee.status === "trabalhando" ? "Em Atendimento" : employee.status === "pausado" ? "Em Pausa" : "Offline"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {
    /* Estatísticas */
  }
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estatísticas do Mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atendimentos</p>
                    <p className="text-xl font-bold">127</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clientes</p>
                    <p className="text-xl font-bold">89</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {
    /* Coluna Direita - Informações Detalhadas */
  }
        <div className="lg:col-span-2 space-y-6">
          {
    /* Informações Pessoais */
  }
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seus dados de contato e identificação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Nome Completo
                  </Label>
                  <Input
    id="nome"
    value={formData.nome}
    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
    disabled={!isEditing}
  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Cargo
                  </Label>
                  <Input
    id="cargo"
    value={formData.cargo}
    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
    disabled={!isEditing}
  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
    id="email"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    disabled={!isEditing}
  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Telefone
                  </Label>
                  <Input
    id="telefone"
    value={formData.telefone}
    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
    disabled={!isEditing}
  />
                </div>
              </div>
            </CardContent>
          </Card>

          {
    /* Especialidades */
  }
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Especialidades
                  </CardTitle>
                  <CardDescription>Suas áreas de expertise</CardDescription>
                </div>
                {isEditing && <Button
    size="sm"
    onClick={() => setShowAddSpecialty(true)}
    className="bg-primary hover:bg-primary/90 text-barbershop-dark"
  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.especialidades.length > 0 ? formData.especialidades.map((esp, index) => <Badge
    key={index}
    variant="secondary"
    className="text-sm px-3 py-1.5 flex items-center gap-2"
  >
                      {esp}
                      {isEditing && <button
    onClick={() => removeSpecialty(esp)}
    className="hover:text-destructive transition-colors"
  >
                          <X className="h-3 w-3" />
                        </button>}
                    </Badge>) : <p className="text-sm text-muted-foreground">Nenhuma especialidade cadastrada</p>}
              </div>
            </CardContent>
          </Card>

          {
    /* Redes Sociais */
  }
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Compartilhe seus trabalhos nas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </Label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    @
                  </span>
                  <Input
    id="instagram"
    placeholder="seu_usuario"
    value={formData.redesSociais?.instagram?.replace("@", "") || ""}
    onChange={(e) => setFormData({
      ...formData,
      redesSociais: {
        ...formData.redesSociais,
        instagram: e.target.value ? `@${e.target.value.replace("@", "")}` : ""
      }
    })}
    disabled={!isEditing}
    className="rounded-l-none"
  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube
                </Label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    @
                  </span>
                  <Input
    id="youtube"
    placeholder="seu_canal"
    value={formData.redesSociais?.youtube?.replace("@", "") || ""}
    onChange={(e) => setFormData({
      ...formData,
      redesSociais: {
        ...formData.redesSociais,
        youtube: e.target.value ? `@${e.target.value.replace("@", "")}` : ""
      }
    })}
    disabled={!isEditing}
    className="rounded-l-none"
  />
                </div>
              </div>

              {!isEditing && formData.redesSociais && <div className="pt-2 space-y-2">
                  {formData.redesSociais.instagram && <a
    href={`https://instagram.com/${formData.redesSociais.instagram.replace("@", "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm text-pink-600 hover:underline"
  >
                      <Instagram className="h-4 w-4" />
                      {formData.redesSociais.instagram}
                    </a>}
                  {formData.redesSociais.youtube && <a
    href={`https://youtube.com/${formData.redesSociais.youtube.replace("@", "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm text-red-600 hover:underline"
  >
                      <Youtube className="h-4 w-4" />
                      {formData.redesSociais.youtube}
                    </a>}
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aparência e conta</CardTitle>
          <CardDescription>Tema da interface e sessão</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <ThemeToggle area="funcionario" />
          <Button
            variant="outline"
            onClick={logout}
            className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair da conta
          </Button>
        </CardContent>
      </Card>

      {
    /* Modal Adicionar Especialidade */
  }
      <Dialog open={showAddSpecialty} onOpenChange={setShowAddSpecialty}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Adicionar Especialidade
            </DialogTitle>
            <DialogDescription>
              Digite o nome da nova especialidade que você domina
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newSpecialty">Nome da Especialidade</Label>
              <Input
    id="newSpecialty"
    placeholder="Ex: Corte Afro, Coloração, Design de Sobrancelha..."
    value={newSpecialty}
    onChange={(e) => setNewSpecialty(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === "Enter") {
        addSpecialty();
      }
    }}
    autoFocus
  />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <strong>Dica:</strong> Seja específico! Quanto mais clara for sua especialidade, mais fácil para os clientes encontrarem você.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
    setShowAddSpecialty(false);
    setNewSpecialty("");
  }}>
              Cancelar
            </Button>
            <Button
    onClick={addSpecialty}
    className="bg-primary hover:bg-primary/90 text-barbershop-dark"
  >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  ProfileNew
};
