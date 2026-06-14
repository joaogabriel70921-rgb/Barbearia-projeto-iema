import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Clock, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { catalogService } from "../../services/catalogService.js";
import { ServiceIcon } from "../components/ServiceIcon";
import useEmblaCarousel from "embla-carousel-react";
function ServiceCard({ service }) {
  return <Link
    to={`/servico/${service.id}`}
    className="rounded-2xl p-5 flex flex-col transition-all duration-200 active:scale-[0.98] h-full min-h-[280px]"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
      {
    /* Icon */
  }
      <div
    className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
    style={{ backgroundColor: "var(--bs-gold-light)" }}
  >
        <ServiceIcon
    name={service.iconName}
    size={28}
    color="var(--bs-gold-dark)"
  />
      </div>

      {
    /* Name */
  }
      <div className="mb-3 flex-grow">
        <h3 className="mb-1" style={{ fontSize: "1.0625rem", color: "var(--bs-text-primary)" }}>
          {service.name}
        </h3>
        <p className="text-sm line-clamp-2" style={{ color: "var(--bs-text-secondary)" }}>
          {service.description}
        </p>
      </div>

      {
    /* Info */
  }
      <div className="flex items-center justify-between pt-2 mb-3 border-t" style={{ borderColor: "var(--bs-border)" }}>
        <div className="flex items-center gap-1.5">
          <Clock size={14} style={{ color: "var(--bs-text-muted)" }} />
          <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
            {service.duration} min
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={14} style={{ color: "var(--bs-gold)" }} />
          <span className="font-semibold" style={{ color: "var(--bs-gold)" }}>
            R$ {service.price}
          </span>
        </div>
      </div>

      {
    /* CTA */
  }
      <button
    className="w-full py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold mt-auto"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white"
    }}
    onClick={(e) => {
      e.preventDefault();
      window.location.href = `/agendar?serviceId=${service.id}`;
    }}
  >
        Agendar agora
      </button>
    </Link>;
}
function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    catalogService
      .listServices()
      .then((data) => active && setServices(data))
      .catch((err) => active && setError(err.message || "Erro ao carregar serviços"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps"
  });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const filteredServices = services.filter(
    (service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return <div className="min-h-screen" style={{ backgroundColor: "var(--bs-off-white)" }}>
      {
    /* Header */
  }
      <header
    className="sticky top-0 z-40 px-4 pt-safe lg:hidden"
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
            Nossos Serviços
          </h1>
          <div className="w-[44px]" />
        </div>
      </header>

      <div className="max-w-lg lg:max-w-7xl mx-auto px-4 lg:px-8 pb-8 lg:pt-12">
        {
    /* Desktop Title */
  }
        <div className="hidden lg:block mb-8">
          <h1
    className="text-4xl font-bold mb-2"
    style={{
      color: "var(--bs-text-primary)",
      fontFamily: "'Playfair Display', serif"
    }}
  >
            Nossos Serviços
          </h1>
          <p className="text-lg" style={{ color: "var(--bs-text-secondary)" }}>
            Escolha o serviço ideal para você
          </p>
        </div>

        {
    /* Search Bar */
  }
        <div className="mt-4 lg:mt-0 mb-6 lg:mb-10">
          <div className="relative lg:max-w-md">
            <Search
    className="absolute left-4 top-1/2 -translate-y-1/2"
    size={20}
    style={{ color: "var(--bs-text-muted)" }}
  />
            <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Buscar serviço..."
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
    /* Services Grid/Carousel */
  }
        {loading ? <div
    className="rounded-2xl p-8 text-center"
    style={{ backgroundColor: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
            <p style={{ color: "var(--bs-text-secondary)" }}>Carregando serviços...</p>
          </div> : error ? <div
    className="rounded-2xl p-8 text-center"
    style={{ backgroundColor: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
            <p style={{ color: "var(--bs-error)" }}>{error}</p>
          </div> : filteredServices.length === 0 ? <div
    className="rounded-2xl p-8 text-center"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
            <Search size={48} className="mx-auto mb-3" style={{ color: "var(--bs-text-muted)" }} />
            <p className="font-medium mb-1" style={{ color: "var(--bs-text-primary)" }}>
              Nenhum serviço encontrado
            </p>
            <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
              Tente buscar por outro termo
            </p>
          </div> : <>
            {
    /* Mobile Grid (hidden on desktop) */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>

            {
    /* Desktop Carousel (hidden on mobile) */
  }
            <div className="hidden lg:block relative px-20">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-8">
                  {filteredServices.map((service) => <div key={service.id} className="flex-[0_0_calc(33.333%-21px)] min-w-0">
                      <ServiceCard service={service} />
                    </div>)}
                </div>
              </div>

              {
    /* Navigation Buttons */
  }
              {filteredServices.length > 3 && <>
                  <button
    onClick={scrollPrev}
    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-10"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
    aria-label="Anterior"
  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
    onClick={scrollNext}
    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-10"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
    aria-label="Próximo"
  >
                    <ChevronRight size={24} />
                  </button>
                </>}
            </div>
          </>}

        {
    /* Info Box */
  }
        {filteredServices.length > 0 && <div
    className="rounded-xl p-4 mt-6"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold-medium)"
    }}
  >
            <p className="text-sm" style={{ color: "var(--bs-text-primary)" }}>
              <strong>Dica:</strong> Você pode selecionar múltiplos serviços no agendamento para economizar tempo.
            </p>
          </div>}
      </div>
    </div>;
}
export {
  Services
};
