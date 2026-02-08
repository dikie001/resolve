import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck, Delete, KeyRound, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: () => void;
}

const PIN_STORAGE_KEY = "vault_pin";

// Hardcoded Recovery Secrets
const RECOVERY_YEAR = "2004";
const RECOVERY_INDEX = "42721116001";

type AuthMode = "UNLOCK" | "CREATE" | "CONFIRM" | "RECOVERY";

export function AuthDialog({ open, onOpenChange, onUnlock }: AuthDialogProps) {
  const [pin, setPin] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [mode, setMode] = useState<AuthMode>("UNLOCK");
  const [isShaking, setIsShaking] = useState(false);

  // Recovery Form State
  const [recoveryYear, setRecoveryYear] = useState("");
  const [recoveryIndex, setRecoveryIndex] = useState("");

  // Check if PIN exists on mount or open
  useEffect(() => {
    if (open) {
      const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
      if (!storedPin) {
        setMode("CREATE");
      } else {
        setMode("UNLOCK");
      }
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setPin("");
    setTempPin("");
    setRecoveryYear("");
    setRecoveryIndex("");
  };

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const showError = (msg: string) => {
    setIsShaking(true);
    toast.error("Error", {
      description: msg,
      style: { background: "#ef4444", color: "#fff", fontWeight: "bold" },
    });
    setTimeout(() => {
      setIsShaking(false);
      setPin("");
    }, 500);
  };

  // Main Logic Handler
  const handleAction = () => {
    switch (mode) {
      case "CREATE":
        if (pin.length !== 4) return;
        setTempPin(pin);
        setPin("");
        setMode("CONFIRM");
        break;

      case "CONFIRM":
        if (pin.length !== 4) return;
        if (pin === tempPin) {
          localStorage.setItem(PIN_STORAGE_KEY, pin);
          toast.success("PIN Created", {
            description: "Your vault is now secured.",
            style: { background: "#10b981", color: "#09090b", fontWeight: "bold" },
          });
          onUnlock();
          onOpenChange(false);
        } else {
          showError("PINs do not match. Try again.");
          setPin("");
          setTempPin("");
          setMode("CREATE");
        }
        break;

      case "UNLOCK":
        if (pin.length !== 4) return;
        const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
        if (pin === storedPin) {
          toast.success("Vault Unlocked", {
            icon: <ShieldCheck className="w-5 h-5" />,
            style: { background: "#10b981", color: "#09090b", fontWeight: "bold" },
          });
          onUnlock();
          onOpenChange(false);
          setPin("");
        } else {
          showError("Access Denied");
        }
        break;
    }
  };

  // Specific Handler for Recovery Form
  const handleRecoverySubmit = () => {
    if (recoveryYear === RECOVERY_YEAR && recoveryIndex === RECOVERY_INDEX) {
      localStorage.removeItem(PIN_STORAGE_KEY);
      toast.info("Identity Verified", {
        description: "Please create a new PIN.",
        icon: <RefreshCcw className="w-5 h-5" />,
      });
      resetState();
      setMode("CREATE");
    } else {
      setIsShaking(true);
      toast.error("Verification Failed", {
        description: "Incorrect Birth Year or Index Number.",
        style: { background: "#ef4444", color: "#fff", fontWeight: "bold" },
      });
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const getHeaderText = () => {
    switch (mode) {
      case "CREATE": return "CREATE PIN";
      case "CONFIRM": return "CONFIRM PIN";
      case "RECOVERY": return "ACCOUNT RECOVERY";
      default: return "VAULT ACCESS";
    }
  };

  const getSubText = () => {
    switch (mode) {
      case "CREATE": return "Set a 4-digit security PIN";
      case "CONFIRM": return "Re-enter to confirm";
      case "RECOVERY": return "Verify your identity to reset PIN";
      default: return "Enter your 4-digit PIN";
    }
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-amber-500/20 text-white rounded-[2rem] w-[95vw] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-amber-500 italic tracking-tighter flex items-center gap-2">
            {mode === "RECOVERY" ? <AlertCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            {getHeaderText()}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            {getSubText()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {/* --- RECOVERY FORM VIEW --- */}
          {mode === "RECOVERY" ? (
            <div className={`space-y-4 ${isShaking ? "animate-shake" : ""}`}>
              <div className="space-y-2">
                <label className="text-zinc-400">Birth Year</label>
                <Input 
                  type="number" 
                  placeholder="YYYY"
                  value={recoveryYear}
                  onChange={(e) => setRecoveryYear(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12 rounded-xl focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-400">Primary School Index Number</label>
                <Input 
                  type="number" 
                  placeholder="Enter Index Number"
                  value={recoveryIndex}
                  onChange={(e) => setRecoveryIndex(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12 rounded-xl focus-visible:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode("UNLOCK");
                    resetState();
                  }}
                  className="h-12 bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRecoverySubmit}
                  className="h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20"
                >
                  Verify & Reset
                </Button>
              </div>
            </div>
          ) : (
            /* --- PIN PAD VIEW --- */
            <>
              {/* PIN Bubbles */}
              <div className={`flex justify-center gap-3 ${isShaking ? "animate-shake" : ""}`}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      pin.length > i
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-800 bg-zinc-900"
                    }`}
                  >
                    {pin.length > i && (
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-3">
                {numbers.map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    className="h-16 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/30 text-white text-xl font-bold rounded-2xl transition-all active:scale-95"
                  >
                    {num}
                  </Button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="h-14 bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 font-bold rounded-2xl"
                >
                  <Delete className="w-5 h-5 mr-2" />
                  Delete
                </Button>
                
                <Button
                  onClick={handleAction}
                  disabled={pin.length !== 4}
                  className="h-14 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === "CREATE" || mode === "CONFIRM" ? (
                    <>Next</>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Unlock
                    </>
                  )}
                </Button>
              </div>

              {/* Forgot PIN Link */}
              {mode === "UNLOCK" && (
                <div className="flex justify-center">
                  <Button
                    variant="link"
                    onClick={() => {
                      setMode("RECOVERY");
                      resetState();
                    }}
                    className="text-xs text-zinc-500 hover:text-amber-500 transition-colors"
                  >
                    <KeyRound className="w-3 h-3 mr-1.5" />
                    Forgot PIN?
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}