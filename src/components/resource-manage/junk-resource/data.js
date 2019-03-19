import { selectData } from '@/components/resource-manage/custom-list/data.js'

let intertionData = [ //意向对照表
	{
		label: "第一次未接通",
		value: 1
	},
	{
		label: "回访未接通",
		value: 2
	},
	{
		label: "初次沟通加微Q发资料",
		value: 3
	},
	{
		label: "想开实体",
		value: 4
	},
	{
		label: "不接受费用",
		value: 5
	},
	{
		label: "意向一般",
		value: 6
	},
	{
		label: "意向中等",
		value: 7
	},
	{
		label: "意向强烈",
		value: 8
	},
	{
		label: "意向考察",
		value: 9
	},
	{
		label: "已来访",
		value: 10
	},
	{
		label: "未留言（非本人）",
		value: 11
	},
	{
		label: "号码错误",
		value: 12
	},
	{
		label: "无意向",
		value: 13
	}
]
export const tableDataHeader = [ 
	{
	    title: '所属组',
	    key: 'Deptment',
	},
	{
	    title: '业务员',
	    slot: 'UName',
	},
	{
	    title: '客户姓名',
	    slot: 'Name',
	},
	{
	    title: '意向',
		key: 'Intention',
		render: (h, r) => {
			let rel = "未选择";
			intertionData.map(item => {
				if (item.value === r.row.Intention) {
					rel = item.label
				}
			})
			return h('span', rel)
		}
	},
	{
	    title: '手机号',
	    slot: 'CellPhone',
	}, 
	{
	    title: '留言时间',
	    slot: 'LeaveWordsDate',
		width: 150
	},
	{
	    title: '最后时间',
	    slot: 'LastNegotiationDate',
		width: 150,
	},
	{
	    title: '状态',
		key: 'ContractState',
		render: (h, r) => {
			let rel = null
			selectData.contractState.map(item => {
				if (item.value === r.row.ContractState) {
					rel = item.label
				}
			})
			rel = h('span', rel)
			return rel	
		}
	}, 
	{
	    title: '洽谈数',
	    key: 'NegotiationCount',
		width: 80,
	},
	{
	    title: '操作',
	    slot: 'actions',
	    align: 'center',
		width: 180
	},
]

export const selectDataInfo = {
    count:[
        {
            label: "0次",
            value: 0,
        },
        {
            label: "1次",
            value: 1,
        },
        {
            label: "2次",
            value: 2,
        },
        {
            label: "3次",
            value: 3,
        },
        {
            label: "4次",
            value: 4,
        },
        {
            label: "≥5次",
            value: 5,
        },
        {
            label: "≥10次",
            value: 10,
        },
	],
	purpose: intertionData,
	resourcList: [ //资源来源
		{
            name: "搜狗",
			value: 8 ,
			index: 1
		},
		{
            name: "360",
			value: 14,
			index: 2
		},
		{
			name: "头条",
			value: 16,
			index: 4
		},
		{
			name: "自定义",
			value: 21,
			index: 5
		},
		{
			name: "无",
			value: 22,
			index: 6
		}
	]
}