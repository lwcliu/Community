<template>
	<div class="login">
		<h1><a href="#/"><img src="../pubic/img/logo.png" alt=""></a></h1>
		<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="80px" class="demo-ruleForm">
			<el-form-item prop="email" label="邮箱">
				<el-input v-model="ruleForm2.email" type="email"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="loginbtn" type="primary" @click="submitForm('ruleForm2')">登录</el-button>
				<div class="message">
				  <p>没有账号? <a href="#/register">点击创建</a>.</p>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			const validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					callback();
				}
			};
			const validateemail = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('邮箱不能为空'));
				} else {
					const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
					if (!reg.test(value)) {
						callback(new Error('请输入正确邮箱格式'))
					} else {
						callback()
					}
				}
			};
			return {
				ruleForm2: {
					password: '',
					email: ''
				},
				rules2: {
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					email: [{
						validator: validateemail,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			 submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const res = await axios.post('http://127.0.0.1:3000/session', this.ruleForm2)
						if(res.data.err){
							return this.$message('用户名或密码错误')
						}
						this.$router.push('/')
					}
				})
			}	
		}
	}
</script>

<style scoped>
	.login {
		width: 400px;
		padding: 30px;
		padding-left: 10px;
		padding-right: 70px;
		padding-bottom: 20px;
		margin: 100px auto;
		border: 1px solid #ccc;
	}
	.loginbtn{
		width: 100%;
	}
	.message {
		height: 40px;
		margin-top: 20px;
		padding-left: 20px;
	  border: 1px solid #d8dee2;
	  border-radius: 5px;
	}
	.message p{
		padding: 0;
		line-height: 40px;
		margin: 0;
	}
	.login h1{
		text-align: center;
		margin: 0;
	}
</style>
