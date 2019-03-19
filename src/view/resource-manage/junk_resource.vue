<template>
    <div class="scrm-page-content resource-manage-junk-resource junk-resource">
        <filterBox rightClassName="none">
			<template slot="left">
				<div class="input-wrapper input-wrapper-small">
					<label>姓名:</label>
					<Input type="text" placeholder="姓名" style="width: 100px;" v-model="filter.Name" clearable  />
				</div>
				<div class="input-wrapper">
					<label>手机:</label>
					<Input type="text" placeholder="手机号" style="width: 120px;" v-model="filter.CellPhone" clearable />
				</div>
				
				<div class="input-wrapper">
					<label>留言时间:</label>
					<DatePicker 
						type="daterange" 
						split-panels placeholder="选择时间区间" 
						style="width: 190px" 
						:value="valDate" 
						format="yyyy/MM/dd" 
						@on-change="selectChange"
					></DatePicker>
				</div>
				
				<div class="input-wrapper">
					<label>洽谈次数:</label>
					<Select v-model="filter.NegotiationCount" clearable style="width: 85px;">
						<Option v-for="item in selectDataInfo.count" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
				
				<div class="input-wrapper">
					<label>意向:</label>
					<Select v-model="filter.Intention" style="background-color: #f6f6f6;" clearable>
						<Option v-for="item in selectDataInfo.purpose" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select> 
				</div>
				<div class="input-wrapper">
					<Button type="primary" @click="onSearch" icon="ios-search">查询</Button>
				</div>
			</template>
		</filterBox>
        	
		<tableWrapper>
			<template slot="table">
				<Table size="small" stripe :columns="tableDataHeader" :data="tableMainData">
					<template slot="UName" slot-scope="{ row }">
						<span>{{ !row.UName ? "未分配" : row.UName }}</span>
					</template>

					<template slot-scope="{ row, index }" slot="Name">
						<div class="table-btns">
							<a @click="watchInfo(row, index)">{{row.Name}}</a>
						</div>
					</template>
					
					<template slot="CellPhone" slot-scope="{ row }">
						<span>{{ HidTel(row.CellPhone)}}</span>
					</template>

					<template slot="LeaveWordsDate" slot-scope="{ row }">
						<span>{{formatDate(row.LeaveWordsDate)}}</span>
					</template>

					<template slot="LastNegotiationDate" slot-scope="{ row }">
						<span>{{formatDate(row.LastNegotiationDate)}}</span>
					</template>

					<template slot="actions" slot-scope="{ row, index }" >
						<div class="table-btns">
							<a @click="resetWare(row, index)"  :key="4"> 还原到公库 </a> 
							<a 
								@click="resetmyself(row, index)"
								:key="3"
							> 划分给自己 </a>
						</div>
					</template>
				</Table>
			</template>
			<template slot="paging">
				<paging :pageData="pageData" @on-switch-page="switchPage"></paging>
			</template>
		</tableWrapper>

		<transition name="slide-fade">
		<frameBox :mytitle="title" @close="close('formInline')" class="large"  v-if="isShow">
			<template slot="frame-form">
				<div class="bar-title">
					<div class="bar-titleInfo">
						<span class="r">姓名：</span><span class="l">{{resourceInfo.Name}}</span>
					</div>
					<div class="bar-titleInfo">
						<span  class="r">手机：</span><span class="l">{{resourceInfo.CellPhone}}</span>
					</div>
					<div class="bar-titleInfo">
						<span  class="r">座机：</span><span  class="l">{{resourceInfo.unam}}</span>
					</div>
					<div class="bar-titleInfo">
						<span  class="r">QQ：</span><span  class="l">{{resourceInfo.QQ}}</span>
					</div>
					<div class="bar-titleInfo">
						<span  class="r">性别：</span><span  class="l">{{resourceInfo.unam}}</span>
					</div>
				</div>
				<Table :columns="sigendHeader" :data="singedData" ref="table" class="table-box" height="448" >
				</Table>
				<div class="footer-sider">
					<div class="sider-left">
						<div class="wrapper">
						<label>洽谈方式:</label>
						<Select :number="true" v-model="note.Cway" placement="top-start">
							<Option v-for="(item) in CwayMap" :key="item.value" :value="item.value">{{ item.label }}</Option>
						</Select>
					</div>
					<div class="wrapper">
						<Button type="primary" @click="resetWareInfo" class="resetWare tomyself">还原到公库</Button>
					</div>
					<div class="wrapper">
						<Button type="primary" @click="resetmyselfInfo" class="tomyself" >划分给自己</Button>
					</div>
					</div>
					<div class="sider-right">
						<div class="wrapper">
							<Button type="primary" @click="goUP" class="goUP tomyself upTo" >上一个</Button>
					</div>
						<div class="wrapper">
							<Button  @click="dowmPass" class="godown">下一个</Button>
						</div>
					</div>
				</div>
				<div class="footer-textarea">
					<Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
       					 <FormItem prop="addTxt">
							<Input type="text" v-model="formInline.addTxt"  placeholder="请输入小结"/></Input>
        				</FormItem>
					</Form>
					<Button  type="primary" @click="addClickTxt('formInline')" class="addBth">添加记录</Button>
				</div>
			</template>	
		</frameBox>
		</transition>
	</div>
</template>

<script>

import filterBox from '@/components/common/filter.vue'
import tableWrapper from '@/components/common/table-wrapper.vue'
import paging from '@/components/common/paging.vue'
import frameBox from '@/components/common/frame.vue'
import { selectDataInfo,tableDataHeader } from '@/components/resource-manage/junk-resource/data.js'
import { search, _post, _get, _del, _lock, AXIOSrequest } from '@/api/query.js'
import { getDate, hidTel } from '@/libs/tools.js'
import { getToken, getAuthority, setAutorArr, uniq, swicthCase } from '@/libs/util.js'

export default{
	data(){
		
		return{
			ruleInline: {
				addTxt: [{ required: true, type: 'string', max: 30, message: '请填写小结', trigger: 'blur' }]
			},
			formInline: {
				addTxt: '', // 添加小结文本
			},
			setIndex: null, // 设置上下翻条的index
			authorObj: {}, // 获取权限值字段
			filter: {
				Name: '',
				CellPhone: '',
				LeaveWordsDate: '',
				NegotiationCount: -1,
				Intention: 0
			},
			resourceInfo: {},  //记录table点击当行的数据
			tableHeight: null, // 设置表格头部的高度
			note: { // 洽谈方式
				Cway: ''
			},
			CwayMap: [ // 洽谈方式对照表
					{
						label: '电话',
						value: 2
					},
					{
						label: '在公司面谈',
						value: 3
					},
					{
						label: '拜访',
						value: 4
					},
					{
						label: '微信',
						value: 5
					},
					{
						label: 'QQ',
						value: 6
					},
					{
						label: '电子邮件',
						value: 7
					},
					{
						label: '其它方式',
						value: 8
					}
				],
			title: '洽谈记录',
			isShow: false, // 弹窗
			selectDataInfo,
			tableDataHeader, // 表格头部的
			tableMainData: [],
			valDate: [], //定义留言时间
			pageData: {
				row: 0,//共多少行
				pageRow: 20,//一页20行 
				pageIndex: 1,//当前第一页
				pageSum: 1,//总共 1页
				toIndex: 1,//跳转到
			},
			singedData: [], // 详情列表的数据
			sigendHeader: [
				{
					title: '时间',
					key: 'createdate',
					align: 'center',
					render: (h, r) => {
						if(r.row.createdate) {
							return h('span', getDate(r.row.createdate, 'year'))
						}
					}
				},
				{
					title: '洽谈人',
					key: 'uName',
					align: 'center'
				},
				{
					title: '方式',
					key: 'CWay',
					align: 'center',
					render: (h, r) => {
						let rel = null
						this.CwayMap.map(item => {
							if (item.value === r.row.CWay) {
								rel = item.label
							}
						})
						return h('span', rel)
					}
				},
				{
					title: '内容',
					key: 'content',
					align: 'center'
				}
			]
		}
	},
	methods:{
		// 获取权限字段匹配权限按钮
		getBlock () { 
			let list = []
			this.authorObj =  swicthCase(uniq(setAutorArr(getAuthority(), list)))
			if (!this.authorObj.dis && !this.authorObj.recover && getAuthority() >= 0) {
				if (this.tableDataHeader.length > 9) {
					this.tableDataHeader.splice(this.tableDataHeader.length - 1, 1)
				}
			} else {
				if (this.tableDataHeader.length <= 9) {
					this.tableDataHeader.push({
	    				title: '操作',
	    				slot: 'actions',
	    				align: 'center',
						width: 180
					})
				}
			}
		},
		//格式化时间
		formatDate(time) { 
      		return getDate(time, "year")
		},
		// 过滤取中文字段
		filterCway () { 
			let rel = null
			this.CwayMap.map(item => {
				if (item.value === this.note.Cway) {
						rel = item.label
					}
				})
			return rel
		},
		// 向上翻一条
		goUP () { 
			this.setIndex = this.setIndex - 1
			if (!this.tableMainData[this.setIndex]) {
				this.setIndex = 0
				this.$Message.info('已经是最顶部一条')
				return false
			}
			this.resourceInfo = this.tableMainData[this.setIndex]
			this.axiosPost(this.resourceInfo)
		},
		// 向下翻一条
		dowmPass (type) { 
			this.setIndex = this.setIndex + 1
			if (!this.tableMainData[this.setIndex]) {
				if (this.setIndex > 19) {
					this.page()
					this.setIndex = 0
				} else {
					this.setIndex = this.tableMainData.length - 1
					this.$Message.info('已经是最后一条')
					return false
				}
			}
			this.resourceInfo = this.tableMainData[this.setIndex]
			this.axiosPost(this.resourceInfo)
		},
		//详情列表还原公库
		resetWareInfo () { 
			this.resetWare(this.tableMainData[this.setIndex])
			this.dowmPass()
		},
		// 详情列表划分自己
		resetmyselfInfo () { 
			this.resetmyself(this.tableMainData[this.setIndex])
			this.dowmPass()
			// this.getUpdetListData()
		},
		getUpdetListData () {
			this.setIndex += 1
			if (this.setIndex.length >= 19) {
				this.page(this.filter.RowIndex + 1)
				this.setIndex = 0
				this.resourceInfo = this.tableMainData[this.setIndex]
			} else {
				if (this.tableMainData[this.setIndex]) {
					this.resourceInfo = this.tableMainData[this.setIndex]
					this.$Message.info('已经切换下-条数据')
				} else if (this.tableMainData[this.setIndex - 2]) {
					this.resourceInfo = this.tableMainData[this.setIndex - 2]
					this.$Message.info('已经切换上一条数据')
				} else {
					this.singedData = []
					this.$Message.info('暂无数据')
				}
			}
		},
		page (to) { // 详情页面里操作数据进行分页
			this.filter.RowIndex = (to - 1) * 20
			this.getData()
		},
		addClickTxt (name) { // 添加小结
			if (!this.note.Cway) {
				this.$Message.error('请选择洽谈方式')
				return false
			}
			if (!this.formInline.addTxt) {
				this.$Message.error('请填写小节')
				return false
			}
			this.$refs[name].validate((valid) => {
				if (valid) {
					let params = {
						Id: 0,
						CId: this.resourceInfo.Id,
						CWay: this.note.Cway,
						TmpCWay: this.filterCway(),
						Clock: -28800,
						TmpClock: '无',
						UName: this.resourceInfo.UName,
						Content: this.formInline.addTxt,
						CreateDate: Math.ceil(new Date().getTime() / 1000),
						TmpCreateDate: Math.ceil(new Date().getTime() / 1000),
					}
					AXIOSrequest('/api/v1/negorecords/nonQuery/' + this.token, 'post', params).then(res => {
						if (res.data.Err === 0) {
							this.$Message.success('添加记录成功')
							this.note.Cway = ''
							this.formInline.addTxt = ''
							this.axiosPost(this.resourceInfo)
						}
					})
				} else {
					this.$Message.error('超出55个字符串');
				}
			})

		},
		resetWare (row, index) { // 还原公库
			let params = {
				State: 4,
				Reason: ''
			}
			AXIOSrequest('/api/v1/customer/change/' + this.token + '_' + row.Id, 'patch', params).then(res => {
				if (res.data.Err === 0) {
					this.$Message.success('还原到公库成功')
					this.init()
					this.getData()
				}
			})
			
		},
		resetmyself (row, index) { // 划分自己
			let params = {
				CId: row.Id,
				DId: 0,
				UId: 0
			}
			AXIOSrequest('/api/v1/customer/distribute/' + this.token, 'post', params).then(res => {
				if (res.data.Err === 0) {
					this.$Message.success( '划分给自己成功!')
					this.init()
					this.getData()
				}
			})
		},
		onSearch () { //查询
			this.getData()
		},
		close (name) {
			this.$refs[name].resetFields()
			this.formInline.addTxt = ''
			this.isShow = false
		},
		watchInfo (row, index) {
			this.isShow = true
			this.resourceInfo = row
			this.setIndex = index
			this.axiosPost(row)
		},
		axiosPost (row) {
			AXIOSrequest('/api/v1/customer/info/' + this.token + '_' + row.Id, 'get').then(res => {
				if (res.data.Err == 0) {
					this.singedData = res.data.Data2
				}
			})
		},
		init () {
			this.filter = {
				Name: '',
				CellPhone: '',
				LeaveWordsDate: '',
				NegotiationCount: -1,
				Intention: 0,
				RowIndex: 0,
				PageCapacity: 20
			}
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * this.$config.days );
			this.valDate = [start,end];
		},
		getData () { // 获取垃圾资源列表
			let params = {
				RowIndex: this.filter.RowIndex,
				PageCapacity: this.filter.PageCapacity,
				Name: this.filter.Name,
				CellPhone: this.filter.CellPhone,
				StartTime: Math.ceil( this.valDate[0].getTime() / 1000),
				EndTime: Math.ceil( this.valDate[1].getTime() / 1000),
				Count: this.filter.NegotiationCount,
				Intention: this.filter.Intention,
				State: 7
			}
			
			AXIOSrequest('/api/v1/customer/special/' + this.token, 'post', params).then(res => {
				if (res.data.Err === 0) {
						this.tableMainData = res.data.Data
						this.pageData.row = res.data.Ret;
						// 总页数
						this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow );
				} else if (res.data.Err === -1000){
					this.tableMainData = []
					this.$Message.error('登录已经过期，请退出重新登录')
				}
			})
		},
		selectChange (row) {
			this.valDate = row
		},
		switchPage (to) {
			this.filter.RowIndex = (to - 1) * 20
			this.getData()
		},
		HidTel(tel){
			return hidTel(tel)
		}
	},
	computed: {
		token () {
			return getToken()
		},
		AuthorArrList () {
			return this.$store.getters.AuthorArrs
		}
	},
	components:{
		filterBox,
		tableWrapper,
		paging,
		frameBox
	},
	mounted () {
		this.init()
		this.getData()
		//this.getBlock()
	}
}
</script>

<style  lang="less">
	.resource-manage-junk-resource {
		.bar-title {
			display: flex;
			justify-content: flex-start;
			padding-bottom: 21px;

		}
		.bar-title .bar-titleInfo {
			margin-right: 20px;
			width: 120px;
			font-size: 13px;
			.r {
				color: #c9c9c9;
			}
			.l {
				color: #535653;
				font-size: 12px;
			}
		}
		.footer-sider {
			margin-top: 36px;
			display: flex;
			justify-content: space-between;
			.sider-left, .sider-right {
				display: flex;
				justify-content: flex-start;
				.wrapper {
					display: flex;
					justify-content: flex-start;
					label {
					height: 28px;
					line-height: 28px;
					width: 80px;
					}
				}
				.resetWare {
					margin-left: -10px;
					margin-right: 15px;
				}
				.goUP {
					background-color: #4a77ee;
				}
				.tomyself {
					height: 28px;
					
					background-color: #4a77ee;
				}
				.upTo {
					margin-right: 20px;
				}
			}
			.sider-right {
				.goUP {
					background-color: #4a77ee;
				}
				.ivu-btn > span:hover {
					color: #515a6e;
				}
			}
		}
		.footer-textarea {
			margin-top: 30px;
			margin-bottom: 30px;
			display: flex;
			justify-content: flex-start;
			.ivu-form {
				width:100%;
				height: 60px;
				.ivu-form-item {
					width: 100%;
				}
			}
			.addBth {
				background-color: #7478a2;
				height: 60px;
				border: none;
				border-top-left-radius: 0px;
				border-bottom-left-radius: 0px;
				width: 138px;

			}
		}
	}
</style>

<style>
	.junk-resource .large .ivu-table {
		border: none;
		border-radius: 4px;
		overflow-y: none;
		overflow-x: none;
	}
	 .junk-resource .large .ivu-select-selection {
		height: 28px;
		width: 115px;
	}
	.junk-resource .large .footer-sider .ivu-btn {
		height: 28px;
		padding: 3px 15px 6px;
	}
	.junk-resource .large .footer-textarea .ivu-input {
		border-right: 0;
		outline: none;
		height: 60px;
		border-top-right-radius: 0px;
		border-bottom-right-radius: 0px;
		overflow:auto;
	}
	.junk-resource .large .ivu-table-overflowX {
		overflow-x: hidden;	
	}
	.junk-resource .large .footer-textarea .ivu-input:focus, .junk-resource .large .ivu-select-selection:focus, .junk-resource .large .ivu-btn:focus {
		outline: none;
		box-shadow: none;

	}
	.junk-resource .large .footer-textarea .ivu-input:focus, 
	.junk-resource .large .footer-textarea .ivu-input:hover, 
	.junk-resource .large .ivu-select-selection:focus,
	.junk-resource .large .ivu-select-selection:hover
	.junk-resource .large .ivu-btn:focus,
	.junk-resource .large .ivu-btn:hover
	{
		border-color:  #dcdee2;
	}
</style>