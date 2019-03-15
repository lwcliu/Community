const User = require('../DataSheet/userSchema.js')
const md5 = require('md5-node')

exports.query = (req,res,next) => {
	
	User.find(req.query,function(err,ret){
		if(err){
			return res.status(500).json({
				err : '服务器繁忙'
			})
		}
		res.json(ret)
	})
}
exports.creat = (req,res,next) => {
	const $body = req.body
	$body.password = md5($body.password)
	User.find({
    $or:[
        {
            username : $body.username
        },
        {
            email : $body.email
        }
    ]
	},function(err,ret){
			if(err){
				return res.status(500).json({
					err : '服务器繁忙'
				})
			}
			if(ret[0]){
				return res.json({
					err : '用户名或邮箱已已存在'
				})
			}
			new User($body).save(function(err,ret){	//保存到数据库中
				if(err){
					res.json({
						err : '格式不准确'
					})
				}else{
					res.status(201).json(ret)
				}
			})
	})

}
exports.delete = (req,res,next) => {
	
}
exports.updata = (req,res,next) => {
	const currentuser = req.session.user
	if(!currentuser){
		return res.json({
					err : '没有权限'
				})
	}
	
	const $id = req.params.id
	if($id !== currentuser._id){
		return res.json({
					err : '没有权限'
				})
	}
	const $body = req.body
	User.findByIdAndUpdate($id,$body, function (err, ret) {
	   if (err) {
	     return res.status(500).json({
	     	err : '服务器繁忙'
	     })
	   } else {
	     res.status(200).json(ret)
	   }
	 })
}