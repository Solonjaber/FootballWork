
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayersPage from "./pages/PlayersPage";
import GenerateTeamsPage from "./pages/GenerateTeamsPage";
import HistoryPage from "./pages/HistoryPage";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<PlayersPage />} />
              <Route path="gerar-times" element={<GenerateTeamsPage />} />
              <Route path="historico" element={<HistoryPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
