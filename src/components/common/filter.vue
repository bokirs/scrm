<template>
	<div class="filter flex">
		<div class="fl flex">
			<slot name="left"></slot>
			<!-- <Button :class="{ none: hidSearch }" type="primary" icon="ios-search" @click="handleSearch">查询</Button> -->
		</div>
		
		<div class="flex fr" :class="rightClassName">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			rightClassName: String,
			hidSearch:{
				type: Boolean,
				default: false,
			}
		},
		methods:{
			handleSearch(){
				this.$emit('on-filter',true)
			}
		}
	}
</script>

<style>
.filter{
	padding: 8px 18px;
	width: 100%;
	height: 50px;
	box-sizing: border-box;
	margin: 0 auto 20px;
	background-color: #fff;
	box-shadow: 0px 3px 12px 0px rgba(74, 119, 238, 0.1);
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.filter .fl{
	height: 100%;
	margin: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.filter .fl .input-wrapper {
	font-family: MicrosoftYaHei;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 17px;
	letter-spacing: 0px;
	color: #a0a0a0;
	display: flex;
	justify-content: space-between;
	max-width: 320px;
	min-width: 60px;
	align-items: center;
	margin-right: 20px;
}
.filter .fl .input-wrapper > div{
	width: auto;
	margin-left: 10px;
	min-width: 60px;
	flex-grow: 1;
}
.filter .fl .input-wrapper > label{
	display: inline-block;
	line-height: 1;
	white-space: nowrap;
	
}
.filter .fl .input-wrapper input[type="text"] {
	height: 34px;
	/* background-color: #f6f6f6; */
	border-radius: 6px;
	border: solid 1px #e8e7e7;
	box-sizing: border-box;
	padding: 5px 10px;
}
.filter .fl .input-wrapper input[type="text"]:focus {
	outline: none;
}
.filter .fr {
	height: 100%;
	line-height: 1;
	overflow: hidden;
	justify-content: flex-end;
	align-items: center;
	max-width: 180px;
    padding-left: 10px;
    border-left: 1px #ddd solid;
}
.filter .fr > div{
	height: 100%;
	padding-left: 10px;
}
/* 鼠标经过提示文字 */
.filter .fr > div > div:first-child{
	height: 100%;
}
.filter .fr span {
	padding: 9px 20px 9px 0;
	font-family: MicrosoftYaHei;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 1;
	letter-spacing: 0px;
	color: #a0a0a0;
	display: inline-block;
	/* border-left: 1px #e5e5e5 solid; */
}
.filter .fr button {
	float: right;
	position: static !important;
}
.filter .ivu-btn > .ivu-icon{
	line-height: 1;
}
/* .width-180px{
	width: 180px;
} */
</style>
