import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { ThemeToggle } from "../../../components/ThemeToggle.jsx";
import { adminService } from "../../../services/adminService.js";
import { authService } from "../../../services/authService.js";

function ProfileTab() {
  const { logout, user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [shop, setShop] = useState({ name: "", phone: "", email: "", cnpj: "", address: "" });
  const [general, setGeneral] = useState({ opening: "09:00", closing: "19:00", interval: 15, maxAdvance: 30 });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState("");

  useEffect(() => {
    adminService.settings
      .getProfile()
      .then((p) => setProfile({ name: p.name || "", email: p.email || "", phone: p.phone || "" }))
      .catch(() => {});
    adminService.settings
      .getBarbershop()
      .then((s) => {
        if (!s) return;
        const oh = s.openingHours || {};
        setShop({
          name: s.name || "",
          phone: s.phone || "",
          address: s.address || "",
          email: oh.email || "",
          cnpj: oh.cnpj || ""
        });
        setGeneral({
          opening: oh.opening || "09:00",
          closing: oh.closing || "19:00",
          interval: oh.interval ?? 15,
          maxAdvance: oh.maxAdvance ?? 30
        });
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving("profile");
    try {
      const updated = await adminService.settings.updateProfile(profile);
      updateUser({ name: updated.name, email: updated.email, phone: updated.phone });
      toast.success("Informações pessoais atualizadas");
    } catch (e) {
      toast.error("Erro ao salvar perfil", { description: e?.message });
    } finally {
      setSaving("");
    }
  };

  const saveShop = async () => {
    setSaving("shop");
    try {
      await adminService.settings.updateBarbershop({
        name: shop.name,
        phone: shop.phone,
        address: shop.address,
        openingHours: { ...general, email: shop.email, cnpj: shop.cnpj }
      });
      toast.success("Informações da barbearia salvas");
    } catch (e) {
      toast.error("Erro ao salvar barbearia", { description: e?.message });
    } finally {
      setSaving("");
    }
  };

  const saveGeneral = async () => {
    setSaving("general");
    try {
      await adminService.settings.updateBarbershop({
        openingHours: { ...general, email: shop.email, cnpj: shop.cnpj }
      });
      toast.success("Configurações gerais salvas");
    } catch (e) {
      toast.error("Erro ao salvar configurações", { description: e?.message });
    } finally {
      setSaving("");
    }
  };

  const changePassword = async () => {
    if (!pwd.current || !pwd.next) {
      toast.error("Preencha a senha atual e a nova senha");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast.error("A confirmação não corresponde à nova senha");
      return;
    }
    setSaving("pwd");
    try {
      await authService.changePassword({ currentPassword: pwd.current, newPassword: pwd.next });
      setPwd({ current: "", next: "", confirm: "" });
      toast.success("Senha alterada com sucesso");
    } catch (e) {
      toast.error("Erro ao alterar senha", { description: e?.message });
    } finally {
      setSaving("");
    }
  };

  const initials = (profile.name || user?.name || "AD").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return <div className="space-y-6">
      <div>
        <h2 className="text-foreground">Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações e da barbearia</p>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Informações Pessoais</CardTitle>
          <CardDescription className="text-muted-foreground">Seus dados como administrador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {initials}
            </div>
          </div>
          <Separator className="bg-border/30" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-name" className="text-foreground">Nome</Label>
              <Input id="admin-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-foreground">Email</Label>
              <Input id="admin-email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-phone" className="text-foreground">Telefone</Label>
              <Input id="admin-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="bg-input-background border-border/50" />
            </div>
          </div>
          <Button onClick={saveProfile} disabled={saving === "profile"} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving === "profile" ? "Salvando…" : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Informações da Barbearia</CardTitle>
          <CardDescription className="text-muted-foreground">Dados do estabelecimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salon-name" className="text-foreground">Nome da Barbearia</Label>
              <Input id="salon-name" value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salon-phone" className="text-foreground">Telefone</Label>
              <Input id="salon-phone" value={shop.phone} onChange={(e) => setShop({ ...shop, phone: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salon-email" className="text-foreground">Email</Label>
              <Input id="salon-email" type="email" value={shop.email} onChange={(e) => setShop({ ...shop, email: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salon-cnpj" className="text-foreground">CNPJ</Label>
              <Input id="salon-cnpj" value={shop.cnpj} onChange={(e) => setShop({ ...shop, cnpj: e.target.value })} className="bg-input-background border-border/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salon-address" className="text-foreground">Endereço</Label>
            <Input id="salon-address" value={shop.address} onChange={(e) => setShop({ ...shop, address: e.target.value })} className="bg-input-background border-border/50" />
          </div>
          <Button onClick={saveShop} disabled={saving === "shop"} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving === "shop" ? "Salvando…" : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Configurações Gerais</CardTitle>
          <CardDescription className="text-muted-foreground">Horários e preferências</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="opening-time" className="text-foreground">Horário de Abertura</Label>
              <Input id="opening-time" type="time" value={general.opening} onChange={(e) => setGeneral({ ...general, opening: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closing-time" className="text-foreground">Horário de Fechamento</Label>
              <Input id="closing-time" type="time" value={general.closing} onChange={(e) => setGeneral({ ...general, closing: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval-duration" className="text-foreground">Intervalo entre Atendimentos (min)</Label>
              <Input id="interval-duration" type="number" value={general.interval} onChange={(e) => setGeneral({ ...general, interval: e.target.value })} className="bg-input-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-advance" className="text-foreground">Máximo de dias para agendamento</Label>
              <Input id="max-advance" type="number" value={general.maxAdvance} onChange={(e) => setGeneral({ ...general, maxAdvance: e.target.value })} className="bg-input-background border-border/50" />
            </div>
          </div>
          <Button onClick={saveGeneral} disabled={saving === "general"} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving === "general" ? "Salvando…" : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Segurança</CardTitle>
          <CardDescription className="text-muted-foreground">Altere sua senha</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-foreground">Senha Atual</Label>
            <PasswordInput id="current-password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} className="bg-input-background border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-foreground">Nova Senha</Label>
            <PasswordInput id="new-password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} className="bg-input-background border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-foreground">Confirmar Nova Senha</Label>
            <PasswordInput id="confirm-password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className="bg-input-background border-border/50" />
          </div>
          <Button onClick={changePassword} disabled={saving === "pwd"} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving === "pwd" ? "Alterando…" : "Alterar Senha"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Aparência e conta</CardTitle>
          <CardDescription className="text-muted-foreground">Tema da interface e sessão</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <ThemeToggle area="admin" />
          <Button
            onClick={logout}
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>;
}
export {
  ProfileTab
};
