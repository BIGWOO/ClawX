/**
 * TelegramGuide — Step-by-step SOP for obtaining a Telegram Bot Token
 * Collapsible panel used inside the Setup Wizard channel step.
 */
import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const GUIDE_STEPS = [1, 2, 3, 4, 5] as const;

const STEP_CIRCLES = ['①', '②', '③', '④', '⑤'] as const;

export function TelegramGuide() {
  const { t } = useTranslation('setup');
  const [open, setOpen] = useState(false);

  const openExternal = (url: string) => {
    if (window.electron?.openExternal) {
      window.electron.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="mt-3">
      {/* Toggle link */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
        />
        {t('channel.guide.toggle')}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border bg-[#FAFAF8] dark:bg-muted/30 p-5 space-y-0">
              {GUIDE_STEPS.map((step, idx) => (
                <div key={step}>
                  <div className="flex gap-3 py-3">
                    {/* Step circle */}
                    <span className="text-lg font-bold text-[#1A1A1A] dark:text-foreground leading-6 select-none">
                      {STEP_CIRCLES[idx]}
                    </span>

                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium text-foreground">
                        {t(`channel.guide.steps.${step}.text`)}
                      </p>

                      {/* Extra line for step 4 */}
                      {step === 4 && (
                        <p className="text-sm text-foreground">
                          {t('channel.guide.steps.4.text2')}
                        </p>
                      )}

                      {/* Hint */}
                      <p className="text-xs text-muted-foreground">
                        {t(`channel.guide.steps.${step}.hint`)}
                      </p>

                      {/* Step 1 button */}
                      {step === 1 && (
                        <Button
                          size="sm"
                          className="mt-1 bg-[#1A1A1A] hover:bg-[#333] text-white"
                          onClick={() => openExternal('https://t.me/BotFather')}
                        >
                          {t('channel.guide.steps.1.button')}
                          <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Button>
                      )}

                      {/* Step 5 token example */}
                      {step === 5 && (
                        <code className="block text-xs bg-black/5 dark:bg-black/20 rounded px-2 py-1 font-mono text-muted-foreground break-all">
                          110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
                        </code>
                      )}
                    </div>
                  </div>
                  {idx < GUIDE_STEPS.length - 1 && (
                    <div className="border-b border-border/50 ml-8" />
                  )}
                </div>
              ))}

              {/* Paid service CTA */}
              <div className="border-t border-border/50 pt-4 mt-2 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  {t('channel.guide.paidService.text')}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  disabled
                >
                  {t('channel.guide.paidService.button')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
