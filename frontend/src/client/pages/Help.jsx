import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, MessageCircle, Phone, Mail, Clock } from "lucide-react";
const faqs = [
  {
    question: "Como fa\xE7o para agendar um hor\xE1rio?",
    answer: "Acesse a aba 'Agendar' no menu inferior, escolha o servi\xE7o desejado, selecione o barbeiro, data e hor\xE1rio. Depois \xE9 s\xF3 confirmar!"
  },
  {
    question: "Posso cancelar ou reagendar meu hor\xE1rio?",
    answer: "Sim! Acesse 'Meus Agendamentos', selecione o compromisso e escolha 'Cancelar' ou 'Reagendar'. Cancelamentos devem ser feitos com pelo menos 2 horas de anteced\xEAncia."
  },
  {
    question: "Qual \xE9 a pol\xEDtica de cancelamento?",
    answer: "Voc\xEA pode cancelar sem custos com at\xE9 2 horas de anteced\xEAncia. Cancelamentos fora desse prazo ou n\xE3o comparecimento podem gerar cobran\xE7a de taxa."
  },
  {
    question: "Como altero meus dados cadastrais?",
    answer: "V\xE1 em 'Perfil' \u2192 'Dados pessoais' e clique em 'Editar perfil'. Voc\xEA pode alterar nome, telefone e email."
  },
  {
    question: "Posso agendar para outra pessoa?",
    answer: "O agendamento \xE9 pessoal, mas voc\xEA pode informar o barbeiro na chegada caso seja para outra pessoa."
  },
  {
    question: "Aceitam cart\xE3o de cr\xE9dito?",
    answer: "Sim! Aceitamos cart\xE3o de cr\xE9dito, d\xE9bito, PIX e dinheiro."
  },
  {
    question: "Preciso chegar com anteced\xEAncia?",
    answer: "Recomendamos chegar com 5 minutos de anteced\xEAncia para garantir seu hor\xE1rio."
  },
  {
    question: "Como funciona o sistema de avalia\xE7\xF5es?",
    answer: "Ap\xF3s cada atendimento, voc\xEA pode avaliar o servi\xE7o e o barbeiro. Isso nos ajuda a manter a qualidade!"
  }
];
function Help() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const goBack = () => navigate("/perfil");
  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return <div className="min-h-screen" style={{ backgroundColor: "var(--bs-off-white)" }}>
      {
    /* Header (mobile only) */
  }
      <header
    className="sticky top-0 z-40 px-4 pt-safe lg:hidden"
    style={{ backgroundColor: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto flex items-center justify-between h-14">
          <button
    onClick={goBack}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3"
    aria-label="Voltar"
  >
            <ArrowLeft size={20} color="white" />
          </button>
          <h1 className="text-white" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
            Ajuda
          </h1>
          <div className="w-[44px]" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {
    /* Quick Actions */
  }
        <div className="mt-4 grid grid-cols-1 gap-3">
          <a
    href="tel:+559884408330"
    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
            <div
    className="w-12 h-12 rounded-xl flex items-center justify-center"
    style={{ backgroundColor: "var(--bs-gold-light)" }}
  >
              <Phone size={22} style={{ color: "var(--bs-gold-darker)" }} />
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: "var(--bs-text-primary)" }}>
                Ligar para nós
              </p>
              <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                (98) 8440-8330
              </p>
            </div>
          </a>

          <a
    href="mailto:joaogabriel70921@gmail.com"
    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
            <div
    className="w-12 h-12 rounded-xl flex items-center justify-center"
    style={{ backgroundColor: "var(--bs-gold-light)" }}
  >
              <Mail size={22} style={{ color: "var(--bs-gold-darker)" }} />
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: "var(--bs-text-primary)" }}>
                Enviar email
              </p>
              <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                joaogabriel70921@gmail.com
              </p>
            </div>
          </a>

          <a
    href="https://wa.me/559884408330"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
            <div
    className="w-12 h-12 rounded-xl flex items-center justify-center"
    style={{ backgroundColor: "var(--bs-gold-light)" }}
  >
              <MessageCircle size={22} style={{ color: "var(--bs-gold-darker)" }} />
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: "var(--bs-text-primary)" }}>
                WhatsApp
              </p>
              <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                Atendimento rápido
              </p>
            </div>
          </a>
        </div>

        {
    /* Business Hours */
  }
        <div
    className="mt-4 p-4 rounded-xl"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} style={{ color: "var(--bs-gold)" }} />
            <h3 style={{ fontSize: "1rem" }}>Horário de atendimento</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--bs-text-secondary)" }}>Segunda a Sexta</span>
              <span style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}>09:00 - 19:00</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--bs-text-secondary)" }}>Sábado</span>
              <span style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}>09:00 - 17:00</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--bs-text-secondary)" }}>Domingo</span>
              <span style={{ color: "var(--bs-text-muted)", fontWeight: 500 }}>Fechado</span>
            </div>
          </div>
        </div>

        {
    /* FAQ Section */
  }
        <div className="mt-6">
          <h2 className="mb-3 px-1" style={{ fontSize: "1.25rem" }}>
            Perguntas frequentes
          </h2>
          <div
    className="rounded-2xl overflow-hidden divide-y"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)",
      borderColor: "var(--bs-border)"
    }}
  >
            {faqs.map((faq, index) => <div key={index}>
                <button
    onClick={() => toggleFAQ(index)}
    className="w-full flex items-center justify-between gap-3 p-4 text-left transition-colors duration-150 hover:bg-gray-50/70"
  >
                  <span className="font-medium flex-1" style={{ color: "var(--bs-text-primary)" }}>
                    {faq.question}
                  </span>
                  <ChevronDown
    size={20}
    style={{
      color: "var(--bs-text-muted)",
      transform: expandedIndex === index ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 200ms"
    }}
  />
                </button>
                {expandedIndex === index && <div
    className="px-4 pb-4 text-sm leading-relaxed"
    style={{ color: "var(--bs-text-secondary)" }}
  >
                    {faq.answer}
                  </div>}
              </div>)}
          </div>
        </div>

        {
    /* Still Need Help */
  }
        <div
    className="mt-4 p-5 rounded-xl text-center"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold-medium)"
    }}
  >
          <p className="font-medium mb-1" style={{ color: "var(--bs-text-primary)" }}>
            Não encontrou o que procura?
          </p>
          <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
            Entre em contato conosco pelos canais acima. Estamos prontos para ajudar!
          </p>
        </div>
      </div>
    </div>;
}
export {
  Help
};
