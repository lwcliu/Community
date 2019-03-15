const express = require('express')
const router = express.Router()
const multer = require('multer')
const userconteoller = require('./conteollers/userconteoller.js')
const topicconteoller = require('./conteollers/topicconteoller.js')
const sessionconteoller = require('./conteollers/sessionconteoller.js')
const commentconteoller = require('./conteollers/commentconteoller.js')
/*
* 用户资源处理
*/
router
	.get('/users',userconteoller.query)
	.post('/users',userconteoller.creat)
	.patch('/users/:id',userconteoller.updata)
	.delete('/users',userconteoller.delete)
	
	/*
	* 会话状态处理
	*/
 router
 	.get('/session',sessionconteoller.query)
 	.post('/session',sessionconteoller.creat)
 	.delete('/session',sessionconteoller.delete)
	
	/*
	* 话题资源处理
	*/
 router
 	.get('/topics',topicconteoller.query)
 	.post('/topics',topicconteoller.creat)
 	.patch('/topics/:id',topicconteoller.updata)
	.patch('/topics/star/:id',topicconteoller.updatastar)
 	.delete('/topics/:id',topicconteoller.delete)
	.get('/topics/details',topicconteoller.queryone)
	.get('/topics/usertopics',topicconteoller.queryusertopic)
	.get('/topics/title',topicconteoller.querytitle)
	/*
	*评论资源处理
	*/
 router
 	.get('/comments',commentconteoller.query)
 	.post('/comments',commentconteoller.creat)
 	// .patch('/comment/:id',commentconteoller.updata)
 	.delete('/comments/:id',commentconteoller.delete)
	
/*
*	图片上传处理
*/
 const storage = multer.diskStorage({
   //确定图片存储的位置
   destination: function (req, file, cb){
     cb(null, './public/uploadImgs')
   },
   //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
   filename: function (req, file, cb){
     cb(null, Date.now()+file.originalname)
   }
 })
 //生成的专门处理上传的一个工具，可以传入storage、limits等配置
 const upload = multer({storage: storage});
 //接收上传图片请求的接口
 router.post('/uploadimg', upload.single('file'), function (req, res, next) {
   //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
   //线上的也就是服务器中的图片的绝对地址
   const url = '/public/uploadImgs/' + req.file.filename
   res.json({
     code : 200,
     data : url
   })
 })
module.exports = router