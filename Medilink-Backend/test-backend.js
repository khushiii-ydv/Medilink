const axios = require('axios');

async function test() {
  const BASE_URL = 'http://localhost:5000/api';
  
  try {
    console.log('--- Testing Admin Login ---');
    const adminLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@medilink.com',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.data.token;
    console.log('Admin Token Received');

    console.log('--- Testing List Requests ---');
    const reqsRes = await axios.get(`${BASE_URL}/admin/patient-requests`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const requests = reqsRes.data.data;
    const reqId = requests[0].id;
    console.log(`Found ${requests.length} requests. Using ReqID: ${reqId}`);

    console.log('--- Testing List Doctors ---');
    const docsRes = await axios.get(`${BASE_URL}/admin/system-doctors`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const doctors = docsRes.data.data;
    const docId = doctors[0].id;
    console.log(`Found ${doctors.length} doctors. Using DocID: ${docId}`);

    console.log('--- Testing Assign Request ---');
    const assignRes = await axios.post(`${BASE_URL}/admin/requests/${reqId}/assign`, 
      { doctorId: docId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('Assignment Success:', assignRes.data.message);

    console.log('--- Testing Doctor Login ---');
    const docLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'doctor1@medilink.com',
      password: 'doc123'
    });
    const docToken = docLogin.data.data.token;
    console.log('Doctor Token Received');

    console.log('--- Testing Resolve Priority ---');
    const resolveRes = await axios.put(`${BASE_URL}/doctor/requests/${reqId}/resolve`,
      { priority: 'CRITICAL' },
      { headers: { Authorization: `Bearer ${docToken}` } }
    );
    console.log('Resolution Success:', resolveRes.data.message);
    
    console.log('--- ALL BACKEND TESTS PASSED ---');
  } catch (err) {
    console.error('Test Failed:', err.response ? err.response.data : err.message);
  }
}

test();
