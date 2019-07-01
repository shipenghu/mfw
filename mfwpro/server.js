//创建服务器
const express=require("express");
var server=express();
server.listen(3000);
//4:指定静态资源目录
server.use(express.static("../public"))
//创建数据库连接池
const mysql = require("mysql");
var pool = mysql.createPool({
  host:"127.0.0.1",
  user:"root",
  password:"",
  port:3306,
  database:"travel",
  connectionLimit:15
})
const bodyPaser=require("body-parser")
server.use(bodyPaser.urlencoded({
  extended:false
}))

//跨域请求
const cors = require("cors");
server.use(cors({
  origin:["http://127.0.0.1:5500",
  "http://localhost:5500"],
  credentials:true
}));

//添加session功能
const session = require("express-session");
server.use(session({
  secret:"128位字符串",
  resave:true,
  saveUninitialized:true
}));

server.get("/login",(req,res)=>{
   
    var uname = req.query.uname;
    var upwd = req.query.upwd;
    console.log(uname,upwd)
    
    var sql = " SELECT * FROM user WHERE uname=? AND upwd=md5(?)";
    pool.query(sql,[uname,upwd],(err,result)=>{
      if(err)throw err;
      console.log(result)
      if(result.length>0){
        req.session.uid=id;
        res.send({code:1,msg:"查询成功"});
      }else{
        res.send({code:-1,msg:"查询失败"}); 
      }    
    })
   });
   /*
   server.get("/insert",(req,res)=>{
    
    var uname = req.query.uname;
    var upwd = req.query.upwd;
    console.log(uname,upwd) 
    if(uname==undefined||upwd==undefined){
      res.send({code:-1,msg:"插入失败"})
      return;
    }
    var sql = " INSERT INTO user VALUES(NULL,?,md5(?))";
    pool.query(sql,[uname,upwd],(err,result)=>{
      if(err)throw err;
      console.log(result)
      if(result.affectedRows>0) {
        res.send({code:1,msg:"插入成功"})
      }else{
        res.send({code:-1,msg:"插入失败"})
      }
    })
   });
   */
   
   server.post("/insert",(req,res)=>{
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    console.log(uname,upwd) 
    if(uname==undefined||upwd==undefined){
      res.send({code:-1,msg:"插入失败"})
      return;
    }
    pool.query("select id from user where uname=?",[uname],(err,result)=>{
      if(err) throw err;
      if(result.length>0){
        res.send({code:-2,msg:"数据库中已存在"})
      }else{
          var sql = " INSERT INTO user VALUES(NULL,?,md5(?))";
          pool.query(sql,[uname,upwd],(err,result)=>{
          if(err)throw err;
          console.log(result)
          if(result.affectedRows>0) {
              res.send({code:1,msg:"插入成功"})
          }else{
              res.send({code:-1,msg:"插入失败"})
          }
          })
      }
    })
    
   });
   