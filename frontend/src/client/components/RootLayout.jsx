import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import { DesktopTopbar } from "./DesktopTopbar";
import { DesktopSidebar } from "./DesktopSidebar";
function RootLayout() {
  const location = useLocation();
  const isTopbarPage = ["/", "/servicos", "/barbeiros", "/ajuda"].includes(location.pathname);
  const isAuthPage = ["/login", "/cadastro", "/esqueci-senha"].includes(location.pathname);
  return <>
      {!isAuthPage && isTopbarPage && <DesktopTopbar />}
      <div className={!isAuthPage && !isTopbarPage ? "lg:flex" : ""}>
        {!isAuthPage && !isTopbarPage && <DesktopSidebar />}
        <div className={!isAuthPage && !isTopbarPage ? "flex-1 lg:h-screen lg:overflow-y-auto" : ""}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </>;
}
export {
  RootLayout
};
