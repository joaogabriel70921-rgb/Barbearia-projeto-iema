import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Clock, Award } from "lucide-react";
import { catalogService } from "../../services/catalogService.js";
import { BarberAvatar } from "../components/BarberAvatar";
function Barbers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    catalogService
      .listBarbers()
      .then((data) => active && setBarbers(data))
      .catch((err) => active && setError(err.message || "Erro ao carregar barbeiros"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const filteredBarbers = barbers.filter(
    (barber) => barber.name.toLowerCase().includes(searchTerm.toLowerCase()) || barber.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return <div className="min-h-screen" style={{ backgroundColor: "var(--bs-off-white)" }}>
      {
    /* Header */
  }
      <header
    className="sticky top-0 z-40 px-4 pt-safe"
    style={{ backgroundColor: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto flex items-center justify-between h-14">
          <Link
    to="/"
    className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3"
    aria-label="Voltar"
  >
            <ArrowLeft size={20} color="white" />
          </Link>
          <h1 className="text-white" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
            Nossos Barbeiros
          </h1>
          <div className="w-[44px]" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {
    /* Search Bar */
  }
        <div className="mt-4 mb-6">
          <div className="relative">
            <Search
    className="absolute left-4 top-1/2 -translate-y-1/2"
    size={20}
    style={{ color: "var(--bs-text-muted)" }}
  />
            <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Buscar por nome ou especialidade..."
    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none"
    style={{
      backgroundColor: "var(--bs-surface)",
      borderColor: "var(--bs-border)",
      color: "var(--bs-text-primary)"
    }}
    onFocus={(e) => e.target.style.borderColor = "var(--bs-gold)"}
    onBlur={(e) => e.target.style.borderColor = "var(--bs-border)"}
  />
          </div>
        </div>

        {
    /* Stats */
  }
        <div
    className="rounded-2xl p-4 mb-4 flex items-center justify-between"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold-medium)"
    }}
  >
          <div className="flex items-center gap-3">
            <Award size={24} style={{ color: "var(--bs-gold-darker)" }} />
            <div>
              <p className="font-semibold" style={{ color: "var(--bs-text-primary)" }}>
                {barbers.length} profissionais
              </p>
              <p className="text-xs" style={{ color: "var(--bs-text-secondary)" }}>
                Todos certificados e experientes
              </p>
            </div>
          </div>
        </div>

        {
    /* Barbers Grid */
  }
        {loading ? <div
    className="rounded-2xl p-8 text-center"
    style={{ backgroundColor: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
            <p style={{ color: "var(--bs-text-secondary)" }}>Carregando barbeiros...</p>
          </div> : error ? <div
    className="rounded-2xl p-8 text-center"
    style={{ backgroundColor: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
            <p style={{ color: "var(--bs-error)" }}>{error}</p>
          </div> : filteredBarbers.length === 0 ? <div
    className="rounded-2xl p-8 text-center"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
            <Search size={48} className="mx-auto mb-3" style={{ color: "var(--bs-text-muted)" }} />
            <p className="font-medium mb-1" style={{ color: "var(--bs-text-primary)" }}>
              Nenhum barbeiro encontrado
            </p>
            <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
              Tente buscar por outro nome ou especialidade
            </p>
          </div> : <div className="grid grid-cols-1 gap-4">
            {filteredBarbers.map((barber) => <Link
    key={barber.id}
    to={`/barbeiro/${barber.id}`}
    className="rounded-2xl p-4 flex gap-4 transition-all duration-200 active:scale-[0.98]"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
                {
    /* Avatar */
  }
                <div className="relative flex-shrink-0">
                  <BarberAvatar
    name={barber.name}
    image={barber.image}
    size={96}
    className="rounded-xl"
    style={{ border: "2px solid var(--bs-gold-light)" }}
  />
                  {barber.availableToday && <div
    className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
    style={{
      backgroundColor: "var(--bs-success)",
      color: "white"
    }}
  >
                      Disponível
                    </div>}
                </div>

                {
    /* Info */
  }
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1" style={{ fontSize: "1.0625rem", color: "var(--bs-text-primary)" }}>
                    {barber.name}
                  </h3>

                  <div
    className="inline-block px-2 py-0.5 rounded-full mb-2"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      color: "var(--bs-gold-darker)",
      fontSize: "11px",
      fontWeight: 600
    }}
  >
                    {barber.specialty}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock size={14} style={{ color: "var(--bs-text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--bs-text-secondary)" }}>
                      {barber.availableToday ? `Pr\xF3ximo hor\xE1rio: ${barber.nextAvailable}` : "Dispon\xEDvel amanh\xE3"}
                    </span>
                  </div>
                </div>

                {
    /* Action */
  }
                <div className="flex items-center">
                  <button
    className="px-4 py-2 rounded-lg transition-all duration-200"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      fontSize: "13px",
      fontWeight: 600
    }}
    onClick={(e) => {
      e.preventDefault();
      window.location.href = `/agendar?barberId=${barber.id}`;
    }}
  >
                    Agendar
                  </button>
                </div>
              </Link>)}
          </div>}

        {
    /* Info Box */
  }
        {filteredBarbers.length > 0 && <div
    className="rounded-xl p-4 mt-6"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold-medium)"
    }}
  >
            <p className="text-sm" style={{ color: "var(--bs-text-primary)" }}>
              <strong>Dica:</strong> Clique no card para ver o perfil completo do barbeiro com portfólio e avaliações detalhadas.
            </p>
          </div>}
      </div>
    </div>;
}
export {
  Barbers
};
