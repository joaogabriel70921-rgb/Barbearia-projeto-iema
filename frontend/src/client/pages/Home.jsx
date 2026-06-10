import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Clock, ChevronRight, Scissors, MapPin, Phone, Mail, Instagram, Facebook, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNav } from "../components/BottomNav";
import { StarRating } from "../components/StarRating";
import { ServiceIcon } from "../components/ServiceIcon";
import { Skeleton } from "../components/ui/skeleton";
import { catalogService } from "../../services/catalogService.js";
const HERO_IMAGE = "https://images.unsplash.com/photo-1734723836256-0e168f4721a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYmFyYmVyc2hvcCUyMGludGVyaW9yJTIwZGFyayUyMGx1eHVyeXxlbnwxfHx8fDE3NzY3ODU4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
function Home() {
  const [loading, setLoading] = useState(true);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  useEffect(() => {
    let active = true;
    Promise.all([
      catalogService.listBarbers().catch(() => []),
      catalogService.listServices().catch(() => [])
    ]).then(([b, s]) => {
      if (!active) return;
      setBarbers(b);
      setServices(s);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);
  return <div
    className="min-h-screen pb-24 lg:pb-8"
    style={{ background: "var(--bs-off-white)" }}
  >
      {
    /* ── Sticky Header (mobile only) ── */
  }
      <header
    className="sticky top-0 z-40 lg:hidden"
    style={{ background: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Scissors size={20} color="var(--bs-gold)" aria-hidden="true" />
            <span
    style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 800,
      fontSize: "1.125rem",
      color: "#FFFFFF",
      letterSpacing: "-0.02em"
    }}
  >
              Barber<span style={{ color: "var(--bs-gold)" }}>Scheduler</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
    className="w-2 h-2 rounded-full"
    style={{ background: "var(--bs-success)" }}
    aria-hidden="true"
  />
            <span className="text-[12px]" style={{ color: "var(--bs-text-muted)" }}>
              Aberto agora
            </span>
          </div>
        </div>
      </header>

      {
    /* ── Hero Section ── */
  }
      <section className="relative overflow-hidden" style={{ height: 340 }}>
        <ImageWithFallback
    src={HERO_IMAGE}
    alt="Interior premium da barbearia Barber Scheduler"
    className="w-full h-full object-cover"
  />
        {
    /* Gradient overlay */
  }
        <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(180deg, rgba(26,26,26,0.25) 0%, rgba(26,26,26,0.55) 50%, rgba(26,26,26,0.90) 100%)"
    }}
    aria-hidden="true"
  />
        {
    /* Content */
  }
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 max-w-lg mx-auto">
          <p
    className="mb-1 uppercase tracking-widest text-[11px]"
    style={{ color: "var(--bs-gold)", fontWeight: 600 }}
  >
            Barbearia Premium
          </p>
          <h1
    className="font-serif-display mb-2 text-white leading-tight"
    style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "2rem",
      fontWeight: 800,
      lineHeight: 1.15
    }}
  >
            Seu estilo,<br />nossa paixão.
          </h1>
          <p className="mb-5 text-[14px]" style={{ color: "rgba(255,255,255,0.75)" }}>
            Agende com os melhores barbeiros da cidade.
          </p>
          <Link to="/agendar" className="inline-block">
            <button
    className="h-12 px-8 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-[0.97] focus:outline-none"
    style={{
      background: "var(--bs-gold)",
      color: "var(--bs-text-primary)",
      fontWeight: 700,
      fontSize: "0.9375rem",
      boxShadow: "var(--bs-shadow-gold)"
    }}
    aria-label="Agendar agora"
  >
              <CalendarIcon />
              Agendar Agora
            </button>
          </Link>
        </div>
      </section>

      {
    /* ── Quick Info Bar ── */
  }
      <div
    className="py-3 px-4"
    style={{ background: "var(--bs-charcoal-light)" }}
  >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} color="var(--bs-gold)" aria-hidden="true" />
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>Travessa do santo , 127A Liberdade , São Luís - MA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={13} color="var(--bs-gold)" aria-hidden="true" />
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>(98) 8440-8330</span>
          </div>
        </div>
      </div>

      {
    /* ── Barbers Section ── */
  }
      <section className="pt-6 pb-2 max-w-4xl mx-auto">
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--bs-text-primary)" }}>
            Nossos Barbeiros
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
          
            </div>
            <Link
    to="/barbeiros"
    className="flex items-center gap-0.5 text-[13px] transition-opacity hover:opacity-70 focus:outline-none rounded"
    style={{ color: "var(--bs-gold)", fontWeight: 600 }}
    aria-label="Ver todos os barbeiros"
  >
              Ver todos <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {
    /* Horizontal scroll */
  }
        <div
    ref={scrollRef}
    className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
    role="list"
    aria-label="Lista de barbeiros"
  >
          {loading ? Array.from({ length: 4 }).map((_, i) => <BarberCardSkeleton key={i} />) : barbers.map((barber) => <BarberCard key={barber.id} barber={barber} />)}
        </div>
      </section>

      {
    /* ── Services Section ── */
  }
      <section className="px-4 pt-4 pb-2 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--bs-text-primary)" }}>
            Nossos Serviços
          </h2>
          <Link
    to="/servicos"
    className="flex items-center gap-0.5 text-[13px] transition-opacity hover:opacity-70 focus:outline-none rounded"
    style={{ color: "var(--bs-gold)", fontWeight: 600 }}
    aria-label="Ver todos os serviços"
  >
            Ver todos <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {loading ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div> : <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Lista de serviços">
            {services.slice(0, 4).map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>}
      </section>

      {
    /* ── Why Us section ── */
  }
      <section className="px-4 pt-6 pb-4 max-w-4xl mx-auto">
        <h2
    className="mb-4"
    style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--bs-text-primary)" }}
  >
          Por que nos escolher?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
    { emoji: "\u2B50", title: "Top Avaliados", desc: "4.9 no Google Avalia\xE7\xF5es" },
    { emoji: "\u26A1", title: "Pontualidade", desc: "Zero atrasos, sempre no hor\xE1rio" },
    { emoji: "\u2702\uFE0F", title: "Produtos Premium", desc: "Marcas internacionais" },
    { emoji: "\u{1F4F1}", title: "Agendamento 24/7", desc: "Online, quando quiser" }
  ].map(({ emoji, title, desc }) => <div
    key={title}
    className="rounded-2xl p-4 flex flex-col gap-2"
    style={{
      background: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
              <span className="text-2xl" role="img" aria-hidden="true">{emoji}</span>
              <p style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--bs-text-primary)" }}>
                {title}
              </p>
              <p className="text-[11px] leading-snug" style={{ color: "var(--bs-text-secondary)" }}>
                {desc}
              </p>
            </div>)}
        </div>
      </section>


      {
    /* ── Footer ── */
  }
      <footer className="px-4 pt-6 pb-4 max-w-4xl mx-auto border-t" style={{ borderColor: "var(--bs-border)" }}>
        {
    /* Contact Info */
  }
        <div
    className="rounded-2xl p-5 mb-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
          <h3 className="mb-4" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--bs-text-primary)" }}>
            Contato e Localização
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5" style={{ color: "var(--bs-gold)", flexShrink: 0 }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--bs-text-primary)" }}>
                  Travessa do santo , 127A Liberdade
                </p>
                <p className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                      São Luís - MA
                </p>
              </div>
            </div>
            <a href="tel:+551134567890" className="flex items-center gap-3">
              <Phone size={18} style={{ color: "var(--bs-gold)", flexShrink: 0 }} />
              <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                (98) 8440-8330
              </span>
            </a>
            <a href="mailto:joaogabriel70921@gmail.com" className="flex items-center gap-3">
              <Mail size={18} style={{ color: "var(--bs-gold)", flexShrink: 0 }} />
              <span className="text-sm" style={{ color: "var(--bs-text-secondary)" }}>
                joaogabriel70921@gmail.com
              </span>
            </a>
          </div>
        </div>

        {
    /* Business Hours */
  }
        <div
    className="rounded-2xl p-5 mb-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
          <h3 className="mb-4" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--bs-text-primary)" }}>
            Horário de Funcionamento
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--bs-text-secondary)" }}>Segunda a Sexta</span>
              <span style={{ color: "var(--bs-text-primary)", fontWeight: 600 }}>09:00 - 19:00</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--bs-text-secondary)" }}>Sábado</span>
              <span style={{ color: "var(--bs-text-primary)", fontWeight: 600 }}>09:00 - 17:00</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--bs-text-secondary)" }}>Domingo</span>
              <span style={{ color: "var(--bs-text-muted)", fontWeight: 600 }}>Fechado</span>
            </div>
          </div>
        </div>

        {
    /* Social Media */
  }
        <div className="mb-4">
          <h3 className="mb-3 text-sm" style={{ fontWeight: 600, color: "var(--bs-text-secondary)" }}>
            Siga-nos
          </h3>
          <div className="flex gap-3">
            <a
    href="https://instagram.com/barbeariapremium"
    target="_blank"
    rel="noopener noreferrer"
    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
    style={{ background: "var(--bs-gold-light)" }}
    aria-label="Instagram"
  >
              <Instagram size={20} style={{ color: "var(--bs-gold-darker)" }} />
            </a>
            <a
    href="https://facebook.com/barbeariapremium"
    target="_blank"
    rel="noopener noreferrer"
    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
    style={{ background: "var(--bs-gold-light)" }}
    aria-label="Facebook"
  >
              <Facebook size={20} style={{ color: "var(--bs-gold-darker)" }} />
            </a>
          </div>
        </div>


        {
    /* Copyright */
  }
        <div className="pt-4 border-t text-center" style={{ borderColor: "var(--bs-border)" }}>
          <p className="text-xs" style={{ color: "var(--bs-text-muted)" }}>
            © 2026 BarberScheduler. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <BottomNav />
    </div>;
}
function CalendarIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>;
}
function BarberCard({ barber }) {
  return <Link
    to={`/barbeiro/${barber.id}`}
    role="listitem"
    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl flex-shrink-0 w-[130px] transition-all duration-200 active:scale-[0.97] focus:outline-none"
    style={{
      background: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
    aria-label={`Ver perfil de ${barber.name}, especialidade: ${barber.specialty}`}
  >
      {
    /* Avatar + availability dot */
  }
      <div className="relative">
        <ImageWithFallback
    src={barber.image}
    alt={`Foto do barbeiro ${barber.name}`}
    className="w-20 h-20 rounded-full object-cover"
    style={{ border: "2px solid var(--bs-gold-light)" }}
  />
        {barber.availableToday && <span
    className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
    style={{ background: "var(--bs-success)" }}
    aria-label="Disponível hoje"
  />}
      </div>

      {
    /* Name */
  }
      <p
    className="text-center leading-tight"
    style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--bs-text-primary)" }}
  >
        {barber.name}
      </p>

      {
    /* Specialty pill */
  }
      <span
    className="px-2 py-0.5 rounded-full text-center leading-tight"
    style={{
      background: "var(--bs-gold-light)",
      color: "var(--bs-gold-dark)",
      fontSize: "10px",
      fontWeight: 600
    }}
  >
        {barber.specialty}
      </span>


      {
    /* Next available */
  }
      <div
    className="flex items-center gap-1 px-2 py-1 rounded-lg"
    style={{ background: "var(--bs-off-white)" }}
  >
        <Clock size={11} color="var(--bs-text-muted)" aria-hidden="true" />
        <span
    className="text-[10px]"
    style={{ color: "var(--bs-text-secondary)", fontWeight: 500 }}
  >
          {barber.availableToday ? "Dispon\xEDvel" : "Sob agenda"}
        </span>
      </div>
    </Link>;
}
function BarberCardSkeleton() {
  return <div
    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl flex-shrink-0 w-[130px]"
    style={{ background: "var(--bs-surface)" }}
    aria-hidden="true"
  >
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="w-20 h-3 rounded" />
      <Skeleton className="w-16 h-3 rounded-full" />
      <Skeleton className="w-14 h-2.5 rounded" />
      <Skeleton className="w-16 h-5 rounded-lg" />
    </div>;
}
function ServiceCard({ service }) {
  return <Link
    to={`/servico/${service.id}`}
    role="listitem"
    className="rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 active:scale-[0.97] focus:outline-none"
    style={{
      background: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
    aria-label={`Ver detalhes: ${service.name}, ${service.duration} minutos, R$ ${service.price}`}
  >
      {
    /* Icon */
  }
      <div
    className="w-11 h-11 rounded-xl flex items-center justify-center"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
        <ServiceIcon
    name={service.iconName}
    size={22}
    color="var(--bs-gold-dark)"
  />
      </div>

      {
    /* Name */
  }
      <p
    style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--bs-text-primary)", lineHeight: 1.3 }}
  >
        {service.name}
      </p>

      {
    /* Duration */
  }
      <div className="flex items-center gap-1">
        <Clock size={12} color="var(--bs-text-muted)" aria-hidden="true" />
        <span className="text-[12px]" style={{ color: "var(--bs-text-muted)" }}>
          {service.duration} min
        </span>
      </div>

      {
    /* Price */
  }
      <p
    style={{ fontWeight: 700, fontSize: "1rem", color: "var(--bs-gold-dark)" }}
  >
        R$ {service.price.toFixed(2)}
      </p>
    </Link>;
}
function ServiceCardSkeleton() {
  return <div
    className="rounded-2xl p-4 flex flex-col gap-3"
    style={{ background: "var(--bs-surface)" }}
    aria-hidden="true"
  >
      <Skeleton className="w-11 h-11 rounded-xl" />
      <Skeleton className="w-20 h-3.5 rounded" />
      <Skeleton className="w-14 h-2.5 rounded" />
      <Skeleton className="w-16 h-4 rounded" />
    </div>;
}
export {
  Home
};
