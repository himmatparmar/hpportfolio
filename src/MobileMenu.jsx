import React, { useState } from 'react';
import './MobileMenu.css';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('#home');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setActiveTab(href);
    setIsOpen(false); // Close menu after selection

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <div className="mobile-menu-container">
      {/* Floating Hamburger/Close Trigger Button */}
      <button 
        className={`menu-trigger ${isOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>

      {/* The Fullscreen Liquid/Droplet Overlay */}
      <nav className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
        <div className="mobile-links-wrapper">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={activeTab === link.href ? 'active-link' : ''}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;