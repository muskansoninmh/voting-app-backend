var config = {
    apiDomain: 'api.loginradius.com',
    apiKey: 'c3a8a887-e1e0-4f5a-a3e5-725814f0e9b7',
    apiSecret: 'b7f81801-6150-4810-aa58-51ef41f5c69c',
    siteName: 'internal-muskan',
    apiRequestSigning: false,
    proxy:{
      host:'',
      port:'',
      user:'',
      password:''
   }
}

 var lrv2 = require('loginradius-sdk')(config);
module.exports = lrv2;