/**
 * 芯颜 AI — App Router
 * Theme: Light (warm ivory)
 * Routes: / | /chat | /result | /calendar | /history | /profile | /trends
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Result from "./pages/Result";
import Calendar from "./pages/Calendar";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Trends from "./pages/Trends";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/result" component={Result} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/history" component={History} />
      <Route path="/profile" component={Profile} />
      <Route path="/trends" component={Trends} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
