var express = require('express');
var router = express.Router();
var con = require('../dbcon');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



  
  
router.get('/', function(req, res, next) {
    con.connect(function(err) {
        var sql = "SELECT * FROM employees ORDER BY id DESC";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

router.get('/employees/:id',function (req,res) {
    con.connect(function(err) {
        var sql = "SELECT * FROM employees where id = ?";
        con.query(sql,[req.params.id], function (err, result) {
            if (err) throw err;
            if(result.length != 0){
                res.json(result);
            }
            else{
              res.json({"not found" : true});
            }

        });
    });
});

router.get('/employees/delete/:id',function (req,res) {
    con.connect(function (err) {
      var sql= "DELETE FROM employees where id = ?";
      con.query(sql,[req.params.id],function(err,result){
        if(err) throw err;
        else{
          res.json({"messsage":"Employee "+req.params.id+" deleted successfully"})
        }
      });

    });
});

router.post('/employees',function (req,res) {
  con.connect(function(err){
    var sql = "INSERT into employees (emp_name,salary) values(?,?)";
    con.query(sql,[req.body.user.emp_name,req.body.user.salary])
      res.json({"message":"inserted successfully"})
  });
});


router.post('/employees/update/:id',function (req,res) {
    con.connect(function(err){
        var sql = "Update employees set emp_name=? , salary=? where id =?";
        con.query(sql,[req.body.user.emp_name,req.body.user.salary,req.params.id])
        res.json({"message":"updated"})
    });
});

router.post('/register', function(req, res) {
     var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var date = new Date()
    var username = req.body.username
    var email = req.body.email
    // var password = req.body.password

    con.connect(function (err) {

        var sql = "INSERT INTO users (username,email,password,created_at) values(?,?,?,?)"
        con.query("select * from users where email=?",[email],function(err,result){

           if(result[0]==null)
           {
            con.query(sql,[username,email,hashedPassword,date],function(err,result){
                if(err) throw err
                var token = jwt.sign({ id: result.insertId }, 'supersecret', {
                    expiresIn: 86400 // expires in 24 hours
                  });
                  res.status(200).send({ auth: true, token: token, user_id : result.insertId});   
            });
           }
           else{
            return res.send({auth:false,message:"email already taken"});
           }
        });
        

       
        
        
     
    }); 
    
    
  });
  router.post('/login', function(req, res) {

    con.connect(function(err){
        var sql = "SELECT * from users where email =?";
        con.query(sql,[req.body.email],function(err,result){
            if(err) throw err;
            if(result[0]!=null && result[0].password!=null){
                var validPassword = bcrypt.compareSync(req.body.password,result[0].password);
                if(!validPassword){
                        return res.json({auth:false,token:null,message:"Invalid Credentials"})
                }
                var token = jwt.sign({ id: result[0].id }, 'supersecret', {
                        expiresIn: 86400 
                      });
                      res.status(200).send({ auth: true, token: token,user:result[0] });
            }
            else{
                return res.json({message:"No User Found",auth:false});
            }
        })
       
        

    });
   
  });

  router.post('/socialsignup',function(req,res){
    con.connect(function(err){
        var sql="INSERT INTO users (username,email,provider,provider_id,provider_pic,token) values(?,?,?,?,?,?)";
        con.query("SELECT * from users where email= ?",[req.body.email],function(err,result){
            if(err) throw err
            if(result[0]!=null){
                return res.json({auth:false,token:null,message:"User already registered with this Email"});
            }
            else{
                con.query(sql,[req.body.name,req.body.email,req.body.provider,req.body.provider_id,req.body.provider_pic,req.body.token],
                    function(err,result){
                    var token = jwt.sign({ id: result.insertId }, 'supersecret', {
                        expiresIn: 86400 
                      });
                      con.query("select * from users where id=?",[result.insertId],
                      function(err,result){
                        res.status(200).send({ auth: true, token: token,user:result[0] });
                      });
                      
                })
            }
        })
    })
  });



  router.post('/socialsignin',function(req,res){
    con.connect(function(err){
        
        con.query("SELECT * from users where email= ?",[req.body.email],function(err,result){
            if(err) throw err
            if(result[0]!=null){
                var token = jwt.sign({ id: result[0].id }, 'supersecret', {
                    expiresIn: 86400 
                  });
                  res.status(200).send({ auth: true, token: token,user:result[0] });
               
            }
            else{
                return res.json({auth:false,token:null,message:"No User found with this Email"}); 
            }
        })
    })
  });
  router.get('/me', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'supersecret', function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        con.connect(function(err){
            var sql="SELECT * FROM users where id = ?";
            con.query(sql,[decoded.id],function(err,result){
                if(err) throw err
                res.status(200).send({auth:true,user:result})
            })
        });
    });
  });

module.exports = router;
