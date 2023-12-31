const {countryList} =require('./utils/country')

const {stateList}=require('./utils/countrystate')


const validate=(user)=>{
    const regularExpressions = {
        EMAIL_REGEX: /^[a-zA-Z0-9](.?)+@[a-zA-Z0-9]+.[A-Za-z]+$/,
        PHONE_REGEX:
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        DECIMAL_REGEX: '^[1-9]{1,3}(,[0-9]{3})*(.[0-9]{1,2})?$',
        CODE_REGEX:'/^([0-9]).{4}+$/',
        URL:/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
        MOBILE_NUMBER:/^\d{10}$/,
        DATE:/^\d{4}-\d{2}-\d{2}$/
      };
   let error= {}
    let { userName, email, firstName, lastName, phoneNumber, mobileNumber, country, state,password,dob } = user
    userName = userName ? userName : ''
    email = email ? email : ''
    firstName = firstName ? firstName : ''
    lastName = lastName ? lastName : ''
    phoneNumber = phoneNumber ? phoneNumber : ''
    mobileNumber = mobileNumber ? mobileNumber : ''
    country = country ? country : ''
    state = state ? state : ''
    password=password? password : ''

    if(!userName){
        error['userName']='userName is required field'
    }
    if(!firstName){
        error['firstName']='firstName is required field'
    }
    if(!lastName){
        error['lastName']='lastName is required field'
    }
    if(!regularExpressions.EMAIL_REGEX.test(email)){
        error['email']='enter valid  email'
    }
    if(!regularExpressions.MOBILE_NUMBER.test(mobileNumber)){
        error['mobileNumber']='enter valid  mobile number'
    }
    if(!regularExpressions.MOBILE_NUMBER.test(phoneNumber)){
        error['phoneNumber']='enter valid  phone number'
    }
    if(regularExpressions.DATE.test(dob) ){
        const inputDate = new Date(dob);
        const year=new Date().getFullYear()-inputDate.getFullYear()
        if(year <18){
            error['dob']='age limit above 18 or equal 18'
        }
        
    }
    if(!regularExpressions.DATE.test(dob) ){
            error['dob']='date should given  formate YYYY-MM-DD'
        
    }
    if(!regularExpressions.PASSWORD_REGEX.test(password)){
        error['password']='enter valid  password'
    }
    if(!countryList.includes(country)){
        error['country']='enter valite country'
    }
    if(!(stateList.filter(item=>item.country_name===country) &&
    (stateList.filter(item=>item.country_name===country)[0])?.state.includes(state))
     ){
        error['state']='enter valite state given country'
    }

    return error

}


module.exports.validate=validate