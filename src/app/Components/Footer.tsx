export default function Footer() {
    return (
      <footer className="bg-gray-900 py-6 mt-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Text */}
          <div className="flex items-center gap-2">
            
           
          </div>
  
          {/* Links Section */}
          <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
            <a
              href="/about"
              className="hover:text-white transition duration-200"
            >
              About
            </a>
            <a
              href="/contact"
              className="hover:text-white transition duration-200"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="hover:text-white transition duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-white transition duration-200"
            >
              Terms of Service
            </a>
          </div>
  
          {/* Social Media Icons */}
          <div className="flex gap-4 text-gray-400 text-lg">
            
          </div>
        </div>
  
        {/* Copyright Section */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Movie App. All rights reserved.
        </div>
      </footer>
    );
  }
  