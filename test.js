const captcha = require('./index')

// create captcha
captcha.create().then(res=>{
    console.log(res)
})