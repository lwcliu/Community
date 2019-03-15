<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	import login from './components/login.vue'
	import register from './components/register.vue'
	import index from './components/index.vue'
	export default {
		data() {
			return {
				
			};
		},
		components: {
			login,
			register,
			index
		}
	}
</script>

<style>

</style>
