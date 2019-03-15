<template>
	<el-main class="usercontent">
		<el-breadcrumb separator="/" class="nav">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:">{{ edit?'我': user.username }}的个人中心</a></el-breadcrumb-item>
		</el-breadcrumb>
		<hr/>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<a href="javascript:"><img :src="`http://127.0.0.1:3000${user.avatar}`" alt=""></a>
				<div class="information">
					<p><el-tag><span class="el-icon-info"> : {{ user.username }}</span></el-tag> </p>
					<p><el-tag><span class="el-icon-message"> : {{ user.email }}</span></el-tag> </p>
					<p><el-tag><span class="el-icon-view"> : {{ user.gendar?'女':'男' }}</span></el-tag> </p>
				</div>
				<div class="editbtn" v-if="edit">
					<el-button type="primary" icon="el-icon-edit-outline" @click="useredit" circle></el-button>
				</div>
			</div>
			<h3 style="text-align: center;">{{ edit?'我':'他' }}的话题</h3>
			<hr/>
			<div class="text item" v-for="(topic,index) in topics" :key="index">
				<div v-show="topics[0]">
					<h3>
						<a :href="`#/details/${topic._id}`">{{topic.title}}</a> 
						<el-button 
							size="mini"
							style="color: #888;"
							disabled>
							{{ topic.topictype }}
						</el-button>
						<el-badge :value="topic.stars.length" :max="99" class="item star" type="warning">
							<el-button size="mini"><span class="el-icon-star-on"></span></el-button>
						</el-badge>
					</h3>
					<p class="ps">发布时间 : {{ topic.create_time }}</p>
					<div class="operation" v-if="operation">
						<div class="operation" v-if="operation" style="float: right;">
							<el-button type="primary" icon="el-icon-edit-outline" size="mini">
								<a :href="`#/topicedit/${topic._id}`">编辑</a>
							</el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini">
								<a href="javascript:" :data-id="topic._id" @click="deletetopic">删除</a>
							</el-button>
						</div>
					</div>
					<hr/>
				</div>
			</div>
		</el-card>
	</el-main>
</template>

<script>
	export default {
    data() {
      return {
        activeName: 'second',
				user : {},
				edit : false,
				topics : [],
				operation : false
      };
    },
    methods: {
			async useredit(){
				const {data : currentuser} = await axios.get('http://127.0.0.1:3000/session')
				if(!currentuser.state){
					return
				}
				this.$router.push(`/useredit/${currentuser.state._id}`)
			},
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
					this.getuserone()
				}
			},
			async getuserone() {
				const {id} = this.$route.params
				const {data} = await axios.get('http://127.0.0.1:3000/users?_id='+id)
				this.user = data[0]
				const {data : usertopics} = await axios.get('http://127.0.0.1:3000/topics/usertopics?user_id='+id)
				if(!usertopics.err){
					usertopics.forEach(function(item,i){
						switch(item.topictype){
							case 'technology' : item.topictype = '技术'
								break;
							case 'literature' : item.topictype = '文学'
								break;
							case 'Sports' : item.topictype = '体育'
								break;
							case 'entertainment' : item.topictype = '娱乐'
								break;
							case 'metaphysics' : item.topictype = '玄学'
								break;
							default : item.topictype = '未知'
						}
					})
					this.topics = usertopics
				}
				const {data : currentuser} = await axios.get('http://127.0.0.1:3000/session')
				if(!currentuser.state){
					return
				}
				if(id === currentuser.state._id){
					this.edit = true
					this.operation = true
				}
			}
    },
		created(){
			this.getuserone()
		}
  }
</script>

<style>
	.usercontent{
		/* margin-top: 61px; */
	}
	.usercontent .item.star{
		transform: translateY(9px);
	}
	.usercontent .item.star span{
		color: #0074D9;
	}
	.usercontent a{
		text-decoration: none;
		display: inline-block;
		color: #808080;
	}
	.usercontent a:hover{
		color: #0074D9;
	}
.usercontent .text {
    font-size: 14px;
  }

  .usercontent .item {
    margin-bottom: 18px;
		position: relative;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .usercontent .box-card {
    width: 100%;
		position: relative;
		overflow: hidden;
  }
	.usercontent .clearfix a{
		display: block;
		width: 100px;
		height: 100px;
		transform: translateX(530px);
		border-radius: 50px;
	}
	.usercontent .clearfix a img{
		width: 100%;
		height:100%;
		border-radius: 50px;
		display: block;
	}
	.usercontent .information{
		position: absolute;
		top: 0px;
		left: 50%;
	}
	.usercontent .information p{
		margin: 10px;
	}
	.usercontent .editbtn{
		position: absolute;
		right: 400px;
		top: 45px;
	}
	.usercontent .operation{
		width: 200px;
		position: absolute;
		right: 0px;
		top: 50%;
		transform: translateY(-50%);
	}
	.usercontent .operation a{
		display: inline-block;
		color: white;
	}
</style>
