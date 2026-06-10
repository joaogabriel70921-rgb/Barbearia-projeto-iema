import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { authService } from "../../services/authService.js";
import { ArrowLeft, User, Phone, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
    }
    return phone;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Preencha todos os campos");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inv\xE1lido");
      return;
    }
    const phoneNumbers = phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10) {
      setError("Telefone inv\xE1lido");
      return;
    }
    setIsLoading(true);
    try {
      const updated = await authService.updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      });
      updateUser(updated || { name: name.trim(), email: email.trim(), phone: phone.trim() });
      setSuccess(true);
      setTimeout(() => {
        navigate("/perfil");
      }, 1200);
    } catch (err) {
      setError(err?.message || "N\xE3o foi poss\xEDvel atualizar o perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return <div
    className="min-h-screen pb-8"
    style={{ backgroundColor: "var(--bs-off-white)" }}
  >
      {
    /* Sticky Header */
  }
      <header
    className="sticky top-0 z-40 px-4 pt-safe lg:hidden"
    style={{ backgroundColor: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto flex items-center h-14">
          <button
    onClick={() => navigate("/perfil")}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3 transition-opacity duration-200 hover:opacity-70 active:opacity-50"
    aria-label="Voltar"
  >
            <ArrowLeft size={20} color="white" />
          </button>
          <h1
    className="flex-1 text-center pr-11"
    style={{ fontSize: "1.125rem", fontWeight: 700, color: "white" }}
  >
            Editar Perfil
          </h1>
        </div>
      </header>

      {
    /* Form Content */
  }
      <div className="max-w-lg mx-auto px-4 mt-6">
        <div
    className="rounded-2xl p-6"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-md)"
    }}
  >
          <form onSubmit={handleSubmit} className="space-y-5">
            {
    /* Name Field */
  }
            <div>
              <label
    htmlFor="name"
    className="block mb-2 font-medium"
    style={{ color: "var(--bs-text-primary)" }}
  >
                Nome completo
              </label>
              <div className="relative">
                <User
    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
    style={{ color: "var(--bs-text-muted)" }}
  />
                <input
    id="name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Seu nome completo"
    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none"
    style={{
      backgroundColor: "var(--bs-surface-alt)",
      borderColor: "var(--bs-border)",
      color: "var(--bs-text-primary)"
    }}
    onFocus={(e) => e.target.style.borderColor = "var(--bs-gold)"}
    onBlur={(e) => e.target.style.borderColor = "var(--bs-border)"}
  />
              </div>
            </div>

            {
    /* Phone Field */
  }
            <div>
              <label
    htmlFor="phone"
    className="block mb-2 font-medium"
    style={{ color: "var(--bs-text-primary)" }}
  >
                Telefone
              </label>
              <div className="relative">
                <Phone
    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
    style={{ color: "var(--bs-text-muted)" }}
  />
                <input
    id="phone"
    type="tel"
    value={phone}
    onChange={(e) => setPhone(formatPhone(e.target.value))}
    placeholder="(11) 98765-4321"
    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none"
    style={{
      backgroundColor: "var(--bs-surface-alt)",
      borderColor: "var(--bs-border)",
      color: "var(--bs-text-primary)"
    }}
    onFocus={(e) => e.target.style.borderColor = "var(--bs-gold)"}
    onBlur={(e) => e.target.style.borderColor = "var(--bs-border)"}
  />
              </div>
            </div>

            {
    /* Email Field */
  }
            <div>
              <label
    htmlFor="email"
    className="block mb-2 font-medium"
    style={{ color: "var(--bs-text-primary)" }}
  >
                Email
              </label>
              <div className="relative">
                <Mail
    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
    style={{ color: "var(--bs-text-muted)" }}
  />
                <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="seu@email.com"
    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none"
    style={{
      backgroundColor: "var(--bs-surface-alt)",
      borderColor: "var(--bs-border)",
      color: "var(--bs-text-primary)"
    }}
    onFocus={(e) => e.target.style.borderColor = "var(--bs-gold)"}
    onBlur={(e) => e.target.style.borderColor = "var(--bs-border)"}
  />
              </div>
            </div>

            {
    /* Error Message */
  }
            {error && <div
    className="flex items-center gap-2 p-3 rounded-lg"
    style={{
      backgroundColor: "var(--bs-error-light)",
      color: "var(--bs-error)"
    }}
  >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>}

            {
    /* Success Message */
  }
            {success && <div
    className="flex items-center gap-2 p-3 rounded-lg"
    style={{
      backgroundColor: "#E8F5E9",
      color: "#2E7D32"
    }}
  >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Perfil atualizado com sucesso!</p>
              </div>}

            {
    /* Submit Button */
  }
            <button
    type="submit"
    disabled={isLoading || success}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 mt-6"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
    onMouseEnter={(e) => {
      if (!isLoading && !success) e.currentTarget.style.backgroundColor = "var(--bs-charcoal-light)";
    }}
    onMouseLeave={(e) => {
      if (!isLoading && !success) e.currentTarget.style.backgroundColor = "var(--bs-charcoal)";
    }}
  >
              {isLoading ? "Salvando..." : success ? "Salvo!" : "Salvar altera\xE7\xF5es"}
            </button>
          </form>
        </div>

        {
    /* Info Text */
  }
        <p
    className="text-center text-sm mt-4 px-4"
    style={{ color: "var(--bs-text-muted)" }}
  >
          Seus dados são mantidos em segurança e nunca compartilhados com terceiros.
        </p>
      </div>
    </div>;
}
export {
  EditProfile
};
