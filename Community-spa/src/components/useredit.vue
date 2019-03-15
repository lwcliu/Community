<template>
	<el-main class="useredit">
		<p>
			<span @click="gouser">
				<a href="javascript:">个人中心</a>
			</span>
			<span>
				>
				<a href="javascript:">资料修改</a>
			</span>
		</p>
		<hr/>
		<el-upload
		  class="avatar-uploader"
		  action="http://localhost:3000/uploadimg"
		  :show-file-list="false"
		  :on-success="handleAvatarSuccess"
		  :before-upload="beforeAvatarUpload">
		  <img v-if="imageUrl" :src="imageUrl" class="avatar">
		  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="ruleForm2.username"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="gendar">
				<el-radio-group v-model="ruleForm2.gendar">
					<el-radio label="男" value="0"></el-radio>
					<el-radio label="女" value="1"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button class="registerbtn" type="primary" @click="submitForm('ruleForm2')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-main>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			const checkAge = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('用户名不能为空'));
				}
				setTimeout(async () => {
					if (value.length < 2 || value.length > 8) {
						callback(new Error('用户名必须在2-8位'));
					} else {
						const res = await axios.get('http://127.0.0.1:3000/users?username='+value)
						if(res.data[0]){
							const {id} = this.$route.params
							if(res.data[0]._id === id){
								return callback()
							}
							return callback(new Error('该用户名已存在'))
						}
						callback()
					}
				}, 200);
			};
			const validategendar = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请选择性别'));
				} else {
					callback()
				}
			}
			return {
				ruleForm2: {
					username: '',
					gendar: '',
					avatar : ''
				},
				rules2: {
					username: [{
						validator: checkAge,
						trigger: 'blur'
					}],
					gendar: [{
						validator: validategendar,
						trigger: 'blur'
					}]
				},
				imageUrl : ''
			};
		},
		methods: {
			gouser() {
				console.log(1)
				this.$router.back()
			},
			 handleAvatarSuccess(res, file) {
			  this.imageUrl = URL.createObjectURL(file.raw);
				this.ruleForm2.avatar = res.data
			},
			beforeAvatarUpload(file) {
			  const isJPG = file.type === 'image/jpeg';
			  const isLt2M = file.size / 1024 / 1024 < 2;
			
			  if (!isJPG) {
			    this.$message.error('上传头像图片只能是 JPG 格式!');
			  }
			  if (!isLt2M) {
			    this.$message.error('上传头像图片大小不能超过 2MB!');
			  }
			  return isJPG && isLt2M;
			},
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const {id} = this.$route.params
						const {data:currentuser} = await axios.get('http://127.0.0.1:3000/session')
						// console.log(data.state)
						if(!currentuser.state){
							return this.$message({
								message: '请先登录',
								type: 'warning'
							})
						}
						if(id !== currentuser.state._id){
							return this.$message({
								message: '没有权限',
								type: 'warning'
							})
						}
						if (this.ruleForm2.gendar === '男') {
							this.ruleForm2.gendar = 0
						} else {
							this.ruleForm2.gendar = 1
						}
						if(!this.ruleForm2.avatar){
							delete this.ruleForm2.avatar
						}
						const {data} = await axios.patch(`http://127.0.0.1:3000/users/${id}`, this.ruleForm2)
						if(data.err){
							return this.$message({
								message: '服务器繁忙',
								type: 'warning'
							})
						}
						this.$message({
							message: '更新成功',
							type: 'warning'
						})
						this.$router.go(-1)
					}
				})
			}
		},
		async created() {
			const {id} = this.$route.params
			const {data} = await axios.get('http://127.0.0.1:3000/users?_id='+id)
			this.ruleForm2.username = data[0].username
			this.ruleForm2.gendar = data[0].gendar === 0?'男':'女'
		}
	}
</script>

<style>
	.useredit{
		padding: 20px 300px;
		padding-top: 10px;
		background-color: #ccc;
		padding-bottom: 138px;
	}
	.useredit p{
		margin: 0;
	}
	
	.useredit a{
		text-decoration: none;
		color: #000;
		display: inline-block;
		padding: 0 5px;
		font-size: 14px;
	}
	.useredit span:first-child a:hover{
		color: #0074D9;
	}
	.useredit span:last-child a{
		color: #fff;
	}
	.useredit .register {
		width: 500px;
		padding: 40px;
		padding-right: 70px;
		margin: 20px auto;
		border: 1px solid #ccc;
	}
	.useredit .register h1{
		text-align: center;
		margin: 0;
	}
	.useredit .registerbtn{
		width: 100%;
	}
	.useredit .message {
		height: 40px;
		margin: 40px 0;
		padding-left: 20px;
	  border: 1px solid #d8dee2;
	  border-radius: 5px;
	}
	.useredit .message p{
		padding: 0;
		line-height: 40px;
		margin: 0;
	}
	.useredit .avatar-uploader .el-upload {
		margin-left: 50%;
		transform: translateX(-50%);
	  border: 1px solid #409EFF;
		margin-bottom: 20px;
	  border-radius: 6px;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	}
	.useredit .avatar-uploader .el-upload:hover {
	  border-color: #409EFF;
	}
	.useredit .avatar-uploader-icon {
	  font-size: 28px;
	  color: #8c939d;
	  width: 178px;
	  height: 178px;
	  line-height: 178px;
	  text-align: center;
	}
	.useredit .avatar {
	  width: 178px;
	  height: 178px;
	  display: block;
	}
</style>

