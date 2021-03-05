const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
const fs = require('fs');

const enquettes =require('./bd.json');


//GET /enquettes

app.get('/api/enquettes',(req,res)=>{
res.send(enquettes);
});


//GET /enquettes/:id
app.get('/api/enquettes/:id',(req,res)=>{
  const enquette = enquettes.find(c => c.id === parseInt(req.params.id));
  if(!enquette) res.status(404).send('enquete introuvable');
  res.send(enquette);
  });

//POST /enquettes
app.post('/api/enquettes',(req,res)=>{
 enquettes.push({
  id: enquettes.length+1,
  name: req.body.name,
  city: req.body.city
});

var json = JSON.stringify(enquettes , null, 2);
fs.writeFile('./bd.json', json, err => {
    if (err) {
      console.error(err)
      return
    }else{
      res.send("enquette ajouté avec succés");
    }
  })
});


//PUT /enquettes/:id


// UPDATE
app.put('/api/enquettes/:id',(req,res)=>{
  fs.readFile('./bd.json', 'utf8', (err, jsonString) => {
    const enqId = Number(req.params.id);
    const body = req.body;
    const account = enquettes.find((account) => account.id === enqId);
    const index = enquettes.indexOf(account);
     
    if (!account) {
      res.status(500).send('Account not found.');
    } else {
        const updatedAccount = { ...account, ...body };
        enquettes[index] = updatedAccount;
      var json = JSON.stringify(enquettes , null, 2);
      fs.writeFile('./bd.json', json, err => {
      
      res.send(updatedAccount);
      });
    }

  }, true);
});


//DELETE /enquettes/:id
app.delete('/api/enquettes/:id',(req,res)=>{
  fs.readFile('./bd.json', 'utf8', (err, jsonString) => {
    const enqId = Number(req.params.id);
   // const body = req.body;
    const account = enquettes.find((account) => account.id === enqId);
    const index = enquettes.indexOf(account);
     
    if (!account) {
      res.status(500).send('Account not found.');
    } else {
       // const updatedAccount = { ...account, ...body };
        delete   enquettes[index];
      var json = JSON.stringify(enquettes);
      fs.writeFile('./bd.json', json, err => {
      
        res.status(200).send(`enquette deleted `);
      });
    }

  }, true);
 
});


const port = process.env.port || 3000;
app.listen(port, () => console.log(`Node server is listening on port ${port}...`) );

