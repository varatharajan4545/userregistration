const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { handler } = require('../index'); // Update the path accordingly

describe('API Tests', () => {
  // Set a higher timeout for all tests
  jest.setTimeout(15000);
  const userId = uuidv4();
  const testUser = {
    userName: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '1234567890',
    mobileNumber: '9876543210',
    country: 'TestCountry',
    state: 'TestState',
    password: 'testpassword',
    dob: '2000-01-01',
  };

  it('should get user by userId', async () => {
    const response = await request(handler).get(`/users/${userId}`);
    expect(response.statusCode).toBe(404);
  });

  // it('should create a new user', async () => {
  //   const response = await request(handler)
  //     .post('/users')
  //     .send(testUser);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toHaveProperty('userId');
  //   expect(response.body).toHaveProperty('userName', testUser.userName);
  // });

  // it('should not create a user with existing userName', async () => {
  //   const response = await request(handler)
  //     .post('/users')
  //     .send(testUser);
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.error.userName).toBe('userName already exist');
  // });

  // it('should not create a user with existing email', async () => {
  //   const response = await request(handler)
  //     .post('/users')
  //     .send({
  //       ...testUser,
  //       userName: 'newuser',
  //       email: testUser.email, // Use an existing email
  //     });
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.error.email).toBe('email already exist');
  // });

  // Add more test cases as needed
});