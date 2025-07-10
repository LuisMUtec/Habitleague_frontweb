// test-backend.js - Script para probar el backend desde la línea de comandos
const https = require('https');
const http = require('http');

const BACKEND_URL = 'http://localhost:8080';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testBackend() {
  console.log('🔍 Testing Backend Connectivity...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    try {
      const healthResponse = await makeRequest(`${BACKEND_URL}/api/health`);
      console.log(`   ✅ Status: ${healthResponse.status}`);
      console.log(`   📄 Response: ${healthResponse.data}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 2: Login endpoint
    console.log('\n2️⃣ Testing login endpoint...');
    try {
      const loginResponse = await makeRequest(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'testpassword123'
        }
      });
      console.log(`   📊 Status: ${loginResponse.status}`);
      console.log(`   📄 Response: ${loginResponse.data}`);
      
      if (loginResponse.status === 401) {
        console.log('   ✅ Expected 401 for invalid credentials');
      } else if (loginResponse.status === 500) {
        console.log('   ❌ Server error (500) - backend has issues');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 3: Register endpoint
    console.log('\n3️⃣ Testing register endpoint...');
    try {
      const registerResponse = await makeRequest(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'testpassword123',
          firstName: 'Test',
          lastName: 'User'
        }
      });
      console.log(`   📊 Status: ${registerResponse.status}`);
      console.log(`   📄 Response: ${registerResponse.data}`);
      
      if (registerResponse.status === 422 || registerResponse.status === 400) {
        console.log('   ✅ Expected validation error');
      } else if (registerResponse.status === 500) {
        console.log('   ❌ Server error (500) - backend has issues');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 4: Challenges endpoint
    console.log('\n4️⃣ Testing challenges endpoint...');
    try {
      const challengesResponse = await makeRequest(`${BACKEND_URL}/api/challenges`);
      console.log(`   📊 Status: ${challengesResponse.status}`);
      console.log(`   📄 Response: ${challengesResponse.data}`);
      
      if (challengesResponse.status === 401) {
        console.log('   ✅ Expected 401 (authentication required)');
      } else if (challengesResponse.status === 500) {
        console.log('   ❌ Server error (500) - backend has issues');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 5: Achievements endpoint
    console.log('\n5️⃣ Testing achievements endpoint...');
    try {
      const achievementsResponse = await makeRequest(`${BACKEND_URL}/api/achievements/my-achievements`);
      console.log(`   📊 Status: ${achievementsResponse.status}`);
      console.log(`   📄 Response: ${achievementsResponse.data}`);
      
      if (achievementsResponse.status === 401) {
        console.log('   ✅ Expected 401 (authentication required)');
      } else if (achievementsResponse.status === 404) {
        console.log('   ❌ Endpoint not found (404) - check if achievements endpoint exists');
      } else if (achievementsResponse.status === 500) {
        console.log('   ❌ Server error (500) - backend has issues');
      } else if (achievementsResponse.status === 200) {
        console.log('   ✅ Achievements endpoint working!');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 6: Evidence endpoints
    console.log('\n6️⃣ Testing evidence endpoints...');
    
    // Test 6.1: Evidence health check
    try {
      const evidenceHealthResponse = await makeRequest(`${BACKEND_URL}/api/evidences/health`);
      console.log(`   📊 Health Status: ${evidenceHealthResponse.status}`);
      console.log(`   📄 Health Response: ${evidenceHealthResponse.data}`);
      
      if (evidenceHealthResponse.status === 200) {
        console.log('   ✅ Evidence service health check working!');
      } else if (evidenceHealthResponse.status === 404) {
        console.log('   ❌ Evidence service not found (404)');
      }
    } catch (error) {
      console.log(`   ❌ Health check error: ${error.message}`);
    }

    // Test 6.2: My evidences endpoint
    try {
      const myEvidencesResponse = await makeRequest(`${BACKEND_URL}/api/evidences/my-evidences`);
      console.log(`   📊 My Evidences Status: ${myEvidencesResponse.status}`);
      console.log(`   📄 My Evidences Response: ${myEvidencesResponse.data}`);
      
      if (myEvidencesResponse.status === 401) {
        console.log('   ✅ Expected 401 (authentication required)');
      } else if (myEvidencesResponse.status === 404) {
        console.log('   ❌ My evidences endpoint not found (404)');
      } else if (myEvidencesResponse.status === 200) {
        console.log('   ✅ My evidences endpoint working!');
      }
    } catch (error) {
      console.log(`   ❌ My evidences error: ${error.message}`);
    }

    // Test 6.3: Evidence stats endpoint
    try {
      const evidenceStatsResponse = await makeRequest(`${BACKEND_URL}/api/evidences/my-stats`);
      console.log(`   📊 Stats Status: ${evidenceStatsResponse.status}`);
      console.log(`   📄 Stats Response: ${evidenceStatsResponse.data}`);
      
      if (evidenceStatsResponse.status === 401) {
        console.log('   ✅ Expected 401 (authentication required)');
      } else if (evidenceStatsResponse.status === 404) {
        console.log('   ❌ Evidence stats endpoint not found (404)');
      } else if (evidenceStatsResponse.status === 200) {
        console.log('   ✅ Evidence stats endpoint working!');
      }
    } catch (error) {
      console.log(`   ❌ Stats error: ${error.message}`);
    }

    console.log('\n🎉 Backend test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBackend(); 