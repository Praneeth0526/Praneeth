'use client'

import { useState } from 'react'
import Galaxy from '../components/Galaxy'
import { FiArrowLeft, FiSend, FiCheckCircle } from 'react-icons/fi'
import Link from 'next/link'
import SpecularButton from '../components/SpecularButton'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  const inputStyle = (id: string) => ({
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.02)',
    border: focused === id ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    color: '#e2e8f0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
    boxShadow: focused === id ? '0 0 0 4px rgba(255,255,255,0.02)' : 'none'
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', backgroundColor: '#121212', fontFamily: '"Inter", sans-serif' }}>
      <Galaxy 
        mouseRepulsion={false} mouseInteraction={false} density={0.5}
        glowIntensity={0.2} saturation={0.5} hueShift={240} transparent={true}
        style={{ zIndex: -1, position: 'fixed', inset: 0, pointerEvents: 'none' }}
      />
      
      <div style={{ 
        maxWidth: '900px', width: '100%', 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px',
        background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(32px)', 
        padding: '56px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.06)', 
        boxShadow: '0 24px 64px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)' 
      }}>
        
        {/* Left Column: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#888', textDecoration: 'none', marginBottom: '32px', fontSize: '14px', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
              <FiArrowLeft /> Back to Home
            </Link>
            
            <h1 style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: '48px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 16px 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Let's build<br />something great.
            </h1>
            <p style={{ color: '#888', fontSize: '16px', lineHeight: 1.6, maxWidth: '90%' }}>
              I'm actively looking for new opportunities and collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
          </div>
          
          <div style={{ marginTop: '48px' }}>
            <p style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '8px' }}>Direct Contact</p>
            <a href="mailto:connect.praneeth@proton.me" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '16px', fontWeight: 500 }}>connect.praneeth@proton.me</a>
          </div>
        </div>
        
        {/* Right Column: Form */}
        <div>
          {status === 'success' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '24px', color: '#4ade80', textAlign: 'center' }}>
              <FiCheckCircle size={48} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>Message Sent!</h3>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Thanks for reaching out. I'll get back to you as soon as possible.</p>
              <button onClick={() => setStatus('idle')} style={{ marginTop: '24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: '99px', cursor: 'pointer' }}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <input 
                  required type="text" placeholder="Your Name"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  style={inputStyle('name')} 
                />
              </div>
              <div>
                <input 
                  required type="email" placeholder="Email Address"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  style={inputStyle('email')} 
                />
              </div>
              <div>
                <textarea 
                  required rows={5} placeholder="Your Message"
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} 
                  onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                  style={{...inputStyle('message'), resize: 'vertical'}} 
                />
              </div>
              <SpecularButton 
                as="button"
                type="submit" disabled={status === 'loading'} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', 
                  fontSize: '15px', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', 
                  marginTop: '8px',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                  width: '100%'
                }}
              >
                {status === 'loading' ? 'Sending...' : <><FiSend /> Send Message</>}
              </SpecularButton>
              {status === 'error' && <p style={{ color: '#f87171', fontSize: '14px', textAlign: 'center', margin: 0 }}>Failed to send message. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
