import { Outlet, useLocation } from "react-router";
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
          <Outlet />
        </div>
      </div>
    </>;
}
export {
  RootLayout
};
