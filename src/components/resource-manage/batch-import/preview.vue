<template>
	<frameBox @close="close" :mytitle="frameTitle">
		<template slot="frame-form">
			<Table :columns="previewTableHead" :data="previewTableData">
				
			</Table>
		</template>
	</frameBox>
</template>
<script>
	import frameBox from '../../common/frame.vue'
	import { getDate } from '@/libs/tools.js'
	
    export default {
		components:{
			frameBox,
		},
		props:{
			frameTitle:{
				type: String,
				default: "",
			},
// 			previewTableData: {
// 				type: Array,
// 				default(){
// 					return [
// 						{
// 							Name: "测试数据",
// 							CellPhone: "13012341234",
// 							Message: "留言",
// 							Address: "地址"
// 						}
// 					]
// 				}
// 			}
		},
        data () {
            return {                
				previewTableHead: [
					{
						title: "姓名",
						key: "Name"
					},
					{
						title: "手机",
						key: "CellPhone"
					},
					{
						title: "留言内容",
						key: "Message"
					},
					{
						title: "地址",
						key: "Address"
					},
				],
				
				previewTableData: [
					{
						Name: "测试数据",
						CellPhone: "13012341234",
						Message: "留言",
						Address: "地址"
					}
				]
            }
        },
        methods: {
			close(data){
				this.$emit("close",data)
			}
        }
    }
</script>