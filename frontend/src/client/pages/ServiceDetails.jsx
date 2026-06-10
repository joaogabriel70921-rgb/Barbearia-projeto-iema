import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Clock, DollarSign, Info, CheckCircle2 } from "lucide-react";
import { catalogService } from "../../services/catalogService.js";
import { ServiceIcon } from "../components/ServiceIcon";
function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!id) {
      setLoading(false);
      return;
    }
    catalogService
      .getService(id)
      .then((data) => active && setService(data))
      .catch(() => active && setService(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bs-off-white)", color: "var(--bs-text-secondary)" }}>Carregando...</div>;
  }
  if (!service) {
    return <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bs-off-white)" }}>
        <div className="text-center">
          <p style={{ color: "var(--bs-text-secondary)" }}>Serviço não encontrado</p>
          <Link to="/" className="text-sm mt-4 inline-block" style={{ color: "var(--bs-gold)" }}>
            Voltar para início
          </Link>
        </div>
      </div>;
  }
  const benefits = [
    "Produtos premium importados",
    "Atendimento personalizado",
    "T\xE9cnicas atualizadas",
    "Ambiente climatizado",
    "Wi-Fi gratuito",
    "Bebidas inclusas"
  ];
  return <div className="min-h-screen" style={{ backgroundColor: "var(--bs-off-white)" }}>
      {
    /* Header */
  }
      <header
    className="sticky top-0 z-40 px-4 pt-safe lg:hidden"
    style={{ backgroundColor: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto flex items-center justify-between h-14">
          <button
    onClick={() => navigate("/servicos")}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3"
    aria-label="Voltar"
  >
            <ArrowLeft size={20} color="white" />
          </button>
          <h1 className="text-white" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
            Detalhes do Serviço
          </h1>
          <div className="w-[44px]" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {
    /* Service Card */
  }
        <div
    className="rounded-2xl overflow-hidden mt-4"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-md)"
    }}
  >
          {
    /* Icon Header */
  }
          <div
    className="h-32 flex items-center justify-center relative overflow-hidden"
    style={{
      background: "linear-gradient(135deg, var(--bs-charcoal) 0%, var(--bs-charcoal-light) 100%)"
    }}
  >
            <ServiceIcon name={service.iconName} size={64} color="var(--bs-gold)" />
          </div>

          {
    /* Info */
  }
          <div className="p-6">
            <h2 className="mb-2" style={{ color: "var(--bs-text-primary)" }}>
              {service.name}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--bs-text-secondary)" }}>
              {service.description}
            </p>

            {
    /* Price & Duration */
  }
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
    className="p-4 rounded-xl"
    style={{ backgroundColor: "var(--bs-surface-alt)" }}
  >
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={18} style={{ color: "var(--bs-gold)" }} />
                  <p className="text-xs" style={{ color: "var(--bs-text-muted)" }}>
                    Preço
                  </p>
                </div>
                <p className="font-semibold" style={{ fontSize: "1.25rem", color: "var(--bs-text-primary)" }}>
                  R$ {service.price}
                </p>
              </div>

              <div
    className="p-4 rounded-xl"
    style={{ backgroundColor: "var(--bs-surface-alt)" }}
  >
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={18} style={{ color: "var(--bs-gold)" }} />
                  <p className="text-xs" style={{ color: "var(--bs-text-muted)" }}>
                    Duração
                  </p>
                </div>
                <p className="font-semibold" style={{ fontSize: "1.25rem", color: "var(--bs-text-primary)" }}>
                  {service.duration} min
                </p>
              </div>
            </div>

            {
    /* Benefits */
  }
            <div>
              <h3 className="mb-3" style={{ fontSize: "1rem" }}>O que está incluído</h3>
              <div className="space-y-2">
                {benefits.map((benefit, i) => <div key={i} className="flex items-center gap-3">
                    <CheckCircle2
    size={18}
    style={{ color: "var(--bs-gold)", flexShrink: 0 }}
  />
                    <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                      {benefit}
                    </span>
                  </div>)}
              </div>
            </div>

            {
    /* Info Box */
  }
            <div
    className="flex gap-3 p-4 rounded-xl mt-6"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold-medium)"
    }}
  >
              <Info size={20} className="flex-shrink-0" style={{ color: "var(--bs-gold-darker)" }} />
              <p className="text-sm" style={{ color: "var(--bs-text-primary)" }}>
                Agendamentos podem ser cancelados com até 2 horas de antecedência sem custo adicional.
              </p>
            </div>

            {
    /* CTA Button */
  }
            <button
    onClick={() => navigate(`/agendar?serviceId=${service.id}`)}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 mt-6"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bs-charcoal-light)"}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--bs-charcoal)"}
  >
              Agendar agora
            </button>
          </div>
        </div>

        {
    /* Related Services */
  }
        <div
    className="rounded-2xl p-6 mt-4"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
          <h3 className="mb-4">Combine com</h3>
          <p className="text-sm mb-4" style={{ color: "var(--bs-text-secondary)" }}>
            Aproveite para adicionar outros serviços ao seu agendamento e economize tempo.
          </p>
          <button
    onClick={() => navigate("/agendar")}
    className="text-sm font-semibold"
    style={{ color: "var(--bs-gold)" }}
  >
            Ver todos os serviços →
          </button>
        </div>
      </div>
    </div>;
}
export {
  ServiceDetails
};
