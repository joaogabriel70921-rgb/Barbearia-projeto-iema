import { Star } from "lucide-react";
function StarRating({ rating, reviewCount, size = "sm" }) {
  const starSize = size === "sm" ? 12 : 14;
  const filled = Math.round(rating);
  return <div className="flex items-center gap-1" aria-label={`Avalia\xE7\xE3o: ${rating} de 5 estrelas`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => <Star
    key={i}
    size={starSize}
    strokeWidth={1.5}
    aria-hidden="true"
    style={{
      fill: i < filled ? "var(--bs-gold)" : "transparent",
      color: i < filled ? "var(--bs-gold)" : "var(--bs-text-muted)"
    }}
  />)}
      </div>
      <span
    className="text-[11px] font-semibold"
    style={{ color: "var(--bs-text-primary)" }}
  >
        {rating.toFixed(1)}
      </span>
      {reviewCount !== void 0 && <span
    className="text-[11px]"
    style={{ color: "var(--bs-text-muted)" }}
  >
          ({reviewCount})
        </span>}
    </div>;
}
export {
  StarRating
};
