import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { EMAIL } from "../../config/site";
import useReducedMotion from "../../hooks/useReducedMotion";

interface ContactModalContextType {
  isOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType>({
  isOpen: false,
  openContactModal: () => {},
  closeContactModal: () => {},
});

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openContactModal = () => setIsOpen(true);
  const closeContactModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, openContactModal, closeContactModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeContactModal} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  return useContext(ContactModalContext);
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const reducedMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Lock scroll when open & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset form state after closing transition completes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setIsSubmitting(false);
        setIsSuccess(false);
        setSubmitError(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "4963db65-11e4-4718-bdda-85b66874efe3",
          name,
          email,
          message,
        }),
      });
      const result = (await response.json()) as { success?: boolean };

      if (!response.ok || !result.success) {
        throw new Error("Web3Forms submission failed");
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setIsSubmitting(false);
      setSubmitError(`Something went wrong — please email me directly at ${EMAIL}.`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-background/80 backdrop-blur-xl overflow-y-auto"
        >
          <motion.div
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 24 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 20 }
            }
            transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border-subtle bg-surface-glass/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-text-primary overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="group absolute top-5 right-5 rounded-full border border-border-subtle bg-white/[0.04] p-2.5 text-text-muted transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white"
            >
              <X size={18} className="transition-transform duration-300 group-hover:rotate-90 text-accent" />
            </button>

            {isSuccess ? (
              /* Success Panel */
              <div className="flex flex-col items-center text-center py-6">
                <div className="h-14 w-14 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.25)] mb-5">
                  <Check size={28} />
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                  Message Received!
                </h3>
                <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-xs">
                  Thanks for reaching out — I'll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Contact Form */
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    Get in touch
                  </span>
                  <h2
                    id="contact-modal-title"
                    className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl"
                  >
                    Start a conversation
                  </h2>
                  <p className="mt-1 text-xs text-text-muted">
                    Fill out the form below or send an email directly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm leading-relaxed text-red-200"
                    >
                      {submitError}
                    </p>
                  )}
                  <div>
                    <label
                      htmlFor="modal-name"
                      className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="modal-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border-subtle bg-white/[0.04] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-email"
                      className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border-subtle bg-white/[0.04] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-message"
                      className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about your project or idea..."
                      className="w-full rounded-xl border border-border-subtle bg-white/[0.04] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.35)] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
