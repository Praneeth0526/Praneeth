'use client';

import React, { useRef, useState } from 'react';

interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: any;
  href?: string;
  target?: string;
}

export default function SpecularButton({ children, as, href, target, className = '', style = {}, ...props }: SpecularButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const Component = as || (href ? 'a' : 'button');

  return (
    <Component
      ref={buttonRef}
      href={href}
      target={target}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`specular-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textDecoration: 'none',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        ...style
      }}
      {...props}
    >
      <div
        className="specular-highlight"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          opacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(80px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.25), transparent 100%)`,
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </div>
    </Component>
  );
}
