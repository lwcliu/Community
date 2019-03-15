<template>
	<div class="indexheader">
		<el-menu :default-active="activeIndex2"
			class="el-menu-demo"
			mode="horizontal"
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b">
			<el-menu-item index="1"><a href="#/">阅览大厅</a></el-menu-item>
			<el-submenu index="2">
				<template slot="title">我的工作台</template>
				<el-menu-item index="2-1">选项1</el-menu-item>
				<el-menu-item index="2-2">选项2</el-menu-item>
				<el-menu-item index="2-3">选项3</el-menu-item>
				<el-submenu index="2-4">
					<template slot="title">选项4</template>
					<el-menu-item index="2-4-1">选项1</el-menu-item>
					<el-menu-item index="2-4-2">选项2</el-menu-item>
					<el-menu-item index="2-4-3">选项3</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-menu-item index="6" style="border-bottom: none; background-color: rgb(84,92,100);">
				<div class="demo-input-suffix">
					<el-input
						placeholder="请输入标题"
						prefix-icon="el-icon-search"
						size="small"
						style="width: 200px; transform: translateY(-1px);"
						v-model="keyword">
					</el-input>
					<el-button
						type="primary"
						size="small" 
						@click="querytitle"
						style="">
						搜索
					</el-button>
				</div>
			</el-menu-item>
			<el-menu-item style="float: right;" index="4" v-if="!login">
				<el-button type="primary" size="mini"><a href="#/login">登录</a></el-button>
				<el-button type="success" size="mini"><a href="#/register">注册</a></el-button>
			</el-menu-item>
			<el-submenu index="5" v-if="login" style="float: right;">
				<template slot="title">
					<div class="user">
						<a href="" class="portrait">
							<img :src="`http://127.0.0.1:3000${user.avatar}`" alt="">
						</a>
						<p> <span></span>{{user.username}}</p>
					</div>
				</template>
				<el-menu-item index="5-1">
					<span class="el-icon-info"> </span> 
					<a :href="`#/user/${user._id}`" style="color: white;"> 个人主页</a>
				</el-menu-item>
				<el-menu-item index="5-2"><span class="el-icon-document"> </span> 我的话题</el-menu-item>
				<el-menu-item index="5-3" @click="logout"><span class="el-icon-error"> </span> 退出登录</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	import axios from 'axios'
	axios.defaults.withCredentials = true
	export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
				login : false,
				user : {},
				keyword : ''
      };
    },
    methods: {
      async logout(){
				const {data} = await axios.delete('http://127.0.0.1:3000/session')
				if(!data.state){
					this.login = false
					this.user = data.state
				}
			},
			querytitle(){
				this.keyword.trim()
				if(this.keyword === '')	return this.$router.push('/')
				this.$router.push('/listbytitle?keyword='+this.keyword)
			}
    },
		async created(){
			const {data} = await axios.get('http://127.0.0.1:3000/session')
			// console.log(data.state)
			if(data.state){
				this.login = true
				this.user = data.state
			}
		}
  }
</script>

<style scoped>
	/* .indexheader{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10000;
	} */
a{
	text-decoration: none;
}
.user{
	float: left;
	width: 50px;
}
.user p{
	margin: 0;
	height: 20px;
	line-height: 20px;
	text-align: center;
	font-size: 12px;
}
.portrait{
	display: block;
	border: 1px solid #ccc;
	width: 35px;
	height: 35px;
	position: relative;
	border-radius: 50%;
	overflow: hidden;
	margin: 0 auto;
}
.portrait img{
	width: 35px;
	height: 35px;
	border-radius: 50%;
	position: absolute;
	left: 0;
	top: 0;
}
</style>
