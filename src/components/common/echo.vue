<template>
	<div></div>
</template>

<script>
	import { mapActions } from 'vuex'
	import { getToken, getAuthority } from '@/libs/util.js'
	
	export default{
		data() {
			return {
				
			}
		},
		props: {
			echo: {
				type: Object,
				default(){
					return{
						Data: [],
						Err: 0,
						Ret: 0
					}
				}
			},
		},
		methods: {
			...mapActions([
			  'handleLogOut',
			]),
			react(data){
				console.log( "echo-react",data )
				const err = data.data.Err;
				if ( data ) {
					
				} else{
					
				}
			},
		},
		computed: {
			token(){
				return getToken()
			},
			
			roleAuthority() {
				return getAuthority()
			},
		},
	}
</script>

<style>
</style>
