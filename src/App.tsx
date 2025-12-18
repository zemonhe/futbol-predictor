import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import DadosPage from "./pages/DadosPage";
import TreinoPage from "./pages/TreinoPage";
import BacktestPage from "./pages/BacktestPage";
import PrevisoesPage from "./pages/PrevisoesPage";
import SobrePage from "./pages/SobrePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dados" element={<DadosPage />} />
            <Route path="/treino" element={<TreinoPage />} />
            <Route path="/backtest" element={<BacktestPage />} />
            <Route path="/previsoes" element={<PrevisoesPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
