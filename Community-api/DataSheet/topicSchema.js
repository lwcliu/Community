const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
mongoose.connect('mongodb://localhost/cms')
var topicSchema = new Schema({
		title : {
			type : String,
			required:true
		},		//文章标题
    content : {
			type : String,
			required:true
		},	//文章内容
    create_time : {
			type : String,
			default : moment().format('YYYY-MM-DD HH:mm:ss')
		},		//发表时间
    modify_time : {
			type : String,
			default : moment().format('YYYY-MM-DD HH:mm:ss')
		},		//修改时间
    user_id : {
			type : String,
			required : true
		},	//所属用户
		topictype : {
			type : String,
			required : true
		},
		stars : {
			type : Array,
			default : []
		}
})
var Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic

