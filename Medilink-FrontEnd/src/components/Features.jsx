import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layout, RefreshCw, Lock, Smartphone, Webhook } from 'lucide-react';

const featureData = [
    { icon: <Database size={24} />, title: 'Connect Your Data', desc: 'Securely link Postgres, MySQL, Airtable, or any REST API in one click.' },
    { icon: <Layout size={24} />, title: 'Drag & Drop UI', desc: 'Build stunning interfaces faster than drawing them. Pixel-perfect components included.' },
    { icon: <RefreshCw size={24} />, title: 'Real-time Sync', desc: 'Your data syncs instantly across all connected clients and databases.' },
    { icon: <Lock size={24} />, title: 'Enterprise Security', desc: 'Granular permissions, SSO, and bank-grade encryption out of the box.' },
    { icon: <Smartphone size={24} />, title: 'Responsive Design', desc: 'Apps automatically adapt to mobile, tablet, and desktop screens.' },
    { icon: <Webhook size={24} />, title: 'Custom Workflows', desc: 'Automate business logic with our visual node-based workflow builder.' }
];

const Features = () => {
    return (
        <section style={{
            padding: '8rem 5%',
            position: 'relative',
            zIndex: 1
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
                        Everything You Need to <br />
                        <span className="text-gradient">Ship Faster</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        A complete platform built for speed, without compromising on power or flexibility.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {featureData.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(130,87,230,0.3)' }}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                border: '1px solid var(--card-border)',
                                transition: 'border-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(130,87,230,0.5)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'rgba(130,87,230,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-primary)',
                                marginBottom: '0.5rem'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
