import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Check if user previously dismissed it
      const isDismissed = localStorage.getItem("install_dismissed");
      if (!isDismissed) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShow(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    // Remember dismissal for this session/device
    localStorage.setItem("install_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50"
        >
          <div className="flex items-center gap-4 bg-zinc-950/90 backdrop-blur-xl border border-amber-500/20 p-3 pr-12 rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            
            <div className="p-2 bg-amber-500/10 rounded-xl shrink-0">
              <Download className="w-5 h-5 text-amber-500" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm text-white">Install App</span>
              <span className="text-xs text-zinc-400">Add to home screen</span>
            </div>

            <Button 
              size="sm" 
              onClick={handleInstall}
              className="ml-2 h-9 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg"
            >
              Install
            </Button>

            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}