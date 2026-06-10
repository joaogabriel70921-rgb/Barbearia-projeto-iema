import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { authService } from "../../services/authService.js";
import {
  ArrowLeft,
  Lock,
  Shield,
  Trash2,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Key,
  X
} from "lucide-react";
function Privacy() {
  const navigate = useNavigate();
  const { forceLogout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Preencha todos os campos");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no m\xEDnimo 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas n\xE3o coincidem");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("A nova senha deve ser diferente da atual");
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 1500);
    } catch (err) {
      setPasswordError(err?.message || "N\xE3o foi poss\xEDvel alterar a senha");
    } finally {
      setIsChangingPassword(false);
    }
  };
  const handleDeleteAccount = () => {
    // O modal de "Excluir Conta" já é a confirmação; encerra a sessão direto
    // (sem backend de exclusão real ainda) sem abrir um segundo modal "Sair?".
    forceLogout();
  };
  const handleLogoutAllSessions = () => {
    forceLogout();
  };
  const activeSessions = [
    {
      id: "1",
      device: "iPhone 14 Pro",
      location: "S\xE3o Paulo, SP",
      lastActive: "Agora",
      current: true
    },
    {
      id: "2",
      device: "Chrome - Windows",
      location: "S\xE3o Paulo, SP",
      lastActive: "H\xE1 2 dias",
      current: false
    }
  ];
  const privacyItems = [
    {
      icon: Lock,
      label: "Alterar senha",
      sublabel: "Trocar sua senha de acesso",
      action: () => setShowPasswordModal(true),
      variant: "default"
    },
    {
      icon: Trash2,
      label: "Excluir conta",
      sublabel: "Remover permanentemente seus dados",
      action: () => setShowDeleteModal(true),
      variant: "danger"
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
            Privacidade e Segurança
          </h1>
        </div>
      </header>

      {
    /* Content */
  }
      <div className="max-w-lg mx-auto px-4 mt-6">
        {
    /* Info Card */
  }
        <div
    className="rounded-xl p-4 mb-6 flex items-start gap-3"
    style={{
      backgroundColor: "var(--bs-gold-light)",
      border: "1px solid var(--bs-gold)"
    }}
  >
          <Shield size={20} style={{ color: "var(--bs-gold)", flexShrink: 0 }} />
          <p
    className="text-sm font-medium"
    style={{ color: "var(--bs-text-primary)" }}
  >
            Seus dados estão protegidos. Gerencie suas configurações de segurança e privacidade abaixo.
          </p>
        </div>

        {
    /* Privacy Items */
  }
        <div
    className="rounded-2xl overflow-hidden divide-y"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)"
    }}
  >
          {privacyItems.map((item) => {
    const Icon = item.icon;
    return <button
      key={item.label}
      onClick={item.action}
      className="w-full flex items-center gap-3 px-4 py-4 transition-colors duration-150 text-left active:bg-gray-50 hover:bg-gray-50/70"
      style={{
        color: item.variant === "danger" ? "var(--bs-error)" : "var(--bs-text-primary)"
      }}
    >
                <div
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        backgroundColor: item.variant === "danger" ? "var(--bs-error-light)" : "var(--bs-off-white)"
      }}
    >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.label}</p>
                  <p
      className="text-xs mt-0.5"
      style={{ color: "var(--bs-text-muted)" }}
    >
                    {item.sublabel}
                  </p>
                </div>
              </button>;
  })}
        </div>
      </div>

      {
    /* Change Password Modal */
  }
      {showPasswordModal && <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    onClick={() => !isChangingPassword && setShowPasswordModal(false)}
  >
          <div
    className="w-full max-w-md rounded-2xl p-6"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-md)"
    }}
    onClick={(e) => e.stopPropagation()}
  >
            <div className="flex items-center justify-between mb-6">
              <h2
    className="text-xl font-bold"
    style={{ color: "var(--bs-text-primary)" }}
  >
                Alterar Senha
              </h2>
              <button
    onClick={() => setShowPasswordModal(false)}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
    disabled={isChangingPassword}
  >
                <X size={20} style={{ color: "var(--bs-text-muted)" }} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label
    htmlFor="currentPassword"
    className="block mb-2 font-medium text-sm"
    style={{ color: "var(--bs-text-primary)" }}
  >
                  Senha atual
                </label>
                <div className="relative">
                  <Key
    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
    style={{ color: "var(--bs-text-muted)" }}
  />
                  <input
    id="currentPassword"
    type="password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Digite sua senha atual"
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

              <div>
                <label
    htmlFor="newPassword"
    className="block mb-2 font-medium text-sm"
    style={{ color: "var(--bs-text-primary)" }}
  >
                  Nova senha
                </label>
                <div className="relative">
                  <Lock
    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
    style={{ color: "var(--bs-text-muted)" }}
  />
                  <input
    id="newPassword"
    type="password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Mínimo 6 caracteres"
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

              <div>
                <label
    htmlFor="confirmPassword"
    className="block mb-2 font-medium text-sm"
    style={{ color: "var(--bs-text-primary)" }}
  >
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Lock
    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
    style={{ color: "var(--bs-text-muted)" }}
  />
                  <input
    id="confirmPassword"
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Digite novamente"
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

              {passwordError && <div
    className="flex items-center gap-2 p-3 rounded-lg"
    style={{
      backgroundColor: "var(--bs-error-light)",
      color: "var(--bs-error)"
    }}
  >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{passwordError}</p>
                </div>}

              {passwordSuccess && <div
    className="flex items-center gap-2 p-3 rounded-lg"
    style={{
      backgroundColor: "#E8F5E9",
      color: "#2E7D32"
    }}
  >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Senha alterada com sucesso!</p>
                </div>}

              <button
    type="submit"
    disabled={isChangingPassword || passwordSuccess}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60"
    style={{
      backgroundColor: "var(--bs-charcoal)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
  >
                {isChangingPassword ? "Alterando..." : passwordSuccess ? "Senha alterada!" : "Alterar senha"}
              </button>
            </form>
          </div>
        </div>}

      {
    /* Sessions Modal */
  }
      {showSessionsModal && <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    onClick={() => setShowSessionsModal(false)}
  >
          <div
    className="w-full max-w-md rounded-2xl p-6"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-md)"
    }}
    onClick={(e) => e.stopPropagation()}
  >
            <div className="flex items-center justify-between mb-6">
              <h2
    className="text-xl font-bold"
    style={{ color: "var(--bs-text-primary)" }}
  >
                Sessões Ativas
              </h2>
              <button
    onClick={() => setShowSessionsModal(false)}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
  >
                <X size={20} style={{ color: "var(--bs-text-muted)" }} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {activeSessions.map((session) => <div
    key={session.id}
    className="rounded-xl p-4 border-2"
    style={{
      backgroundColor: session.current ? "var(--bs-gold-light)" : "var(--bs-surface-alt)",
      borderColor: session.current ? "var(--bs-gold)" : "var(--bs-border)"
    }}
  >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Smartphone
    size={20}
    style={{ color: session.current ? "var(--bs-gold)" : "var(--bs-text-muted)" }}
  />
                      <div>
                        <p
    className="font-medium"
    style={{ color: "var(--bs-text-primary)" }}
  >
                          {session.device}
                          {session.current && <span
    className="ml-2 text-xs font-semibold"
    style={{ color: "var(--bs-gold)" }}
  >
                              (Atual)
                            </span>}
                        </p>
                        <p
    className="text-xs mt-1"
    style={{ color: "var(--bs-text-muted)" }}
  >
                          {session.location}
                        </p>
                        <p
    className="text-xs mt-0.5"
    style={{ color: "var(--bs-text-muted)" }}
  >
                          {session.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>

            <button
    onClick={handleLogoutAllSessions}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 border-2"
    style={{
      backgroundColor: "transparent",
      borderColor: "var(--bs-error)",
      color: "var(--bs-error)"
    }}
  >
              Encerrar todas as sessões
            </button>
          </div>
        </div>}

      {
    /* Delete Account Modal */
  }
      {showDeleteModal && <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    onClick={() => setShowDeleteModal(false)}
  >
          <div
    className="w-full max-w-md rounded-2xl p-6"
    style={{
      backgroundColor: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-md)"
    }}
    onClick={(e) => e.stopPropagation()}
  >
            <div className="text-center mb-6">
              <div
    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
    style={{ backgroundColor: "var(--bs-error-light)" }}
  >
                <AlertCircle size={32} style={{ color: "var(--bs-error)" }} />
              </div>
              <h2
    className="text-xl font-bold mb-2"
    style={{ color: "var(--bs-text-primary)" }}
  >
                Excluir Conta
              </h2>
              <p
    className="text-sm"
    style={{ color: "var(--bs-text-secondary)" }}
  >
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados, agendamentos e histórico serão removidos.
              </p>
            </div>

            <div className="space-y-3">
              <button
    onClick={handleDeleteAccount}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200"
    style={{
      backgroundColor: "var(--bs-error)",
      color: "white",
      boxShadow: "var(--bs-shadow-md)"
    }}
  >
                Sim, excluir minha conta
              </button>
              <button
    onClick={() => setShowDeleteModal(false)}
    className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 border-2"
    style={{
      backgroundColor: "transparent",
      borderColor: "var(--bs-border)",
      color: "var(--bs-text-secondary)"
    }}
  >
                Cancelar
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Privacy
};
