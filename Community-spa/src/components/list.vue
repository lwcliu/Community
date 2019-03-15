<template>
	<el-main class="list">
		<el-card class="box-card" >
			<div slot="header" class="clearfix">
				<el-dropdown @command="handleCommand" style="text-align: center;">
					<span class="el-dropdown-link">
						{{topicclass}}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="">全部</el-dropdown-item>
						<el-dropdown-item command="technology">技术</el-dropdown-item>
						<el-dropdown-item command="literature">文学</el-dropdown-item>
						<el-dropdown-item command="Sports">体育</el-dropdown-item>
						<el-dropdown-item command="metaphysics">玄学</el-dropdown-item>
						<el-dropdown-item command="entertainment">娱乐</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-button 
					class="release" 
					type="primary" 
					@click = "gorelease"
					icon="el-icon-edit">
					发布
				</el-button>
			</div>
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
					<p class="content">{{ topic.content }}</p>
					<p class="ps">
						 发布时间 : {{ topic.create_time }}
					</p>
					<hr/>
				</div>
			</div>
		</el-card>
		<div class="block">
    <el-pagination
			v-show="topics[0]"
			class="paging"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="alllength">
    </el-pagination>
		<h3 style="text-align: center;" v-show="!topics[0]">还没有相关话题....
			<a href="" @click.prevent="gorelease">去发布?</a>
		</h3>
  </div>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				topics : [],
        currentPage : 1,
				pagesize : 5,
				alllength : 1,
				topictype : '',
				user : null
			};
		},
		methods:{
			handleSizeChange(val) {
//         console.log(`每页 ${val} 条`);
// 				console.log(this.currentPage)
				this.pagesize = val
				this.getlist(`http://127.0.0.1:3000/topics?
				page=${ this.currentPage }&size=${this.pagesize}&topictype=${this.topictype}`)
      },
      handleCurrentChange(val) {
//         console.log(`当前页: ${val}`);
// 				console.log(this.pagesize)
				this.currentPage = val
				this.getlist(`http://127.0.0.1:3000/topics?
				page=${ val }&size=${this.pagesize}&topictype=${this.topictype}`)
      },
			async getlist(url){
				const {data:resdata} = await axios.get(url),
				topicdata = resdata.data
				topicdata.forEach(function(item,i){
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
				this.topics = topicdata
				this.alllength = resdata.alllength
			},
			handleCommand(command) {
        this.topictype = command
				this.currentPage = 1
				this.getlist(`http://127.0.0.1:3000/topics?
				page=${ this.currentPage }&size=${this.pagesize}&topictype=${this.topictype}`)
      },
			async gorelease(){
				const {data} = await axios.get('http://127.0.0.1:3000/session')
				// console.log(data.state)
				if(!data.state){
					return this.$message({
						message: '请先登录',
						type: 'warning'
					})
				}
				this.user = data.state
				this.$router.push('/release')
			}
		},
		async created(){
			this.getlist('http://127.0.0.1:3000/topics')
		},
		computed:{
			topicclass(){
				switch(this.topictype){
					case 'technology' : return '技术'
						break;
					case 'literature' : return  '文学'
						break;
					case 'Sports' : return  '体育'
						break;
					case 'entertainment' : return  '娱乐'
						break;
					case 'metaphysics' : return  '玄学'
						break;
					default : return  '全部'
				}
			}
		}
	}
</script>

<style>
	.list{
		
	}
	.list .item.star{
		
	}
	.list .item.star span{
		color: #0074D9;
	}
	.list a{
		text-decoration: none;
		display: inline-block;
		color: #808080;
	}
	.list a:hover{
		color: #0074D9;
	}
	.list .text {
	font-size: 14px;
}

.list .release {
	float: right;
	transform: translateY(-10px);
}
.list div.el-card__header{
	padding: 15px;
	padding-left: 20px;
}
.list div.el-card__body{
	padding: 5px;
	padding-left: 20px;
}
.list .clearfix{
	height: 20px;
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
.list .content{
	text-overflow:ellipsis;
	overflow: hidden;
	white-space:nowrap;
	padding-right: 300px;
}
.list p.ps{
	margin: 10px;
	font-size: 12px;
	text-align: right;
}
.list .paging{
	margin: 30px;
	float: right;
}
</style>
