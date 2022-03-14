const express = require('express');
const { urlencoded } = require('body-parser');
// const cors = require('cors');
const cookieparser=require('cookie-parser')
const  mysql=require('mysql')
const path =require('path')
const app =express()
const url = require('url'); 
const fs=require('fs')
// const router =express.Router()

const port =3000 || process.env.PORT;

var urlencodedparser=urlencoded({extended:false})

app.use(express.static(path.join(__dirname )));
app.set("views", path.join(__dirname, "views"));
app.use(cookieparser())
// app.use(cors())
var db=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'<password>',
    //for executing the project for first time, comment the below lines and include coorect user and password
    //after creating database uncomment these lines
    database:'SECourseProj',
    multipleStatements:true
})

db.connect((err)=>{
   if(err) console.log('Connection Failed due to',err)
   else console.log('Connection Success')
})
app.set('views',path.join(__dirname))
app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.redirect('/register')
})

app.get('/register',(req,res)=>{ 
   res.render('views/register',{ err:''})
})
app.get('/login',(req,res)=>{ 
   res.render('views/login',{err:''})
})

app.post('/register',urlencodedparser,(req,res)=>{
  var nullvl=null
    console.log(req.body)
    body=req.body
    var regExp = /[a-zA-Z]/;
  if(regExp.test(body.pass)){
    if(body.pass===body.c_pass){
                
                              db.query(`INSERT INTO users VALUES('${body.full_name}','${body.email}','${body.pass}');`,(err,result)=>{
                                if(err){
                                  res.render('registrationForm/index',{err:`This email has been already taken`})
                                }
                                else{
                                  res.render('views/login',{err:`Your Registration has been Successfull. Now Login here`})
                                  console.log(result)
                                }
                                
                              })
           
                          
                
              }
    
    else{
        res.render('views/register',{err:`Oops..the Confirmation Password doesn't match..Please try again`})
      }  
  }
  else{
    res.render('views/register',{err:`Please include at least one non-digit in password`})
  }
  
})
app.get('/home',(req,res)=>{
  console.log(req.query)
   res.render('views/visitpage',{Successmsg:`Welcome ${req.query.username}`})
})
app.post('/login',urlencodedparser,(req,res)=>{

   db.query(`SELECT username, password FROM users WHERE email ='${req.body.email}'`,(err,result)=>{
    
    if(result==false){
      res.render('views/login',{err:`Seems you have not registered`})
     }
     else{
      if(result[0].password===req.body.pass){
        // res.render('LoginPage/visitpage',{Successmsg:`Welcome ${result[0].username}`})
        console.log(url.format('/home',{username:result[0].username}))
        res.redirect('/home?'+'username'+'='+result[0].username)
      }
       else{
        res.render('views/login',{err:`Invalid Password please try again`})
       }
     }
    
   })
})
let sites;
app.post('/home',urlencodedparser,(req,res)=>{
  var sitesToBeBlocked=[]
  sitesToBeBlocked= req.body.sites.split(',')
  console.log(sitesToBeBlocked)
  // sites=sitesToBeBlocked
  // res.cookie('sitesToBeBlocked',sitesToBeBlocked);
  var x =`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet">
      <title>Document</title>
  </head>
  <body>
      <div>
          <div class="img">
              
          </div>
         
         <div class="dive">
          <p class="text1">Starve your distractions</p>
          <p class="text2">Feed your Focus</p>
          <p class="text3">Go back and do your thing darn!</p>
      </div> 
      </div>
      <style>
          html{
              height: 100%;
              width: 100%;
          }
          body{
  
              margin-top: 0rem;
              margin-bottom: 0rem;
              margin-left: 0rem;
              margin-right: 0rem;
              height: 100%;
              width: 100%;
          }
          
          .img{
              position:fixed;
              height: 100%;
              width: 100%;
              background-image: linear-gradient(rgb(255, 175, 1),rgb(228, 83, 57));
          }
          .dive{
              position: absolute;
              top:30%;
              left: 28%;
  
          }
          .text1{
              color: aliceblue;
              font-size: 4rem;
              font-family: 'Playfair Display', serif;
              margin-top: 0.3rem;
              margin-bottom: 0.3rem;
          }
          .text2{
              color: aliceblue;
              margin-top: 0.3rem;
              font-size: 6rem;
              margin-bottom: 0.3rem;
              font-family: 'Anton', sans-serif;
          }
          .text3{
              color: aliceblue;
              margin-top: 0.3rem;
              font-size: 3.5rem;
              margin-bottom: 0.3rem;
              font-family: 'Shadows Into Light', cursive;
          }
      </style>
  </body>
  </html>`
  let code=[]
  sitesToBeBlocked.forEach(element => {
    code.push("case "+'"'+element+'"'+":"+ 
    "document.body.innerHTML="+"`"+x+"`\n"+
    "break;"
    )
  });
let finalcode=""
code.forEach(element => {
  finalcode=finalcode+ element
});
  var replacewith =`
  switch(window.location.hostname){
   ${finalcode}
  }
  `
  fs.writeFile('./main/blocksites.js', 
  `${replacewith}
  console.log("heyyyyyy")
  console.log(window.location.hostname)`,
   (err) => {
    // chrome.runtime.reload()
    // In case of a error throw err.
    // if (err) throw err;
})
  res.status(204).send()
})

app.get('/cookies',(req,res)=>{
  console.log("cookies",req.cookies.sitesToBeBlocked)
  res.send(req.cookies)
})
app.listen(process.env.PORT || port,()=>{
    console.log('Listening on port ',3000)
})

module.exports= function x(){
  return sites
}