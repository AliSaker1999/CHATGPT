import { FaEnvelope, FaGithub, FaUser } from "react-icons/fa";

const Footer = () => (
  <footer className="w-full bg-gradient-to-t from-white via-blue-50 to-blue-100 border-t border-blue-200 mt-auto py-6 px-2 text-center shadow-inner">
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm text-gray-700 font-semibold mb-1">
        &copy; {new Date().getFullYear()} Ali Saker. All rights reserved.
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-base text-blue-800 font-medium">
        <a
          href="mailto:AliSaker1999@hotmail.com"
          className="inline-flex items-center gap-1 hover:text-green-600 transition font-semibold"
        >
          <FaEnvelope className="text-lg" />
          AliSaker1999@hotmail.com
        </a>
        <span className="hidden sm:inline-block">|</span>
        <a
          href="https://github.com/AliSaker1999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-green-600 transition font-semibold"
        >
          <FaGithub className="text-lg" />
          AliSaker1999
        </a>
        <span className="hidden sm:inline-block">|</span>
        <a
          href="https://alisaker1999.github.io/my-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-green-600 transition font-semibold"
        >
          <FaUser className="text-lg" />
          Portfolio
        </a>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Unauthorized use, reproduction, or distribution is prohibited.
      </div>
    </div>
  </footer>
);

export default Footer;
