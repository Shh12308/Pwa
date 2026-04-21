// env.js

window.__ENV__ = {
  // MUST MATCH YOUR RUNPOD PUBLIC URL EXACTLY
  "FREE_AI_URL": "https://yto88alk8mynck-8080.proxy.runpod.net",
  
  // Optional: If your frontend is on the same domain as backend, you can leave this empty.
  // But since you are on Vercel and Backend is RunPod, you likely need the full URL above.
  
  "PREMIUM_AI_URL": "https://free.com", // This seems to be a placeholder, ensure it's correct if used
  
  "SUPABASE_URL": "YOUR_SUPABASE_URL_HERE",
  "SUPABASE_ANON_KEY": "YOUR_SUPABASE_ANON_KEY_HERE", // Replace with the NEW key after rotating
  "RECAPTCHA_SITE_KEY": "6Lc1EoQsAAAAALCFeitfMPlBZFMO6XlKL6TwEVv5"
};
