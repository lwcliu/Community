import Vue from 'vue'
import App from './app.vue'


import router from './router.js'

new Vue({
	el : '#app',
	data : {
		message : 'test'
	},
	template:'<App />',
	components:{
    App
	},
	router
})