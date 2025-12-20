import React, { useEffect, useRef } from 'react';

const MainContent = ({ children }) => {
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  return (
    <main
      ref={mainRef}
      tabIndex="-1"
      id="main-content"
      className="outline-none"
      aria-label="Konten utama halaman"
    >
      {children}
    </main>
  );
};

export default MainContent;
