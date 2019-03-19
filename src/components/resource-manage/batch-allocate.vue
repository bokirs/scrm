<template>
	<frameBox @close="close" :mytitle="frameTitle" classname="small">
		<template slot="frame-form">
			<Form ref="batch-allocate" :rules="ruleValidate" :model="sel" class="batch-allocate clear" :label-width="50">
				<Row :gutter="8">
					<Col span="24">
						<FormItem label="所属组" prop="Dindex">
							<Select :number="true" v-model="sel.Dindex">
								<Option 
									v-for="(group,index) in DepartmentList" 
									:value="index" 
									:key="group.DId"> 
									{{ group.groupName }} 
								</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
					
				<Row :gutter="8">	
					<Col span="24">
						<FormItem label="业务员" prop="UId">
							<Select :number="true" v-model="sel.UId">
								<Option 
									v-for="p in pData"
									:value="p.UId"
									:key="p.UId"> 
									{{ p.UName }} 
								</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				
				<FormItem style="display: flex; margin-left: -50px; justify-content: center; margin-bottom: 10px;">
					<Button style="width: 260px;" type="primary" @click="handleSubmit('batch-allocate')">
						提交
					</Button>
				</FormItem>
			</Form>
		</template>
	</frameBox>
</template>

<script>
	import frameBox from '../common/frame.vue'
	export default {
		props:{
			isShow:{
				type: Boolean,
				default: false,
			},
			frameTitle:{
				type: String,
				default: '批量分配',
			},
			DepartmentList: {
				type: Array,
				default(){
					return [
						{
							DId: null,
							groupName: null,
							personnels: [
								{
									UId: null,
									pName: null
								}
							]
						}
					]
				}
			},
			
		},
		data() {
			return {
				sel: {
					Dindex: null,
					UId: 0,
				},
				ruleValidate: {
// 					Dindex: [
// 						{ required: true, message: '请选择所属组', trigger: 'change' },						
// 					],
// 					UId: [
// 						{ required: true, message: '请选择业务员', trigger: 'change' },
// 					],
				}
			};
		},
		methods:{
			close(data){
				this.$emit("close",data);
			},
			handleSubmit(name){	
				this.$emit("on-allocate-user", {
					DId: this.DId,
					UId: this.sel.UId
				});
			}
		},
		components:{
			frameBox,
		},
		computed: {
			pData(){
				return  this.sel.Dindex == undefined  ?  [] : this.DepartmentList[this.sel.Dindex].personnels
			},
			DId(){
				return this.sel.Dindex == undefined  ?  undefined : this.DepartmentList[this.sel.Dindex].DId *1
			}
		}
	}
</script>

<style>

</style>
