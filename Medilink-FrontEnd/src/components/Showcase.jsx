import React from 'react';
import { motion } from 'framer-motion';

const Showcase = () => {
    return (
        <section style={{ padding: '6rem 5%', position: 'relative' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4rem'
            }}>

                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
                        Loved by Modern Teams
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        The power of custom software with the ease of a spreadsheet.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    style={{
                        width: '100%',
                        height: '600px',
                        borderRadius: '24px',
                        background: 'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.9) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 0 100px -20px rgba(0, 228, 255, 0.2)',
                        display: 'flex',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {/* Animated Glowing Orb inside the showcase to give it life */}
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '20%',
                            left: '30%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(0, 228, 255, 0.15) 0%, transparent 60%)',
                            filter: 'blur(50px)',
                            zIndex: 0
                        }}
                    />

                    {/* Sidebar Mock */}
                    <div style={{
                        width: '260px',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        padding: '2rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        zIndex: 1,
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ height: '32px', width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', marginBottom: '2rem' }} />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{ height: '24px', width: `${100 - (i * 10)}%`, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                        ))}
                    </div>

                    {/* Main Content Mock */}
                    <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 1 }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ height: '40px', width: '30%', background: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                            <div style={{ height: '40px', width: '120px', background: 'var(--accent-primary)', borderRadius: '8px', opacity: 0.8 }} />
                        </div>

                        {/* Data Grid Mock */}
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', padding: '0 1rem', alignItems: 'center', gap: '1rem' }}>
                                {[1, 2, 3, 4].map(i => <div key={i} style={{ height: '16px', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />)}
                            </div>
                            {[1, 2, 3, 4, 5, 6].map((row, idx) => (
                                <div key={idx} style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', padding: '0 1rem', alignItems: 'center', gap: '1rem' }}>
                                    {[1, 2, 3, 4].map((col, i) => (
                                        <motion.div
                                            key={`${row}-${col}`}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: (idx * 0.1) + (i * 0.05) }}
                                            style={{ height: '12px', flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Showcase;
