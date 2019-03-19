<template>
	<frameBox @close="close" :mytitle="frameTitle">
		<Form slot="frame-form" ref="formValidate" :rules="ruleValidate"  :model="companyData" :label-width="80">						
			<FormItem label="部门名称" prop="Name">
				<Input v-model="companyData.Name" placeholder="部门名称" clearable></Input>
			</FormItem>
			
			<FormItem label="父级部门" prop="PId">
				<Select v-model="companyData.PId" style="width:100%;" @on-change="selectChange"  clearable>
					<Option v-for="item in departmentList" :value="item.Value" :key="item.Value">{{item.Key}}</Option>
				</Select>
			</FormItem>
			
			<FormItem label="备注" prop="Remark">
				<Input v-model="companyData.Remark" type="textarea" :rows="4" placeholder="备注必填..." />
			</FormItem>

			<FormItem>
				<Button type="primary"  class="scrm-sub-btns" @click="handleSubmit('formValidate')">
					{{ btnTip }}
				</Button>
			</FormItem>
		</Form>				
	</frameBox>
</template>
<script>
	import frameBox from '../../common/frame.vue'
	import { search, _post, _get, _del, _lock, AXIOSrequest } from '@/api/query.js'
	import { getDate } from '@/libs/tools.js'
	import { getToken } from '@/libs/util.js'
	
    export default {
		components:{
			frameBox,
		},
		props:{
			frameTitle:{
				type: String,
				default: "",
			},
			actionIndex: {
				type: Number,
				default: 0,
			},
			btnTip:{
				type: String,
				default: "保存",
			},
			companyData: {
				type: Object,
				default(){
					return {
						Id: null,
						CId: null,
						PId: null,
						Name: '',
						CName: '',
						CreateDate: '',
						TmpCreateDate: '',
						PName: '',
						Remark: ''
					}
				}
			}
		},
        data () {
            return {
                ruleValidate: {
					PId: [{ required: true, type: 'number', message: '必选', trigger: 'change' }],
				 	Name: [{ required: true, message: '必填', trigger: 'blur' }],
				 	Remark: [{ required: true, message: '必填', trigger: 'blur' }],
				},
				departmentList: []
            }
		},
		computed: {
			token () {
				return getToken()
			}
		},
		methods: {
			selectChange (row) {
				
			},
            handleSubmit (name) {
				this.departmentList.map(item => {
					if (this.companyData.PId === item.PId) {
						this.companyData.PName = item.PName
					} 
				})			
				this.$refs[name].validate((valid) => {
				    if (valid) {
						this.$emit('setData', this.companyData)				        
				    } else {
				        this.$Message.error('表单格式错误!');
				    }
				})
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
			close(data){
				this.$emit("close",data)
			},
			getSelectDataList () {
				_get('/api/v1/deptment/part/' + this.token).then(res => {
					if (res.data.Err === 0) {
						this.departmentList = res.data.Data;
						this.departmentList.unshift({
							"Value": 0,
							"Key": "-根部门-"
						})
					}
				})
			}
		},
		mounted () {
			this.getSelectDataList()
		}
    }
</script>