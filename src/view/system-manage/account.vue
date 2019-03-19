<template>
 <section class="account-page">
	<filterBox>
		<div slot="left" class="flex">
			<div class="input-wrapper">
			  <label>登录名称:</label>
			  <Input type="text" v-model="queryData.LoginName" placeholder="登录名称" />
			</div>
			<div class="input-wrapper">
			  <label>真实名称:</label>
			  <Input type="text" v-model="queryData.RealName" placeholder="真实名称" />
			</div>			
			<Button type="primary" icon="ios-search" @click="handleSearch">查询</Button>
		</div>
		<div slot="right">
			<span>新增用户</span>
			<Button 
				size="large" 
				type="primary" 
				shape="circle" 
				icon="md-person-add"
				@click="addUser"
			></Button>
		</div>
	</filterBox>
	
	
	<tableWrapper>
		<Table size="small" stripe :columns="tableColumns" :data="tableData" slot="table">
			
			<template slot-scope="{ row }" slot="IsAdminOfDept">
				<span>{{ formatAdmin(row.IsAdminOfDept) }}</span>
			</template>
			<template slot-scope="{ row }" slot="CreateDate">
				<span>{{ formatDate(row.CreateDate) }}</span>
			</template>
			
			<template slot-scope="{ row, index }" slot="operate">
				<div class="table-btns">
					<a @click=" reviseUser( row ) ">编辑</a>
					<a @click=" deleteUser( row.Id,index ) ">删除</a>
					<Poptip
						confirm
						:title="'您确定' + '重置密码' + '吗？'"
						@on-ok="reset(row.Id)"
						@on-cancel="cancel">
						<a> 重置 </a>
					</Poptip>
				</div>	
			</template>
		</Table>
		<template slot="paging">
			<paging :pageData="pageData" @on-switch-page="switchPage"></paging>
		</template>
		<template slot="loading">
		  <Spin size="large" fix v-if="spinShow">
		    <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
		    <div>Loading</div>
		  </Spin>
		</template>
	</tableWrapper>
	
	<!-- 编辑用户信息 弹层 -->
	<transition name="slide-fade">
		<revise-user
			:isAdd="isAdd"
			:formItem="propsObj"
			:SeleList = "SeleList"
			v-if="showReviseUser"  
			@removeFrame="close"
			@reviseUserData="SubmitRevise"
		>
		</revise-user>
	</transition> 
	
	<!-- 确定删除弹层 -->	
	<transition name="slide-fade">
		<Delete 
			@close="close" 
			@on-cancle="close" 
			@on-confirm="del" 
			v-if="isDelete">
		</Delete>
	</transition> 
 </section>
</template>
<script>

import reviseUser from '@/components/system-manage/account/revise-user.vue'
import filterBox from '@/components/common/filter.vue'
import frameBox from '@/components/common/frame.vue'
import tableWrapper from '@/components/common/table-wrapper.vue'
import Paging from '@/components/common/paging.vue'
import Delete from '@/components/common/delete.vue'
import {dateFtt} from '@/libs/tools.js'
import { getToken } from '@/libs/util.js'
import { search, _post, _get, _del, AXIOSrequest, GlobalMsg } from '@/api/query.js'
import { getDate } from '@/libs/tools.js'
import md5 from 'md5'

export default {  
	data () {
		return {
			spinShow: false,
			queryData: {
				"RowIndex": 0,
				"PageCapacity": 20,
				"LoginName": "",
				"RealName": "",
			},
			isDelete: false,
			delUserIndex:0,
			tableColumns: [
				{
					title: '所属公司',
					key: 'CName'
				},
				{
					title: '登录账号',
					key: 'LoginName'
				},
				{
					title: '真实姓名',
					key: 'RealName'
				},
				{
					title: '所属角色',
					key: 'RName'
				},
				{
					title: '所属部门',
					key: 'Deptment'
				},
				{
					title: '是否是部门管理员',
					slot: 'IsAdminOfDept'
				},
				{
					title: '手机号码',
					key: 'CellPhone'
				},
				{
					title: '创建时间',
					slot: 'CreateDate'
				},
				{
					title: '操作',
					slot: 'operate'
				}
			],
			tableData: [ ],
			pageData:{
				row:36,//共多少行
				pageRow: 20,//一页20行 
				pageIndex:1,//当前第一页
				pageSum:2,//总共2页
				toIndex:1,//跳转到
			},
			// show: false,
			showReviseUser: false,
			propsObj: {},
			SeleList: {
				
			},
			isAdd: false,//是新增 还是 编辑
			RowId: null,
			RowData: {}, // 操作的当前行数据
			dataInited: false, //是否获取了部门和角色数据
		}
	},
	computed:{
		token(){
			return getToken()
		}
	},
	methods: {
		// 查询
		handleSearch(){
			search("/api/v1/users/query/" + this.token,
				this.queryData
			).then(res => {
				this.tableData = res.data.Data;
				this.pageData.row = res.data.Ret;
				// 总页数
				this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow );
				GlobalMsg.call(this,res)
			}).catch(err => console.log(err))
		},	
		
		//翻页
		switchPage(to){
			this.queryData.RowIndex = (to - 1) * 20;
			search("/api/v1/users/query/" + this.token,
				this.queryData
			).then(res => {
				this.tableData = res.data.Data;
			}).catch(err => console.log(err))
		},
		
		// 编辑
		reviseUser (data) {
			this.isAdd = false;
			this.RowData = data;
			this.propsObj = JSON.parse( JSON.stringify(data) ) ;
			this.propsObj.IsAdminOfDept = !data.IsAdminOfDept ? false : true;
			this.getSeleList(() => {
				this.showReviseUser = true;
			});
		},
		
		// 新增用户
		addUser(){
			this.isAdd = true;
			this.propsObj = {};
			this.getSeleList(() => {
				this.showReviseUser = true;
			});
		},
		
		//提交修改
		SubmitRevise(data){
			const formData = JSON.parse( JSON.stringify(data) );
			formData.RName = this.SeleList.roleListMap["Value"+data.RId];
			formData.Deptment = !data.Did ?  "" : this.SeleList.depListMap["Value" + data.Did];
			formData.IsAdminOfDept = !data.IsAdminOfDept ? false : true;
			formData.TmpCreateDate = this.formatDate(data.CreateDate);
			if ( this.isAdd ) {
				formData.Id = 0;
				formData.CId = 0;
				formData.CName = null;
				formData.LoginPwd = md5(data.LoginPwd);
				AXIOSrequest("/api/v1/users/insert/" + this.token,"post", formData).then(res => {
					this.showReviseUser = false;
					GlobalMsg.call(this,res,"添加成功！")
				}).then(() => {
					this.handleSearch();
				}).catch(err => console.log(err))
			} else {
				formData.Id = this.RowData.Id;
				formData.CId = this.RowData.CId;
				formData.CName = this.RowData.CName;
				formData.LoginPwd = null;
				AXIOSrequest("/api/v1/users/update/" + this.token + "_" + formData.Id, "PATCH", formData).then(res => {
					this.showReviseUser = false;
					GlobalMsg.call(this,res,"修改成功！")
				}).then(() => {
					this.handleSearch();
				}).catch(err => console.log(err))
			}
			
		},		

		// 操作删除
		deleteUser (id,n) {
			this.RowId = id
			this.delUserIndex = n;
			this.isDelete = true;
		},
		
		// 确认删除
		del(){
			this.isDelete = false;
			AXIOSrequest("/api/v1/users/delete/" + this.token + "_" + this.RowId, "DELETE").then(res => {
				if ( res.status === 200 && !res.data.Err ) {
					this.tableData.splice(this.delUserIndex,1);
				}
				GlobalMsg.call(this,res,"删除成功！")
			})
		},
		cancel(){
			
		},

		// 重置
		reset(id){
			const data = {
				"OldPwd": "",
				"NewPwd": "e9bc0e13a8a16cbb07b175d92a113126",
				"Type": 1
			}
			AXIOSrequest( "/api/v1/users/modify/" + this.token + "_" + id, "PATCH", data).then(res => {
				GlobalMsg.call(this,res,"重置成功！")
			}).catch(err => console.log(err))
		},

		close ( data ) {
			this.isDelete =
			this.showReviseUser = false;
		},
		
		formatAdmin(type){
			return !type ? "否" : "是";
		},
		formatDate(time){
			return time.toString().length === 10 && typeof time === 'number' ? getDate( time, 'year') : time;
		},
		// 获取角色、部门信息
		getSeleList(callback){
			if ( this.dataInited ) {
				callback();
				return false;
			} else {
				this.spinShow = true;
				Promise.all([this.getDeptment(),this.getRoles()]).then(() => {
					this.spinShow = false;
					// 确保获取 部门和角色 的请求只执行一次
					this.dataInited = true;
					callback();
				}).catch(err => console.log(err));
			}
		},
		/* 获取角色列表 */
		getRoles(){
			return _get("/api/v1/roles/part/" + this.token).then(res => {
				const roleList = res.data.Data;
				this.SeleList.roleList = roleList;
				let roleListMap = {};
				roleList.forEach((item,index) => {
					roleListMap["Value" + item.Value] = item.Key;
				})
				this.SeleList.roleListMap = roleListMap;
			})
		},
		/* 获取部门列表 */
		getDeptment(){
			let url = "/api/v1/deptment/all/" + this.token + "_0";
			return _get(url).then(res => {
				const depList = res.data.Data;
				this.SeleList.depList = depList;
				let depListMap = {};
				depList.forEach(item => {
					depListMap["Value" + item.Value] = item.Key;
					
				})
				const arr = depList.filter(item => item.pid === 0);
				arr.forEach(group => {
					let children = [];
					depList.forEach(item => {
						if ( item.pid != 0 && item.pid == group.id ) {
							children.push( item )
						}
					})
					group.child = children;
				})
				this.SeleList.depListMap = depListMap;
				this.SeleList.depListArr = arr;
			})
		},
	},
	mounted() {
		this.handleSearch();
	},
	components:{
		filterBox,
		reviseUser,
		tableWrapper,
		Paging,
		Delete,
		frameBox,
	},
}
</script>
<style>
.account-page{
	min-width: 1200px;
}
</style>