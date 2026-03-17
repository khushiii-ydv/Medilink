import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Layers } from 'lucide-react';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 5%',
            overflow: 'hidden',
        }}>
            {/* Background Grid Pattern is handled globally in index.css (.bg-grid) */}
            <div className="bg-grid"></div>

            {/* Decorative Glow Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '30vw',
                height: '30vw',
                background: 'radial-gradient(circle at center, rgba(130,87,230,0.15) 0%, transparent 60%)',
                filter: 'blur(40px)',
                zIndex: -1
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ textAlign: 'center', zIndex: 1, maxWidth: '800px' }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--card-border)',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(10px)',
                        color: 'var(--accent-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                    }}
                >
                    <Zap size={16} color="var(--accent-secondary)" />
                    <span>Anime-Powered App Builder</span>
                </motion.div>

                <h1 style={{
                    fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                }}>
                    Build Internal Tools <br />
                    <span className="text-gradient">Without Writing Code.</span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    margin: '0 auto 3rem auto',
                    lineHeight: '1.6',
                }}>
                    Turn your spreadsheets and databases into stunning, fully functional applications in minutes. Channel your inner Doraemon and pull powerful tools right out of your pocket.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(130, 87, 230, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="hover-target"
                        style={{
                            padding: '16px 32px',
                            borderRadius: '12px',
                            background: 'var(--text-main)',
                            color: 'var(--bg-color)',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        Start Building Free <ArrowRight size={20} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        className="hover-target"
                        style={{
                            padding: '16px 32px',
                            borderRadius: '12px',
                            background: 'transparent',
                            color: 'var(--text-main)',
                            border: '1px solid var(--card-border)',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Layers size={20} /> Let's Explore
                    </motion.button>
                </div>
            </motion.div>

            {/* Floating 3D mock window simulation */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{
                    marginTop: '6rem',
                    width: '100%',
                    maxWidth: '1000px',
                    height: '400px',
                    perspective: '1000px',
                    zIndex: 1
                }}
            >
                <div className="glass-panel" style={{
                    height: '100%',
                    width: '100%',
                    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.05), transparent)',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Mock Browser Header */}
                    <div style={{
                        height: '40px',
                        borderBottom: '1px solid var(--card-border)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F56' }}></div>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }}></div>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27C93F' }}></div>
                    </div>
                    {/* Mock Dashboard Body */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        padding: '2rem',
                        gap: '2rem'
                    }}>
                        <div style={{ width: '20%', height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }} />
                            <div style={{ width: '100%', flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
