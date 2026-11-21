import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

console.log('----------------------------------------------------');
console.log('EMPRO - Supabase Connection Verifier');
console.log('----------------------------------------------------');

if (!fs.existsSync(envPath)) {
  console.error('[ERROR] .env file not found at project root!');
  console.log('Please copy .env.example to .env and configure your Supabase credentials.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
    envVars[key] = value;
  }
}

const supabaseUrl = envVars.VITE_SUPABASE_URL || '';
const publishableKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY || '';

console.log(`Supabase URL : ${supabaseUrl || '(Not set)'}`);
console.log(`Publishable Key : ${publishableKey ? `${publishableKey.substring(0, 12)}...` : '(Not set)'}`);
console.log('');

if (!supabaseUrl || !publishableKey || supabaseUrl.includes('your-project-id') || publishableKey.includes('your-supabase-publishable-key')) {
  console.log('[STATUS] Supabase credentials are placeholder values.');
  console.log('Action needed: Add your actual credentials from Supabase Dashboard -> Project Settings -> API to the .env file.');
  process.exit(0);
}

console.log('Testing communication with Supabase project endpoint...');

try {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'GET',
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  });

  if (response.ok || response.status === 200) {
    console.log(`[SUCCESS] Connected to Supabase! HTTP Status: ${response.status}`);
    console.log('Your Supabase project is active and accessible via the publishable key.');
  } else if (response.status === 401 || response.status === 403) {
    console.error(`[AUTH ERROR] Authentication failed with status HTTP ${response.status}.`);
    console.error('The VITE_SUPABASE_PUBLISHABLE_KEY appears to be invalid or expired.');
  } else {
    console.warn(`[WARNING] Received unexpected HTTP status: ${response.status}`);
  }
} catch (err) {
  console.error(`[NETWORK ERROR] Failed to connect: ${err.message}`);
}
console.log('----------------------------------------------------');
