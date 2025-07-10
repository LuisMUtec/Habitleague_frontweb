import React, { useState } from 'react';
import { apiService } from '../services/api';
import { buildApiUrl } from '../config/api';

const TestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic connectivity
      addResult('🔍 Testing basic connectivity...');
      try {
        const testUrl = import.meta.env.VITE_TEST_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${testUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        addResult(`📡 Direct fetch response: ${response.status} ${response.statusText}`);
        if (response.ok) {
          const data = await response.text();
          addResult(`📄 Response data: ${data}`);
        }
      } catch (error: any) {
        addResult(`❌ Direct fetch failed: ${error.message}`);
      }

      // Test 2: Direct API connectivity
      addResult('🔄 Testing direct API connectivity...');
      try {
        const testUrl = import.meta.env.VITE_TEST_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${testUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        addResult(`📡 Direct API fetch response: ${response.status} ${response.statusText}`);
        if (response.ok) {
          const data = await response.text();
          addResult(`📄 Direct API response data: ${data}`);
        }
      } catch (error: any) {
        addResult(`❌ Direct API fetch failed: ${error.message}`);
        if (error.message.includes('CORS')) {
          addResult(`⚠️ CORS error detected - backend needs CORS configuration`);
        }
      }

      // Test 3: API Service health check
      addResult('🔧 Testing API Service health check...');
      try {
        const healthResponse = await apiService.getJSON(buildApiUrl('/health'));
        addResult(`✅ API Service health check passed: ${JSON.stringify(healthResponse)}`);
      } catch (error: any) {
        addResult(`❌ API Service health check failed: ${error.message}`);
        if (error.originalError) {
          addResult(`🔍 Original error: ${JSON.stringify(error.originalError.response?.data)}`);
        }
      }

      // Test 4: Login with detailed error analysis
      addResult('🔐 Testing login endpoint...');
      try {
        const testEmail = import.meta.env.VITE_TEST_EMAIL || 'test@example.com';
        const testPassword = import.meta.env.VITE_TEST_PASSWORD || 'testpassword123';
        
        const loginData = {
          email: testEmail,
          password: testPassword
        };
        addResult(`📤 Sending login data: ${JSON.stringify({ ...loginData, password: '***' })}`);
        
        const response = await apiService.postText(buildApiUrl('/auth/login'), loginData);
        addResult(`✅ Login succeeded (unexpected): ${response}`);
      } catch (error: any) {
        addResult(`📊 Login response analysis:`);
        addResult(`   Status: ${error.status}`);
        addResult(`   Message: ${error.message}`);
        if (error.originalError?.response?.data) {
          addResult(`   Raw response: ${error.originalError.response.data}`);
        }
        if (error.status === 401) {
          addResult(`✅ Login correctly rejected (401 - expected for invalid credentials)`);
        } else if (error.status === 500) {
          addResult(`❌ Server error (500) - backend has internal issues`);
        }
      }

      // Test 5: Register with detailed error analysis
      addResult('📝 Testing register endpoint...');
      try {
        const testEmail = import.meta.env.VITE_TEST_EMAIL || 'test@example.com';
        const testPassword = import.meta.env.VITE_TEST_PASSWORD || 'testpassword123';
        
        const registerData = {
          email: testEmail,
          password: testPassword,
          firstName: 'Test',
          lastName: 'User'
        };
        addResult(`📤 Sending register data: ${JSON.stringify({ ...registerData, password: '***' })}`);
        
        const response = await apiService.postText(buildApiUrl('/auth/register'), registerData);
        addResult(`✅ Register succeeded: ${response}`);
      } catch (error: any) {
        addResult(`📊 Register response analysis:`);
        addResult(`   Status: ${error.status}`);
        addResult(`   Message: ${error.message}`);
        if (error.originalError?.response?.data) {
          addResult(`   Raw response: ${error.originalError.response.data}`);
        }
        if (error.status === 422 || error.status === 400) {
          addResult(`✅ Register correctly rejected invalid data`);
        } else if (error.status === 500) {
          addResult(`❌ Server error (500) - backend has internal issues`);
        }
      }

      addResult('🎉 Backend connectivity test completed!');

    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
      addResult(`🔍 Full error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-[#F1EADA] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Backend Connectivity Test</h1>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Backend Tests'}
          </button>
          
          <button
            onClick={clearResults}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click the button above to start testing.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="border-b border-gray-100 pb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">What this tests:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Direct backend connectivity</li>
              <li>• API Service functionality</li>
              <li>• Error handling and parsing</li>
              <li>• CORS configuration</li>
              <li>• URL construction</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error 500 Solutions:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Check backend logs</li>
              <li>• Verify database connection</li>
              <li>• Check environment variables</li>
              <li>• Restart backend server</li>
              <li>• Verify endpoint implementations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 