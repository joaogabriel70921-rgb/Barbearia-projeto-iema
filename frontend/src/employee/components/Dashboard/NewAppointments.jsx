import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, X, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SuggestTimeModal } from "./SuggestTimeModal";
function NewAppointments({ appointments, onAccept, onReject, onSuggestTime }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const handleSuggestClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsSuggestModalOpen(true);
  };
  const handleSuggestTime = async (appointmentId, newDate, newTime, message) => {
    try {
      await onSuggestTime(appointmentId, newDate, newTime, message);
      setIsSuggestModalOpen(false);
      setSelectedAppointment(null);
    } catch {
      // erro já tratado (toast no handler pai); mantém o modal aberto p/ corrigir
    }
  };
  if (appointments.length === 0) {
    return <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum novo agendamento</h3>
        <p className="text-muted-foreground">
          Você não tem pedidos de agendamento pendentes no momento.
        </p>
      </div>;
  }
  return <div className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Novos Agendamentos</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Você tem <span className="font-bold text-foreground">{appointments.length}</span> {appointments.length === 1 ? "pedido" : "pedidos"} aguardando confirmação
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {appointments.map((appointment) => <Card key={appointment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{appointment.cliente.nome}</CardTitle>
                  <CardDescription className="mt-1">
                    {appointment.cliente.telefone}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{appointment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Serviço</p>
                  <p className="font-semibold">{appointment.servico.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-semibold">
                    R$ {appointment.servico.preco.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-semibold">
                    {format(parseISO(appointment.data), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-semibold">{appointment.horario}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="font-semibold">{appointment.servico.duracao} minutos</p>
                </div>
              </div>

              {appointment.cliente.observacoes && <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm">{appointment.cliente.observacoes}</p>
                </div>}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
    onClick={() => onAccept(appointment.id)}
  >
                  <Check className="mr-2 h-4 w-4" />
                  Aceitar
                </Button>
                <Button
    variant="outline"
    className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
    onClick={() => onReject(appointment.id)}
  >
                  <X className="mr-2 h-4 w-4" />
                  Recusar
                </Button>
                <Button
    variant="secondary"
    className="sm:flex-1 hover:bg-primary hover:text-barbershop-dark transition-colors"
    onClick={() => handleSuggestClick(appointment)}
  >
                  Sugerir Horário
                </Button>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {selectedAppointment && <SuggestTimeModal
    appointment={selectedAppointment}
    open={isSuggestModalOpen}
    onClose={() => {
      setIsSuggestModalOpen(false);
      setSelectedAppointment(null);
    }}
    onSuggest={handleSuggestTime}
  />}
    </div>;
}
export {
  NewAppointments
};
