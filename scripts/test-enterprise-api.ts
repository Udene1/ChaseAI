/**
 * Verification script for ChaseAI Enterprise API
 * Run this locally with: npx tsx scripts/test-enterprise-api.ts
 */

const API_BASE = 'http://localhost:3000/api/v1/external';
const API_KEY = '1cfbbd23-d015-42ed-9780-2b75010c24c2';
const TEST_INVOICE_ID = '91e70e6f-bf38-46c3-96ba-34422d25753d';
const TEST_CLIENT_ID = 'cad59582-d5e8-4c75-9116-9b9104ce30ea';

async function testEndpoint(name: string, path: string, method: string = 'GET', body?: any) {
    console.log(`\n🧪 Testing ${name} [${method} ${path}]...`);
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!res.ok) {
            console.error(`❌ Failed: ${res.status} ${await res.text()}`);
            return;
        }

        const data = await res.json();
        console.log(`✅ Success!`);
        // console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`❌ Error:`, error);
    }
}

async function runTests() {
    console.log('🚀 Starting Enterprise API Verification Tests...');

    // 1. List Invoices
    await testEndpoint('List Invoices', '/invoices?status=sent&limit=5');

    // 2. Create Invoice
    await testEndpoint('Create Invoice', '/invoices', 'POST', {
        client_email: 'api-test@example.com',
        amount: 15000,
        currency: 'NGN',
        description: 'Enterprise API Test Invoice'
    });

    // 3. Get Single Invoice
    await testEndpoint('Get Single Invoice', `/invoices/${TEST_INVOICE_ID}`);

    // 4. Patch Invoice (Sync status)
    await testEndpoint('Update Invoice Status', `/invoices/${TEST_INVOICE_ID}`, 'PATCH', {
        status: 'paid'
    });

    // 5. Get AI Signals
    await testEndpoint('Get AI Signals', `/clients/${TEST_CLIENT_ID}/signals`);

    console.log('\n🏁 Verification tests complete. Please ensure your local server is running on http://localhost:3000');
}

runTests();
