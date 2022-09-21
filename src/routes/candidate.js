const express = require('express');
var lrv = require('../../config.js');
var fs = require('fs');

const router = new express.Router();

router.post('/register-by-email', async(req,res) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const email = req.body.email[0].value;
    try{
        let {Sott} = await lrv.sottApi.generateSott()
        let data,myObject =[],newData;
        
        let response = await lrv.authenticationApi.userRegistrationByEmail(req.body, Sott)
        
        if(response.IsPosted){
            
          let candidate = await lrv.accountApi.getAccountProfileByEmail(email)
        if(candidate.Uid){
          newData = {
            Uid: candidate.Uid,
            FirstName: candidate.FirstName,
            LastName: candidate.LastName,
            Email: candidate.Email,
            PhoneId: candidate.PhoneId,
            Password: candidate.Password,
            TotalVotes: candidate.Religion,
            IsVoted:candidate.Company,
            VoterList:candidate.Political,
            About: candidate.About}
           
                data = fs.readFileSync('voting-data.json')

           
             if(!data){
              
                fs.writeFile('voting-data.json', JSON.stringify([newData]), function (err) {
                    if (err) throw err;
                  });
             }
             else{
             myObject= JSON.parse(data);
            myObject.push(newData)
            fs.writeFile('voting-data.json', JSON.stringify(myObject), function (err) {
            if (err) throw err;
          });
             }}
             res.send(newData)
    }

    }
    catch(e){
        res.send(e).status(400)
    }
    
     
})
router.get('/get-all-candidate', async(req,res) => {
    try {
      res.header('Access-Control-Allow-Origin', "*");

      const data = fs.readFileSync('voting-data.json')
        let newData = JSON.parse(data)
        newData = newData.filter((obj) => obj.Uid !== req.query.id)
        res.send(newData)
      } catch (err) {
        res.status(400).send(err)
      }
})
router.put('/edit-candidate/:id', async(req,res) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
      let newData, myObject,data;
      const candidate = await lrv.accountApi.updateAccountByUid(req.body, req.params.id);
      if(candidate.Uid){
        newData = {
          Uid: candidate.Uid,
          FirstName: candidate.FirstName,
          LastName: candidate.LastName,
          Email: candidate.Email,
          PhoneId: candidate.PhoneId,
          Password: candidate.Password,
          TotalVotes: candidate.Religion,
          IsVoted:candidate.Company,
          VotedList:candidate.Political,
          About: candidate.About}
         
              data = fs.readFileSync('voting-data.json')

           if(data){
            
           myObject= JSON.parse(data);
           myObject = myObject.map((obj) => obj.Uid !== candidate.Uid ? obj : newData)
          fs.writeFile('voting-data.json', JSON.stringify(myObject), function (err) {
          if (err) throw err;
        });
           }}
        
      
      res.send(newData)
    } catch (err) {
      res.status(400).send(e)
    }
});
router.delete('/delete-candidate/:id', async (req,res) =>{
  try {
    res.header('Access-Control-Allow-Origin', "*");
    const candidate = await lrv.accountApi.deleteAccountByUid(req.params.id)
    let data, myObject;
    data = fs.readFileSync('voting-data.json')

        
           if(data){
            
           myObject= JSON.parse(data);
           myObject = myObject.filter((obj) => obj.Uid !== req.params.id)
          fs.writeFile('voting-data.json', JSON.stringify(myObject), function (err) {
          if (err) throw err;
        });
      }
    res.send(candidate);

  }
  catch(e){
    res.status(400).send(e)
  }

});
module.exports = router 


