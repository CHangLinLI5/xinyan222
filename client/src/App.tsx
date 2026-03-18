/**
 * 芯颜 AI — App Router
 * Theme: Light (warm ivory)
 * Routes: / | /chat | /result | /calendar | /history | /profile | /login | /trends
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import MobileTabBar from "./components/MobileTabBar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Result from "./pages/Result";
import Calendar from "./pages/Calendar";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Trends from "./pages/Trends";

// 检测是否在 GitHub Pages 子路径下运行
const BASE_PATH = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function Router() {
  return (
    <WouterRouter base={BASE_PATH}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/result" component={Result} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/history" component={History} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/trends" component={Trends} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <UserProvider>
          <TooltipProvider>
            <Toaster
              theme="light"
              toastOptions={{
                style: {
                  background: "#FDFAF7",
                  border: "1px solid rgba(193,123,92,0.2)",
                  color: "#2D2420",
                  fontFamily: "'DM Sans', sans-serif",
                  borderRadius: "10px",
                },
              }}
            />
            <Router />
            <MobileTabBar />
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
