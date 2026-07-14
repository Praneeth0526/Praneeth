'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import {
  SiPython, SiC, SiGnubash, SiPytorch, SiLangchain, SiScikitlearn,
  SiFastapi, SiDjango, SiNodedotjs, SiReact, SiNextdotjs, SiTailwindcss,
  SiPostgresql, SiSupabase, SiDocker, SiGit, SiLinux, SiKubernetes,
  SiVercel, SiEspressif, SiArduino, SiFlutter, SiKaggle
} from 'react-icons/si'
import { FaJava, FaGithub, FaLinkedin, FaDownload } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { FiArrowRight, FiCopy, FiCheck, FiShare, FiExternalLink, FiMapPin } from 'react-icons/fi'
import Galaxy from './Galaxy'
import SideRays from './SideRays'
import SpecularButton from './SpecularButton'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ───────────────────────────────── */
export type DjangoData = {
  about: {
    name: string
    role: string
    bio: string
    resume_url: string | null
    profile_image?: string | null
  }
  projects: Array<{
    title: string
    description: string
    link: string
    tags: string[]
    image: string | null
  }>
  certificates: Array<{
    title: string
    date: string
    link: string
  }>
  skills: string[]
  experiences: Array<{
    title: string
    company: string
    date: string
    description: string
    isImage: boolean
    logo: string | null
    color: string
    iconSvg: string
    iconColor: string
  }>
}

/* ─── Components ──────────────────────────── */
export default function BentoGrid({ data }: { data: DjangoData }) {
  const [mounted, setMounted] = useState(false)
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const [activeBg, setActiveBg] = useState<'galaxy' | 'siderays'>('galaxy')
  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setActiveBg(prev => prev === 'galaxy' ? 'siderays' : 'galaxy')
    }, 10000)
    return () => clearInterval(interval)
  }, [mounted])

  const about = data?.about?.name ? data.about : {
    name: "Praneeth G",
    role: "Software Engineer & AI Builder",
    bio: "I build cross-platform mobile apps, integrate APIs, and craft data systems. Currently pursuing B.E in Computer Science & Engineering at VVCE (2023-2027).",
    resume_url: "#"
  }

  const projects = data?.projects?.length ? data.projects : [
    { title: "Object Search Engine", description: "Hybrid AI search", link: "#", tags: ["Python", "AI"], image: null },
    { title: "IoT Smart Home", description: "Edge processing", link: "#", tags: ["C++", "IoT"], image: null },
    { title: "Portfolio V2", description: "Next.js & Django", link: "#", tags: ["Next.js"], image: null },
    { title: "AI Chatbot", description: "RAG based assistant", link: "#", tags: ["LangChain"], image: null }
  ]

  // Auto-cycle projects every 8 seconds
  useEffect(() => {
    if (!mounted || projects.length <= 1) return
    const interval = setInterval(() => {
      setActiveProjectIdx(prev => (prev + 1) % projects.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [mounted, projects.length])

  // Filter certificates
  const targetCertTitles = [
    "Design of Embedded AI & IoT Systems – DigiToad Technologies & STMicroelectronics",
    "Artificial Intelligence for All (IUCEE)"
  ]
  const certificates = data?.certificates?.filter(c => targetCertTitles.includes(c.title)) || []
  const fallbackCerts = [
    { title: "Design of Embedded AI & IoT Systems – DigiToad Technologies & STMicroelectronics", date: "Sep 11, 2025", link: "#" },
    { title: "Artificial Intelligence for All (IUCEE)", date: "Sep 11, 2025", link: "#" }
  ]
  const displayCerts = certificates.length > 0 ? certificates : fallbackCerts

  const fallbackExperiences = [
    {
      title: "AIoT & Systems Engineering Intern",
      company: "Bloombuz Media Pvt Ltd",
      date: "Jan 2026 – Present",
      description: "Built cross-platform mobile apps using Flutter, integrated APIs and databases, and delivered features using Agile practices.",
      logo: "/images/app_icon.png",
      color: "", iconSvg: "", iconColor: ""
    },
    {
      title: "Project Intern",
      company: "Bloombuz Media Pvt Ltd",
      date: "Jan 2025 – Dec 2025",
      description: "Built cross-platform mobile apps using Flutter, integrated APIs and databases, and delivered features using Agile practices.",
      logo: "/images/app_icon.png",
      color: "", iconSvg: "", iconColor: ""
    },
    {
      title: "Web Developer",
      company: "Freelancer",
      date: "2025 – Present",
      description: "Developing scalable full-stack web applications for clients globally.",
      logo: null,
      color: "rgba(59, 130, 246, 0.15)",
      iconColor: "#60a5fa",
      iconSvg: ""
    }
  ]
  const experiences = data?.experiences?.length ? data.experiences : fallbackExperiences

  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText('https://praneeth-g.vercel.app')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Praneeth G - Portfolio',
          text: 'Check out my portfolio!',
          url: 'https://praneeth-g.vercel.app',
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      handleCopy();
    }
  }


  const memoizedGalaxy = useMemo(() => (
    <Galaxy 
      mouseRepulsion={false}
      mouseInteraction={false}
      density={0.15}
      starSpeed={0.2}
      glowIntensity={0.15}
      saturation={0.3}
      hueShift={240}
      transparent={true}
      style={{ zIndex: -1, position: 'fixed', inset: 0, pointerEvents: 'none' }}
    />
  ), []);

  const memoizedSideRays = useMemo(() => (
    <SideRays 
      speed={1.2}
      rayColor1="#e2e8f0"
      rayColor2="#10b981"
      intensity={1.2}
      spread={1.5}
      origin="top-right"
      tilt={-10}
      saturation={1.2}
      blend={0.5}
      falloff={1.5}
      opacity={0.3}
    />
  ), []);

  if (!mounted) return null // Prevent hydration mismatch

  const activeProject = projects[activeProjectIdx]

  return (
    <div className="app-container">
      {/* Alternating Backgrounds */}
      <AnimatePresence>
        {activeBg === 'galaxy' && (
          <motion.div key="galaxy" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            {memoizedGalaxy}
          </motion.div>
        )}
        {activeBg === 'siderays' && (
          <motion.div key="siderays" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            {memoizedSideRays}
          </motion.div>
        )}
      </AnimatePresence>
      

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-main: #121212;
          --card-bg: rgba(24, 24, 27, 0.45);
          --card-border: rgba(255, 255, 255, 0.05);
          --card-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.4);
          --text-primary: #e2e8f0;
          --text-secondary: #94a3b8;
          --accent: #ffffff;
          --font-brico: 'Bricolage Grotesque', sans-serif;
          --font-inter: 'Inter', sans-serif;
        }

        body {
          background-color: var(--bg-main);
          color: var(--text-primary);
          font-family: var(--font-inter);
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }

        .app-container {
          min-height: 100vh;
          padding: 48px 24px;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .bento-wrapper {
          width: 100%;
          max-width: 1120px;
          z-index: 1;
        }

        /* Top Bar */
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .profile-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .avatar-small {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--card-border);
        }

        .btn-glass {
          height: 40px;
          padding: 0 16px;
          border-radius: 99px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--card-border);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        
        .btn-glass:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        /* Bento Grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: minmax(140px, auto);
          gap: 16px;
        }

        .tile {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 32px;
          padding: 32px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: var(--card-shadow), inset 0 1px 0 rgba(255,255,255,0.04);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s ease;
        }

        .tile:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 24px 48px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }
        
        .tile-title {
          font-family: var(--font-brico);
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }
        
        .tile-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Social Icons */
        .social-link {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          display: grid;
          place-items: center;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .social-link:hover {
          background: rgba(255,255,255,0.1);
          color: var(--text-primary);
          transform: scale(1.05);
        }

        /* Tech Stack */
        .tech-category {
          margin-bottom: 0px;
        }
        .tech-category-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          margin-bottom: 6px;
          font-weight: 600;
        }
        .tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tech-chip {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          display: grid;
          place-items: center;
          color: var(--text-secondary);
          font-size: 16px;
          transition: all 0.2s ease;
        }
        .tech-chip:hover {
          background: rgba(255,255,255,0.08);
          color: var(--text-primary);
          border-color: rgba(255,255,255,0.15);
        }

        /* Project Slider */
        .project-slide-enter {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Call to Action */
        .cta-tile {
          background: linear-gradient(145deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.8) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cta-button {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.1);
          height: 48px;
          padding: 0 24px;
          border-radius: 99px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          margin-top: 16px;
          transition: transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease;
          width: max-content;
        }
        .cta-button:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .btn-resume {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
        }


        /* Responsive */
        @media (max-width: 1024px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .col-span-2 { grid-column: span 2 !important; }
        }
        @media (max-width: 640px) {
          .bento-grid { grid-template-columns: 1fr; }
          .col-span-2, .row-span-2 { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
      `}} />

      <div className="bento-wrapper">
        
        {/* Top Bar */}
        <header className="topbar">
          <div className="profile-badge">
            <div className="avatar-small" style={{
              backgroundImage: `url('${about.profile_image || "/images/app_icon.png"}')`,
              backgroundSize: 'cover', backgroundPosition: 'top'
            }}></div>
            <span style={{ fontSize: '15px', fontWeight: 500 }}>{about.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-glass" onClick={handleCopy}>
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <button className="btn-glass" style={{ padding: '0 12px' }} onClick={handleShare}>
              <FiShare />
            </button>
          </div>
        </header>

        {/* Grid (4 columns) */}
        {/* 
          Row 1-2: Profile (2x2), Tech Stack (2x2)
          Row 3-4: Experiences (2x2), Projects (2x2)
          Row 5: Education (1x1), Certifications (1x1), Contact CTA (2x1) 
        */}
        <div className="bento-grid">
          
          {/* Profile (2x2) */}
          <div className="tile col-span-2 row-span-2" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
            <div style={{ 
              width: '160px', height: '160px', borderRadius: '50%', marginBottom: '24px',
              border: '2px solid rgba(255,255,255,0.1)',
              backgroundImage: `url('${about.profile_image || "/images/app_icon.png"}')`,
              backgroundSize: 'cover', backgroundPosition: 'top'
            }}></div>

            <h1 className="tile-title" style={{ fontSize: '32px', marginBottom: '12px' }}>
              Hi, I'm Praneeth
            </h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.04)' }}>
              <FiMapPin size={12} /> MYS ⇄ BLR
            </div>
            <p className="tile-desc" style={{ fontSize: '16px', maxWidth: '90%' }}>
              I build cross-platform mobile apps, integrate APIs, and craft data systems. 
              Always focusing on elegant solutions to complex problems.
            </p>

            {/* Achievements */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 600 }}>Achievements & Experience</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {/* HPE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                    <img src="/images/HPE.png" alt="HPE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>HPE CPP 2026</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Selected Candidate</div>
                  </div>
                </div>

                {/* SIH */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                    <img src="/images/SIH2.webp" alt="SIH" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Smart India Hackathon</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Finalist</div>
                  </div>
                </div>

                {/* Bloombuz */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                    <img src="/images/app_icon.png" alt="Bloombuz" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Bloombuz Media</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AIoT Intern</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="mailto:connect.praneeth@proton.me" target="_blank" className="social-link"><HiOutlineMail size={20} /></a>
                <a href="https://www.linkedin.com/in/praneeth--g/" target="_blank" className="social-link"><FaLinkedin size={18} /></a>
                <a href="https://github.com/Praneeth0526" target="_blank" className="social-link"><FaGithub size={18} /></a>
                <a href="https://kaggle.com/" target="_blank" className="social-link"><SiKaggle size={18} /></a>
              </div>
              <SpecularButton href={about.resume_url || "#"} target="_blank" className="btn-resume">
                <FaDownload size={12} /> Resume
              </SpecularButton>
            </div>
          </div>

          {/* Tech Stack (2x2) */}
          <div className="tile col-span-2 row-span-2" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
            <h2 className="tile-title" style={{ marginBottom: '16px' }}>Tech Stack & Hobbies</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
              <div className="tech-category">
                <div className="tech-category-title">Languages</div>
                <div className="tech-chips">
                  <div className="tech-chip" title="Python"><SiPython /></div>
                  <div className="tech-chip" title="Java"><FaJava /></div>
                  <div className="tech-chip" title="C"><SiC /></div>
                  <div className="tech-chip" title="SQL"><SiPostgresql /></div>
                  <div className="tech-chip" title="Bash"><SiGnubash /></div>
                </div>
              </div>
              
              <div className="tech-category">
                <div className="tech-category-title">AI & Machine Learning</div>
                <div className="tech-chips">
                  <div className="tech-chip" title="PyTorch"><SiPytorch /></div>
                  <div className="tech-chip" title="LangChain"><SiLangchain /></div>
                  <div className="tech-chip" title="Scikit-learn"><SiScikitlearn /></div>
                </div>
              </div>

              <div className="tech-category">
                <div className="tech-category-title">Backend</div>
                <div className="tech-chips">
                  <div className="tech-chip" title="FastAPI"><SiFastapi /></div>
                  <div className="tech-chip" title="Django"><SiDjango /></div>
                  <div className="tech-chip" title="Node.js"><SiNodedotjs /></div>
                </div>
              </div>

              <div className="tech-category">
                <div className="tech-category-title">Frontend</div>
                <div className="tech-chips">
                  <div className="tech-chip" title="React"><SiReact /></div>
                  <div className="tech-chip" title="Next.js"><SiNextdotjs /></div>
                  <div className="tech-chip" title="Tailwind CSS"><SiTailwindcss /></div>
                  <div className="tech-chip" title="Flutter"><SiFlutter /></div>
                </div>
              </div>

              <div className="tech-category">
                <div className="tech-category-title">DevOps & Cloud</div>
                <div className="tech-chips">
                  <div className="tech-chip" title="Docker"><SiDocker /></div>
                  <div className="tech-chip" title="Git"><SiGit /></div>
                  <div className="tech-chip" title="Linux"><SiLinux /></div>
                  <div className="tech-chip" title="Kubernetes"><SiKubernetes /></div>
                  <div className="tech-chip" title="Vercel"><SiVercel /></div>
                </div>
              </div>

              <div className="tech-category">
                <div className="tech-category-title">Embedded Systems</div>
                <div className="tech-chips">
                  <div className="tech-chip" title="ESP32"><SiEspressif /></div>
                  <div className="tech-chip" title="Arduino"><SiArduino /></div>
                </div>
              </div>

              <div className="tech-category">
                <div className="tech-category-title">Hobbies</div>
                <div className="tech-chips">
                  <div className="tech-chip" style={{ width: 'auto', padding: '0 12px', fontSize: '13px', gap: '6px', fontWeight: 500 }}>🏋️‍♂️ Gym</div>
                  <div className="tech-chip" style={{ width: 'auto', padding: '0 12px', fontSize: '13px', gap: '6px', fontWeight: 500 }}>🧘‍♂️ Yoga</div>
                  <div className="tech-chip" style={{ width: 'auto', padding: '0 12px', fontSize: '13px', gap: '6px', fontWeight: 500 }}>🏊‍♂️ Swimming</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experiences (2x2) - Vertical list instead of marquee */}
          <div className="tile col-span-2 row-span-2" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
            <h2 className="tile-title" style={{ marginBottom: '24px' }}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
              {experiences.map((exp, i) => (
                <div key={i} style={{ paddingBottom: i !== experiences.length - 1 ? '20px' : '0', borderBottom: i !== experiences.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', gap: '16px' }}>
                  {exp.logo ? (
                    <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                      <img src={exp.logo} alt={exp.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '8px', background: exp.color || 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', color: exp.iconColor || '#fff' }} dangerouslySetInnerHTML={exp.iconSvg ? { __html: exp.iconSvg } : undefined}>
                      {!exp.iconSvg && <span style={{fontSize:'18px', fontWeight:600}}>{exp.company.charAt(0)}</span>}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{exp.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>{exp.company}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{exp.date}</p>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects (2x2) - Single Carousel */}
          <div className="tile col-span-2 row-span-2" style={{ gridColumn: 'span 2', gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="tile-title" style={{ margin: 0 }}>Featured Project</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {projects.map((_, i) => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === activeProjectIdx ? '#fff' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s ease' }} />
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1, position: 'relative' }}>
              <AnimatePresence>
                {activeProject && (
                  <motion.div 
                    key={activeProjectIdx} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'absolute', inset: 0 }}
                  >
                    <div style={{ height: '180px', width: '100%', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                       {activeProject.image ? (
                         <img src={activeProject.image} alt={activeProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       ) : (
                         <div style={{ width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.1)' }}>
                           <SiReact size={48} style={{ opacity: 0.5 }} />
                         </div>
                       )}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{activeProject.title}</h3>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>{activeProject.description}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {activeProject.tags.slice(0,3).map(tag => (
                          <span key={tag} style={{ 
                            fontSize: '11.5px', padding: '6px 12px', borderRadius: '99px', 
                            background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a href={activeProject.link || "#"} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                        View <FiExternalLink />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Row 5 */}
          
          {/* Education (1x1) */}
          <div className="tile col-span-1" style={{ gridColumn: 'span 1', justifyContent: 'center' }}>
            <h2 className="tile-title" style={{ marginBottom: '16px', fontSize: '18px' }}>Education</h2>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', marginBottom: '12px',
              background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center' 
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 600, margin: '0 0 4px 0' }}>B.E in Computer Science</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 4px 0', lineHeight: 1.3 }}>Vidya Vardhaka College of Engineering</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>2023 – 2027</p>
          </div>

          {/* Achievements & Certifications (1x1) */}
          <div className="tile col-span-1" style={{ gridColumn: 'span 1', overflowY: 'auto' }}>
            <h2 className="tile-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Achievements</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 4px 0', lineHeight: 1.3 }}>Smart India Hackathon 2025</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Finalist</p>
                  </div>
                  <FiExternalLink size={12} color="var(--text-secondary)" />
                </div>
              </a>
              {displayCerts.map((cert, idx) => (
                <a key={idx} href={cert.link || "#"} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block', paddingBottom: '12px', borderBottom: idx !== displayCerts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 4px 0', lineHeight: 1.3 }}>{cert.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{cert.date}</p>
                    </div>
                    <FiExternalLink size={12} color="var(--text-secondary)" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Contact (2x1) */}
          <div className="tile col-span-2 cta-tile" style={{ gridColumn: 'span 2' }}>
            <div>
              <h1 className="tile-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Let's create what's next.</h1>
              <p className="tile-desc" style={{ fontSize: '14px', marginBottom: '0' }}>
                Open to meaningful collaborations and opportunities.
              </p>
            </div>
            <SpecularButton href="/contact" className="cta-button">
              Let's talk <FiArrowRight />
            </SpecularButton>
          </div>

        </div>

        <footer style={{ marginTop: '48px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', paddingBottom: '24px' }}>
          &copy; {new Date().getFullYear()} Praneeth G. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
