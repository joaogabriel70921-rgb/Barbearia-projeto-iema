import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Send } from "lucide-react";
function SuggestTimeModal({
  appointment,
  open,
  onClose,
  onSuggest
}) {
  const [date, setDate] = useState(parseISO(appointment.data));
  const [time, setTime] = useState(appointment.horario);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      // O componente pai fecha o modal em caso de sucesso (via prop `open`).
      await onSuggest(appointment.id, formattedDate, time, message);
    } finally {
      setSubmitting(false);
    }
  };
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Sugerir Novo Horário
          </DialogTitle>
          <DialogDescription>
            Sugira um novo horário para o agendamento de{" "}
            <span className="font-semibold text-foreground">{appointment.cliente.nome}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Serviço Solicitado</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">{appointment.servico.nome}</p>
              <p className="text-sm text-muted-foreground">
                Duração: {appointment.servico.duracao} minutos • R${" "}
                {appointment.servico.preco.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Horário Original</Label>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm">
                <span className="font-semibold">
                  {format(parseISO(appointment.data), "dd 'de' MMMM", { locale: ptBR })}
                </span>{" "}
                às <span className="font-semibold">{appointment.horario}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nova Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
    variant="outline"
    className="w-full justify-start text-left font-normal"
  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    initialFocus
    locale={ptBR}
  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Novo Horário</Label>
              <Input
    id="time"
    type="time"
    value={time}
    onChange={(e) => setTime(e.target.value)}
    className="w-full"
  />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem para o Cliente (Opcional)</Label>
            <Textarea
    id="message"
    placeholder="Ex: Olá! Infelizmente não tenho disponibilidade no horário solicitado. Posso atendê-lo no horário sugerido acima?"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    rows={4}
    className="resize-none"
  />
            <p className="text-xs text-muted-foreground">
              Esta mensagem será enviada ao cliente junto com a sugestão
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
    onClick={handleSubmit}
    disabled={!date || !time || submitting}
    className="bg-primary hover:bg-primary/90 text-barbershop-dark"
  >
            <Send className="mr-2 h-4 w-4" />
            {submitting ? "Enviando…" : "Enviar Sugestão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
export {
  SuggestTimeModal
};
