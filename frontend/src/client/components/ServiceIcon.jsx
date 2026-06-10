import {
  Scissors,
  Smile,
  Star,
  Eye,
  Palette,
  Sparkles,
  Droplets,
  Zap
} from "lucide-react";
const iconMap = {
  scissors: Scissors,
  smile: Smile,
  star: Star,
  eye: Eye,
  palette: Palette,
  sparkles: Sparkles,
  droplets: Droplets,
  zap: Zap
};
function ServiceIcon({ name, size = 24, className, color }) {
  const Icon = iconMap[name] ?? Scissors;
  return <Icon size={size} className={className} color={color} aria-hidden="true" />;
}
export {
  ServiceIcon
};
