import Logo from "@/components/shared/logo";
import { SOCIAL_LINKS } from "@/lib/constants";
import { Github, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo iconSize={16} className="text-lg" />
          <span className="text-gray-300">|</span>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} StaticSend. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={SOCIAL_LINKS.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-emerald-600 transition-colors"
            aria-label="Portfolio"
          >
            <Globe size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
