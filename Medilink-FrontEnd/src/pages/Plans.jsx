import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Shield, Activity, Users, Building2, Server } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Plans() {
  const { user } = useAuth();
  
  const handleUpgrade = (plan) => {
    toast.success(`Redirecting to payment for ${plan} plan...`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>Choose Subscriptions Plan</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
          Scale your hospital's emergency response capabilities with our platform tiers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'stretch' }}>
        
        {/* Basic Plan */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Basic Plan</h2>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹15,000<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}> /year</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Access to hospital dashboard</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Resource availability updates</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Patient admission management</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Basic analytics (Last 30 days)</div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: 14, fontSize: '1.05rem' }}
            onClick={() => handleUpgrade('Basic')}
          >
            Select Basic
          </button>
        </div>

        {/* Professional Plan */}
        <div className="card" style={{ 
          display: 'flex', flexDirection: 'column', 
          border: '2px solid var(--primary-500)', 
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
          position: 'relative',
          transform: 'scale(1.03)',
          zIndex: 10
        }}>
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-500)', color: 'white', padding: '4px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Recommended
          </div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--primary-500)' }}>Professional Plan</h2>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹45,000<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}> /year</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> <strong>Everything in Basic</strong></div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Real-time network visibility</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Live Ambulance GPS Tracking</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Inter-hospital bed/oxygen requests</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Advanced AI Resource Prediction</div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: 14, fontSize: '1.05rem', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
            onClick={() => handleUpgrade('Professional')}
          >
            Upgrade to Professional
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Enterprise Plan</h2>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>Custom</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> <strong>Everything in Professional</strong></div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Fully white-labeled platform app</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Dedicated Admin coordination support</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Custom API integrations</div>
            <div style={{ display: 'flex', gap: 12 }}><CheckCircle2 className="text-primary" size={20} /> Unlimited staff accounts</div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: 14, fontSize: '1.05rem' }}
            onClick={() => handleUpgrade('Enterprise')}
          >
            Contact Sales
          </button>
        </div>

      </div>
    </div>
  );
}
