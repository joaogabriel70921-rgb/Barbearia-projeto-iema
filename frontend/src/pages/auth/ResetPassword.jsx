import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { authService } from "../../services/authService.js";
import { AuthShell } from "./AuthShell.jsx";
import { PasswordInput } from "./PasswordInput.jsx";
import { Button } from "../../client/components/ui/button";
import { Label } from "../../client/components/ui/label";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!(password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password))) {
      setError("A nova senha deve ter no mínimo 8 caracteres, incluindo letra e número.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
      // Leva ao login depois de um instante mostrando o sucesso.
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(err.message || "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  // Link aberto sem token (ex.: digitado à mão) — não há o que redefinir.
  if (!token) {
    return (
      <AuthShell title="Link inválido" footer="© 2026 Barbearia IEMA">
        <div className="text-center space-y-4 py-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            Este link de redefinição é inválido ou está incompleto. Solicite um novo link
            de recuperação.
          </p>
          <Link
            to="/recuperar-senha"
            className="inline-block text-primary hover:underline text-sm font-medium"
          >
            Recuperar senha
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Redefinir senha"
      subtitle={done ? undefined : "Escolha uma nova senha para sua conta"}
      footer="© 2026 Barbearia IEMA"
    >
      {done ? (
        <div className="text-center space-y-4 py-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Senha redefinida com sucesso! Você já pode entrar com a nova senha.
          </p>
          <Link
            to="/login"
            className="inline-block text-primary hover:underline text-sm font-medium"
          >
            Ir para o login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Digite novamente"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full font-semibold">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redefinindo...
                </>
              ) : (
                "Redefinir senha"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Voltar ao login
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
