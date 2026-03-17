import { useEffect, useRef, useState } from 'react';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, total, color = 'primary', trend, suffix = '', animate = true }) {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!animate) { setDisplayValue(value); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(start + (value - start) * eased));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [value, animate]);

  const percentage = total ? Math.round((value / total) * 100) : null;

  return (
    <div className={`stat-card stat-card-${color}`} ref={cardRef}>
      <div className="stat-card-header">
        <div className={`stat-card-icon stat-icon-${color}`}>
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <p className="stat-value">{displayValue}{suffix}</p>
        <p className="stat-label">{label}</p>
      </div>
      {total && (
        <div className="stat-progress">
          <div className="stat-progress-bar">
            <div className={`stat-progress-fill fill-${color}`} style={{ width: `${percentage}%` }} />
          </div>
          <span className="stat-progress-text">{percentage}% of {total}</span>
        </div>
      )}
    </div>
  );
}
