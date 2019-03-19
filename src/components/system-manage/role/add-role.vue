<template>
	<frameBox @close="close" :mytitle="frameTitle">
		<Form slot="frame-form" ref="formValidate" :rules="ruleValidate" :model="roleData" :label-width="80">						
			<FormItem label="角色名称" prop="Name">
				<Input v-model="roleData.Name" placeholder="角色名称"></Input>
			</FormItem>
			
			<FormItem label="权限授予" prop="jurisdiction">
				<CheckboxGroup v-model="roleData.jurisdiction">
					<Checkbox label="增">
						<Icon type="md-add-circle" />
						<span>增加</span>
					</Checkbox>
					<Checkbox label="删">
						<Icon type="ios-trash" />
						<span>删除</span>
					</Checkbox>
					<Checkbox label="改">
						<Icon type="md-clipboard" />
						<span>修改</span>
					</Checkbox>
					<Checkbox label="分">
						<Icon type="md-disc" />
						<span>分配</span>
					</Checkbox>
					
					<Checkbox label="还">
						<Icon type="ios-undo" />
						<span>还原</span>
					</Checkbox>
				</CheckboxGroup>
			</FormItem>			

			<FormItem>
				<Button 
					type="primary" 
					class="scrm-sub-btns"
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
			roleData: {
				type: Object,
				default(){
					return {
						roleName: "",
						jurisdiction: [],
					}
				}
			},
			actionIndex: {
				type: Number,
				default: 0,
			},
			btnTip:{
				type: String,
				default: "新增",
			}
		},
        data () {
            return {                
				//formItem: formItemData,
                ruleValidate: {
					Name: [
						{ required: true, type: 'string', message: '请填写角色名称！', trigger: 'blur' },
					]
                },
				isShow: false,
				AuthorityArrMap: ["增","删","改","分","还","查"],
				AuthorityObjMap: {
					"查": 0,
					"增": 1,
					"删": 2,
					"改": 4,
					"分": 8,
					"还": 16
				}
            }
        },
        methods: {
            handleSubmit (name) {  
				let AuthorityArr = [];
				this.$refs[name].validate((valid) => {
				    if (valid) {
						const createTime = parseInt( +new Date / 1000 );
						AuthorityArr = this.roleData.jurisdiction;
						let Authority = 0, arr = [], GetAuthority;
						
						AuthorityArr.forEach((item,index) => { 
							Authority += this.AuthorityObjMap[item] *1;
						})
						if ( !AuthorityArr.includes( this.AuthorityArrMap[5] ) ) {
							AuthorityArr.push("查");
						}
						GetAuthority = AuthorityArr.join();
						const newRoleData = {
							"Id": 0,
							"Name": this.roleData.Name,
							"CId": 0,
							"CName": null,
							"Authority": Authority,
							"GetAuthority": GetAuthority,
							"CreateDate": createTime,
							"TmpCreateDate": getDate(createTime,"year")
						}
						this.$emit("SetRoleData", newRoleData);
				    } else {
				        this.$Message.error('表单格式错误!');
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