<template>
<!-- 公共资源 -->
    <div class="scrm-page-content resource-manage-public-resource public-resource">
        <filterBox rightClassName="none">
        	<template slot="left">
        		<div class="input-wrapper input-wrapper-small">
        			<label>姓名:</label>
        			<Input v-model="SearchData.Name" type="text" placeholder="姓名" style="width: 100px;" />
        		</div>
        		<div class="input-wrapper">
        			<label>手机:</label>
        			<Input v-model="SearchData.CellPhone" type="text" placeholder="手机号" style="width: 120px;" />
        		</div>
        		
        		<div class="input-wrapper">
        			<label>留言时间:</label>
        			<DatePicker v-model="filter.time" type="daterange" split-panels placeholder="选择时间区间" style="width: 190px"></DatePicker>
        		</div>
        		
        		<div class="input-wrapper">
        			<label>洽谈次数:</label>
        			<Select v-model="SearchData.Count" clearable style="width: 85px;">
        				<Option v-for="item in selectData.count" :value="item.value" :key="item.value">{{ item.label }}</Option>
        			</Select>
        		</div>
        		
        		<div class="input-wrapper">
        			<label>意向:</label>
        			<Select v-model="SearchData.Intention" style="background-color: #f6f6f6;" clearable>
        				<Option v-for="item in selectData.purpose" :value="item.value" :key="item.value">{{ item.label }}</Option>
        			</Select> 
        		</div>
				<Button type="primary" icon="ios-search" @click="handleSearch">查询</Button>
        	</template>
        </filterBox>
		
		<tableWrapper>
			<template slot="table">
				<Table size="small" stripe :columns="tableDataHeader" :data="tableMainData">
					<template slot="Name" slot-scope="{ row }">
						<div class="table-btn">
							<!-- <a @click="showNote(row.Id)"> {{ row.Name }} </a> -->
							<a @click="watchInfo(row)"  class="table-btn"> {{ row.Name }} </a>
						</div>
					</template>
					<template slot="Intention" slot-scope="{ row }">
						<span>{{ formatIntention( row.Intention - 1 ) }}</span>
					</template>
					
					<template slot="CellPhone" slot-scope="{ row }">
						<span>{{ HidTel( row.CellPhone ) }}</span>
					</template>

					<template slot="ContractState" slot-scope="{ row }">
						<span>{{ formatState( row.ContractState - 1 ) }}</span>
					</template>
					
					<template slot="LeaveWordsDate" slot-scope="{ row }">
						<span>{{ formatTime( row.LeaveWordsDate ) }}</span>
					</template>
					
					<template slot="LastNegotiationDate" slot-scope="{ row }">
						<span>{{ formatTime( row.LastNegotiationDate ) }}</span>
					</template>

					<template slot="actions" slot-scope="{ row }"  >
						<div class="table-btns" v-author="authorObj.dis" >
							<Poptip
								confirm
								title="您确定划分给自己吗？"
								@on-ok="ok(row.Id)"
								@on-cancel="cancel">
								<a> 划分给自己 </a>
							</Poptip>
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
				<Table :columns="sigendHeader" :data="singedData" ref="table" class="table-box" height="440" ></Table>
				<div class="footer-sider">
					<div class="sider-left">
						<div class="wrapper">
						<label class="label">洽谈方式:</label>
						<Select :number="true" v-model="note.Cway" placement="top-start">
							<Option v-for="(item) in CwayMap" :key="item.value" :value="item.value">{{ item.label }}</Option>
						</Select>
					</div>
					<div class="wrapper" >
						<Button type="primary" @click="resetMyself" class="goUP tomyself"  v-author="authorObj.dis">划分给自己</Button>
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
import batchAllocate from '@/components/resource-manage/batch-allocate.vue'
import Delete from '@/components/common/delete.vue'
import frameBox from '@/components/common/frame.vue'
import { tableDataHeader } from '@/components/resource-manage/public-resource/data.js'
import { selectData } from '@/components/resource-manage/custom-list/data.js'
import { search, _post, _get, _del, _lock, AXIOSrequest, GlobalMsg} from '@/api/query.js'
import { getDate, hidTel } from '@/libs/tools.js'
import Note from '@/components/resource-manage/public-resource/note.vue'
import { getToken, getAuthority, setAutorArr, uniq, swicthCase } from '@/libs/util.js'

export default{
	data(){
		return{ 
			ruleInline: {
				addTxt: [{ required: true, type: 'string', max: 30, message: '请填写小结', trigger: 'blur' }]
			},
			sigendHeader: [ //弹窗table 头部
				{
					title: '时间',
					key: 'createdate',
					align: 'center',
					width: 150,
					render: (h, r) => {
						if(r.row.createdate) {
							return h('span', getDate(r.row.createdate, 'year'))
						}
					}
				},
				{
					title: '洽谈人',
					key: 'uName',
					align: 'center',
					width: 80
				},
				{
					title: '方式',
					key: 'CWay',
					align: 'center',
					width: 80,
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
			],
			filter: { //时间
				time: [undefined,undefined]
			},
			authorObj: {}, //自定义权限指令对象
			setIndex: null, //设置详情里的翻转上下条的Index
			formInline: {
				addTxt: '', // 添加小结
			},
			resourceInfo: {}, //记录点击table上的一行数据
			tableHeight: null, // 查询详情里table 设置固定的高度
			title: '客户沟通记录',
			isShow: false, // 弹窗显示
			singedData: [], // 弹窗的data定义
			note: { // 添加记录的洽谈方式
				Cway: '' 
			},
			CwayMap: [
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

			selectData,
			tableDataHeader,
			tableMainData: [],
			isShowAllocate: false,
			isDelete: false,
			isShowNote: false,
			pageData:{				
				row: 0,//共多少行
				pageRow: 20,//一页20行 
				pageIndex: 1,//当前第一页
				pageSum: 1,//总共*页
				toIndex: null,//跳转到					
			},
			SearchData: {
				"RowIndex": 0,
				"PageCapacity": 20,
				"Name": "",
				"CellPhone": "",
				"State": 4,
				"StartTime": null,
				"EndTime": null,
				"Count": null,
				"Intention": null
			},
			NoteProps: {
				id: null,
				info: {},
				note: []
			}
		}
	},
	methods:{
		getBlock () { // 首次加载获取权限的值匹配权限按钮
			let list = []
			this.authorObj =  swicthCase(uniq(setAutorArr(getAuthority(), list)))
			if (!this.authorObj.dis && getAuthority() >= 0) {
				if (this.tableDataHeader.length > 9) {
					this.tableDataHeader.splice(this.tableDataHeader.length - 1, 1)
				}
			} else {
				if (this.tableDataHeader.length <= 9) {
					this.tableDataHeader.push({
	    				title: '操作',
	    				slot: 'actions',
	    				align: 'center',
						width: 180,
					})
				}
			}
		},
		resetMyself () { // 划分自己
			let params = {
				CId: this.resourceInfo.Id,
				DId: 0,
				UId: 0
			}
			AXIOSrequest('/api/v1/customer/distribute/' + this.token, 'post', params).then(res => {
				if (res.data.Err === 0) {
					this.dowmPass()
					this.$Message.success('划分自己成功')
				}
			})
		},
		close (name) { // 关闭弹框
			this.$refs[name].resetFields()
			this.formInline.addTxt = ''
			this.isShow = false
			this.handleSearch()
		},
		filterCway () { // 过滤中文字段
			let rel = null
			this.CwayMap.map(item => {
				if (item.value === this.note.Cway) {
						rel = item.label
					}
				})
			return rel
		},
		goUP () { // 向上翻一条
			this.setIndex = this.setIndex - 1
			if (!this.tableMainData[this.setIndex]) {
				this.setIndex = 0
				this.$Message.success('已经是最顶部一条')
				return false
			}
			this.resourceInfo = this.tableMainData[this.setIndex]
			this.axiosPost(this.resourceInfo)
		},
		dowmPass () { // 向下翻一条
			this.setIndex = this.setIndex + 1
			if (!this.tableMainData[this.setIndex]) {
				this.setIndex = this.tableMainData.length - 1
				this.$Message.success('已经是最后一条')
				return false
			}
			console.log(this.tableMainData[this.setIndex])
			this.resourceInfo = this.tableMainData[this.setIndex]
			this.axiosPost(this.resourceInfo)
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
		watchInfo (row, index) { // 点击客户名称进入详情查看
			this.isShow = true
			this.resourceInfo = row
			this.serIndex = index
			this.axiosPost(row)
		},
		axiosPost (row) {
			AXIOSrequest('/api/v1/customer/info/' + this.token + '_' + row.Id, 'get').then(res => {
				if (res.data.Err === 0) {
					this.singedData = res.data.Data2
				}	
			})
		},
		// 查询
		handleSearch(){			
			this.SearchData.StartTime = !this.filter.time[0] ?
				parseInt( new Date().getTime() / 1000 - 3600 * 24 * this.$config.days ) : 
				parseInt( Date.prototype.getTime.call( this.filter.time[0] ) /1000 );
			this.SearchData.EndTime = !this.filter.time[1] ? 
				parseInt( new Date().getTime() / 1000 ) : 
				parseInt( Date.prototype.getTime.call( this.filter.time[1] ) /1000 );
			
			return search("/api/v1/customer/special/" + this.token,
				this.SearchData
			).then(res => {
				if ( !res.data.Err ) {
					this.pageData.row = res.data.Ret;
					this.tableMainData = res.data.Data;
					// 总页数
					this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow );
				}
				GlobalMsg.call(this,res);
			})
		},
		
		//翻页
		switchPage(to){
			this.SearchData.RowIndex = (to - 1) * 20;
			console.log( this.SearchData )
			search("/api/v1/customer/special/" + this.token,
				this.SearchData
			).then(res => {
				this.tableMainData = res.data.Data;
			}).catch(err => console.log(err))
		},
		
		// 展示小结
		showNote(id){
			this.isShowNote = true;
			_get("/api/v1/customer/info/" + this.token + "_" + id).then(res => {				
				this.NoteProps = {
					id: id,
					info: res.data.Data1,
					note: res.data.Data2
				}
			})
		},
		addNote(data){
			_post("/api/v1/negorecords/nonQuery/" + this.token, data).then(res => {
				GlobalMsg.call(this,res,'添加小结成功!')
			}).then(() => {
				this.showNote(data.CId)
			})
		},
		
		soloAllocate(){
			this.isShowAllocate = true;
		},
		removeFrame(data){
			this.isShowNote = 
			this.isDelete = 
			data
		},
		clickDel(){
			this.isDelete = true;
		},
		del(){
			this.isDelete = false;
			setTimeout( () => this.$Message.success('删除成功!'), 400 )
		},
		
		// 确定划分给自己
		ok(id){
			_post("/api/v1/customer/distribute/" + this.token, {
				"CId": id,
				"DId": 0,
				"UId": 0
			}).then(res => {
				GlobalMsg.call(this,res,'操作成功!')
			}).then(()=>{
				this.handleSearch();
			})
		},
		cancel(){ 
			
		},
		formatIntention(type){
			return type < 1 ? "未选择" : this.selectData.purpose[type].label;
		},
		formatState(type){
			return type < 1 ? "未知" : this.selectData.contractState[type].label;
		},
		formatTime(time){
			return getDate(time,'year')
		},
		// 隐藏手机号的中间四位
		HidTel(phone){
		return hidTel(phone);
		},
	},
	computed:{
		token(){
			return getToken()
		}	
	},
	mounted() {
		this.handleSearch(); 
		this.getBlock()
		const end = new Date();
		const start = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		this.filter.time = [start, end];
	},
	components:{
		filterBox,
		tableWrapper,
		paging,
		batchAllocate,
		Delete,
		Note, 
		frameBox
	}
}
</script>
<style  lang="less">
	.public-resource {
		.bar-title {
			display: flex;
			justify-content: flex-start;
			padding-bottom: 21px;

		}
		.bar-title .bar-titleInfo {
			margin-right: 0px;
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
					.label {
						height: 28px;
						line-height: 28px;
						width: 90px;
					}
				}
				.goUP {
					background-color: #4a77ee;
				}
				.tomyself {
					margin-left: -30px;
				}
				.upTo {
					margin-right: 30px;
				}
			}

		}
		.footer-textarea {
			margin-top: 35px;
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

<style >
	.public-resource .large .ivu-table {
		border: none;
		border-right: none;
		border-radius: 4px;
		overflow-y: none;
		overflow-x: none;
	}
	.public-resource .large .ivu-select-selection {
		height: 28px;
		margin-right: 20px;
		width: 115px;
	}
	.public-resource .large .footer-sider .ivu-btn {
		height: 28px;
		padding: 3px 15px 6px;
		margin-right: 0px;
	}
	.public-resource .large .footer-sider .upTo {
		margin-right: 20px;
	}
	.public-resource .large .ivu-btn .addBth {
		/* background-color: #4a77ee */
	}
	.public-resource .large .footer-textarea .ivu-form .ivu-input {
		border-right: 0;
		outline: none;
		height: 60px;
		overflow: scroll; 
		border-top-right-radius: 0px;
		border-bottom-right-radius: 0px;
	}
	.public-resource .large .ivu-table-overflowX {
			overflow-x: hidden;	
	}
	.public-resource .large .footer-textarea .ivu-input:focus, .junk-resource .large .ivu-select-selection:focus {
		outline: none;
		box-shadow: none;

	}
	.public-resource .large .footer-textarea .ivu-input:focus, 
	.public-resource .large .footer-textarea .ivu-input:hover, 
	.public-resource .large .ivu-select-selection:focus,
	.public-resource .large .ivu-select-selection:hover
	/* .junk-resource .large .ivu-btn:focus,
	.junk-resource .large .ivu-btn:hover */
	{
		border-color:  #dcdee2;
	}
</style>