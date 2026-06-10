import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Save, X, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
function AvailabilityNew({ availability, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localAvailability, setLocalAvailability] = useState(availability);
  const [selectedDate, setSelectedDate] = useState(void 0);
  const [saving, setSaving] = useState(false);
  const diasSemana = [
    { value: 0, label: "Domingo", short: "Dom" },
    { value: 1, label: "Segunda", short: "Seg" },
    { value: 2, label: "Ter\xE7a", short: "Ter" },
    { value: 3, label: "Quarta", short: "Qua" },
    { value: 4, label: "Quinta", short: "Qui" },
    { value: 5, label: "Sexta", short: "Sex" },
    { value: 6, label: "S\xE1bado", short: "S\xE1b" }
  ];
  const isDayActive = (day) => localAvailability.diasSemana.includes(day);
  const toggleDay = (day) => {
    if (!isEditing) return;
    const newDays = isDayActive(day) ? localAvailability.diasSemana.filter((d) => d !== day) : [...localAvailability.diasSemana, day].sort();
    setLocalAvailability({
      ...localAvailability,
      diasSemana: newDays
    });
  };
  const updateTimeSlot = (index, field, value) => {
    const newHorarios = [...localAvailability.horarios];
    newHorarios[index] = { ...newHorarios[index], [field]: value };
    setLocalAvailability({ ...localAvailability, horarios: newHorarios });
  };
  const toggleTimeSlotAvailability = (index) => {
    const newHorarios = [...localAvailability.horarios];
    newHorarios[index] = { ...newHorarios[index], disponivel: !newHorarios[index].disponivel };
    setLocalAvailability({ ...localAvailability, horarios: newHorarios });
  };
  const addFolga = () => {
    if (!selectedDate) return;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    if (localAvailability.folgas.includes(formattedDate)) {
      toast.error("Esta data j\xE1 est\xE1 marcada como folga");
      return;
    }
    setLocalAvailability({
      ...localAvailability,
      folgas: [...localAvailability.folgas, formattedDate].sort()
    });
    setSelectedDate(void 0);
    toast.success("Folga adicionada com sucesso");
  };
  const removeFolga = (date) => {
    setLocalAvailability({
      ...localAvailability,
      folgas: localAvailability.folgas.filter((f) => f !== date)
    });
    toast.success("Folga removida");
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(localAvailability);
      setIsEditing(false);
      toast.success("Disponibilidade atualizada com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar disponibilidade", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    setLocalAvailability(availability);
    setIsEditing(false);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Disponibilidade</h2>
          <p className="text-muted-foreground">
            Configure seus dias e horários de trabalho
          </p>
        </div>
        {!isEditing ? <Button
    onClick={() => setIsEditing(true)}
    className="bg-primary hover:bg-primary/90 text-barbershop-dark"
  >
            <Clock className="mr-2 h-4 w-4" />
            Editar Disponibilidade
          </Button> : <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Salvando…" : "Salvar Alterações"}
            </Button>
          </div>}
      </div>

      {
    /* Dias da Semana */
  }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Dias de Trabalho
          </CardTitle>
          <CardDescription>
            {isEditing ? "Clique nos dias para ativar/desativar sua disponibilidade" : "Dias da semana em que voc\xEA trabalha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {diasSemana.map((dia) => {
    const isActive = isDayActive(dia.value);
    return <button
      key={dia.value}
      onClick={() => toggleDay(dia.value)}
      disabled={!isEditing}
      className={`p-4 border-2 rounded-lg transition-all ${isActive ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/50"} ${isEditing ? "cursor-pointer hover:scale-105" : "cursor-default"} ${!isEditing && !isActive ? "opacity-50" : ""}`}
    >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-semibold">{dia.short}</span>
                    {isActive && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                </button>;
  })}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>{localAvailability.diasSemana.length}</strong> {localAvailability.diasSemana.length === 1 ? "dia selecionado" : "dias selecionados"}
            </p>
          </div>
        </CardContent>
      </Card>

      {
    /* Horários de Trabalho */
  }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Horários de Trabalho
          </CardTitle>
          <CardDescription>
            Defina seus horários para cada dia da semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {localAvailability.horarios.map((horario, index) => <div
    key={index}
    className={`p-4 border rounded-lg transition-all ${horario.disponivel ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"}`}
  >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold mb-2">{horario.dia}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Input
    type="time"
    value={horario.horarioInicio}
    onChange={(e) => updateTimeSlot(index, "horarioInicio", e.target.value)}
    disabled={!isEditing}
    className="w-32"
  />
                      <span className="text-muted-foreground">até</span>
                      <Input
    type="time"
    value={horario.horarioFim}
    onChange={(e) => updateTimeSlot(index, "horarioFim", e.target.value)}
    disabled={!isEditing}
    className="w-32"
  />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
    checked={horario.disponivel}
    onCheckedChange={() => toggleTimeSlotAvailability(index)}
    disabled={!isEditing}
  />
                    <Label className="text-sm">
                      {horario.disponivel ? "Dispon\xEDvel" : "Indispon\xEDvel"}
                    </Label>
                  </div>
                </div>
              </div>
            </div>)}
        </CardContent>
      </Card>

      {
    /* Pausas e Intervalos - Somente Visualização */
  }
      <Card>
        <CardHeader>
          <CardTitle>Pausas e Intervalos</CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-400">
            ⚠️ As pausas são configuradas pelo administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {localAvailability.pausas.length > 0 ? localAvailability.pausas.map((pausa, index) => <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold">{pausa.dia}</p>
                  <p className="text-sm text-muted-foreground">
                    {pausa.horarioInicio} - {pausa.horarioFim}
                  </p>
                </div>
                <Badge variant="secondary">Pausa</Badge>
              </div>) : <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma pausa configurada
            </p>}
        </CardContent>
      </Card>

      {
    /* Folgas e Bloqueios */
  }
      <Card>
        <CardHeader>
          <CardTitle>Folgas Programadas</CardTitle>
          <CardDescription>Adicione datas em que você não estará disponível</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
    mode="single"
    selected={selectedDate}
    onSelect={setSelectedDate}
    locale={ptBR}
    disabled={(date) => date < /* @__PURE__ */ new Date()}
  />
                </PopoverContent>
              </Popover>
              <Button
    onClick={addFolga}
    disabled={!selectedDate}
    className="bg-primary hover:bg-primary/90 text-barbershop-dark"
  >
                <Plus className="h-4 w-4" />
              </Button>
            </div>}

          <div className="space-y-2">
            {localAvailability.folgas.length > 0 ? localAvailability.folgas.map((folga, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <span className="text-sm font-medium">
                    {format(new Date(folga), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  {isEditing && <Button
    size="sm"
    variant="ghost"
    onClick={() => removeFolga(folga)}
    className="text-destructive hover:text-destructive hover:bg-destructive/10"
  >
                      <Trash2 className="h-4 w-4" />
                    </Button>}
                </div>) : <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma folga programada
              </p>}
          </div>
        </CardContent>
      </Card>
    </div>;
}
export {
  AvailabilityNew
};
