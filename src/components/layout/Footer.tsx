import { ArrowUp, Mail } from "lucide-react";
import Container from "../common/Container";
import { EMAIL } from "../../config/site";
import { useContactModal } from "../common/ContactModal";

export default function Footer() {
  const { openContactModal } = useContactModal();

  return (
    <footer className="border-t border-border-subtle/80 bg-background/50 backdrop-blur-md py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 text-xs font-medium text-text-muted/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Suraj Dias. Built with intent.</p>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent cursor-pointer"
            >
              <Mail size={13} />
              <span>Contact</span>
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors hover:text-accent hidden sm:inline"
            >
              {EMAIL}
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-1 transition-colors hover:text-accent"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

