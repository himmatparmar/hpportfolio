import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isFloating, setIsFloating] = useState(false);
  const [activeTab, setActiveTab] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar only after 100px
      if (window.scrollY > 100) {
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Work Experience', href: '#workexp' },
    { name: 'Education & Specialization', href: '#education' },
    { name: 'Skill Sets', href: '#skills' },
    { name: 'Softwares', href: '#softwares' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Events', href: '#events' },
    { name: 'Insta Profile', href: '#insta' },
    { name: 'Get In Touch', href: '#contact' },
  ];

  return (
    // The navbar now relies entirely on the 'visible' class to show up
    <nav className={`custom-navbar ${isFloating ? 'visible' : 'hidden'}`}>
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className={activeTab === link.href ? 'active' : ''}
          onClick={() => setActiveTab(link.href)}
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
};

export default Navbar;