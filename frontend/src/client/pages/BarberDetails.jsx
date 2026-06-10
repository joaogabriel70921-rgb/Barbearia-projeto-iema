import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Calendar, Award, Users, Clock, MapPin, Phone, Instagram, Youtube } from "lucide-react";
import { catalogService } from "../../services/catalogService.js";
function BarberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!id) {
      setLoading(false);
      return;
    }
    catalogService
      .getBarber(id)
      .then((data) => active && setBarber(data))
      .catch(() => active && setBarber(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bs-off-white)", color: "var(--bs-text-secondary)" }}>Carregando...</div>;
  }
  if (!barber) {
    return <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bs-off-white)" }}>
        <div className="text-center">
          <p style={{ color: "var(--bs-text-secondary)" }}>Barbeiro não encontrado</p>
          <Link to="/" className="text-sm mt-4 inline-block" style={{ color: "var(--bs-gold)" }}>
            Voltar para início
          </Link>
        </div>
      </div>;
  }
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
    onClick={() => navigate("/barbeiros")}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3"
    aria-label="Voltar"
  >
            <ArrowLeft size={20} color="white" />
          </button>
          <h1 className="text-white" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
            Barbeiro
          </h1>
          <div className="w-[44px]" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {
    /* Profile Card */
  }
        <div
    className="rounded-2xl overflow-hidden mt-4"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-md)"
    }}
  >
          {
    /* Cover Image */
  }
          <div className="h-48 relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: "var(--bs-charcoal-light)" }}>
            {barber.image ? <img
    src={barber.image}
    alt={barber.name}
    className="w-full h-full object-cover"
  /> : <span style={{ color: "var(--bs-gold)", fontSize: "3rem", fontWeight: 700 }}>
              {barber.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </span>}
            <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)"
    }}
  />
          </div>

          {
    /* Info */
  }
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="mb-1" style={{ color: "var(--bs-text-primary)" }}>
                  {barber.name}
                </h2>
                <p className="text-sm mb-2" style={{ color: "var(--bs-text-secondary)" }}>
                  {barber.specialty}
                </p>
                {barber.specialties?.length > 0 && <div className="flex flex-wrap gap-1.5">
                  {barber.specialties.map((esp) => <span
    key={esp}
    style={{ backgroundColor: "var(--bs-gold-light)", color: "var(--bs-gold-darker)", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px" }}
  >
                    {esp}
                  </span>)}
                </div>}
              </div>

              {barber.availableToday && <div
    className="px-3 py-1.5 rounded-full text-xs font-medium"
    style={{
      backgroundColor: "var(--bs-success-light)",
      color: "var(--bs-success)"
    }}
  >
                  Disponível hoje
                </div>}
            </div>

            {
    /* Stats Grid */
  }
            <div
    className="grid grid-cols-3 gap-3 p-4 rounded-xl mb-6"
    style={{ backgroundColor: "var(--bs-surface-alt)" }}
  >
              <div className="text-center">
                <Award size={20} className="mx-auto mb-1" style={{ color: "var(--bs-gold)" }} />
                <p className="text-xs" style={{ color: "var(--bs-text-muted)" }}>
                  5 anos
                </p>
              </div>
              <div className="text-center">
                <Users size={20} className="mx-auto mb-1" style={{ color: "var(--bs-gold)" }} />
                <p className="text-xs" style={{ color: "var(--bs-text-muted)" }}>
                  2.5k clientes
                </p>
              </div>
              <div className="text-center">
                <Calendar size={20} className="mx-auto mb-1" style={{ color: "var(--bs-gold)" }} />
                <p className="text-xs" style={{ color: "var(--bs-text-muted)" }}>
                  Seg-Sáb
                </p>
              </div>
            </div>

            {
    /* About */
  }
            <div className="mb-6">
              <h3 className="mb-2" style={{ fontSize: "1rem" }}>Sobre</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--bs-text-secondary)" }}>
                Profissional especializado em {barber.specialty.toLowerCase()}, com vasta experiência e
                dedicação ao atendimento personalizado. Sempre atualizado com as últimas tendências e
                técnicas do mercado.
              </p>
            </div>

            {
    /* Next Available */
  }
            <div
    className="flex items-center gap-3 p-4 rounded-xl mb-6"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold-medium)"
    }}
  >
              <Clock size={20} style={{ color: "var(--bs-gold-darker)" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--bs-text-primary)" }}>
                  Disponibilidade
                </p>
                <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                  {barber.availableToday ? "Disponível hoje" : "Confira os horários ao agendar"}
                </p>
              </div>
            </div>

            {
    /* Contact Info */
  }
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin size={18} style={{ color: "var(--bs-text-muted)" }} />
                <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                  Rua das Flores, 123 - Centro
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} style={{ color: "var(--bs-text-muted)" }} />
                <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                  (11) 98765-4321
                </span>
              </div>
              {barber.instagram && <a href={`https://instagram.com/${barber.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <Instagram size={18} style={{ color: "#E1306C" }} />
                <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>{barber.instagram}</span>
              </a>}
              {barber.youtube && <a href={`https://youtube.com/${barber.youtube.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <Youtube size={18} style={{ color: "#FF0000" }} />
                <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>{barber.youtube}</span>
              </a>}
            </div>

            {
    /* CTA Button */
  }
            <button
    onClick={() => navigate(`/agendar?barberId=${barber.id}`)}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bs-charcoal-light)"}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--bs-charcoal)"}
  >
              Agendar com {barber.name.split(" ")[0]}
            </button>
          </div>
        </div>

      </div>
    </div>;
}
export {
  BarberDetails
};
