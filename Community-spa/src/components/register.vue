<template>
	<div class="register">
		<h1><img src="../pubic/img/logo.png" alt=""></h1>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
			<span>注册成功!去登录？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="gologin">确 定</el-button>
			</span>
		</el-dialog>
		<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="ruleForm2.username"></el-input>
			</el-form-item>
			<el-form-item prop="email" label="邮箱">
				<el-input v-model="ruleForm2.email" type="email"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass">
				<el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="gendar">
				<el-radio-group v-model="ruleForm2.gendar">
					<el-radio label="男" value="0"></el-radio>
					<el-radio label="女" value="1"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button class="registerbtn" type="primary" @click="submitForm('ruleForm2')">提交</el-button>
				<div class="message">
				  <p>已有账号? <a href="#/login">点击登录</a>.</p>
				</div>
			</el-form-item>
		</el-form>
	</div>
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
							return callback(new Error('该用户名已存在'))
						}
						callback();
					}
				}, 200);
			};
			const validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm2.checkPass !== '') {
						this.$refs.ruleForm2.validateField('checkPass');
					}
					callback();
				}
			};
			const validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm2.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			const validateemail = async (rule, value, callback) => {
				if (value === '') {
					callback(new Error('邮箱不能为空'));
				} else {
					const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
					if (!reg.test(value)) {
						callback(new Error('请输入正确邮箱格式'))
					} else {
						const res = await axios.get('http://127.0.0.1:3000/users?email='+value)
						if(res.data[0]){
							return callback(new Error('该邮箱已被注册'))
						}
						callback()
					}
				}
			};
			const validategendar = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请选择性别'));
				} else {
					callback()
				}
			};
			return {
				ruleForm2: {
					password: '',
					checkPass: '',
					username: '',
					email: '',
					gendar: ''
				},
				dialogVisible: false,
				rules2: {
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
					username: [{
						validator: checkAge,
						trigger: 'blur'
					}],
					email: [{
						validator: validateemail,
						trigger: 'blur'
					}],
					gendar: [{
						validator: validategendar,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						delete this.ruleForm2.checkPass
						if (this.ruleForm2.gendar === '男') {
							this.ruleForm2.gendar = 0
						} else {
							this.ruleForm2.gendar = 1
						}
						const res = await axios.post('http://127.0.0.1:3000/users', this.ruleForm2)
						if(res.data.err){
							return
						}
						this.dialogVisible = true
					}
				})
			},
			gologin(){
				this.dialogVisible = false
				this.$router.push('/login')
			}
		}
	}
</script>

<style scoped>
	.register {
		width: 500px;
		padding: 40px;
		padding-right: 70px;
		margin: 20px auto;
		border: 1px solid #ccc;
	}
	.register h1{
		text-align: center;
		margin: 0;
	}
	.registerbtn{
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
</style>

