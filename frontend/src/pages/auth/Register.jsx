import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth, ROLE_HOME } from "../../contexts/AuthContext.jsx";
import { authService } from "../../services/authService.js";
import { AuthShell } from "./AuthShell.jsx";
import { Button } from "../../client/components/ui/button";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import { PasswordInput } from "./PasswordInput.jsx";
import { Loader2 } from "lucide-react";

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to={ROLE_HOME[user.role] ?? "/"} replace />;
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const pw = form.password;
    if (!(pw.length >= 8 && /[a-zA-Z]/.test(pw) && /\d/.test(pw))) {
      setError("A senha deve ter no mínimo 8 caracteres, incluindo letra e número.");
      return;
    }
    setLoading(true);
    try {
      // Cria a conta (não verificada) e leva para a confirmação por código.
      await authService.register(form);
      navigate("/confirmar-email", { replace: true, state: { email: form.email } });
    } catch (err) {
      setError(err.message || "Não foi possível criar a conta.");
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Criar conta" subtitle="É rápido e gratuito" footer="© 2026 Barbearia IEMA">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" value={form.name} onChange={update("name")} placeholder="Seu nome" required autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="seu@email.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="(00) 00000-0000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput id="password" value={form.password} onChange={update("password")} placeholder="Mínimo 8 caracteres" required />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full font-semibold">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando conta...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
