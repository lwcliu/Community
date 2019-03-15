const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
mongoose.connect('mongodb://localhost/cms')
var commentSchema = new Schema({
	content : {	//评论内容
		type : String,
		required:true
	},		
    create_time : {
			type : String,
			default : moment().format('YYYY-MM-DD HH:mm:ss'),
			required:true
		},	//评论时间
    article_id : {
			type : String,
			required:true
		}, 	//所属文章		
		user :{		//所属用户
			type : Object,
			required : true
		}
})
var Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment


