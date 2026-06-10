import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
const STORAGE_KEY = "barber_notifications";
function Notifications() {
  const navigate = useNavigate();
  const [showSaved, setShowSaved] = useState(false);
  const [settings, setSettings] = useState({
    push: true,
    sms: true,
    email: true,
    marketing: false,
    appointments: true,
    reminders: true
  });
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
      }
    }
  }, []);
  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2e3);
  };
  const notificationGroups = [
    {
      title: "Canais de Notifica\xE7\xE3o",
      items: [
        {
          key: "push",
          icon: Bell,
          label: "Notifica\xE7\xF5es Push",
          sublabel: "Receba alertas no aplicativo"
        },
        {
          key: "sms",
          icon: MessageSquare,
          label: "SMS",
          sublabel: "Mensagens de texto no celular"
        },
        {
          key: "email",
          icon: Mail,
          label: "Email",
          sublabel: "Notifica\xE7\xF5es por e-mail"
        }
      ]
    },
    {
      title: "Prefer\xEAncias de Conte\xFAdo",
      items: [
        {
          key: "appointments",
          icon: Bell,
          label: "Confirma\xE7\xF5es de agendamento",
          sublabel: "Confirma\xE7\xF5es e altera\xE7\xF5es"
        },
        {
          key: "reminders",
          icon: Bell,
          label: "Lembretes",
          sublabel: "Lembrete 1h antes do hor\xE1rio"
        },
        {
          key: "marketing",
          icon: Mail,
          label: "Promo\xE7\xF5es e novidades",
          sublabel: "Ofertas especiais e atualiza\xE7\xF5es"
        }
      ]
    }
  ];
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
            Notificações
          </h1>
        </div>
      </header>

      {
    /* Content */
  }
      <div className="max-w-lg mx-auto px-4 mt-6">
        {
    /* Success Toast */
  }
        {showSaved && <div
    className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-fade-in"
    style={{
      backgroundColor: "#2E7D32",
      color: "white"
    }}
  >
            <CheckCircle2 size={18} />
            <span className="font-medium text-sm">Preferências salvas</span>
          </div>}

        {
    /* Info Card */
  }
        <div
    className="rounded-xl p-4 mb-6"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold)"
    }}
  >
          <p
    className="text-sm font-medium"
    style={{ color: "var(--bs-text-primary)" }}
  >
            Configure como você deseja receber notificações sobre seus agendamentos e novidades.
          </p>
        </div>

        {
    /* Notification Groups */
  }
        {notificationGroups.map((group) => <div key={group.title} className="mb-6">
            <p
    className="px-1 mb-3 uppercase tracking-widest text-xs font-semibold"
    style={{ color: "var(--bs-text-muted)" }}
  >
              {group.title}
            </p>
            <div
    className="rounded-2xl overflow-hidden divide-y"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
              {group.items.map((item) => {
    const Icon = item.icon;
    const isEnabled = settings[item.key];
    return <div
      key={item.key}
      className="flex items-center gap-3 px-4 py-4"
    >
                    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: "var(--bs-off-white)" }}
    >
                      <Icon
      size={18}
      style={{ color: isEnabled ? "var(--bs-gold)" : "var(--bs-text-muted)" }}
    />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
      className="font-medium"
      style={{ color: "var(--bs-text-primary)" }}
    >
                        {item.label}
                      </p>
                      <p
      className="text-xs mt-0.5"
      style={{ color: "var(--bs-text-muted)" }}
    >
                        {item.sublabel}
                      </p>
                    </div>
                    <button
      onClick={() => handleToggle(item.key)}
      className="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      style={{
        backgroundColor: isEnabled ? "var(--bs-gold)" : "#D1D5DB"
      }}
      role="switch"
      aria-checked={isEnabled}
      aria-label={`Toggle ${item.label}`}
    >
                      <span
      className="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      style={{
        transform: isEnabled ? "translateX(20px)" : "translateX(0px)"
      }}
    />
                    </button>
                  </div>;
  })}
            </div>
          </div>)}

        {
    /* Quick Actions */
  }
        <div className="flex gap-3 mt-6">
          <button
    onClick={() => {
      const allEnabled = { ...settings };
      Object.keys(allEnabled).forEach((key) => {
        allEnabled[key] = true;
      });
      setSettings(allEnabled);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allEnabled));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2e3);
    }}
    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2"
    style={{
      backgroundColor: "transparent",
      borderColor: "var(--bs-gold)",
      color: "var(--bs-gold)"
    }}
  >
            Ativar todas
          </button>
          <button
    onClick={() => {
      const allDisabled = { ...settings };
      Object.keys(allDisabled).forEach((key) => {
        allDisabled[key] = false;
      });
      setSettings(allDisabled);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allDisabled));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2e3);
    }}
    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2"
    style={{
      backgroundColor: "transparent",
      borderColor: "var(--bs-border)",
      color: "var(--bs-text-secondary)"
    }}
  >
            Desativar todas
          </button>
        </div>

        {
    /* Footer Note */
  }
        <p
    className="text-center text-xs mt-6"
    style={{ color: "var(--bs-text-muted)" }}
  >
          Você pode alterar suas preferências a qualquer momento
        </p>
      </div>
    </div>;
}
export {
  Notifications
};
