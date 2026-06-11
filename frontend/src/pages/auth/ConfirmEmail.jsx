import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { authService } from "../../services/authService.js";
import { AuthShell } from "./AuthShell.jsx";
import { Button } from "../../client/components/ui/button";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import { Loader2, MailCheck } from "lucide-react";

export default function ConfirmEmail() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { completeLogin } = useAuth();
  const initialEmail = location.state?.email || searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email) {
      setError("Informe o email.");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("Digite o código de 6 dígitos.");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await authService.verifyEmail({ email, code });
      completeLogin(token, user); // confirma, loga e redireciona pelo papel
    } catch (err) {
      setError(err.message || "Não foi possível confirmar o código.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Informe o email para reenviar.");
      return;
    }
    setResending(true);
    try {
      await authService.resendCode(email);
      setInfo("Se a conta existir e não estiver confirmada, enviamos um novo código.");
    } catch (err) {
      setError(err.message || "Não foi possível reenviar o código.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Confirme seu email"
      subtitle="Digite o código de 6 dígitos que enviamos"
      footer="© 2026 Barbearia IEMA"
    >
      <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-5">
        <MailCheck className="w-7 h-7 text-primary" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {initialEmail ? (
          <p className="text-sm text-muted-foreground text-center">
            Enviado para <span className="text-foreground font-medium">{email}</span>
          </p>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="text-center tracking-[0.5em] text-lg"
            required
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        {info && (
          <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2">
            {info}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full font-semibold">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirmando...
            </>
          ) : (
            "Confirmar"
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-primary hover:underline disabled:opacity-60"
        >
          {resending ? "Reenviando..." : "Reenviar código"}
        </button>
        <Link to="/login" className="text-muted-foreground hover:underline">
          Voltar ao login
        </Link>
      </div>
    </AuthShell>
  );
}
