const validation = require('../validation');



describe('API Tests', () => {
    const testUser = {
        userName: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        mobileNumber: '9876543210',
        country: 'Sri Lanka',
        state: 'Eastern Province',
        password: 'Sv*@4545',
        dob: '2000-01-01',
      };


    it('should validate email', () => {

        const result=validation.validate({...testUser,email:'svdasf'})
        
        expect(Object.keys(result).length).toBe(1);
      });
      it('should validate password', () => {

        const result=validation.validate({...testUser,password:'123xc'})
        
        expect(Object.keys(result).length).toBe(1);
      });

      it('validate password email phonenumber ', () => {

        const result=validation.validate({...testUser,password:'123xc',email:'svdasf',phoneNumber:'1234'})
        
        expect(Object.keys(result).length).toBe(3);
      });

      it('all field is required ', () => {

        const result=validation.validate({
            userName: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            mobileNumber: '',
            country: '',
            state: '',
            password: '',
            dob: '',
        })
        
        expect(Object.keys(result).length).toBe(10);
      });

      
      
      
})