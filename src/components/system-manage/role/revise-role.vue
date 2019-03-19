<template>
	<frameBox @close="close" :mytitle="frameTitle" classname="small">
		<Form slot="frame-form" ref="formValidate" :rules="ruleValidate" :model="roleData" :label-width="80">						
			<FormItem label="角色名称" prop="Name">
				<Input v-model="roleData.Name" placeholder="角色名称"></Input>
			</FormItem>
			
			<FormItem label="所属公司" prop="CId">
				<Select v-model="roleData.CId" placeholder="选择公司...">
					<Option v-for="(item,index) in companyData" :value="item.Value" :key="index">{{ item.Key }}</Option>
				</Select>
			</FormItem>

			<FormItem style="display: flex; margin-left: -70px; justify-content: center; margin-bottom: 10px;">
				<Button 
					class="scrm-sub-btns" 
					type="primary" 
					@click="handleSubmit('formValidate')"
				>
					保存
				</Button>
			</FormItem>
		</Form>
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
			roleData: Object,
			actionIndex: {
				type: Number,
				default: 0,
			},
			btnTip:{
				type: String,
				default: "新增",
			},
			companyData: Array,
		},
        data () {
            return {
                ruleValidate: {
					Name: [
						{ required: true, type: 'string', message: '请填写角色名称！', trigger: 'blur' },

					],

					CId: [
						{ required: true, type: 'number', message: '请选择所属公司！', trigger: 'blur' },
					]
                },
				isShow: false,
            }
        },
        methods: {
            handleSubmit (name) {
				this.$refs[name].validate((valid) => {
				    if (valid) {
						this.$emit("on-submit", this.roleData);
				    } else {
				        this.$Message.error('表单格式错误!');
				    }
				})
            },
			
			close(data){
				this.$emit("close",data)
			}
        }
    }
</script>