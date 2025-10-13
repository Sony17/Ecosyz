#!/usr/bin/env node

/**
 * Local Authentication Testing Script
 * This script helps test the authentication system locally
 */

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';

// Test configuration
const tests = [
  {
    name: 'Health Check',
    url: `${BASE_URL}/`,
    method: 'GET'
  },
  {
    name: 'Auth Status Check (Unauthenticated)',
    url: `${BASE_URL}/api/auth/me`,
    method: 'GET'
  },
  {
    name: 'Auth Page Access',
    url: `${BASE_URL}/auth`,
    method: 'GET'
  },
  {
    name: 'Workspaces Page Access (Should redirect to auth)',
    url: `${BASE_URL}/workspaces`,
    method: 'GET'
  }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function makeRequest(test) {
  return new Promise((resolve) => {
    const url = new URL(test.url);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: test.method,
      headers: {
        'User-Agent': 'Local-Auth-Tester/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          test: test.name
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        error: error.message,
        test: test.name
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        error: 'Request timeout',
        test: test.name
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log(`${colors.blue}🧪 Starting Local Authentication Tests...${colors.reset}\n`);

  // Check if server is running
  console.log(`${colors.yellow}📡 Checking if development server is running...${colors.reset}`);
  
  for (const test of tests) {
    console.log(`\n${colors.blue}🔍 Testing: ${test.name}${colors.reset}`);
    
    const result = await makeRequest(test);
    
    if (result.error) {
      console.log(`${colors.red}❌ Failed: ${result.error}${colors.reset}`);
      if (result.error.includes('ECONNREFUSED')) {
        console.log(`${colors.yellow}💡 Tip: Make sure to run 'npm run dev' first${colors.reset}`);
        break;
      }
    } else {
      const statusColor = result.status < 300 ? colors.green : 
                         result.status < 400 ? colors.yellow : colors.red;
      console.log(`${statusColor}✓ Status: ${result.status}${colors.reset}`);
      
      // Additional info for specific tests
      if (test.name.includes('Auth Status') && result.status === 401) {
        console.log(`${colors.green}✓ Correct: Unauthenticated user properly rejected${colors.reset}`);
      }
      
      if (test.name.includes('Auth Page') && result.status === 200) {
        console.log(`${colors.green}✓ Auth page is accessible${colors.reset}`);
      }
    }
  }

  console.log(`\n${colors.blue}📋 Testing Summary:${colors.reset}`);
  console.log(`${colors.yellow}1. Start dev server: npm run dev${colors.reset}`);
  console.log(`${colors.yellow}2. Open browser: http://localhost:3000${colors.reset}`);
  console.log(`${colors.yellow}3. Test email auth (works without OAuth setup)${colors.reset}`);
  console.log(`${colors.yellow}4. For OAuth testing, see LOCAL_AUTH_TESTING.md${colors.reset}`);
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };