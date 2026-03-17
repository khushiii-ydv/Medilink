import { Link } from 'react-router-dom';
import { 
  Activity, Bed, HeartPulse, Ambulance, Shield, MapPin, 
  ArrowRight, Zap, Users, Building2, Phone, Clock, 
  CheckCircle2, Star, ChevronRight
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './Landing.css';

function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(end * eased));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero animated-gradient">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="container hero-content">
          <div className="hero-badge fade-in">
            <Zap size={14} />
            <span>India's #1 Healthcare Coordination Platform</span>
          </div>
          <h1 className="hero-title fade-in fade-in-delay-1">
            Smart Hospital<br />
            <span className="hero-gradient-text">Resource Network</span>
          </h1>
          <p className="hero-subtitle fade-in fade-in-delay-2">
            Real-time coordination between hospitals, ambulances, and patients.
            Find beds, ventilators, blood banks, and specialists instantly.
          </p>
          <div className="hero-cta fade-in fade-in-delay-3">
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-get-started">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn hero-btn-outline btn-lg" id="hero-sign-in">
              Sign In <ChevronRight size={18} />
            </Link>
          </div>
          <div className="hero-stats fade-in fade-in-delay-4">
            <div className="hero-stat">
              <span className="hero-stat-value"><Counter end={500} suffix="+" /></span>
              <span className="hero-stat-label">Hospitals</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value"><Counter end={2000} suffix="+" /></span>
              <span className="hero-stat-label">Ambulances</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value"><Counter end={50} suffix="K+" /></span>
              <span className="hero-stat-label">Patients Served</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value"><Counter end={24} suffix="/7" /></span>
              <span className="hero-stat-label">Emergency Support</span>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L48 54C96 48 192 36 288 36C384 36 480 48 576 54C672 60 768 60 864 54C960 48 1056 36 1152 30C1248 24 1344 24 1392 24L1440 24V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z" fill="var(--bg-primary)"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need for<br /><span className="text-primary">Emergency Healthcare</span></h2>
            <p className="section-subtitle">Comprehensive tools for hospitals, ambulances, and patients to coordinate healthcare resources in real-time</p>
          </div>
          <div className="features-grid">
            {[
              { icon: Bed, title: 'Live Bed Tracking', desc: 'Real-time visibility of ICU, general, and specialty beds across all hospitals', color: 'primary' },
              { icon: HeartPulse, title: 'Ventilator & Oxygen', desc: 'Monitor ventilator counts and oxygen supply levels across the network', color: 'danger' },
              { icon: Ambulance, title: 'Ambulance GPS', desc: 'Track ambulance locations in real-time for faster emergency response', color: 'warning' },
              { icon: Shield, title: 'Blood Bank Network', desc: 'Search blood availability by type across all hospitals instantly', color: 'info' },
              { icon: Building2, title: 'Hospital Transfer', desc: 'Seamless patient transfer coordination between hospitals', color: 'success' },
              { icon: Users, title: 'Specialist Finder', desc: 'Locate available specialist doctors across the healthcare network', color: 'primary' },
              { icon: MapPin, title: 'Location Integration', desc: 'Interactive maps showing hospitals, ambulances and resources near you', color: 'warning' },
              { icon: Clock, title: '24/7 Response', desc: 'Round-the-clock emergency management with instant notifications', color: 'danger' },
            ].map((feature, i) => (
              <div key={i} className={`feature-card fade-in fade-in-delay-${(i % 4) + 1}`}>
                <div className={`feature-icon feature-icon-${feature.color}`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Process</span>
            <h2 className="section-title">How MediLink <span className="text-primary">Works</span></h2>
            <p className="section-subtitle">Three simple steps to access the entire healthcare network</p>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', title: 'Register', desc: 'Create your account as a Hospital, Ambulance Service, or Patient. Quick and free.', icon: Users },
              { step: '02', title: 'Search & Connect', desc: 'Search hospitals by resources, find ambulances nearby, or manage your healthcare facility.', icon: MapPin },
              { step: '03', title: 'Coordinate', desc: 'Send requests, manage transfers, update resources, and coordinate in real-time.', icon: Activity },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.step}</div>
                <div className="step-icon-wrap">
                  <s.icon size={28} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 2 && <div className="step-connector"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="section roles-section" id="roles">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Dashboards</span>
            <h2 className="section-title">Built for <span className="text-primary">Every Role</span></h2>
            <p className="section-subtitle">Specialized dashboards with features tailored to each user type</p>
          </div>
          <div className="roles-grid">
            <div className="role-card role-hospital">
              <div className="role-card-gradient" />
              <div className="role-icon"><Building2 size={32} /></div>
              <h3>Hospital Dashboard</h3>
              <p>Manage beds, ICU, ventilators, blood bank, equipment, and specialist availability in real-time</p>
              <ul className="role-features">
                <li><CheckCircle2 size={16} /> Resource Management</li>
                <li><CheckCircle2 size={16} /> Hospital-to-Hospital Requests</li>
                <li><CheckCircle2 size={16} /> Patient Admission Control</li>
                <li><CheckCircle2 size={16} /> Ambulance Fleet Management</li>
              </ul>
              <Link to="/register?role=hospital" className="btn btn-primary" id="role-hospital-btn">
                Register Hospital <ArrowRight size={16} />
              </Link>
            </div>

            <div className="role-card role-ambulance">
              <div className="role-card-gradient" />
              <div className="role-icon"><Ambulance size={32} /></div>
              <h3>Ambulance Dashboard</h3>
              <p>Real-time GPS tracking, emergency request management, and dispatch coordination</p>
              <ul className="role-features">
                <li><CheckCircle2 size={16} /> Status Management</li>
                <li><CheckCircle2 size={16} /> Live GPS Tracking</li>
                <li><CheckCircle2 size={16} /> Emergency Requests</li>
                <li><CheckCircle2 size={16} /> Hospital Integration</li>
              </ul>
              <Link to="/register?role=ambulance" className="btn btn-primary" id="role-ambulance-btn">
                Register Ambulance <ArrowRight size={16} />
              </Link>
            </div>

            <div className="role-card role-patient">
              <div className="role-card-gradient" />
              <div className="role-icon"><Users size={32} /></div>
              <h3>Patient Dashboard</h3>
              <p>Search hospitals, filter by resources, request admissions, and find ambulances nearby</p>
              <ul className="role-features">
                <li><CheckCircle2 size={16} /> Hospital Search & Filter</li>
                <li><CheckCircle2 size={16} /> Admission Requests</li>
                <li><CheckCircle2 size={16} /> Ambulance Booking</li>
                <li><CheckCircle2 size={16} /> Google Maps Integration</li>
              </ul>
              <Link to="/register?role=patient" className="btn btn-primary" id="role-patient-btn">
                Register as Patient <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section animated-gradient">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: 8, label: 'Partner Hospitals', suffix: '+', icon: Building2 },
              { value: 10, label: 'Active Ambulances', suffix: '+', icon: Ambulance },
              { value: 15000, label: 'Beds Monitored', suffix: '+', icon: Bed },
              { value: 99.9, label: 'Uptime (%)', suffix: '%', icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="big-stat">
                <stat.icon size={28} className="big-stat-icon" />
                <p className="big-stat-value"><Counter end={stat.value} suffix={stat.suffix} /></p>
                <p className="big-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">Trusted by <span className="text-primary">Healthcare Leaders</span></h2>
          </div>
          <div className="testimonials-grid">
            {[
              { name: 'Dr. Rajesh Kumar', role: 'Director, Apollo Hospital', text: 'MediLink has revolutionized how we coordinate patient transfers. What used to take hours now happens in minutes.' },
              { name: 'Sanjay Mehta', role: 'Head, Emergency Services', text: 'The real-time ambulance tracking has saved countless lives. Dispatching the nearest ambulance is now effortless.' },
              { name: 'Priya Sharma', role: 'Patient', text: 'Finding a hospital with available ICU beds during an emergency was a nightmare before MediLink. Now it takes seconds.' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="var(--warning)" color="var(--warning)" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Transform Healthcare Coordination?</h2>
            <p>Join the MediLink network and ensure every patient gets the care they need, when they need it.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-register">
                Start Free Today <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg" id="cta-login">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo">
                <div className="logo-icon"><Activity size={24} /></div>
                <span className="logo-text" style={{ color: 'white' }}>Medi<span className="logo-highlight">Link</span></span>
              </div>
              <p className="footer-desc">India's first real-time healthcare coordination platform connecting hospitals, ambulances, and patients.</p>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#roles">Dashboards</a>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className="footer-links">
              <h4>Emergency</h4>
              <div className="footer-emergency">
                <Phone size={16} />
                <span>102 - Ambulance</span>
              </div>
              <div className="footer-emergency">
                <Phone size={16} />
                <span>108 - Emergency</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 MediLink. All rights reserved. Made with ❤️ for healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
