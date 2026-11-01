import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ywkwooknndzcywyrzlfh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3a3dvb2tubmR6Y3l3eXJ6bGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NTA0ODAsImV4cCI6MjEwOTEyNjQ4MH0.3AbigQcc1sjfa-IwqPFDCAdxNuJmy3t1qAWz0VJ4jBI";

// Client-side / public Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side privileged client (for webhooks, Gemini background processing, and task ingestion)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
