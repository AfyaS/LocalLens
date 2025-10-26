import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AccessibilityPage from "./pages/Accessibility";
import CommunityPage from "./pages/Community";
import ImpactPage from "./pages/Impact";
import GetStarted from "./pages/GetStarted";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateAction from "./pages/CreateAction";
import ActionDetails from "./pages/ActionDetails";
import BrowseActions from "./pages/BrowseActions";
import ASLServicesPage from "./pages/ASLServices";
import FeaturesPage from "./pages/Features";
import KidsPage from "./pages/Kids";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AccessibilityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-action" element={<CreateAction />} />
              <Route path="/action/:id" element={<ActionDetails />} />
              <Route path="/browse-actions" element={<BrowseActions />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/asl-services" element={<ASLServicesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/kids" element={<KidsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AccessibilityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
