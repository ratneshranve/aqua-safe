import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';

import aquasafeLogo from '../aquasafe-logo.png';
import heroBg from './assets/hero_bg.png';
import card1 from './assets/card1.png';
import card2 from './assets/card2.png';
import card3 from './assets/card3.png';
import heroVideo from './assets/fbabd4ea1324a4f9eeddb8289f792ab6_720w.mp4';

export const MainNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = React.useContext(AuthContext);
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (user?.role === 'Admin') return '/admin';
    if (user?.role === 'Engineer') return '/engineer';
    return '/user';
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isScrolled ? '0.8rem 2rem' : '1.2rem 2rem',
      background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(15px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => handleNavClick(e, 'home')}>
        <img src={aquasafeLogo} alt="AquaSafe" style={{ height: '32px', filter: isScrolled ? 'none' : 'brightness(0) invert(1)' }} />
      </div>
      
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {['home', 'about', 'business', 'notice'].map((item) => (
          <a 
            key={item}
            href={`#${item}`} 
            onClick={(e) => handleNavClick(e, item)} 
            style={{ 
              color: isScrolled ? '#1a1a1a' : '#fff', 
              textDecoration: 'none', 
              fontWeight: 500, 
              fontSize: '0.85rem', 
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.3s' 
            }}
          >
            {item === 'home' ? 'Home' : item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ')}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={toggleTheme} style={{ 
          background: 'transparent', 
          border: `1px solid ${isScrolled ? '#ddd' : 'rgba(255,255,255,0.2)'}`, 
          borderRadius: '50%', 
          width: '32px', 
          height: '32px', 
          cursor: 'pointer', 
          color: isScrolled ? '#1a1a1a' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem'
        }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <Link to="/login" style={{ 
            padding: '6px 20px', 
            borderRadius: '20px',
            background: '#004aad',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>Login</Link>
        ) : (
          <Link to="/login" style={{ 
            padding: '6px 20px', 
            borderRadius: '20px',
            background: isScrolled ? '#004aad' : '#fff',
            color: isScrolled ? '#fff' : '#004aad',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'all 0.3s'
          }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const LandingPage = () => {
  const { user } = React.useContext(AuthContext);

  const getDashboardLink = () => {
    if (user?.role === 'Admin') return '/admin';
    if (user?.role === 'Engineer') return '/engineer';
    return '/user';
  };

  return (
    <div style={{ background: '#fff', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.8);
          font-size: clamp(4rem, 10vw, 9rem);
          font-weight: 900;
          letter-spacing: 12px;
          line-height: 1;
          text-align: center;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }
        
        .business-card {
          width: 360px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
        }
        
        .business-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        
        .info-box {
          flex: 1;
          padding: 2.5rem;
          border-radius: 20px;
          color: #fff;
          position: relative;
          overflow: hidden;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: all 0.3s ease;
        }
        
        .info-box:hover {
          transform: scale(1.02);
        }
        
        .notice-item {
          display: flex;
          justify-content: space-between;
          padding: 1.2rem 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .notice-item:hover {
          padding-left: 10px;
        }
        
        .notice-item:hover h4 {
          color: #004aad;
        }

        .btn-compact {
          padding: 12px 36px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: inline-block;
          text-decoration: none;
        }
      `}</style>

      <MainNavbar />

      {/* Hero Section */}
      <section id="home" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        background: '#001428' // Fallback dark background
      }}>
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            objectFit: 'cover',
            opacity: 0.65,
            filter: 'blur(3px)'
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0, 20, 40, 0.4), rgba(0, 20, 40, 0.7))',
          zIndex: 2
        }} />

        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          animation: 'fadeIn 1s ease-out',
          marginTop: '8vh' // Pushing content lower
        }}>
          <div style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            letterSpacing: '8px', 
            marginBottom: '0.8rem', 
            opacity: 0.8,
            color: '#fff'
          }}>WATER INTELLIGENCE</div>
          
          <h1 style={{
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 0.9,
            margin: '0 auto',
            color: '#fff',
            textShadow: '0 0 30px rgba(0,212,255,0.3)',
            fontFamily: "'Inter', sans-serif"
          }}>
            <span style={{ color: '#00d4ff' }}>AQUA</span>
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #fff' }}>SAFE</span>
          </h1>

          <div style={{ 
            fontSize: '1.1rem', 
            marginTop: '1.5rem', 
            maxWidth: '600px', 
            margin: '1.5rem auto 0', 
            fontWeight: 400, 
            lineHeight: 1.5, 
            opacity: 0.85,
            letterSpacing: '0.5px'
          }}>
            An intelligent platform for continuous, real-time tracking of water purity to ensure community safety.
          </div>
          
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/login" className="btn-compact" style={{
              background: '#fff',
              color: '#004aad',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              padding: '10px 32px'
            }}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Droplet Decoration */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          width: '50px',
          height: '50px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'fadeIn 1.5s ease-out'
        }}>
          <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%', transform: 'rotate(45deg)' }}></div>
        </div>
      </section>

      {/* Water Safety Section */}
      <section id="business" style={{ padding: '6rem 2rem', position: 'relative', background: '#fef7e2' }}>
        <div style={{ position: 'absolute', top: '-60px', left: 0, right: 0, height: '60px', background: '#fef7e2', borderRadius: '60px 60px 0 0' }}></div>
        
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ width: '280px' }}>
            <div style={{ color: '#004aad', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>CORE SERVICES</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-1px' }}>Safe Water</h2>
            <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Simple steps to protect your home from water contamination and ensure every drop is safe for your family.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '2rem' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>←</button>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>→</button>
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            background: '#222', 
            padding: '2rem 1.5rem', 
            borderRadius: '30px 0 0 30px',
            display: 'flex',
            gap: '1rem',
            marginLeft: 'auto'
          }}>
            {[
              { id: '01', title: 'Contamination Alert', tag: 'Detecting dirty tap water', img: card1 },
              { id: '02', title: 'Home Purification', tag: 'Protecting your storage', img: card2 },
              { id: '03', title: 'Real-time Testing', tag: 'Ensuring family health', img: card3 }
            ].map((item, idx) => (
              <div key={idx} style={{ 
                flex: 1, 
                background: '#fff', 
                borderRadius: '10px', 
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}>
                <div style={{ height: '140px', background: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ color: '#004aad', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>Step. {item.id}</div>
                  <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.3rem' }}>{item.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Boxes Section */}
      <section style={{ padding: '0 2rem 7rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ 
            flex: 1, 
            background: `linear-gradient(rgba(0,30,60,0.7), rgba(0,30,60,0.7)), url(${card3})`, 
            backgroundSize: 'cover',
            padding: '2.5rem',
            borderRadius: '12px',
            display: 'flex',
            gap: '1.5rem',
            color: '#fff',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>💧</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Underground Water</h3>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>Water contamination story</div>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Ensuring the purity of vital deep-water resources.</p>
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            background: '#004aad',
            padding: '2.5rem',
            borderRadius: '12px',
            display: 'flex',
            gap: '1.5rem',
            color: '#fff',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>⚙️</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Service Status</h3>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>Technology & Service</div>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Check our latest technical support and services.</p>
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            background: '#002e6d',
            padding: '2.5rem',
            borderRadius: '12px',
            display: 'flex',
            gap: '1.5rem',
            color: '#fff',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>📊</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Reference Room</h3>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>Reports & Data</div>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Directly access detailed safety analysis reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry & CS Section */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5%',
        background: '#002b5c', 
        backgroundImage: `linear-gradient(rgba(0,43,92,0.88), rgba(0,43,92,0.88)), url(${heroBg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        position: 'relative',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ display: 'flex', gap: '3rem', maxWidth: '1000px', margin: '0 auto', alignItems: 'center', width: '100%' }}>
          {/* Inquiry Form Box */}
          <div style={{ 
            flex: 1, 
            background: 'rgba(34, 34, 34, 0.95)', 
            padding: '2rem 2.2rem', 
            borderRadius: '12px 80px 12px 12px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: '#004aad', fontWeight: 800, fontSize: '0.65rem', marginBottom: '0.3rem', letterSpacing: '1.5px' }}>ONLINE INQUIRY</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1px', color: '#fff' }}>Inquiry</h2>
            
            <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.2rem', fontWeight: 600 }}>NAME</div>
                <input type="text" style={{ background: 'transparent', border: 'none', width: '100%', color: '#fff', outline: 'none', fontSize: '0.85rem' }} />
              </div>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.2rem', fontWeight: 600 }}>CONTACT</div>
                <input type="text" style={{ background: 'transparent', border: 'none', width: '100%', color: '#fff', outline: 'none', fontSize: '0.85rem' }} />
              </div>
              <div style={{ gridColumn: 'span 2', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.2rem', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <input type="email" style={{ background: 'transparent', border: 'none', width: '100%', color: '#fff', outline: 'none', fontSize: '0.85rem' }} />
              </div>
              <div style={{ gridColumn: 'span 2', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.2rem', fontWeight: 600 }}>MESSAGE</div>
                <textarea style={{ background: 'transparent', border: 'none', width: '100%', color: '#fff', outline: 'none', minHeight: '40px', fontSize: '0.85rem', resize: 'none' }}></textarea>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <label style={{ color: '#666', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" style={{ marginRight: '6px' }} /> I agree to the privacy policy
                </label>
                <button type="submit" style={{ background: '#004aad', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '30px', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.5px' }}>SEND MESSAGE</button>
              </div>
            </form>
          </div>

          {/* CS Center Info */}
          <div style={{ flex: 0.9 }}>
            <div style={{ color: '#004aad', fontWeight: 800, fontSize: '0.65rem', marginBottom: '0.3rem', letterSpacing: '1.5px' }}>SUPPORT</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-1px' }}>CS Center</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)' }}>📞</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>043-224-8106</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)' }}>📠</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>043-224-8108</div>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, marginBottom: '0.4rem', color: '#004aad', letterSpacing: '1.2px' }}>OPERATION HOURS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem', opacity: 0.8 }}>Weekday: 09:00 - 18:00</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.8 }}>Saturday: 09:00 - 14:00</div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{ 
        padding: '5rem 2rem', 
        background: '#0e0e0e', 
        backgroundImage: 'linear-gradient(rgba(14,14,14,0.7), rgba(14,14,14,0.7)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000")', // A more luminous world/space map
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#aaa', 
        fontSize: '0.85rem', 
        borderTop: '1px solid #1a1a1a',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '3rem', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
            <div style={{ cursor: 'pointer', hover: { color: '#004aad' } }}>About Company</div>
            <div style={{ cursor: 'pointer' }}>Service Policy</div>
            <div style={{ cursor: 'pointer' }}>Privacy Policy</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem', alignItems: 'end' }}>
            <div style={{ lineHeight: '2.2' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <img src={aquasafeLogo} alt="AquaSafe" style={{ height: '35px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              </div>
              <strong style={{ color: '#fff', fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>AquaSafe Co., Ltd.</strong>
              CEO: John Doe | Business License: 123-45-67890<br />
              Address: 123 Water Street, Clean City, Science Park<br />
              TEL: 043-224-8106 | FAX: 043-224-8108 | Email: contact@aquasafe.com
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {['Facebook', 'LinkedIn', 'Twitter'].map(social => (
                  <div key={social} style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {social[0]}
                  </div>
                ))}
              </div>
              <div style={{ opacity: 0.4, letterSpacing: '0.5px', fontSize: '0.8rem' }}>
                &copy; {new Date().getFullYear()} AquaSafe. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

