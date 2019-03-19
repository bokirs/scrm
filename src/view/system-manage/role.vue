<template>
    <div v-if="isVisible" class="role-page-content">
        <!-- 角色管理 -->
		<filterBox>
			<div slot="left" class="flex">
				<div class="input-wrapper">
				  <label>角色名称:</label>
				  <Input v-model="queryData.Name" type="text" placeholder="角色名称" />
				</div>
				
				<Button type="primary" icon="ios-search" @click="handleSearch">查询</Button>
				<!-- <Button type="primary" icon="ios-search" @click="authority(30)">授权</Button> -->
			</div>
			 
			<div slot="right">
				<span>新增角色</span>
				<Button 
					size="large" 
					type="primary" 
					shape="circle" 
					icon="md-person-add"
					@click="addRoleBtn"
				></Button>
			</div>
		</filterBox>
		
		<tableWrapper>
			<Table size="small" stripe :columns="tableColumns" :data="showTableData" slot="table">				
				<template slot-scope="{ row }" slot="Authority">
					<span>{{ authorityToString(row.Authority,row.Name) }}</span>
				</template>
				
				<template slot-scope="{ row }" slot="CreateDate">
					<span>{{ formatDate(row.CreateDate) }}</span>
				</template>
				
				<template slot-scope="{ row, index }" slot="operate">
					<div v-if=" row.Authority >= 0 || roleAuthority == -1 " class="table-btns">
						<a @click=" reviseRole( row, index ) ">编辑</a>
						<a @click=" deleteRole( row.Id,index ) ">删除</a>
						<a @click=" authority( row.Id,index ) ">授权</a>
					</div>
				</template>
			</Table>
			<template slot="paging">
				<paging :pageData="pageData" @on-switch-page="switchPage"></paging>
			</template>
			<template slot="loading">
				<Spin size="large" fix v-if="spinShow">
					<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
					<div>Loading</div>
				</Spin>
			</template>
		</tableWrapper>	
		
		<!-- 新增角色 编辑角色  弹层 -->
		<transition name="slide-fade">
			<addRole 
				:frameTitle="myFrameTitle" 
				:roleData="roleDataPropObj"
				:btnTip = "btnTip"
				:actionIndex = "actionIndex"				
				v-if="showAddRole" 
				@SetRoleData = "SubmitRoleData"
				@close="close">
			</addRole>
		</transition>
		
		<!--超管 新增角色 编辑角色 -->
		<transition name="slide-fade">
			<SAdminAddRole 
				:frameTitle="myFrameTitle" 
				:roleData="SAdminRoleData"
				:companyData = "companyData"
				:btnTip = "btnTip"
				:actionIndex = "actionIndex"				
				v-if="showSAdminAddRole"
				@on-submit = "SAdminSubRole"
				@close="close">
			</SAdminAddRole>
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
		
		<!-- 授权 -->
		<transition name="slide-fade">
			<Impower
				frameTitle="角色授权"
				@close="close"
				:menus = "ImpowerMenus"
				v-if="showImpower"
				@on-sub-authorised = "subAuthority"
			>			
			</Impower>
		</transition>
    </div>
</template>

<script>
	import filterBox from '../../components/common/filter.vue'
	import SAdminAddRole from '../../components/system-manage/role/revise-role.vue'
	import addRole from '../../components/system-manage/role/add-role.vue'
	import tableWrapper from '../../components/common/table-wrapper.vue'
	import Paging from '../../components/common/paging.vue'
	import Delete from '@/components/common/delete.vue'
	import Impower from '@/components/system-manage/role/authority.vue'
	import {dateFtt} from '../../libs/tools.js'
	import { search, _post, _get, _del, _lock, AXIOSrequest, GlobalMsg } from '@/api/query.js'
	import { getDate } from '@/libs/tools.js'
	import { getToken, getAuthority } from '@/libs/util.js'
	
	export default{		
		data(){
			return{
				showImpower: false,
				tableColumns:[
					{
						title:"角色名称",
						key:"Name",
						align: 'center',
					},
					{
						title:"所属公司",
						key:"CName",
						align: 'center',
					},
					{
						title:"角色权限",
						slot:"Authority",
						align: 'center',
					},
					{
						title:"创建时间",
						slot:"CreateDate",
						align: 'center',
					},
					{
					  title: '操作',
					  slot: 'operate',
					  align: 'center',
					}
				],
				tableData:[
					{
						"Id": 16,
						"Name": "售前客服",
						"CId": 1,
						"CName": "商途在线",
						"Authority": 29,
						"CreateDate": 1521014729
					}
				],
				showTableData:[],
				pageData:{
					row: 0,//共多少行
					pageRow: 20,//一页20行 
					pageIndex:1,//当前第一页
					pageSum: 1,//总共2页
					toIndex: 1,//跳转到
				},
				showAddRole:false,
				roleDataPropObj:{},
				showSAdminAddRole: false,
				SAdminRoleData: {},
				companyData: [],
				myFrameTitle: "",
				actionIndex: 0,
				btnTip: "",
				newRoleData:{},
				isDelete: false,// 确认删除弹框
				modal_loading: false,//异步删除
				queryData: {
					"RowIndex": 0,
					"PageCapacity": 20,
					"Name": ""
				},
				RowId: 0,
				RowData: {},
				ImpowerMenus: [],
				spinShow: false,
				isVisible: false,
				companyMap: {},
			}
		},
		methods:{
			// 角色查询
			handleSearch(){
				search("/api/v1/roles/query/" + this.token, this.queryData ).then(res => {
					this.Message(res);
					this.pageData.row = res.data.Ret;
					this.showTableData = res.data.Data;
					// 总页数
					this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow );
				})
			},
			
			// 分页查询
			switchPage(to){
				this.queryData.RowIndex = (to - 1) * 20;
				this.handleSearch()
			},
			
			//操作 - 新增
			addRoleBtn(){
				this.actionIndex = -1;
				this.myFrameTitle = "新增角色";
				this.btnTip = "新增";
				
				if ( this.roleAuthority == -1 ) {
					this.showSAdminAddRole = true;
					this.SAdminRoleData = {}
				} else {
					this.showAddRole = true;
					this.roleDataPropObj = {}
				}
			},
			
			//操作 - 编辑
			reviseRole(row,n){
				this.RowId = row.Id;
				this.RowData = row;
				this.actionIndex = n;
				this.myFrameTitle = "编辑角色";
				this.btnTip = "提交修改";
				if ( this.roleAuthority == -1 ) {					
					this.showSAdminAddRole = true;
					this.SAdminRoleData.Name = this.showTableData[n].Name;
					this.SAdminRoleData.CId = this.showTableData[n].CId;
				} else {
					this.showAddRole = true;
					this.roleDataPropObj.Name = this.showTableData[n].Name;
					const authorityStr = this.authorityToString(this.showTableData[n].Authority);
					const authorityArr = authorityStr.split(",");
					authorityArr.splice(-1,1);
					this.roleDataPropObj.jurisdiction = authorityArr;
				}
			},
			
			// 提交修改
			SubmitRoleData(data){
				const n = this.actionIndex;
				const row = this.showTableData[n];
				if ( this.actionIndex < 0 ) { // 新增
					_post("/api/v1/roles/nonQuery/"+this.token, data).then(res => {
						this.showAddRole = false;
						this.Message(res,'新增成功');
					}).then(()=>{
						this.handleSearch()
					})
				} else {
					data.CName = row.CName
					data.Id = row.Id
					data.CId = row.CId
					
					AXIOSrequest("/api/v1/roles/nonQuery/" + this.token + "_" + row.Id, "PATCH", data).then(res => {
						this.showAddRole = false;
						this.Message(res,'编辑成功');
					}).then(()=>{
						this.handleSearch()
					}).catch(err => console.log(err))
				}
			},

			// 超管 提交修改
			SAdminSubRole(data){
				const isAdd = this.actionIndex < 0 ? true : false;
				const now = ~~(+new Date/1000);
				if ( isAdd ) {
					const newRoleData = {
						"Id": 0,
						"Name": data.Name,
						"CId": data.CId,
						"CName": null,
						"Authority": 0,
						"GetAuthority": "查",
						"CreateDate": now,
						"TmpCreateDate": this.formatDate(now)
					}
					_post("/api/v1/roles/nonQuery/" + this.token, newRoleData).then(res => {
						this.showSAdminAddRole = false;
						this.Message(res,'新增角色成功！');

					}).then(()=>{
						this.handleSearch()
					}).catch(err => console.log(err))
				} else {
					const Authority = this.RowData.Authority;
					const resetRoleData = {
						"Id": this.RowId,
						"Name": data.Name,
						"CId": data.CId,
						"CName": !data.CId ? null : this.companyMap["Value" + data.CId],
						"Authority": Authority,
						"GetAuthority": this.authorityToString(Authority),
						"CreateDate": now,
						"TmpCreateDate": this.formatDate(now)
					}
					AXIOSrequest("/api/v1/roles/nonQuery/" + this.token + "_" + this.RowId, "PATCH", resetRoleData).then(res => {
						this.showSAdminAddRole = false;
						this.Message(res,'编辑成功');
					}).then(()=>{
						this.handleSearch()
					}).catch(err => console.log(err))
				}
			},


			
			// 角色权限  由数字转字符串
			authorityToString(num,roleName){
				const AuthorityMap = ["增","删","改","分","还"], AuthorityList = [];
				if ( num > -1 && num < 32 ) {
					const CheckedArr = num.toString(2).split("").reverse();
					const len = CheckedArr.length;
					if ( len < 5 ) {
						CheckedArr.length = 5;
						CheckedArr.fill("0", len, 5 );
					}
					CheckedArr.forEach((item,index) => {
						if ( item == "1" ) {
							AuthorityList.push(AuthorityMap[index])
						}
					})
					AuthorityList.push("查");
					return AuthorityList.join(",");
				} else if ( num == 95 ){
					AuthorityMap.push("查");
					return AuthorityMap.join(",");
				} else {
					return roleName
				}
			},
			
			//操作 - 删除
			deleteRole(id,n){
				this.RowId = id;
				this.actionIndex = n;
				this.isDelete = true;
			},
			
			// 删除角色
			del(){
				this.isDelete = false;
				AXIOSrequest("/api/v1/roles/delete/"+ this.token + "_" + this.RowId, "DELETE").then(res => {					
					if ( res.status === 200 && !res.data.Err ) {
						this.showTableData.splice(this.actionIndex,1);
						this.$Message.success('删除成功');
					}else{
						this.$Message.error('操作失败，请稍后再试！');
					}
				})
			},
			
			// 授权操作
			authority(id){
				this.RowId = id;
				this.spinShow = true;
				_get("/api/v1/menus/authority/" + this.token + "_" + id).then(res => {
					this.spinShow = false;
					this.Message(res);
					this.ImpowerMenus = res.data.Data;
					this.showImpower = true;
				})
			},
			
			// 提交授权
			subAuthority(mids){
				_post("/api/v1/rolemenus/insert/" + this.token, {
					"RId": this.RowId,
					"MIds": mids
				}).then(res => {
					this.showImpower = false;
					this.Message(res,'角色授权成功！');
				})
			},
			
			// 关闭 弹层
			close(data){
				this.showImpower = 
				this.isDelete = 
				this.showAddRole = 
				this.showSAdminAddRole = 
				this.showReviseRole = false;
			},
			
			// 格式化时间
			formatDate(time){
				return getDate(time, 'year')
			},
			
			// 全局通知，请求反馈
			Message(data,msg){
				return GlobalMsg.call(this,data,msg)
			},
			
			init(){
				const authority = this.roleAuthority;
				if ( authority == -1 ) {					
					_get("/api/v1/company/all/" + this.token).then(res => {
						this.companyData = res.data.Data;
					}).then(() => {
						const companyData = this.companyData;
						let companyMap = {}
						companyData.forEach(item => {
							companyMap["Value" + item.Value] = item.Key;
						})
						this.companyMap = companyMap;
					})
				}
				if ( authority == -2 || authority == -1 ) {
					this.isVisible = true;
				} else {
					this.isVisible = false;
				}
			}
		},
		computed:{
			token(){
				return getToken()
			},
			
			roleAuthority(){
				return getAuthority()
			},
		},
		mounted() {
			this.handleSearch();
			this.init();
		},
		components:{
			filterBox,
			addRole,
			SAdminAddRole,
			tableWrapper,
			Paging,
			Delete,
			Impower
		}
	}
</script>
<style scoped>
.role-page-content{
	min-width: 1300px;
}
</style>