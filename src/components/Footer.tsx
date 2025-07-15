import { Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background text-muted-foreground py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-3">
            <Linkedin className="w-5 h-5" />
            <a 
              href="https://www.linkedin.com/in/mgraj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            > 
              Connect on LinkedIn
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <span>Contact Us: contact.plamento@gmail.com</span>
          </div>
        </div>
        
        <div className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-sm">&copy; 2024 Plamento. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
