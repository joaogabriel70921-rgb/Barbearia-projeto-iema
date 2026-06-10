import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Scissors, User, Briefcase } from "lucide-react";
import { motion } from "motion/react";
function UnifiedLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("cliente");
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userType);
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-barbershop-darker via-barbershop-dark to-barbershop-gray p-4 relative overflow-hidden">
      {
    /* Elementos decorativos de fundo */
  }
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md relative z-10"
  >
        {
    /* Logo e Nome da Barbearia */
  }
        <div className="text-center mb-8">
          <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20"
  >
            <Scissors className="w-10 h-10 text-barbershop-dark" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Barbearia Premium</h1>
          <p className="text-gray-400">Excelência em estilo e cuidado</p>
        </div>

        <Card className="border-barbershop-gray shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Faça login para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Tabs
    value={userType}
    onValueChange={(value) => setUserType(value)}
    className="mb-6"
  >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cliente" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="funcionario" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Funcionário
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
    id="email"
    type="email"
    placeholder={userType === "cliente" ? "seu@email.com" : "funcionario@barbearia.com"}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="transition-all focus:ring-2 focus:ring-primary"
  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
    id="password"
    type="password"
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="transition-all focus:ring-2 focus:ring-primary"
  />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-muted-foreground">Lembrar-me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-barbershop-dark font-semibold">
                Entrar
              </Button>
            </form>

            {userType === "cliente" && <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Cadastre-se
                  </a>
                </p>
              </div>}
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 Barbearia Premium. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>;
}
export {
  UnifiedLogin
};
