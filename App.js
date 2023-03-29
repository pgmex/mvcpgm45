var express=require('express');
var app = express();
var ejs = require('ejs')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
app.use(expressValidator())
var urlencodedParser = bodyParser.urlencoded({extended:false})
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1/employee1', function(err, db){
if(!err){
console.log('Welcome');
var dbo=db.db("employee1");
app.get('/',function(req,res){
  res.sendFile(__dirname+'/'+'Exp4.html');
})
app.post('/emp_post',urlencodedParser, function(req, res){
req.checkBody('empid',"employee id should not be blank").notEmpty();
req.checkBody('name',"employee id should not be blank").isAlpha();
var errors = req.validationErrors();
if(errors) {
res.send(errors);
return;
}
else {
var obj = {emp_id:req.body.empid,name:req.body.name, dept:req.body.dept,des:req.body.desig,mob:req.body.mob,email:req.body.email}
dbo.collection('employee1').insertOne(obj, function(err,doc){
  if(err)
  return console.log(err);
  else
  console.log('Record Inserted');
})
res.send('<p>emp_id : '+req.body.empid+'</p><p>emp_name : '+req.body.name+'</p><p>emp_dep : '+req.body.dept+'</p><p>emp_des : '+req.body.desig+'</p><p>emp_mob : '+req.body.mob+'</p><p>emp_email : '+req.body.email+'</p><a href="http://localhost:3002/Exp4.html">home</a>')}
})
var server =  app.listen(3002, function(){
var port = server.address().port
console.log('Employee app listening on port %s go to http://localhost:3002',port)
})
app.get('/display',function(req,res){
  dbo.collection('employee1').find().toArray(function(err,i){
    if(err)
    return console.log(err)
    res.render('2b.ejs',{employees:i})
})
})
app.get('/sort',function(req,res){
dbo.collection('employee1').find().sort({empid:1}).toArray(function(err,i){
if(err)
return console.log(err)
res.render('2b.ejs',{employees:i})
})
})
}
else
db.close
})