const Topic = require('../DataSheet/topicSchema.js')
const moment = require('moment')

exports.query = (req,res,next) => {
	// .limit(1).skip(1)
	let {page = 1, size = 5, topictype = null} = req.query
	let $data = null
	if(topictype){
		$data = {
			topictype : topictype
		}
	}
	let alllength
	Topic.find($data,(err,ret)=>{
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		alllength = ret.length
	})

	page = (page - 1) * size
	if(page < 0){
		page = 0
	}
	Topic.find($data,(err,ret)=>{
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json({
			alllength : alllength,
			data : ret
		})
	}).limit(parseInt(size)).skip(page).sort({"create_time":-1})
}

exports.creat = (req,res,next) => {
	const user = req.session.user
	if(!user){
		return res.json({
					err : '没有权限'
				})
	}
	const $body = req.body
	$body.user_id = user._id
	$body.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
	new Topic($body).save(function(err,ret){	//保存到数据库中
		if(err){
			res.json({
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
	Topic.findOneAndRemove({			
		_id : $id
	},function(err,ret){
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json(ret)
	})
}

exports.updata = (req,res,next) => {
	const user = req.session.user
	if(!user){
		return res.json({
					err : '没有权限'
				})
	}
	
	const $id = req.params.id
	const $body = req.body
	$body.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
	Topic.findByIdAndUpdate($id,$body, function (err, ret) {
     if (err) {
       return res.status(500).json({
       	err : '服务器繁忙'
       })
     } else {
       res.status(200).json(ret)
     }
   })
}

//查询单个话题
exports.queryone = (req,res,next) => {
	// .limit(1).skip(1)
	
	Topic.findOne(req.query,(err,ret)=>{
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json(ret)
	})
}

//查询用户相关话题
exports.queryusertopic = (req,res,next) => {
	// .limit(1).skip(1)
	
	Topic.find(req.query,(err,ret)=>{
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json(ret)
	}).sort({"create_time":-1})
}

//更新点赞
exports.updatastar = (req,res,next) => {
	const user = req.session.user
	if(!user){
		return res.json({
					err : '没有权限'
				})
	}
	
	const $id = req.params.id
	const $body = req.body
	Topic.findByIdAndUpdate($id,$body, function (err, ret) {
     if (err) {
       return res.status(500).json({
       	err : '服务器繁忙'
       })
     } else {
       res.status(200).json(ret)
     }
   })
}

//标题查询
exports.querytitle = (req,res,next) => {
	// .limit(1).skip(1)
	const keyword = req.query.keyword
	const reg = new RegExp(keyword, 'i')
	Topic.find({
		title : {$regex : reg}
	},(err,ret)=>{
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.status(200).json(ret)
	}).sort({"create_time":-1})
}