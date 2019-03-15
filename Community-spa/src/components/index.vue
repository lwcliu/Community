<template>
	<div>
		<indexheader></indexheader>
		<router-view></router-view>
	</div>
</template>

<script>
	import list from './list.vue'
	import indexheader from './indexheader.vue'
	import release from './release.vue'
	import detailspage from './details.vue'
	import user from './user.vue'
	import topicedit from './topicedit.vue'
	import useredit from './useredit.vue'
	import listbytitle from './listbytitle.vue'
	export default {
		data() {
			return {
				
			};
		},
		components : {
			indexheader,
			list,
			release,
			detailspage,
			user,
			useredit,
			listbytitle
		} 
	}
</script>

<style>

</style>
