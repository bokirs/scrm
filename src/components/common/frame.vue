<template>	
	<div class="full-fixd" :class="classname">
		<div class="frame-wrapper">
			<div class="frame-top-tip">
				<em>{{mytitle}}</em>				
				<div class="close-box" @click="removeFrame()">
					<Icon type="md-close" />
				</div>				
			</div>
			<div class="frame-form-main">
				<slot name="frame-form"></slot>
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
			mytitle: String,
			classname: String,
		},
		methods:{
			removeFrame(){
				this.$emit("close",false)
			}
		}
	}
</script>

<style>
.full-fixd{
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0; 
	width: 100%;
	height: 100%; 
	background-color: rgba(0,0,0,.5); 
	z-index: 999;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */

.slide-fade-leave-active,
.slide-fade-enter-active{
	transition: all 0.3s linear;
}
.frame-wrapper{
	transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-fade-enter .frame-wrapper,
.slide-fade-leave-to .frame-wrapper{
	transform: scale(0.9,0.9);
	opacity: 0;
}
.slide-fade-enter-to .frame-wrapper,
.slide-fade-leave .frame-wrapper{
	transform: scale(1,1);
	opacity: 1;
}
.slide-fade-enter-to,
.slide-fade-leave{
	background-color: rgba(0,0,0,.5);
}
.slide-fade-enter,
.slide-fade-leave-to{
	background-color: rgba(0,0,0,0);
}

.frame-wrapper{
	padding: 70px 10px 20px;
	width: 90%; 
	margin: 0 auto;
	max-width: 450px;
	background-color: #fff;
	border-radius: 8px;
	position: relative;
	overflow: auto;
	z-index: 9;
}
.frame-wrapper .frame-form-main{
	padding: 0 20px;
}
.frame-wrapper .frame-top-tip{
	background-color: #565a81;
	height: 40px;
	position: absolute;
	top: 0;
	width: 100%;
	left: 0;
	right: 0;
	z-index: 10;
	color: #fff;
	text-align: center;
	line-height: 40px;
	border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}	
.frame-wrapper .frame-top-tip em{
	font-style: normal;
	font-size: 14px;
}
.frame-wrapper .frame-top-tip .close-box{
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	right: 0;
	top: 0;
	font-size: 28px;
	width: 40px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	cursor: pointer;		
}
.frame-wrapper .frame-top-tip .close-box:hover{
	background-color: #7478a2;
	transition: all 0.4s ease;
}
/* .frame-wrapper .frame-top-tip .close-box .ivu-icon{
	transition: all 0.4s ease;
}
.frame-wrapper .frame-top-tip .close-box:hover .ivu-icon{
	transform: rotate(180deg);
} */
.frame-wrapper .ivu-btn.ivu-btn-primary{
	background-color: #565a81;
	/* width: 100px; */
}
.isManage-tip{
	font-size: 12px;
	color: #666;
}

/* 大号的弹框 */
.full-fixd.large>.frame-wrapper{
	max-width: 800px;
	min-width: 520px;
	height: 800px; 
	max-height: 80%;
	overflow: hidden
}

.full-fixd.role-authority > .frame-wrapper{
	overflow: hidden;
	height: 740px;
	max-height: 80%;
}

.full-fixd.role-authority >.frame-wrapper .frame-form-main,
.full-fixd.mid>.frame-wrapper .frame-form-main,
.full-fixd.large>.frame-wrapper .frame-form-main{
	overflow-y: auto;
	max-height: 100%;
}
.full-fixd>.frame-wrapper .frame-form-main .tips{
	margin-top: 10px;
	position: relative;
	height: 0;
	padding-bottom: 30px;
	border-top: 1px #ddd solid;
}
.full-fixd>.frame-wrapper .frame-form-main .tips>div{
	position: absolute;
	left: 0;
	top: -10px;
	height: 20px;
	line-height: 20px;
	padding: 0 15px 0;
	border-left: 3px #59b3ff solid;
	z-index: 2;
	background-color: #fff;
	color: #59b3ff;
}
/* 小号的弹框 */
.full-fixd.small>.frame-wrapper{
	width: 320px;
	height: auto; 
	overflow: visible
}
.full-fixd.min>.frame-wrapper{
	width: 250px;
	height: auto; 
	overflow: hidden
}

/* 中等的 */
.full-fixd.mid>.frame-wrapper{
	max-width: 660px;
	height: auto;
}
</style>
