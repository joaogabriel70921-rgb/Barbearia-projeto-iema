import { useState } from "react";
import { Link } from "react-router";
import { authService } from "../../services/authService.js";
import { AuthShell } from "./AuthShell.jsx";
import { Button } from "../../client/components/ui/button";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import { Loader2, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Não foi possível enviar o email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle={sent ? undefined : "Enviaremos um link para redefinir sua senha"}
      footer="© 2026 Barbearia IEMA"
    >
      {sent ? (
        <div className="text-center space-y-4 py-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
            <MailCheck className="w-7 h-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Se o email <span className="text-foreground font-medium">{email}</span> estiver
            cadastrado, você receberá as instruções de recuperação em instantes.
          </p>
          <Link to="/login" className="inline-block text-primary hover:underline text-sm font-medium">
            Voltar ao login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoFocus
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
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
