const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))	
app.use(bodyParser.json())
app.use(session({
  // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'itcast',
  resave: false,
  saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))
app.use('/',function(req, res, next){
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header("Access-Control-Allow-Origin", 'http://localhost:9998');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
})

app.use('/public/', express.static('./public/'))

const router = require('./router.js')
app.use(router)
app.listen(3000,function(){
	console.log('api-server 3000 running~~~~');
})
 