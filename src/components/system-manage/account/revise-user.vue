<template>
	<div class="full-fixd user-fiexd">
		<div class="frame-wrapper">	
			<div class="frame-top-tip">
				<em> {{ isAdd ? "新增用户" : "编辑用户" }} </em>				
				<div class="close-box" @click="removeFrame()">
					<Icon type="md-close" />
				</div>
			</div>
			
			<div class="frame-form-main">
				<Form slot="frame-form" ref="formValidate" :rules="ruleValidate" :model="formItem" :label-width="80">						
					<FormItem label="登录账号" prop="LoginName">
						<Input :disabled = "!isAdd" v-model="formItem.LoginName" placeholder="登录账号"></Input>
					</FormItem>
					
					<FormItem v-if="isAdd" label="登录密码" prop="LoginPwd">
						<Input type="password" v-model="formItem.LoginPwd" placeholder="登录密码"></Input>
					</FormItem>
					
					<FormItem v-if="isAdd" label="确认密码" prop="passwdCheck">
						<Input type="password" v-model="formItem.passwdCheck" placeholder="确认密码"></Input>
					</FormItem>
					
					<FormItem label="真实姓名" prop="RealName">
						<Input v-model="formItem.RealName" placeholder="真实姓名"></Input>
					</FormItem>
					<template>
					<FormItem label="所属部门" prop="Did" style="height: 32px;"> 
						<Dropdown placement="bottom-start" trigger="click" >
							<a href="javascript:void(0)" @click="clickClose">{{formItem.Deptment}}<Icon :type="iosrish"></Icon></a>
    						<DropdownMenu slot="list" v-if="ishow">
    						     <div class="ivu-dropdown-itemss" style="text-indent: 10px; cursor: auto; " v-for="(item, index) in getListData(SeleList.depList, 0)" :key="index">
									<div class="ivu-dropdown-items" @click="changeF(item)">{{item.name }}</div>
									<div class="ivu-dropdown-items" style="padding-left: 20px;" v-for="(o, x) in item.children" :key="x" @click="changeZ(o)">
										{{o.name }}
									</div>
								 </div>
        					</DropdownMenu>
    					</Dropdown>
					</FormItem>
					</template>
					<FormItem label="选择角色" prop="RId">
						<Select 
							:label-in-value = "true"
							@on-change = "roleChange"
							v-model="formItem.RId">
							<Option
								v-for="(item,index) in SeleList.roleList" 
								:value="item.Value" 
								:key="index"
							>
								{{ item.Key }}
							</Option>
						</Select>
					</FormItem>
					
					<FormItem label="部门管理">
						<i-switch v-model="formItem.IsAdminOfDept" size="large">
							<span slot="open">是</span>
							<span slot="close">否</span>
						</i-switch>
						<span class="isManage-tip">（ 提示：总监、组长或需部门管理请选择 ）</span>
					</FormItem>
					<FormItem label="电话号码" prop="CellPhone">
						<Input v-model="formItem.CellPhone" placeholder="输入您的手机号码"></Input>
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
			</div>
		</div>
	</div>
</template>
<script>
	import frameBox from '../../common/frame.vue'
	import md5 from 'md5'
    export default {
		components:{
			frameBox,
		},
		props:{
			formItem:{
				type:Object,
			},
			SeleList: {
				type: Object,
				default(){
					return{
						roleList: [],
						depList: []
					}
				}
			},
			isAdd: {
				type: Boolean,
				default(){
					return false;
				}
			},
			tip: Object,
		},
        data () {
			const validatePassCheck = (rule, value, callback) => {
                if (!this.formItem.Deptment) {
                    callback(new Error('请选择所属部门'));
                } else {
                    callback();
                }
            }
            return {
				txt: '',
				Did: null,
				ishow: false,
				iosrish: 'ios-arrow-down',
                ruleValidate: {
					LoginName: [
						{ required: true, message: '登陆账号不能为空', trigger: 'blur' },
						{ 
							type: 'string',
							pattern: /^[A-z]+\w*$/,
							message: '登陆账号只能是字母和数字，且不能以数字开头', 
							trigger: 'blur'
						}
					],
                    LoginPwd: [
						{ required: true, message: '密码不能为空', trigger: 'blur' },
						{ 
							type: 'string',
							pattern: /^[A-Za-z0-9_-~!@#$%^&*]{6,16}/,
							message: '密码设置的太简单了吧？', 
							trigger: 'blur'
						}
					],
					passwdCheck: [
						{
							validator: this.pwdCheck,
							trigger: 'blur'
						}
					],
					RealName: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' },
						{ 
							type: 'string',
							pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
							message: '姓名只能是字母或者汉字', 
							trigger: 'blur'
						}
					],
					RId: [
						{ required: true, type: 'number', message: '请选择角色', trigger: 'change' },
					],
					Did: [
						// { required: true, type: 'number', message: '请选择部门', trigger: 'change' },
						{validator: validatePassCheck, trigger: 'change'}
					],
					CellPhone: [
						{ required: true, message: '手机号不能为空', trigger: 'blur' },
						{ 
							type: 'string', 
							pattern: /1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}/,
							message: '手机号码格式有误', 
							trigger: 'blur'
						}
					]
                },
				isShow: false,
            }
        },
        methods: {
			clickClose () {
				this.ishow = !this.ishow
				if (this.ishow) {
					this.iosrish = 'ios-arrow-up'
				} else {
					this.iosrish = 'ios-arrow-down'
				}
			},
			changeF (val) {
				this.formItem.Deptment = val.name
				this.iosrish = 'ios-arrow-down'
				this.ishow = false
				this.Did = val.id
			},
			changeZ (val) {
				this.formItem.Deptment = val.name
				this.iosrish = 'ios-arrow-down'
				this.Did = val.id
				this.ishow = false
			},
			getListData (data, pid) {
				var result = [], temp;
  				    for (var i in data) {
  				        if (data[i].pid == pid) {
  				            result.push(data[i])
  				            temp = this.getListData(data, data[i].id)
  				            if (temp.length > 0) {
  				              data[i].children = []
  				              data[i].children = temp
  				            }
  				        }
					}
  				return result
			},
            handleSubmit (name) {
				this.iosrish = 'ios-arrow-down'
				const now = ~~( +new Date / 1000 );	
				this.formItem.CreateDate = now;
				this.formItem.Did = !this.Did ? this.formItem.Did : this.Did;
				const data = JSON.parse( JSON.stringify(this.formItem) );	
				this.$refs[name].validate((valid) => {
					if (valid) {
						if ( this.isAdd ) {
							delete data.passwdCheck;
						}
						this.$emit("reviseUserData",data);
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
			},
			pwdCheck(rule, value, callback ){
				if( value == "" ){
					callback(new Error("请再次输入密码！"));
				}else if( value != this.formItem.LoginPwd ){
					callback(new Error("两次密码不一致！"));
				}else{
					callback()
				}
			},
			// 如果角色名称包含 “组长”“总监”“管理”关键词 就自动判断为管理部门
			roleChange(data){
				if ( data.label.indexOf("组长") > -1 || data.label.indexOf("总监") > -1 || data.label.indexOf("管理") > -1 || data.label.indexOf("经理") > -1 ) {
					this.formItem.IsAdminOfDept = true;			
				} else {
					this.formItem.IsAdminOfDept = false;
				}
			}
        },
    }
</script>

<style lang="less">
	.user-fiexd {
		.ivu-dropdown {
			width: 100%;
			height: 32px;
			.ivu-dropdown-rel {
				width: 100%;
				height: 100%;
				a {
					display: block;
					border: 1px solid #dcdee2;
					box-sizing: border-box;
					cursor: pointer;
					border-radius: 4px;
					height: 100%;
					width: 100%;
					position: relative;
					padding-left: 5px;
					color: #515a6e;
					i {
						position: absolute;
						top: 50%;
						right: 10px;
						transform: translateY(-50%);
					}
				}
				// a:active > i {
				// 	transition: transform 2s;
				// 	transform-origin: center center;
				// 	transform: rotate(180deg);
				// }
			}	
		}
		.ivu-dropdown-menu {
			overflow-x: hidden;
    		overflow-y: scroll;
    		height: 150px;
		}
		.ivu-select-dropdown {
			top: 27px !important;
		}
		.ivu-dropdown-itemss {
			cursor: auto;
		}
		.ivu-dropdown-items:hover {
			background-color: rgb(215, 218, 223);
			cursor: auto;
		}
		.ivu-form-item-content {
			height: 32px;
		}
	}
	
</style>