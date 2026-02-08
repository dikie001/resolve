import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border rounded-xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom-4">
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
            >
                <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Download className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">Install Resolve</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Install for quick access and offline use
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleDismiss}
                >
                    Not now
                </Button>
                <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleInstall}
                >
                    Install
                </Button>
            </div>
        </div>
    );
}
