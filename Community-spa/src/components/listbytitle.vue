<template>
	<el-main class="list">
		<el-card class="box-card" v-show="topics[0]" >
			<div class="text item" v-for="(topic,index) in topics" :key="index">
				<div>
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
		<h3 style="text-align: center;" v-show="!topics[0]">找不到相关话题....
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
				topictype : ''
			};
		},
		methods:{
			async gettopicsbytitle(){
				const {keyword} = this.$route.query
				const {data : topics} = await axios.get('http://127.0.0.1:3000/topics/title?keyword='+keyword)
				topics.forEach(function(item,i){
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
				this.topics = topics
				// console.log(topics)
			}
		},
		async created(){
			this.gettopicsbytitle()
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
		},
		watch:{
			'$route' (to , from){
				this.gettopicsbytitle()
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
