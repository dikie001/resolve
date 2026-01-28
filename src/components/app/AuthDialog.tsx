import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, Delete } from "lucide-react";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: () => void;
}

const DEFAULT_PIN = "2026"; // Default PIN for vault access

export function AuthDialog({ open, onOpenChange, onUnlock }: AuthDialogProps) {
  const [pin, setPin] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };



  const handleSubmit = () => {
    if (pin === DEFAULT_PIN) {
      toast.success("Vault Unlocked", {
        description: "Welcome to The Vault",
        icon: <ShieldCheck className="w-5 h-5" />,
        style: { background: "#10b981", color: "#09090b", fontWeight: "bold" },
      });
      onUnlock();
      onOpenChange(false);
      setPin("");
    } else {
      setIsShaking(true);
      toast.error("Access Denied", {
        description: "Invalid PIN. Please try again.",
        style: { background: "#ef4444", color: "#fff", fontWeight: "bold" },
      });
      setTimeout(() => {
        setIsShaking(false);
        setPin("");
      }, 500);
    }
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-amber-500/20 text-white rounded-[2rem] w-[95vw] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-amber-500 italic tracking-tighter flex items-center gap-2">
            <Lock className="w-6 h-6" />
            VAULT ACCESS
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Enter your 4-digit PIN to unlock The Vault
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* PIN Display */}
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
              onClick={handleSubmit}
              disabled={pin.length !== 4}
              className="h-14 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Unlock
            </Button>
          </div>

          <p className="text-xs text-zinc-600 text-center font-mono">
            Default PIN: 2026
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add shake animation to CSS if not already present
