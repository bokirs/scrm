<template>
    <div class="custom-page-content">
        <filterBox>
        	<div slot="left" class="flex">
        		<div class="input-wrapper">
        		  <label>来源名称:</label>
        		  <Input type="text" placeholder="来源名称" v-model="filter.Name"   clearable/>
        		</div>
				
				<div class="input-wrapper">
					<label>类型:</label>
					<Select v-model="filter.type"  clearable style="width: 100px;"> 						
						<Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
					<Button type="primary" icon="ios-search" @click="searchData">查询</Button>
        	</div>
					<div slot="right" 	v-author="authorObj.add">
        		<span>新增来源</span>
        		<Button 
        			size="large" 
        			type="primary" 
        			shape="circle" 
        			icon="md-person-add"
        			@click="reviseCustom(-1)"
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
						<a  @click="editor(row, index)" v-author="authorObj.updat">编辑</a>
						<a  @click="deletes(row, index)" v-author="authorObj.del">删除</a>
					</div>
				</template>
			</Table>
			<paging slot="paging" :pageData="pageData" @on-switch-page="switchPage"></paging>
		</tableWrapper>
		
		<!-- 弹层 -->
		<transition name="slide-fade">
			<reviseCustomFrame
				v-if="showReviseCustom"
				:frameTitle="myFrameTitle" 
				:customData ="customDataPropObj"
				:btnTip = "btnTip"
				:actionIndex = "actionIndex"
				@setCustomData = "submitCustomData"
				@close = "removeFrame"
			>
			</reviseCustomFrame>
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
	import paging from '../../components/common/paging.vue'
	import reviseCustomFrame from '../../components/system-manage/custom/revise-custom.vue'
	import Delete from '@/components/common/delete.vue'
	import {dateFtt} from '../../libs/tools.js'
	import { search, _post, _get, _del, _lock, AXIOSrequest, GlobalMsg } from '@/api/query.js'
	import { getDate } from '@/libs/tools.js'
	import { getToken, getAuthority, setAutorArr, uniq, swicthCase } from '@/libs/util.js'
	
	export default{
		components:{
			filterBox,
			reviseCustomFrame,
			tableWrapper,
			paging,
			Delete
		},
		data(){
			return{
				authorObj: {},		
				showTableData:[],
				filter: {
					Name: '',
					type: 0,
					RowIndex: 0,
					PageCapacity: 20
				},
				tableHeadData:[
					{
						title:"公司名称",
						key:"CName",
						align: 'center',
					},
					{
						title:"名称",
						key:"Name",
						align: 'center',
					},
					{
						title:"类型",
						key:"Type",
						align: 'center',
						render: (h, o) => {
							let rel = ''
							this.typeList.map(item => {
								if (item.value === o.row.Type) {
									rel = item.label
								}
							})
							return h('span', rel)
						}
					},
					{
						title:"备注",
						key:"Remark",
						align: 'center',
					},
					{
						title:"创建时间",
						key:"CreateDate",
						align: 'center',
						render: (h, o) => {
							return h('span', getDate(o.row.CreateDate, 'year'))
						}
					},
					{
					  title: '操作',
					  slot: 'operate',
					  align: 'center',
					}
				],
				pageData:{				
					row: 0,//共多少行
					pageRow: 20,//一页20行 
					pageIndex: 1,//当前第一页
					pageSum: 1,//总共*页
					toIndex: null,//跳转到					
				},
				showReviseCustom: false,
				row: {},
				btnTip: "",
				myFrameTitle: "",
				actionIndex: -1,
				customDataPropObj:{},//弹框 表单填充内容
				isDelete: false,// 确认删除弹框
				modal_loading: false,//异步删除
				typeList: [
					{
						value: 1,
						label: "资源",
					},
					{
						value: 2,
						label: "关键词",
					},
					{
						value: 3,
						label: "合同类型",
					},
				],
			}
		},
		methods:{
			getBlock () {
				let list = []
				this.authorObj =  swicthCase(uniq(setAutorArr(getAuthority(), list)))
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
			searchData () {
				let params = {
					RowIndex: this.filter.RowIndex,
					PageCapacity: this.filter.PageCapacity,
					Name: this.filter.Name,
					Type: this.filter.type
				}
				 AXIOSrequest('/api/v1/resources/query/' + this.token, 'post', params).then(res => {
					 if (res.data.Err === 0) {
						 	this.showTableData = res.data.Data
						 	this.pageData.row = res.data.Ret
							this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow )
					 } else if (res.data.Err === -1000){
							this.showTableData = []
							this.$Message.error('登录已经过期，请退出重新登录')
						}	
				 })

			},
			switchPage (to) {
					this.filter.RowIndex = (to - 1) * 20
					this.searchData()
			},
			editor (row, index) { //编辑
				this.showReviseCustom = true
				this.customDataPropObj = row
				this.myFrameTitle = '新增客户'
				this.btnTip = '提交修改'
				this.actionIndex = index
			},
			deletes (row) {
					this.isDelete = true
					this.row = row
			},
			reviseCustom(n){
				this.actionIndex = n;
				this.showReviseCustom = true;
				if ( n < 0 ) {
					this.myFrameTitle = "新增资源";
					this.btnTip = "新增";
					this.customDataPropObj = {};
				} else{
					this.myFrameTitle = "编辑资源";
					this.btnTip = "提交";
					const parm = this.showTableData[this.actionIndex];
					this.customDataPropObj = JSON.parse( JSON.stringify( parm ) );
				}				
			},
			//操作 删除
			deleteCustom(n){
				this.actionIndex = n;
				this.isDelete = true;
			},
			//确定删除
			del(){
				this.isDelete = false;
				let row = this.row
				AXIOSrequest('/api/v1/resources/delete/' + this.token + '_' + row.Id, 'delete').then(res => {
					if (res.data.Err === 0) {
						setTimeout(()=>this.$Message.success('删除成功'),600)
					} else {
						setTimeout(()=>this.$Message.error('非法操作'),600)
					}
						this.searchData()
				})
			},
			mimeticData(){
				const item = {
					company:"公共资源",
					name: "无",
					type: "资源",
					comments: "无来源",
					createTime: "2019-01-15 16:40:52",
				}
				for(let i=0;i<15;i++ ){
					this.showTableData.push( item );				
				}
			},
			removeFrame(){
				this.isDelete = 
				this.showReviseCustom = false;
			},
			submitCustomData(data){
				const now = ~~(+new Date/1000);
				if ( this.actionIndex < 0 ) {
					const queryData = {
						"Id": 0,
						"CId": 0,
						"CName": null,
						"Name": data.Name,
						"Type": data.Type,
						"TypeDesc": data.TypeDesc,
						"Remark": data.Remark,
						"CreateDate": now,
						"TmpCreateDate": getDate(now,'year')
					}
					_post('/api/v1/resources/nonQuery/' + this.token, queryData).then(res => {
						this.showReviseCustom = false
						if (res.data.Err >= 0) {
							this.$Message.success('新增来源成功！');
							this.searchData();
						} else {
							GlobalMsg.call(this, res);
						}
					})
				} else {
					const queryData = {
						"Id": data.Id,
						"CId": data.CId,
						"CName": data.CName,
						"Name": data.Name,
						"Type": data.Type,
						"TypeDesc": data.TypeDesc,
						"Remark": data.Remark,
						"CreateDate": now,
						"TmpCreateDate": getDate(now,'year')
					}
					AXIOSrequest('/api/v1/resources/nonQuery/' + this.token + '_' + queryData.Id, 'patch', queryData).then(res => {
						this.showReviseCustom = false
						if (res.data.Err >= 0) {
							setTimeout(()=>this.$Message.success('编辑成功!'),300)
							this.searchData()
						} else {
							GlobalMsg.call(this, res);
						}
					})
				}
			},
		},
		computed: {
		  token () {
					return getToken()
			},
			AuthorArrList () {
				return this.$store.getters.AuthorArrs
			}
		},
		mounted () {
			this.getBlock()
			this.searchData()
		}
	}
</script>