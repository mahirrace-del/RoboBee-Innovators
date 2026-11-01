import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileText, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | RoboBee Innovators",
  description: "Official Privacy Policy for RoboBee Innovators web platform and WhatsApp communication services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#0d0b0a",
      color: "#e8e5e1",
      padding: "120px 24px 80px 24px",
      fontFamily: "var(--font-inter), sans-serif",
    }}>
      <div style={{
        maxWidth: "860px",
        margin: "0 auto",
      }}>
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#F4B304",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "500",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header Block */}
        <div style={{
          borderBottom: "1px solid rgba(244, 179, 4, 0.2)",
          paddingBottom: "28px",
          marginBottom: "40px",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(244, 179, 4, 0.1)",
            border: "1px solid rgba(244, 179, 4, 0.3)",
            padding: "6px 14px",
            borderRadius: "20px",
            color: "#F4B304",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "16px",
          }}>
            <Shield size={16} />
            <span>RoboBee Innovators Policy</span>
          </div>

          <h1 style={{
            fontSize: "2.4rem",
            fontWeight: "800",
            color: "#ffffff",
            fontFamily: "var(--font-outfit), sans-serif",
            letterSpacing: "-0.5px",
            marginBottom: "12px",
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#a8a29e", fontSize: "0.95rem" }}>
            Last updated: November 2, 2026 • Effective immediately
          </p>
        </div>

        {/* Content Body */}
        <div style={{
          lineHeight: "1.75",
          fontSize: "1rem",
          color: "#d6d3d1",
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}>
          {/* Section 1 */}
          <section>
            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <FileText size={20} color="#F4B304" />
              1. Overview & Scope
            </h2>
            <p>
              Welcome to <strong>RoboBee Innovators</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are dedicated to youth robotics, STEM mentorship, and school science fair engineering in Bangladesh. This Privacy Policy outlines how we collect, use, and safeguard personal information obtained through our official website (<code>robobee-seven.vercel.app</code>) and our automated WhatsApp communication services powered by Meta and Google Gemini.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <Lock size={20} color="#F4B304" />
              2. Information We Collect
            </h2>
            <p>
              When guardians, students, or institutional partners contact us or register for school science fair mentorship, we may collect:
            </p>
            <ul style={{ paddingLeft: "24px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Contact Identifiers:</strong> Name, phone number, and WhatsApp user profile information.</li>
              <li><strong>Educational Context:</strong> Student&rsquo;s school name, grade/class level (Class 5–10), and project category preferences.</li>
              <li><strong>Project Materials:</strong> Text descriptions, project guidelines, photos, or PDF circulars sent via WhatsApp to help us specify hardware components.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
            }}>
              3. How We Use Your Information
            </h2>
            <p>We use the collected information strictly for legitimate operational purposes:</p>
            <ul style={{ paddingLeft: "24px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>To answer inquiries regarding science fair hardware, pricing estimates, and lab schedules.</li>
              <li>To schedule, manufacture, and assemble student robotics kits and science models.</li>
              <li>To organize tasks on our team dashboard and coordinate lab component checkouts.</li>
              <li>To send courteous verification and delivery schedule confirmations via WhatsApp.</li>
            </ul>
            <p style={{ marginTop: "12px" }}>
              We <strong>never</strong> sell, rent, or trade your personal contact information to third-party advertisers or commercial brokers.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
            }}>
              4. WhatsApp & Third-Party Processors
            </h2>
            <p>
              Our communication pipeline operates using enterprise-grade third-party infrastructure:
            </p>
            <ul style={{ paddingLeft: "24px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Meta Platforms (WhatsApp Cloud API):</strong> Used to reliably deliver and receive text and media messages. Meta adheres to strict data protection standards.</li>
              <li><strong>Google Gemini API:</strong> Evaluates incoming message content solely to assist our human team in structuring bill-of-materials and project dates. Data processed through Google enterprise APIs is not used to train public foundation models.</li>
              <li><strong>Supabase Database:</strong> Encrypted PostgreSQL storage with Row Level Security (RLS) located in secure enterprise cloud regions.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
            }}>
              5. Data Retention & Deletion
            </h2>
            <p>
              We retain message summaries only for the duration necessary to complete the student&rsquo;s science fair project build or academy course. Guardians can request immediate deletion of their chat records or contact details at any time by messaging our team directly.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px",
            marginTop: "16px",
          }}>
            <h2 style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
            }}>
              6. Contact Us
            </h2>
            <p style={{ marginBottom: "16px" }}>
              If you have any questions about this Privacy Policy or wish to modify your stored information, please reach out directly to RoboBee Innovators:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F4B304" }}>
                <Phone size={18} />
                <span style={{ color: "#ffffff" }}>+880 1902-821018 (WhatsApp & Call)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F4B304" }}>
                <Mail size={18} />
                <span style={{ color: "#ffffff" }}>contact@robobeeinnovators.org</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F4B304" }}>
                <MapPin size={18} />
                <span style={{ color: "#ffffff" }}>Flat 2, 75 North Chashara (Uttar Chashara), Narayanganj, Bangladesh 1400</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
