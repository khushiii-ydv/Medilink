import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
    const [currentStage, setCurrentStage] = useState(0);

    const stages = [
        { text: "Summoning Anime Energy...", color: "#FF3366" },
        { text: "Awakening Shinchan...", color: "#FFD700" },
        { text: "Configuring Doraemon Gadgets...", color: "#00E4FF" },
        { text: "StackerHQ Mode: Engaged.", color: "#8257E6" }
    ];

    useEffect(() => {
        if (currentStage < stages.length) {
            const timer = setTimeout(() => {
                setCurrentStage(prev => prev + 1);
            }, 1200); // 1.2 seconds per stage
            return () => clearTimeout(timer);
        } else {
            const finishTimer = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(finishTimer);
        }
    }, [currentStage, onComplete, stages.length]);

    return (
        <AnimatePresence>
            <motion.div
                key="intro-container"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#050505',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    overflow: 'hidden'
                }}
            >
                {/* Animated Background Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        width: '40vw',
                        height: '40vw',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${stages[Math.min(currentStage, stages.length - 1)].color} 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        opacity: 0.3,
                        zIndex: 0
                    }}
                />

                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AnimatePresence mode="wait">
                        {currentStage < stages.length && (
                            <motion.h1
                                key={currentStage}
                                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    color: stages[currentStage].color,
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    textShadow: `0 0 20px ${stages[currentStage].color}80`
                                }}
                            >
                                {stages[currentStage].text}
                            </motion.h1>
                        )}
                    </AnimatePresence>

                    {/* Progress Indicator */}
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '8px' }}>
                        {stages.map((_, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0.3, scale: 0.8 }}
                                animate={{
                                    opacity: idx <= currentStage ? 1 : 0.3,
                                    scale: idx === currentStage ? 1.2 : 1,
                                    backgroundColor: idx <= currentStage ? stages[idx].color : '#333'
                                }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    width: '40px',
                                    height: '4px',
                                    borderRadius: '2px',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IntroAnimation;
