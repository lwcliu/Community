const User = require('../DataSheet/userSchema.js')
const md5 = require('md5-node')

exports.query = (req,res,next) => {
	res.json({
		state : req.session.user
	})
}
exports.creat = (req,res,next) => {
	const $body = req.body
	$body.password = md5($body.password)
	User.findOne({
		email : $body.email,
		password : $body.password
	},function(err,ret){
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		if(!ret){
			return res.json({
				err : '邮箱或密码错误'
			})
		}
		req.session.user = ret
		res.status(200).json(ret)
	})
}
exports.delete = (req,res,next) => {
	req.session.user = null
	res.json({
		state : req.session.user
	})
}
