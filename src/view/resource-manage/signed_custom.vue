<template>
	<div class="scrm-page-content resource-manage-signed-custom  signed">
		<filterBox rightClassName="none">
			<template slot="left">
				<div class="input-wrapper input-wrapper-small">
					<label>姓名:</label>
					<Input type="text" placeholder="姓名" style="width: 100px;" v-model="filter.Name"  clearable />
				</div>
				
				<div class="input-wrapper">
					<label>留言时间:</label>
					<DatePicker 
						type="daterange" 
						split-panels 
						placeholder="选择时间区间" 
						style="width: 190px" 
						:value="valDate" 
						format="yyyy/MM/dd"
						@on-change="selectChange"
					></DatePicker>
				</div>

				<div class="input-wrapper">
					<Button type="primary" @click="onSearch" icon="ios-search">查询</Button>
				</div>
			</template>
		</filterBox>
		
		<tableWrapper>
			<template slot="table">
				<Table size="small" stripe :columns="tableDataHeader" :data="tableMainData">
					<template slot="LastNegotiationDate" slot-scope="{ row }">
						<span>{{formatDate(row.LeaveWordsDate)}}</span>
					</template>

					<template slot="ContractAmount" slot-scope="{ row }">
						<span>{{ !row.ContractAmount ? "" :"￥" + row.ContractAmount.toFixed(2) }}</span>
					</template>

					<template slot-scope="{ row, index }" slot="Name">
						<div class="table-btn">
							<a @click="watchInfo(row, index)" class="table-btn">{{row.Name}}</a>
						</div>
					</template>
				</Table>
			</template>
			<template slot="paging">
				<paging :pageData="pageData"  @on-switch-page="switchPage"></paging>
			</template>
		</tableWrapper>
		<frameBox :mytitle="title" @close="close" class="large"  v-if="isShow">
			<template slot="frame-form">
				<div class="bar-title footer-sider">
					<div class="bar-titleInfo">
						<span class="r">姓名：</span><span class="l">{{resourceInfo.Name}}</span>
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
				<Table :columns="sigendHeader" :data="singedData" ref="table" class="table-box" height="600" >
				</Table>
				<div class="footer-sider">
					<div class="sider-left">

					</div>
				</div>
			</template>	
		</frameBox>
	</div>
	
</template>
	
<script>

import filterBox from '@/components/common/filter.vue'
import tableWrapper from '@/components/common/table-wrapper.vue'
import paging from '@/components/common/paging.vue'
import frameBox from '@/components/common/frame.vue'
import { selectData,tableDataHeader } from '@/components/resource-manage/signed-custom/data.js'
import { search, _post, _get, _del, _lock, AXIOSrequest } from '@/api/query.js'
import { getDate } from '@/libs/tools.js'
import { getToken } from '@/libs/util.js'

export default{
	data(){
		return{
			resourceInfo: {},
			setIndex: null,
			filter: {
				Name: '',
				CellPhone: '',
				LeaveWordsDate: '',
				NegotiationCount: -1,
				Intention: 0,
				RowIndex: 0,
				PageCapacity: 20
			},
			title: '洽谈记录',
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
			pageData: {
				row: 0,//共多少行
				pageRow: 20,//一页20行 
				pageIndex: 1,//当前第一页
				pageSum: 1,//总共 1页
				toIndex: 1,//跳转到
			},
			isShow: false,
			valDate:[],
			selectData,
			tableDataHeader,
			tableMainData: [],
			singedData: [],
			sigendHeader: [
					{
						title: '时间',
						key: 'createdate',
						align: 'center',
						render: (h, r) => {
							return h('span', getDate(r.row.createdate, 'year'))
						}
					},
					{
						title: '洽谈人',
						align: 'center',
						key: 'uname'
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
		init () {
			this.filter = {
				Name: '',
				CellPhone: '',
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
		formatDate(time) {
      		return getDate(time, "year")
    	},
		filterCway () {
			let rel = null
			this.CwayMap.map(item => {
				if (item.value === this.note.Cway) {
						rel = item.label
					}
				})
			return rel
		},
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
		dowmPass () {
			this.setIndex = this.setIndex + 1
			if (!this.tableMainData[this.setIndex]) {
				this.setIndex = this.tableMainData.length - 1
				this.$Message.info('已经是最后一条')
				return false
			}
			this.resourceInfo = this.tableMainData[this.setIndex]
			this.axiosPost(this.resourceInfo)
		},
		getData () {
			let params = {
				"RowIndex": this.filter.RowIndex,
				"PageCapacity": this.filter.PageCapacity,
				"Name": this.filter.Name,
				"CellPhone": this.filter.CellPhone,
				"StartTime": Math.ceil( this.valDate[0].getTime() / 1000),
				"EndTime": Math.ceil( this.valDate[1].getTime() / 1000),
				"Count": this.filter.NegotiationCount,
				"Intention": this.filter.Intention,
				"State": 2
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
		axiosPost (row) {
			AXIOSrequest('/api/v1/negorecords/query/' + this.token + '_' + row.Id, 'get').then(res => {
				if (res.data.Err === 0) {
					this.singedData = res.data.Data
				}
			})
		},
		switchPage(to) {
			this.filter.RowIndex = (to - 1) * 20
			this.getData()
		},
		onSearch () {
			this.getData()
		},
		selectChange (row) {
			this.valDate = row
		},
		close () {
			this.isShow = false
		},
		watchInfo (row, index) {
			this.isShow = true
			this.resourceInfo = row
			this.axiosPost(this.resourceInfo)
		}	
	},
	computed: {
		token () {
			return getToken()
		}
	},
	components:{
		filterBox,
		tableWrapper,
		paging,
		frameBox
	},
	mounted() {
		this.init()
		this.getData()
	},
}
</script>

<style scoped>
	.signed .add {
		display: none;
	}
</style>

<style scoped lang="less">
	.signed {
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
			margin-top: 0px;
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
					width: 60px;
					}
				}
				.upTo {
					margin-right: 20px;
				}
			}
		}
		.footer-textarea {
			margin-top: 30px;
			overflow: auto;
			display: flex;
			justify-content: flex-start;
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

<style  >
	.signed .large .ivu-table {
		/* border: 1px solid #dcdee2; */
		border: none;
		border-radius: 4px;
		overflow-y: none;
		overflow-x: none;
	}
	 .signed .large .ivu-select-selection {
		height: 28px;
		margin-right: 20px;
		width: 115px;
	}
	.signed .large .ivu-btn {
		height: 28px;
		padding: 3px 15px 6px;
	}
	.signed .large .ivu-btn.ivu-btn-primary {
		background-color: #4a77ee
	}
	.signed .footer-textarea .ivu-input {
		border-right: 0;
		outline: none;
		height: 60px;
		border-top-right-radius: 0px;
		border-bottom-right-radius: 0px;
	}
	.signed .large .ivu-table-overflowX {
			overflow-x: hidden;	
	}
	.signed .large .footer-textarea .ivu-input:focus, .junk-resource .large .ivu-select-selection:focus {
		outline: none;
		box-shadow: none;

	}
	.signed .footer-textarea .ivu-input:focus, 
	.signed .footer-textarea .ivu-input:hover, 
	.signed .ivu-select-selection:focus,
	.signed .ivu-select-selection:hover
	/* .junk-resource .large .ivu-btn:focus,
	.junk-resource .large .ivu-btn:hover */
	{
		border-color:  #dcdee2;
	}
</style>

