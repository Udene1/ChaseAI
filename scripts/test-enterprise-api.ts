/**
 * Verification script for ChaseAI Enterprise API (Safe Version)
 * 
 * Instructions:
 * 1. Ensure NEXT_PUBLIC_SUPABASE_URL and your API Key are in .env.local
 * 2. Run with settings from your environment
 */

const API_BASE = 'http://localhost:3000/api/v1/external';

// --- CONFIGURATION (Use your own test IDs) ---
const TEST_API_KEY = 'YOUR_API_KEY_HERE'; // DO NOT COMMIT THIS
const TEST_INVOICE_ID = 'YOUR_INVOICE_ID_HERE';
const TEST_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
// ---------------------------------------------

async function testEndpoint(name: string, path: string, method: string = 'GET', body?: any) {
    console.log(`\n🧪 Testing ${name} [${method} ${path}]...`);
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers: {
                'Authorization': `Bearer ${TEST_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!res.ok) {
            console.error(`❌ Failed: ${res.status} ${await res.text()}`);
            return;
        }

        console.log(`✅ Success!`);
    } catch (error) {
        console.error(`❌ Error:`, error);
    }
}

async function runTests() {
    if (TEST_API_KEY === 'YOUR_API_KEY_HERE') {
        console.error('⚠ Please set TEST_API_KEY in the script before running.');
        return;
    }

    console.log('🚀 Starting Enterprise API Verification Tests...');

    await testEndpoint('List Invoices', '/invoices?limit=5');
    await testEndpoint('Get Single Invoice', `/invoices/${TEST_INVOICE_ID}`);
    await testEndpoint('Get AI Signals', `/clients/${TEST_CLIENT_ID}/signals`);

    console.log('\n🏁 Verification tests complete.');
}

runTests();
