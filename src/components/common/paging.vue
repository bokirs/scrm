<template>
	<div class="paging-wrapper">
		<div class="page-wrapper">
			<div class="page-info">
				共<em>{{ pageData.row }}</em>行,
				每页<em>{{ pageData.pageRow }}</em>行,
				第<em>{{ pageData.pageIndex }}</em> / <em>{{ pageData.pageSum }}</em>页
			</div>
			<div class="page-buttons">				
				<Button @click="handlePage(1)">首页</Button>
				<Button @click="handlePage(pageData.pageIndex*1 - 1)">上一页</Button>
				<Button @click="handlePage(pageData.pageIndex*1 + 1)">下一页</Button>
				<Button @click="handlePage(pageData.pageSum*1)">末页</Button>
				<Input v-model="pageData.toIndex" />
				<Button @click="handlePage(pageData.toIndex*1)">跳转</Button>  
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			pageData:{
				type: Object,
				default(){
					return{
						row: 0,//共多少行
						pageRow: 20,//一页20行 
						pageIndex: 1,//当前第一页
						pageSum: 1,//总共 1页
						toIndex: 1,//跳转到
					}
				}
			}
		},
		methods:{
			handlePage(to){					
				//console.log( to );
				if ( to < 1 || to > this.pageData.pageSum) {
					return false; 
				} else{			
					this.pageData.pageIndex = to;					
					this.$emit("on-switch-page",to)
				}				
			}
		}
	}
</script>

<style>
.paging-wrapper{
	position: absolute;
	width: 100%;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	display: flex;
	justify-content: center;
	overflow: hidden;
	z-index: 3;
}
.page-wrapper {
	height: 60px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: row nowrap;
}
.page-wrapper .page-buttons{
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.page-wrapper .page-buttons>button:hover{
	color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
}
.page-wrapper .page-buttons>button,
.page-wrapper .page-buttons>div{
	margin-right: 10px;
}
.page-wrapper .page-buttons input.ivu-input{
	width: 50px;
	background-color: #fafafa;
}
.page-wrapper .page-buttons button.ivu-btn:last-child{
	margin-left: -15px;
	z-index: 8;
}
.page-wrapper .page-info{
	margin-right: 20px;
}
.page-wrapper .page-info em{
	font-style: normal;
	font-size: 14px;
	padding: 0 5px;
	font-weight: 500;
	color: #2d8cf0;
}

.page-wrapper ul.ivu-page {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
