<template>
	<el-main class="topicedit">
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		<el-breadcrumb separator="/" class="nav">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="#/release">话题编辑</a></el-breadcrumb-item>
		</el-breadcrumb>
		<hr/>
		<el-form-item label="话题分类" prop="topictype">
			<el-select v-model="ruleForm.topictype" placeholder="请选择话题分类">
				<el-option label="技术" value="technology"></el-option>
				<el-option label="文学" value="literature"></el-option>
				<el-option label="体育" value="Sports"></el-option>
				<el-option label="娱乐" value="entertainment"></el-option>
				<el-option label="玄学" value="metaphysics"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="标题" prop="title">
			<el-input v-model="ruleForm.title"></el-input>
		</el-form-item>
		<el-form-item label="话题内容" prop="content">
			<el-input type="textarea" v-model="ruleForm.content" cols="80" class=".textarea"></el-input>
			<!-- <textarea name="" id="" cols="100" rows="20" v-model="ruleForm.desc" class=".textarea"></textarea> -->
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		</el-form-item>
	</el-form>
	</el-main>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				ruleForm: {
					title: '',
					topictype: '',
					content: ''
				},
				rules: {
					title: [{
							required: true,
							message: '标题不能为空',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 30,
							message: '长度在 2 到 30 个字符',
							trigger: 'blur'
						}
					],
					topictype: [{
						required: true,
						message: '请选择话题类型',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '话题内容不能为空',
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			submitForm(formName) {
				const {id} = this.$route.params
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const {data:topicdata} = await axios.patch(`http://127.0.0.1:3000/topics/${id}`,this.ruleForm)
						if(topicdata.err === "没有权限"){
							return this.$message({
								message: '请先登录',
								type: 'warning',
								customClass : 'message'
							})
						}
						if(!topicdata.err){
							this.$message({
								message: '更新成功',
								type: 'success'
							})
							this.$router.go(-1)
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		},
		async created(){
			const {id} = this.$route.params
			const {data : topic} = await axios.get('http://127.0.0.1:3000/topics/details?_id='+id)
			if(topic.err){
				return
			}
			this.ruleForm.content = topic.content
			this.ruleForm.title = topic.title
			this.ruleForm.topictype = topic.topictype
		}
	}
</script>

<style>
.topicedit{
	/* margin-top: 61px; */
}
.demo-ruleForm{
	
}
.nav{
	margin-top: 0px;
	margin-bottom: 20px;
}
.el-textarea__inner{
	min-height: 250px !important;
}
</style>
