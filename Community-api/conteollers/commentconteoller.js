const Comment = require('../DataSheet/commentSchema.js')
const User = require('../DataSheet/userSchema.js')
const moment = require('moment')

exports.query = (req,res,next) => {
	// .limit(1).skip(1)
	const article_id = req.query.article_id
	Comment.find({article_id},(err,ret)=>{
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json(ret)
	}).sort({"create_time":-1})
}

exports.creat = (req,res,next) => {
	const user = req.session.user
	if(!user){
		return res.status(401).json({
					err : '没有权限'
				})
	}
	const $body = req.body
	$body.user = user;
	$body.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
	new Comment($body).save(function(err,ret){	//保存到数据库中
		if(err){
			res.status(400).json({
				err : '格式不准确'
			})
		}else{
			res.status(201).json(ret)
		}
	})
}
exports.delete = (req,res,next) => {
	const user = req.session.user
	if(!user){
		return res.status(401).json({
					err : '没有权限'
				})
	}
	const $id = req.params.id
	Comment.findOneAndRemove({			
		_id : $id
	},function(err,ret){
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json({})
	})
}
// exports.updata = (req,res,next) => {
// 	
// }