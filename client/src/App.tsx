import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Resources from "@/pages/resources";
import Community from "@/pages/community";
import Volunteer from "@/pages/volunteer";
import Chat from "@/pages/chat";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SOSButton from "@/components/emergency/sos-button";
import QuickExit from "@/components/emergency/quick-exit";

function Router() {
  return (
    <div className="min-h-screen bg-soft-gray">
      <QuickExit />
      <SOSButton />
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/resources" component={Resources} />
          <Route path="/community" component={Community} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/chat" component={Chat} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
