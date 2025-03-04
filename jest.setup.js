
// jest.setup.js

const supertest = require('supertest');

// ✅ Global request object
global.request = supertest('http://localhost:8001/api/v1');
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;