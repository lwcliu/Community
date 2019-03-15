<template>
	<el-main class="details">
		<el-breadcrumb separator="/" class="nav">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:">话题详情</a></el-breadcrumb-item>
		</el-breadcrumb>
		<hr/>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span class="title">{{ topic.title }}</span>
				<span class="author">作者 : <a style="font-weight: bold;" :href="`#/user/${author._id}`">{{author.username}}</a></span>
				<span :class="star?'el-icon-star-off stars':'el-icon-star-on stars'" @click="setstar"> 
					{{ stars }}
				</span>
				<span class="create_time">创建时间 : {{topic.create_time}}</span>
			</div>
			<div class="text item">
				<p>
					{{topic.content}}
				</p>
				<div class="operation" v-if="operation" style="float: right;">
					<el-button type="primary" icon="el-icon-edit-outline" size="mini">
						<a :href="`#/topicedit/${topic._id}`">编辑</a>
					</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini">
						<a href="javascript:" :data-id="topic._id" @click="deletetopic">删除</a>
					</el-button>
				</div>
			</div>
		</el-card>
		<el-card class="box-card comment" v-show="comments[0]">
			<div class="text item" v-for="(comment,index) in comments" :key="index">
				<a :href="`#/user/${comment.user._id}`" class="avatar"><img :src="`http://127.0.0.1:3000${comment.user.avatar}`" alt=""></a>
				<div class="commentcontent">
					<h6>
						用户 : <a :href="`#/user/${comment.user._id}`"> {{ comment.user.username }}</a>&nbsp; &nbsp;
						<span> {{ comment.create_time }}</span>
					</h6>
					<p>{{ comment.content }}</p>
				</div>
			</div>
		</el-card>
		<el-card class="box-card" v-show="!comments[0]">
			<div class="text item">
				<h5 style="text-align: center;">暂时还没人留言...........</h5>
			</div>
		</el-card>
		<div class="demo-input-size">
			<el-input
				placeholder="发表你的看法..."
				suffix-icon="el-icon-date"
				v-model="nwemessage">
			</el-input>
			<el-button 
				type="primary" 
				icon="el-icon-edit" 
				class="sendmessage"
				@click="sendmessage">
			</el-button>
		</div>
	</el-main>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				topic : {},
				author : {},
				comments : [],
				nwemessage : '',
				operation : false,
				stars : 0,
				star : true
			};
		},
		async created(){
			// console.log(this.$route.params)
			let currentuser_id = ''
			const {id} = this.$route.params
			const {data : topic} = await axios.get('http://127.0.0.1:3000/topics/details?_id='+id)
			const {data : author} = await axios.get('http://127.0.0.1:3000/users?_id='+topic.user_id)
			if(!author.err){
				this.author = author[0]
				const {data : currentuser} = await axios.get('http://127.0.0.1:3000/session')
				if(currentuser.state){
					currentuser_id = currentuser.state._id
					if(this.author._id === currentuser.state._id){
						this.operation = true
					}
				}
			}
			if(!topic.err){
				this.topic = topic
			}
			this.getcomments()
			this.stars = this.topic.stars.length
			if(currentuser_id){
				// console.log(this.stars)
				this.star = this.topic.stars.indexOf(currentuser_id) === -1 ? true : false
				// console.log(this.stars.indexOf(currentuser_id))
			}
		},
		methods:{
			async deletetopic(e){
				const id = e.target.dataset["id"]
				const {data:topicdata} = await axios.delete(`http://127.0.0.1:3000/topics/${id}`)
				if(topicdata.err === "没有权限"){
					return this.$message({
						message: '请先登录',
						type: 'warning'
					})
				}
				if(!topicdata.err){
					this.$message({
						message: '删除成功',
						type: 'success',
					})
					this.$router.go(-1)
				}
			},
			async getcomments(){
				const {id} = this.$route.params 
				const {data : comments} = await axios.get('http://127.0.0.1:3000/comments?article_id='+id)
				if(!comments.err){
					this.comments = comments
					// console.log(this.comments)
				}
			},
			async sendmessage(){
				const {data} = await axios.get('http://127.0.0.1:3000/session')
				// console.log(data.state)
				if(!data.state){
					return this.$message({
						message: '请先登录!',
						type: 'warning'
					})
				}
				const {id} = this.$route.params 
				const {data : comment} = await axios.post('http://127.0.0.1:3000/comments',{
					content : this.nwemessage,
					article_id : id
				})
				if(!comment.err){
					this.nwemessage = ''
					this.getcomments()
				}
			},
			async setstar(){
				const {data} = await axios.get('http://127.0.0.1:3000/session')
				// console.log(data.state)
				if(!data.state){
					return this.$message({
						message: '请先登录',
						type: 'warning'
					})
				}
				const user_id = data.state._id
				let stars = this.topic.stars
				const star_idx = stars.indexOf(user_id)
				if(star_idx === -1){
					stars.push(user_id)
				} else {
					stars.splice(star_idx,1)
				}
				const {data : newtopic} = await axios.patch(`http://127.0.0.1:3000/topics/star/${this.topic._id}`,{stars : stars})
				if(!newtopic.err){
					this.stars = stars.length
					this.star = this.star ? false : true
				}
			} 
		}
	}
</script>

<style>
	.details{
		/* margin-top: 61px; */
	}
	.details a{
		text-decoration: none;
		display: inline-block;
		color: #808080;
	}
	.details a:hover{
		color: #0074D9;
	}
 .details .text {
    font-size: 17px ;
		text-indent: 2em;
  }

  .details .item {
    margin-bottom: 18px;
		overflow: hidden;
  }
	.details .operation{
		margin-top: 50px;
	}
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
  	width: 100%;
  }
	.details .title{
		font-size: 30px;
		font-weight: bolder;
	}
	.details .box-card div.el-card__header{
		height: 100px;
		line-height: 63px;
		position: relative;
	}
	span.author{
		display: block;
		position: absolute;
		bottom: 13px;
		right: 20px;
		font-size: 15px;
	}
	span.stars{
		display: block;
		position: absolute;
		top: 18px;
		right: 20px;
		font-size: 15px;
		color: #0074D9;
		cursor: pointer;
	}
	span.create_time{
		display: block;
		height: 0px;
		position: absolute;
		bottom: 50px;
		right: 20px;
		font-size: 12px;
	}
	.comment{
		margin-top: 30px;
	}
	.details .comment .text{
		margin-bottom: 0;
		text-indent: 0;
		overflow: hidden;
		position: relative;
		border-bottom: 1px solid #ccc;
		padding: 10px 0;
		padding-bottom: 20px;
	}
	.details .comment .text a.avatar{
		display: block;
		width: 40px;
		height: 40px;
		border-radius: 20px;
		float: left;
	}
	.details .comment .text a img{
		display: block;
		width: 40px;
		height: 40px;
		border-radius: 20px;
	}
	.commentcontent{
		width: 100%;
		padding-left: 60px;
	}
	.commentcontent h6 ,p{
		margin: 0;
	}
	.commentcontent p{
		margin-top: 10px;
		font-size: 14px;
		text-indent: 0;
		font-weight: bold;
	}
	div.demo-input-size{
		margin-top: 30px;
		padding-right: 54px;
		position: relative;
	}
	.sendmessage{
		position: absolute;
		top: 0;
		right: 0;
	}
	.operation a{
		color: white;
	}
</style>
