import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';

import aquasafeLogo from '../aquasafe-logo.png';

// Carousel Images
import slide1Img from './nature.jpg';
import slide2Img from './download_6.jpg';
import slide3Img from './fond_mer.jpg';

export const MainNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = React.useContext(AuthContext);
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  const getDashboardLink = () => {
    if (user?.role === 'Admin') return '/admin';
    if (user?.role === 'Engineer') return '/engineer';
    return '/user';
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    // If not already on home page, push to '/' and delay the scroll slightly
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Already on home page, just scroll smoothly
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 3rem',
      background: 'var(--sidebar-bg)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => handleNavClick(e, 'home')}>
        <img src={aquasafeLogo} alt="AquaSafe" style={{ height: '40px' }} />
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', transition: 'color 0.3s', whiteSpace: 'nowrap' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-main)'}>Home</a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', transition: 'color 0.3s', whiteSpace: 'nowrap' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-main)'}>About Us</a>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'background 0.3s' }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <Link to={getDashboardLink()} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>Dashboard</Link>
            <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--error)'} onMouseOut={e => e.target.style.color = 'var(--text-main)'}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const LandingPageWithNav = () => {
  const { user } = React.useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      title: "AquaSafe",
      description: "An intelligent platform for continuous, real-time tracking of water purity to ensure community safety.",
      image: slide1Img
    },
    {
      title: "Powered by Sensors",
      description: "Deploying high-precision IoT sensors to instantly measure critical metrics like TDS, Turbidity, and pH levels.",
      image: slide2Img
    },
    {
      title: "Instant Alerts",
      description: "Our system guarantees zero delay with immediate Email Alerts.",
      image: slide3Img
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getDashboardLink = () => {
    if (user?.role === 'Admin') return '/admin';
    if (user?.role === 'Engineer') return '/engineer';
    return '/user';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <MainNavbar />

      {/* Hero Carousel Section */}
      <section id="home" style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '90vh',
        minHeight: '600px',
        overflow: 'hidden',
        scrollMarginTop: '100px',
        padding: 0,
        margin: 0
      }}>
        {slides.map((slide, index) => (
          <div key={`slide-${index}`} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100%',
            opacity: currentSlide === index ? 1 : 0,
            visibility: currentSlide === index ? 'visible' : 'hidden',
            transition: 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out',
            zIndex: currentSlide === index ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* Full-width Image Background */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)',
              transition: 'transform 6s ease-out',
              zIndex: -2
            }} />
            
            {/* Dark aesthetic overlay for solid readability */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.8) 100%)',
              backdropFilter: 'blur(3px)',
              zIndex: -1
            }} />

            {/* Centered Text Content Block */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '2rem',
              maxWidth: '900px',
              animation: currentSlide === index ? 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
            }}>
              <h1 style={{
                fontSize: '4rem',
                fontWeight: 700,
                background: 'linear-gradient(to right, #00d2ff, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1.5rem',
                lineHeight: 1.1,
                filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.8))'
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: '1.4rem',
                color: '#f8fafc',
                maxWidth: '750px',
                margin: '0 auto 3rem auto',
                lineHeight: 1.6,
                textShadow: '0 4px 12px rgba(0,0,0,0.8)'
              }}>
                {slide.description}
              </p>
              <Link to={user ? getDashboardLink() : "/login"} className="btn btn-primary" style={{
                fontSize: '1.2rem',
                padding: '16px 48px',
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 210, 255, 0.4)'
              }}>
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </div>
          </div>
        ))}

        {/* Carousel Indicators placed at the bottom bounds of the section */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 10
        }}>
          {slides.map((_, index) => (
            <div
              key={`ind-${index}`}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '45px' : '15px',
                height: '6px',
                borderRadius: '6px',
                background: currentSlide === index ? '#00d2ff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                boxShadow: currentSlide === index ? '0 0 10px #00d2ff' : 'none'
              }}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: '6rem 2rem',
        background: 'var(--card-bg)',
        borderTop: '1px solid var(--border-light)',
        textAlign: 'center',
        scrollMarginTop: '100px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '1.5rem'
          }}>About Us</h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.8,
            marginBottom: '4rem',
            maxWidth: '800px',
            margin: '0 auto 4rem auto'
          }}>
            AquaSafe is dedicated to preserving our most precious resource. Our intelligent system seamlessly monitors critical water parameters—such as TDS, Turbidity, and pH—providing real-time alerts and actionable insights to prevent contamination and protect communities.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱️</div>
              <h3 style={{ color: '#00d2ff', marginBottom: '1rem', fontSize: '1.6rem' }}>Real-time Alerts</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>Instant notifications when water quality drops below safe levels, enabling rapid response.</p>
            </div>
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ color: '#00d2ff', marginBottom: '1rem', fontSize: '1.6rem' }}>High Accuracy</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>Precision sensors ensure reliable data collection around the clock in every condition.</p>
            </div>
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ color: '#00d2ff', marginBottom: '1rem', fontSize: '1.6rem' }}>Smart Analytics</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>Advanced dashboards and automated workflow to streamline monitoring and maintenance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-light)',
        background: 'var(--sidebar-bg)',
        color: 'var(--text-muted)'
      }}>
        &copy; {new Date().getFullYear()} AquaSafe. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPageWithNav;
