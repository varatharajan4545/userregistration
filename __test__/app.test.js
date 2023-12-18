const supertest = require('supertest');
describe('API Tests', () => {
  // Set a higher timeout for all tests
  jest.setTimeout(15000);
  const baseurl='https://nlmnekz553.execute-api.us-east-1.amazonaws.com/dev'
  const testUser = {
    "country": "Andorra",
 "dob": "2000-12-14",
 "email": "svs2@gmail.com",
 "firstName": "subramanijam",
 "lastName": "Varatharajan",
 "mobileNumber": "0778195709",
 "password": "Sv*@4545",
 "phoneNumber": "0779195709",
 "state": "La Massana",
 "userName": "varathan5"
 
 }

  

  it('should create a new user', async () => {
    const response = await supertest(baseurl)
      .post('/users')
      .send(testUser);
    expect(response.statusCode).toBe(200);

  });

  it('should not create a user with existing userName', async () => {
    const response = await supertest(baseurl)
      .post('/users')
      .send({...testUser,email:'svsa@gmail.com'});
    expect(response.statusCode).toBe(400);
    expect(response.body.error.userName).toBe('userName already exist');
  });

  it('should not create a user with existing email', async () => {
    const response = await supertest(baseurl)
      .post('/users')
      .send({
        ...testUser,
        userName: 'newuser',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error.email).toBe('email already exist');
  });
});