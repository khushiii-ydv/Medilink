import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '4rem 5%',
            borderTop: '1px solid var(--card-border)',
            background: 'rgba(0,0,0,0.5)',
            marginTop: '4rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '2rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: '1 1 250px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        Stacker<span className="text-gradient">HQ</span> Clone
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        The anime-powered internal tool builder. <br />
                        Unleash your inner creativity.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ color: 'var(--text-main)', fontWeight: 600 }}>Product</h4>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="hover-target">Builder</a>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="hover-target">Templates</a>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="hover-target">Integrations</a>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ color: 'var(--text-main)', fontWeight: 600 }}>Company</h4>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="hover-target">About Us</a>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="hover-target">Careers</a>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="hover-target">Contact</a>
                    </div>
                </div>
            </div>
            <div style={{
                marginTop: '4rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--card-border)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem'
            }}>
                © {new Date().getFullYear()} StackerHQ Clone. Built with Anime Energy.
            </div>
        </footer>
    );
};

export default Footer;
