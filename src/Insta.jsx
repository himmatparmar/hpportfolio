import React, { useEffect } from 'react';
import seedInsta from './data/insta.json';
import { useContent } from './useContent';

const Insta = () => {
  const { profileUrl, postUrls } = useContent('insta', seedInsta);

  // Load Instagram's official embed script once, then re-process the
  // blockquotes whenever postUrls changes (e.g. once live CMS data arrives).
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      script.onload = () => window.instgrm?.Embeds.process();
      document.body.appendChild(script);
    }
  }, [postUrls]);

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
          href={profileUrl}
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