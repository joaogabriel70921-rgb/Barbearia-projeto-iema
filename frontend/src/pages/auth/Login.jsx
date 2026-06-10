import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { Scissors, Loader2 } from "lucide-react";
import { useAuth, ROLE_HOME } from "../../contexts/AuthContext.jsx";
import { Button } from "../../client/components/ui/button";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import { Card, CardContent } from "../../client/components/ui/card";
import { PasswordInput } from "./PasswordInput.jsx";

// Foto lateral. Para usar a SUA imagem: salve em src/assets/login-barber.jpg
// e troque esta URL por:  import loginImg from "../../assets/login-barber.jpg"
const SIDE_IMAGE =
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80";

export default function Login() {
  const { login, user } = useAuth();
  const location = useLocation();
  const justRegistered = location.state?.registered;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to={ROLE_HOME[user.role] ?? "/"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password); // o AuthContext redireciona pelo papel
    } catch (err) {
      setError(err.message || "Não foi possível entrar.");
      setLoading(false);
    }
  };

  return (
    <div className="dark text-foreground min-h-screen w-full grid md:grid-cols-2 bg-gradient-to-br from-[#0c0b09] via-[#15120c] to-[#231c12] overflow-hidden">
      {/* ── Lado da imagem (ocupa toda a altura, com sombreamento) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden md:block"
      >
        <img
          src={SIDE_IMAGE}
          alt="Barbearia"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-card/80" />

        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="relative h-full flex flex-col justify-end p-12 lg:p-16"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#9A7A30] flex items-center justify-center mb-5 shadow-lg shadow-primary/40">
            <Scissors className="w-7 h-7 text-[#1a1a1a]" />
          </div>
          <h2 className="font-serif-display text-4xl lg:text-5xl text-white leading-tight">
            Estilo que<br />fala por você
          </h2>
          <p className="text-gray-300 text-sm mt-3 max-w-xs">
            Agende seu horário com os melhores profissionais da Barbearia IEMA.
          </p>
        </motion.div>
      </motion.div>

      {/* ── Lado do formulário (centralizado) ── */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo da tesoura no topo (mobile — a imagem lateral some abaixo do md) */}
          <div className="md:hidden flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#9A7A30] flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-primary/40">
              <Scissors className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Título ACIMA do card, em dourado brilhante com destaque */}
          <div className="text-center md:text-left mb-6">
            <h1
              className="font-serif-display text-4xl md:text-5xl text-gradient-gold tracking-tight leading-tight"
              style={{ filter: "drop-shadow(0 2px 12px rgba(201,168,76,0.35))" }}
            >
              Barbearia IEMA
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Bem-vindo de volta — entre para continuar
            </p>
          </div>

          <Card className="border-border shadow-2xl bg-card/95 backdrop-blur">
            <CardContent className="pt-6">
              {justRegistered && (
                <p className="mb-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2">
                  Conta criada com sucesso! Faça login para continuar.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <Link to="/recuperar-senha" className="text-primary hover:underline">
                  Esqueci a senha
                </Link>
                <Link to="/cadastro" className="text-primary hover:underline font-medium">
                  Criar conta
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-muted-foreground/70 text-xs">
            © 2026 Barbearia IEMA
          </p>
        </motion.div>
      </div>
    </div>
  );
}
