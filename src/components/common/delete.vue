<template>
	<frameBox 
		@close="close" 
		@click.native="cancel" 
		@keyup.native.delete="confirm" 
		@keyup.native.esc="cancel"
		@keyup.native.enter="cancel"
		classname='min' 
		:mytitle="mytitle"
	>
		<template slot="frame-form">
			<p style="margin-bottom: 20px;"><Icon type="md-warning" style="color: orangered;" />删除后不可恢复，确定删除吗？</p>
			<div style="display: flex;justify-content: flex-end;">
				<Button type="text" @click="confirm">确定</Button>
				<Button type="primary" @click="cancel">取消</Button>
			</div>
		</template>
	</frameBox>
</template>

<script>
	import frameBox from './frame'
	
	export default {
		data() {
			return {
				
			};
		},
		props:{
			mytitle: {
				type: String,
				default: "确认删除"
			}
		},
		methods:{
			close(data){
				this.$emit("close",false)
			},
			cancel(){
				this.$emit("on-cancle",false)
			},
			confirm(){
				this.$emit("on-confirm",true)
			}
		},
		components:{
			frameBox,
		}
	}
</script>