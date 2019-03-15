import VueRouter from 'vue-router'
import login from './components/login.vue'
import register from './components/register.vue'
import index from './components/index.vue'
import list from './components/list.vue'
import release from './components/release.vue'
import detailspage from './components/details.vue'
import user from './components/user.vue'
import topicedit from './components/topicedit.vue'
import useredit from './components/useredit.vue'
import listbytitle from './components/listbytitle.vue'
export default new VueRouter({
	routes : [
		{
			path : '/',
			component : index,
			children: [
        { path: '/', component: list },
				{ path: '/release', component: release },
				{ path: '/details/:id', component: detailspage },
				{ path: '/user/:id', component: user },
				{ path: '/topicedit/:id', component: topicedit },
				{ path: '/useredit/:id', component: useredit },
				{ path: '/listbytitle', component: listbytitle }
      ]
		},
		{
			path : '/login',
			component : login
		},
		{
			path : '/register',
			component : register
		}
	]
})