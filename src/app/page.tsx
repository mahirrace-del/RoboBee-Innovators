"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [marquees, setMarquees] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubAchievements = onSnapshot(query(collection(db, "achievements"), orderBy("year", "desc")), (snap) => {
      setAchievements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubMarquee = onSnapshot(collection(db, "marquee"), (snap) => {
      setMarquees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubLeaders = onSnapshot(collection(db, "leaders"), (snap) => {
      setLeaders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProjects();
      unsubAchievements();
      unsubMarquee();
      unsubLeaders();
    };
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.shape1 + ' ' + styles.shape}></div>
      <div className={styles.shape2 + ' ' + styles.shape}></div>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Next-Gen Robotics Club</div>
          <h1 className={styles.title}>
            Engineering the <span className={styles.titleHighlight}>Future</span>
          </h1>
          <p className={styles.subtitle}>
            Welcome to RoboBee. We are a community of innovators, builders, and creators 
            passionate about robotics, automation, and artificial intelligence. 
            Join us to turn your ideas into reality.
          </p>
          
          <div className={styles.ctaContainer}>
            <Link href="/recruitment" className={styles.primaryBtn}>
              Apply for Membership
            </Link>
            <Link href="#features" className={styles.secondaryBtn}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>What We Do</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Our club focuses on hands-on experience, collaborative projects, and pushing the boundaries of what's possible with modern hardware and software.
        </p>

        <div className={styles.featuresGrid}>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8" y2="16"></line>
                <line x1="16" y1="16" x2="16" y2="16"></line>
              </svg>
            </div>
            <h3>Robotics</h3>
            <p>Design and build autonomous robots, from line followers to complex robotic arms using Arduino and Raspberry Pi.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>AI & ML</h3>
            <p>Implement machine learning models, computer vision, and neural networks to make our hardware intelligent.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3>IoT Automation</h3>
            <p>Create interconnected smart systems, sensor networks, and home automation tools using modern protocols.</p>
          </div>

        </div>
      </section>

      <section id="projects" className={styles.projects}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Dynamic Project Showcase</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem' }}>
          Explore our latest builds, ranging from environmental solutions to competitive robotics.
        </p>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>More projects coming soon!</p>
        ) : (
          <div className={styles.featuresGrid}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectImagePlaceholder} style={{ background: `url(${project.image}) center/cover no-repeat`, height: '250px' }}>
                </div>
                <div className={styles.projectContent}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="achievements" className={styles.achievements}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Achievements</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem' }}>
          A timeline of our competitive milestones and achievements on the national and international stage.
        </p>

        {achievements.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Our journey has just begun.</p>
        ) : (
          <div className={styles.featuresGrid}>
            {achievements.map((ach) => (
              <div key={ach.id} className={styles.projectCard}>
                <div className={styles.projectImagePlaceholder} style={ach.image?.trim() ? { background: `url(${ach.image.trim()}) center/cover no-repeat`, height: '250px' } : { height: '250px' }}>
                  {!ach.image?.trim() && 'No Image'}
                </div>
                <div className={styles.projectContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.4rem' }}>{ach.title}</h3>
                    <span style={{ background: 'rgba(244, 179, 4, 0.1)', color: 'var(--accent-primary)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{ach.year}</span>
                  </div>
                  <p>{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CORE TEAM / LEADERS SECTION */}
      {leaders.length > 0 && (
        <section id="leadership" className={styles.features}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Meet the Core Team</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem' }}>
            The leaders and visionaries guiding our club towards new horizons.
          </p>
          <div className={styles.leaderGrid}>
            {leaders.map((leader) => (
              <div key={leader.id} className={styles.leaderCard}>
                {leader.image?.trim() ? (
                  <img src={leader.image.trim()} alt={leader.name} className={styles.leaderAvatar} />
                ) : (
                  <div className={styles.leaderAvatarPlaceholder}>
                    {leader.name.charAt(0)}
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{leader.name}</h3>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{leader.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MEMBER MARQUEE */}
      {marquees.length > 0 && (
        <section className={styles.marqueeSection} style={{ overflow: 'hidden', padding: '4rem 0', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Meet Our Members</h3>
          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
              {[...marquees, ...marquees, ...marquees, ...marquees, ...marquees, ...marquees, ...marquees, ...marquees, ...marquees, ...marquees].map((m, i) => (
                <div key={i} className={styles.marqueeItem}>
                  {m.image?.trim() ? <img src={m.image.trim()} alt="Member" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F4B304' }} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <div className={styles.socialContainer}>
          <a 
            href="https://www.facebook.com/robobeeinnovators/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.fbLink}
            aria-label="Visit RoboBee Innovators on Facebook"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>

          <a 
            href="https://www.instagram.com/robobee.innovators/reels/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.igLink}
            aria-label="Visit RoboBee Innovators on Instagram"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span>Instagram</span>
          </a>
        </div>
        <p style={{ fontSize: '0.9rem' }}>© 2026 RoboBee. All rights reserved.</p>
      </footer>
    </div>
  );
}
