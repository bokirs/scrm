<template>
	<frameBox @close="close" :mytitle="frameTitle">
		<Form slot="frame-form" ref="formValidate" :rules="ruleValidate" :model="customData" :label-width="50">						
			<FormItem label="名称" prop="Name">
				<Input v-model="customData.Name" placeholder="名称" clearable></Input>
			</FormItem>
			
			<FormItem label="类型" prop="Type">
				<Select v-model="customData.Type" style="width:100%;" clearable>
					<Option v-for="item in typeList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
				</Select>
			</FormItem>
			
			<FormItem label="备注" prop="Remark">
				<Input v-model="customData.Remark" type="textarea" :rows="4" placeholder="填写备注..." />
			</FormItem>

			<FormItem>
				<Button type="primary" class="scrm-sub-btns"  @click="handleSubmit('formValidate')">
					{{ btnTip }}
				</Button>
			</FormItem>
		</Form>				
	</frameBox>
</template>
<script>
	import frameBox from '../../common/frame.vue'
	
    export default {
		components:{
			frameBox,
		},
		props:{
			frameTitle:{
				type: String,
				default: "",
			},
			customData: {
				type: Object,
				default(){
					return {
						CName:"",
						Name:"",
						Type: Number,
						Remark: "",
						CreateDate:''
					}
				}
			},
			actionIndex: {
				type: Number,
				default: 0,
			},
			btnTip:{
				type: String,
				default: "保存",
			}
		},
        data () {
            return {
				ruleValidate: {
					Type: [{ required: true, type: 'number', message: '必选', trigger: 'change' }],
				 	Name: [{ required: true, message: '必填', trigger: 'blur' }],
				 	Remark: [{ required: true, message: '必填', trigger: 'blur' }],
				},
				typeList: [
					{
						value: 1,
						label: '资源',
					},
					{
						value: 2,
						label: '关键词',
					},
					{
						value: 3,
						label: '合同类型',
					},
				],				
            }
        },
        methods: {
            handleSubmit (name) {
				this.typeList.map(item => {
					if (this.customData.Type === item.value) {
						this.customData.TypeDesc = item.label
					}
				})    				
				this.$refs[name].validate((valid) => {
					if (valid) {
						// console.log( this.customData )
						this.$emit("setCustomData",this.customData);
				    } else {
						this.$Message.error('表单格式错误!');
						return false
				    }
				})
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
			removeFrame(){
				this.$emit( "removeFrame", false )
			},
			close(data){
				this.$emit("close",data)
			}
        }
    }
</script>