import { Scissors } from "lucide-react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../client/components/ui/card";

// Moldura visual das telas de autenticação (escopo dark/dourado, premium + animado).
export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="dark text-foreground min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0b09] via-[#15120c] to-[#231c12] p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "backOut" }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-[#9A7A30] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/30 ring-1 ring-primary/40"
          >
            <Scissors className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="font-serif-display text-3xl text-foreground tracking-tight">
            Barbearia IEMA
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Excelência em estilo e cuidado</p>
        </div>

        <Card className="border-border shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-center">{subtitle}</CardDescription>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {footer && (
          <div className="text-center text-muted-foreground text-sm mt-6">{footer}</div>
        )}
      </motion.div>
    </div>
  );
}
