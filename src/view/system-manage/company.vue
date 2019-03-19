<template>
    <div class="scrm-page-content system-manage-company">
        <filterBox>
        	<div slot="left" class="flex">
        		<div class="input-wrapper">
        		  <label>部门名称:</label>
        		  <Input type="text" placeholder="部门名称"  v-model="filter.searchTxt"  clearable/>
        		</div>
							<Button type="primary" icon="ios-search" @click="searchData">查询</Button>
        	</div>
        	
        	<div slot="right" v-author="authorObj.add">
        		<span>新增部门</span>
        		<Button 
        			size="large" 
        			type="primary" 
        			shape="circle" 
        			icon="md-person-add"
        			@click="reviseCompany(-1)"
        		></Button>
        	</div>
        </filterBox>
		
		<tableWrapper>
			<Table size="small" stripe :columns="tableHeadData" :data="showTableData" slot="table">
				<template slot-scope="{ row }" slot="name">
					<strong>{{ row.company }}</strong>
				</template>
				<template slot-scope="{ row, index }" slot="operate">
					<div  class="table-btns">
						<a   @click="editor(row, index)" v-author="authorObj.updat">编辑</a>
						<a   @click="deletes(row, index)" v-author="authorObj.del">删除</a>
					</div>
					
				</template>
				<template slot-scope="{ row }" slot="CreateDate">
						<span v-cloak  v-html="formatDate(row.CreateDate)"></span>
				</template>
			</Table>
			<paging slot="paging" :pageData="pageData"  @on-switch-page="switchPage"></paging>
		</tableWrapper>
		
		<!-- 弹层 -->
		<transition name="slide-fade">
			<reviseCompanyFrame
				v-if="showReviseCompany"
				:frameTitle="myFrameTitle" 
				:companyData ="companyDataPropObj"
				:btnTip = "btnTip"
				:actionIndex = "actionIndex"
				@setData = "submitData"
				@close = "removeFrame"
			>
			</reviseCompanyFrame>
		</transition>
		
		<!-- 确定删除弹框 -->
		<transition name="slide-fade">
			<Delete 
				@close="removeFrame" 
				@on-cancle="removeFrame" 
				@on-confirm="del" 
				v-if="isDelete">
			</Delete>
		</transition>

    </div>
</template>
<script>
	import filterBox from '../../components/common/filter.vue'
	import tableWrapper from '../../components/common/table-wrapper.vue'
	import Paging from '../../components/common/paging.vue'
	import reviseCompanyFrame from '../../components/system-manage/company/revise-company.vue'
	import Delete from '@/components/common/delete.vue'
	import {dateFtt} from '../../libs/tools.js'
	import { search, _post, _get, _del, _lock, AXIOSrequest } from '@/api/query.js'
	import { getDate } from '@/libs/tools.js'
	import { getToken, getAuthority, setAutorArr, uniq, swicthCase } from '@/libs/util.js'
	
	export default{
		data(){
			return{
				authorObj: {},
				row: {},
				searchTxt: '', // 查询搜索
				tableHeadData:[
					{
						title:"部门名称",
						key:"Name",
						align: 'center',
					},
					{
						title:"公司名称",
						key:"CName",
						align: 'center',
					},
					{
						title:"父级部门",
						key:"PName",
						align: 'center',
					},
					{
						title:"创建时间",
						slot:"CreateDate",
						align: 'center',
					},
					{
						title:"备注",
						key:"Remark",
						align: 'center',
					},					
					{
					  title: '操作',
					  slot: 'operate',
					  align: 'center',
					}
				],
				filter: {
					searchTxt: '',
					RowIndex: 0,
					PageCapacity: 20
				},
				row: {}, //操作删除记录当前的row
				showTableData:[//展示数据
				   {
						 "Id": 30,
						"CId": 8,
						"CName": "武汉中智颢天科技有限公司",
						"PId": 4,
						"PName": "业务部",
						"Name": "电销三组",
						"Remark": "电话销售三组",
						"CreateDate": 1542072620
					 }
				], 
				actionIndex: null, //操作 索引值
				pageData:{  //分页数据
					row:20,//共多少行
					pageRow: 20,//一页20行 
					pageIndex:1,//当前第一页
					pageSum:2,//总共2页
					toIndex:1,//跳转到
				},
				showReviseCompany: false,
				companyDataPropObj:{}, //表单填充数据
				isDelete: false,
				modal_loading: false,
			};
		},
		computed: {
			token () {
				return getToken()
			},
			AuthorArrList () {
				return this.$store.getters.AuthorArrs
			}
		},
		methods:{
			getBlock () {
				let list = []
				this.authorObj =  swicthCase(uniq(setAutorArr(getAuthority(), list)));
				if (!this.authorObj.updat && !this.authorObj.del && getAuthority() >= 0) {
					if (this.tableHeadData.length > 5) {
							this.tableHeadData.splice(this.tableHeadData.length - 1, 1)
					}
				} else {
					if (this.tableHeadData.length <= 5) {
							this.tableHeadData.push({
								title: '操作',
								slot: 'operate',
								align: 'center',
							})
					}
				}
			},
			formatDate(time) { //格式化时间
      		return getDate(time, "year")
    	},
			// 模拟数据
			mimeticData(){
				const item = {
					department:"售前客服",
					company: "公共序列",
					parentDepartment: "综合服务部",					
					createTime: "2019-01-15 16:40:52",
					comments: "客服",
				}
				for(let i=0;i<9;i++ ){
					this.showTableData.push( item );				
				}
			},
			editor (row, index) { //编辑
				this.showReviseCompany = true;
				// 避免直接赋值带来的双向绑定效果（表单修改表格数据同步修改了）
				this.companyDataPropObj = Object.assign({},row);
				this.myFrameTitle = '编辑部门';
				this.btnTip = '保存';
				this.actionIndex = index;
			},
			deletes (row) {
				this.row = row
				this.isDelete = true
			},
			// 新增、编辑 操作
			reviseCompany(n){
				this.actionIndex = n;
				this.showReviseCompany = true;
				if ( n < 0 ) {//新增
					this.myFrameTitle = "新增部门";
					this.btnTip = "保存";
					this.companyDataPropObj = {};
				} else{//编辑
					this.myFrameTitle = "编辑部门";
					this.btnTip = "保存";
					this.companyDataPropObj = JSON.parse( JSON.stringify(this.showTableData[n]) );					
				}
			},
			// 删除操作
			deleteCompany(n){
				this.actionIndex = n;
				this.isDelete = true;
			},
			// 确定删除
			del () {
				this.isDelete = false;
				AXIOSrequest('/api/v1/deptment/delete/' + this.token + '_' + this.row.Id, 'delete').then(res => {
						if (res.data.Err === 0) {
							setTimeout(()=>this.$Message.success('删除成功'),600)
						} else {
								setTimeout(()=>this.$Message.error('删除失败'),600)
						}
							 this.searchData()
					})
			},
			// 关闭
			removeFrame(data){
				this.isDelete =
				this.showReviseCompany = false;
			},
			// 提交
			submitData(data){
				let now = Math.ceil(new Date().getTime() / 1000)
				let params = {
					Id: data.Id,
					CId: data.CId,
					PId: data.PId,
					Name: data.Name,
					CName: data.CName,
					CreateDate: now,
					TmpCreateDate: this.formatDate(now),
					PName: data.PName,
					Remark: data.Remark
				}				
				if ( this.actionIndex < 0 ) {
						params.CName = "公共序列";
						params.Id = 0
						params.CId = 0
					_post('/api/v1/deptment/nonQuery/' + this.token, params).then(res => {
						if (res.data.Err === 0) {
							this.searchData() 
							this.showTableData.unshift( data )
							setTimeout(()=>this.$Message.success('新增部门成功'),600)
						} 
					})	
				} else{
					AXIOSrequest('/api/v1/deptment/nonQuery/' + this.token + '_' + params.Id, 'patch', params).then(res => {
						if (res.data.Err === 0) {
							setTimeout(()=>this.$Message.success('编辑部门成功'),600)
							 this.searchData()
						}
					})
				}
				this.showReviseCompany = false;
			},
			// 获取数据列表和查询
			searchData () {
				let params = {
					RowIndex: this.filter.RowIndex,
					PageCapacity: this.filter.PageCapacity,
					Name: this.filter.searchTxt ? this.filter.searchTxt.trim() : ''
				}
				search("/api/v1/deptment/query/" + this.token, params).then(res => {
					if (res.data.Err === 0 ) {
							this.showTableData = res.data.Data
							this.pageData.row = res.data.Ret;
						// 总页数
							this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow );
					} else if (res.data.Err === -1000){
						this.showTableData = []
						this.$Message.error('登录已经过期，请退出重新登录')
					}
				})
			},
			switchPage(to) {
				this.filter.RowIndex = (to - 1) * 20
				this.searchData()
			}
		},
		mounted() {
			this.getBlock()
			this.searchData()
		},
		components:{
			filterBox,
			tableWrapper,
			Paging,
			reviseCompanyFrame,
			Delete
		},
	}
</script>