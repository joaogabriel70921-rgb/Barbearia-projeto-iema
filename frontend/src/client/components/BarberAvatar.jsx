import { ImageWithFallback } from "./figma/ImageWithFallback";

function initialsOf(name) {
  return (
    (name || "")
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

// Avatar do barbeiro: usa a foto quando houver; senão, mostra as iniciais
// num círculo dourado (mesmo padrão da tela de detalhes do barbeiro).
// `className` carrega o formato (rounded-full / rounded-xl) e `style` a borda.
export function BarberAvatar({ name, image, size = 80, className = "", style = {} }) {
  const dimensions = { width: size, height: size };

  if (image) {
    return (
      <ImageWithFallback
        src={image}
        alt={`Foto do barbeiro ${name}`}
        className={`object-cover ${className}`}
        style={{ ...dimensions, ...style }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        ...dimensions,
        fontSize: Math.round(size * 0.36),
        fontWeight: 700,
        background: "linear-gradient(135deg, var(--bs-charcoal), var(--bs-charcoal-light))",
        color: "var(--bs-gold)",
        ...style,
      }}
      aria-label={`Avatar de ${name}`}
    >
      {initialsOf(name)}
    </div>
  );
}
