import React, { useEffect } from 'react';

const Insta = () => {
  // 1. Array of your specific public Instagram post URLs
  const postUrls = [
    "https://www.instagram.com/p/DYufreViBTg/",
    "https://www.instagram.com/p/DYcO1rwCLL1/",
    "https://www.instagram.com/p/DYAGEjliMnO/",
  ];

  // 2. Automatically load Instagram's official embed script when the component mounts
  useEffect(() => {
    // Check if the script is already appended to prevent duplicate script tags
    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.instgrm) {
      // If script is already loaded elsewhere, force re-processing of the blockquotes
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }} id='insta'>
      
      {/* Header section targeting your specific handle */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="hpGridHrCenter">
                <h2 className="title">Insta Profile</h2>
        </div>
      </div>

      {/* Grid container to make your feed look like a gallery */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px' 
      }}>
        {postUrls.map((url, index) => (
          <div 
            key={index} 
            style={{ 
              width: '100%', 
              maxWidth: '328px', 
              minWidth: '320px',
              backgroundColor: '#fff',
              border: '1px solid #dbdbdb',
              borderRadius: '3px'
            }}
          >
            {/* The standard Instagram embedding markup structure */}
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ 
                background: '#FFF', 
                border: '0', 
                borderRadius: '3px', 
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
                margin: '1px', 
                maxWidth: '328px', 
                minWidth: '326px', 
                padding: '0', 
                width: 'calc(100% - 2px)' 
              }}
            >
              <div style={{ padding: '16px' }}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#c93082', textDecoration: 'none' }}
                >
                  Loading post...
                </a>
              </div>
            </blockquote>
          </div>
        ))}
      </div>
      <a 
          href="https://www.instagram.com/hpphotography_785/" 
          target="_blank" 
          rel="noopener noreferrer"
          className='hpGridCompCenter instaLinkView'
        >
          View more...
        </a>
    </div>
  );
};

export default Insta;