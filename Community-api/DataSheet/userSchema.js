const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
mongoose.connect('mongodb://localhost/cms')
var userSchema = new Schema({
	username:{			//用户名
		type:String,	//约束数据保存类型
		required:true	//约束数据是否必须存在,参数为true和false
	},
	password:{	//密码
		type:String,	
		required:true	
	},
	email:{			//邮箱
		type:String,
		required: true
	},
	avatar: {
			type:String,
			default : '/public/uploadImgs/defaultimg.jpg'
	},		 						//头像
	gendar :{		//性别，0为男，1为女
			type:Number,	
			required:true
	},
	create_time : {		//创建时间，自动生成
			type : String,
			default : moment().format('YYYY-MM-DD hh:mm:ss')
	},
	modify_time : {
			type : String,
			default : moment().format('YYYY-MM-DD hh:mm:ss')
	}	//修改时间
});
var User = mongoose.model('User', userSchema)
module.exports = User