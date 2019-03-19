<template>
	<frameBox 
		classname="role-authority" @close="close" :mytitle="frameTitle">
		<Form slot="frame-form" ref="formValidate" :rules="ruleValidate" :model="authorised">
			<Row type="flex" justify="space-between" :gutter="16">
				<Col v-for="Lv0 in menusTree" :key="Lv0.Id" span="8">
					<Card>
						<Row class-name="menu-type">
							<Checkbox 
								:true-value = "1"
								:false-value = "0"
								:indeterminate = "Lv0.indeterminate"
								@on-change ="handleCheckAllLv0(Lv0)"
								v-model = "Lv0.IsExist">{{ Lv0.Name }}</Checkbox>
						</Row>
						<Row 
							v-for="(Lv1,index) in Lv0.child" :key="Lv1.Id"
							class-name="menu-group"
						>
							<Col span="12">
								<Checkbox
									:true-value = "1"
									:false-value = "0"
									:indeterminate = "Lv1.indeterminate"
									v-model = "Lv1.IsExist" 
									@on-change = "handleCheckAllLv1(Lv0,index)"
								>{{ Lv1.Name }}</Checkbox>
							</Col>
							<Col span="12">
								<div class="menu-items">
									<Checkbox 
										v-for="Lv2 in Lv1.child" 
										:true-value = "1"
										:false-value = "0"
										:key="Lv2.Id"
										v-model = "Lv2.IsExist"
										@on-change = "handleCheckItem(Lv0,index,Lv2)"
									>
										{{ Lv2.Name }}
									</Checkbox>
								</div>
							</Col>
						</Row>	
					</Card>
				</Col>
			</Row>
			<FormItem>
				<Button 
					style="float: right;padding: 10px 40px;" 
					type="primary" 
					@click="handleSubmit('formValidate')">
					授权
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
			authorised: {
				type: Object,
			},
			// 菜单列表
			menus: {
				type: Array,
			}
		},
        data () {
            return {
                ruleValidate: {
					Name: [
						{ required: true, type: 'string', message: '请填写角色名称！', trigger: 'blur' },
					]
                },
				menusTree: [],
				indeterminate: false,
                checkAll: false,
                checkAllGroup: [],
				checkArr: [],
            }
        },
		
        methods: {
            handleSubmit (name) {
				const mids = this.getMIds();
				this.$emit("on-sub-authorised", mids)
            },
			
			close(data){
				this.$emit("close",data)
			},
			
			/* 
			 * 格式化菜单数据 （树状结构）
			 * */
			formatData(){
				const menus = this.menus;
				let arr = [];				
				menus.forEach(m => {
					if ( !m.PId && m.Depth == "0" ) {
						m.indeterminate = false;
						m.child = [];
						arr.push( m )
					} else {
						arr.forEach(list => {
							if ( m.PId === list.Id && m.Depth == "1" ) {
								m.indeterminate = false;
								m.child = [];
								list.child.push(m)
							} else {
								list.child.forEach(item => {
									if ( m.PId === item.Id && m.Depth == "2" ) {
										item.child.push(m)
									}
								})
							}
						})
					}
				})
				
				arr.forEach(parent => {
					if ( parent.IsExist === 1 ) { //如果父项勾选了
						// 子项 没有选的
						const notCheck = parent.child.filter(child => !child.IsExist || child.indeterminate )
						
						if ( notCheck.length > 0 ) { // 如果子项 有未勾选的
							parent.IsExist = 0;
							parent.indeterminate = true;
						} else { // 如果子项都有勾选 判断孙子项 是不是全选
							parent.child.forEach(child => {
								// 孙子项未选的
								const sunNotCheck = child.child.filter(item => !item.IsExist)
								if ( !sunNotCheck.length ) { // 如果孙子项是全选的
									child.IsExist = 1;
									child.indeterminate = false;
									parent.IsExist = 1;
									parent.indeterminate = false;
								} else if ( sunNotCheck.length < child.child.length ) { //孙子项选了部分
									child.IsExist = 0;
									child.indeterminate = true;
									parent.IsExist = 0;
									parent.indeterminate = true;
								} else { // 孙子全没选
									child.IsExist = 0;
									child.indeterminate = false;
								}
							})
						}
					}
				})
				this.menusTree = arr;
			},

			// 一级菜单全选
			handleCheckAllLv0(data){
				data.indeterminate = false;
				if ( !data.IsExist ) {
					data.child.forEach(group => {
						group.IsExist = 0;
						group.indeterminate = false;
						group.child.forEach(item => {
							item.IsExist = 0;
						})
					})
				} else {
					data.child.forEach(group => {
						group.IsExist = 1;
						group.indeterminate = false;
						group.child.forEach(item => {
							item.IsExist = 1;
						})
					})
				}
			},
			
			// 二级菜单全选
			handleCheckAllLv1(data,index){
				/*
				* 
				* */
				const thisItem = data.child[index]; // 当前项数据
				thisItem.indeterminate = false; // 部分选择状态 设置为false
				
				if ( !thisItem.IsExist ) {
					thisItem.child.forEach(item => {
						item.IsExist = 0
					});
					
					const isChecked = data.child.filter(group => group.IsExist > 0 || group.indeterminate );
					if ( isChecked.length > 0 ) {
						data.IsExist = 0;
						data.indeterminate = true;
					} else {
						data.IsExist = 0;
						data.indeterminate = false;
					}
				} else {
					thisItem.child.forEach(item => {
						item.IsExist = 1
					});
					
					const notCheck = data.child.filter(group => !group.IsExist );
					if ( notCheck.length > 0 ) {
						data.IsExist = 0;
						data.indeterminate = true;
					} else {
						data.IsExist = 1;
						data.indeterminate = false;
					}
				}
			},
			
			/* 
			* 三级菜单 选中状态改变
			* {formItemData} 当前一级菜单的数据
			* {groupIndex} 当前二级菜单位于一级菜单的索引
			* */
			handleCheckItem(formItemData,groupIndex,thisItem){
				const parent = formItemData.child[groupIndex];
				if ( thisItem.IsExist === 1 ) {
					const notCheck = parent.child.filter(brothers => brothers.IsExist === 0)
					if ( notCheck.length > 0 ) {
						formItemData.indeterminate = 
						parent.indeterminate = true;
						formItemData.IsExist = 
						parent.IsExist = 0;
					} else {
						parent.indeterminate = false;
						parent.IsExist = 1;
						const uncleNotCheck = formItemData.child.filter(uncle => uncle.IsExist === 0)
						if ( uncleNotCheck.length > 0 ) {
							formItemData.indeterminate = true;
							formItemData.IsExist = 0;
						} else{
							formItemData.indeterminate = false;
							formItemData.IsExist = 1;
						}
					}
				} else {
					const isChecked = parent.child.filter(brothers => brothers.IsExist === 1)
					if ( isChecked.length > 0 ) {
						formItemData.indeterminate = 
						parent.indeterminate = true;
						formItemData.IsExist = 
						parent.IsExist = 0;
					} else {
						parent.indeterminate = false;
						parent.IsExist = 0;
						const uncleHasChecked = formItemData.child.filter(uncle => uncle.IsExist === 1)
						if ( uncleHasChecked.length < 1 ) {
							formItemData.indeterminate = false;
							formItemData.IsExist = 0;
						} else {
							formItemData.indeterminate = true;
							formItemData.IsExist = 0;
						}
					}
				}
			},
			
			/* 
			 * 选中的项的ID
			 * 
			 * */
			getMIds(){
				let MIds = [];
				this.menusTree.forEach(group => {
					if ( group.IsExist === 1 || group.indeterminate ) {
						if ( !MIds.includes(group.Id) ) {
							MIds.push( group.Id )
						}
						group.child.forEach(_class => {
							if ( _class.IsExist === 1 || _class.indeterminate ) {
								
								if ( !MIds.includes(_class.Id) ) {
									MIds.push( _class.Id )
								}								
								_class.child.forEach(item => {
									if ( !MIds.includes(item.Id) && item.IsExist === 1 ) {
										MIds.push( item.Id )
									}
								})
							}
						})
					}
				})
				return MIds.join(",");
			}
        },
		
		mounted(){
			this.formatData()
		},
    }
</script>

<style scoped>
	.ivu-card.ivu-card-bordered{
		height: 560px;
		margin-bottom: 20px;
	}
	.ivu-checkbox-wrapper{
		position: relative;
		z-index: 2;
	}	
</style>
<style>
	.role-authority > .frame-wrapper{
		max-width: 1000px;
		width: 90%;
	}
	.menu-type:after{
		content: "";
		position: absolute;
		display: block;
		height: 0;
		width: 160px;
		border-bottom: 1px dashed #ddd;
		right: 0;
		top: 50%; 
		visibility: visible;
	}
	.menu-type:before{
		content: "";
		position: absolute;
		display: block;
		height: 35px;
		width: 0;
		border-left: 1px dashed #ddd;
		left: 7px;
		top: 22px; 
		visibility: visible;
	}
	.menu-type label{
		font-size: 18px;
	}
	.menu-group{
		margin: 20px 0 20px 30px;
		position: relative;
		display: flex;
	}
	.menu-group:after{
		content: "";
		position: absolute;
		display: block;
		height: 0;
		width: 22px;
		border-bottom: 1px dashed #ddd;
		left: -22px;
		top: 9px; 
		visibility: visible;
	}
	.ivu-card-body > :nth-child(2):before {
		border-left: none !important;
	}
	.ivu-card-body > .menu-group:before {
		content: "";
		position: absolute;
		display: block;
		visibility: visible;
		height: 85px;
		border-left: 1px dashed #ddd;
		top: -77px;
		left: -23px;
	}
	.menu-items{
		display: flex;
		flex-flow: column;
	}
	.menu-items > label{
		margin-bottom: 14px;
		position: relative;
	}
	.menu-items > label:after{
		position: absolute;
		content: "";
		display: block;
		visibility: visible;
		height: 14px;
		width: 0;
		left: 7px;
		top: -15px;
		border-left: 1px dashed #ddd;
	}
	.menu-items > label:first-child:after{
		border-left: none;
		content: "";
		display: block;
		visibility: visible;
		position: absolute;
		z-index: 1;
		width: 46px;
		height: 0;
		top: 50%;
		left: -47px;
		border-bottom: 1px dashed #ddd;
	}
</style>