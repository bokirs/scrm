export const selectData = {
	// 洽谈数
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
        }
    ],
	// 关键词
	KName: [
		{
			KId: 1,
			label: "百度",
			index: 0
		},
		{
			KId: 9,
			label: "商场",
			index: 1
		}
	],
	
	// 意向
    purpose:[
        {
            label: "第一次未接通",
            value: 1,
        },
        {
            label: "回访未接通",
            value: 2,
        },
        {
            label: "初次沟通加微,Q发资料",
            value: 3,
        },
		{
		    label: "想开实体",
		    value: 4,
		},
		{
		    label: "不接受费用",
		    value: 5,
		},
		{
		    label: "意向一般",
		    value: 6,
		},
		{
		    label: "意向中等",
		    value: 7,
		},
		{
		    label: "意向强烈",
		    value: 8,
		},
		{
		    label: "考察中",
		    value: 9,
		},
		{
		    label: "已到访",
		    value: 10,
		},
		{
		    label: "未留言",
		    value: 11,
		},
		{
		    label: "号码错误",
		    value: 12,
		},
		{
		    label: "无意向",
		    value: 13,
		}
    ],
	// 来源
    source: [
        {
            label: "搜狗",
            value: 8,
			index: 1
        },
        {
            label: "360",
            value: 14,
			index: 2
        },
        {
            label: "UC",
            value: 15,
			index: 3
        },
		{
		    label: "头条",
		    value: 16,
			index: 4
		},
		{
		    label: "自定义",
		    value: 21,
			index: 5
		},
		{
		    label: "无",
		    value: 22,
			index: 6
		}
    ],	
	// 状态
	contractState: [
		{
			value: 1,
			label: "洽谈中",
			index: 0,
		},
		{
			value: 2,
			label: "已签约",
			index: 1,
		},
		{
			value: 3,
			label: "组公库",
			index: 2,
		},
		{
			value: 4,
			label: "总共库",
			index: 3,
		},
		{
			value: 5,
			label: "系统未分配",
			index: 4,
		},
		{
			value: 6,
			label: "组未分配",
			index: 5,
		},
		{
			value: 7,
			label: "垃圾资源",
			index: 6,
		},
	],
	// 文化程度
	Education: [
		{
			value: 0,
			label: "无"
		},
		{
			value: 1,
			label: "小学"
		},
		{
			value: 2,
			label: "初中"
		},
		{
			value: 3,
			label: "中职"
		},
		{
			value: 4,
			label: "高中"
		},
		{
			value: 5,
			label: "大专"
		},
		{
			value: 6,
			label: "本科"
		},
		{
			value: 7,
			label: "硕士"
		},
		{
			value: 8,
			label: "博士及以上"
		},
	],
	// 收入
	Income: [
		{
			value: 0,
			label: "3500及以下"
		},
		{
			value: 1,
			label: "3500~5000"
		},
		{
			value: 2,
			label: "5000~10000"
		},
		{
			value: 3,
			label: "10000~15000"
		},
		{
			value: 4,
			label: "15000~25000"
		},
		{
			value: 5,
			label: "25000及以上"
		}
	],
	// 行业
	JobType: [
		{
			value: 1,
			label: "农、牧、林、渔业"
		},
		{
			value: 2,
			label: "采石和采矿"
		},
		{
			value: 3,
			label: "制造业"
		},
		{
			value: 4,
			label: "电、煤气、蒸汽和空调供应"
		},
		{
			value: 5,
			label: "供水：污水处理、废物管理和补救"
		},
		{
			value: 6,
			label: "建筑业"
		},
		{
			value: 7,
			label: "批发和零售业"
		},
		{
			value: 8,
			label: "物流、运输、仓储"
		},
		{
			value: 9,
			label: "食宿"
		},
		{
			value: 10,
			label: "信息通信"
		},
		{
			value: 11,
			label: "金融、证券、保险"
		},
		{
			value: 12,
			label: "房地产"
		},
		{
			value: 13,
			label: "专业、科学和技术"
		},
		{
			value: 14,
			label: "行政和辅助"
		},
		{
			value: 15,
			label: "公共管理与国防、社会保障"
		},
		{
			value: 16,
			label: "教育"
		},
		{
			value: 17,
			label: "人体健康和社会工作"
		},
		{
			value: 18,
			label: "艺术、娱乐、文娱"
		},
		{
			value: 19,
			label: "其他服务"
		},
		{
			value: 20,
			label: "家庭作为雇主的"
		},
		{
			value: 21,
			label: "国家组织和机构"
		},
	]
	
	
}
export const dataMap = {
	KNameMap: {
		KId0: "",
		KId1: "百度",
		KId9: "商场"
	},
	contractStateMap: ['未选择','洽谈中','已签约','组公库','总共库','系统未分配','组未分配','垃圾资源'],
	sourceMap: {
		val0: "",
		val8: "搜狗",
		val14:  "360",
		val15:  "UC",
		val16: "头条",
		val21: "自定义",
		val22: "无",
	},
}


export const tableHeadData = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '所属组',
        slot: 'Deptment',
		minWidth: 80,
    },
    {
        title: '业务员',
        slot: 'UName',
		minWidth: 80,
    },
    {
        title: '客户姓名',
        slot: 'Name',
		minWidth: 100,
    },
    {
        title: '意向',
        slot: 'Intention',
		minWidth: 180
    },
    {
        title: '手机号',
        slot: 'CellPhone',
		minWidth: 120,
    }, 
    {
        title: '留言时间',
        slot: 'LeaveWordsDate',
		minWidth: 150,
    },
    {
        title: '最后时间',
        slot: 'LastNegotiationDate',
		minWidth: 150,
    },
    {
        title: '来源',
        slot: 'SName',
		minWidth: 80,
    },
    {
        title: '关键词',
        slot: 'KName',
		minWidth: 80,
    },
    {
        title: '状态',
        slot: 'ContractState',
		minWidth: 80,
    }, 
    {
        title: '洽谈数',
        key: 'NegotiationCount',
		minWidth: 60,
    },
    {
        title: '添加人',
        key: 'Operator',
		minWidth: 60,
    },
    {
        title: '操作',
        slot: 'actions',
        align: 'center',
		minWidth: 180,
    },
]

export const tableMainData = [
    
]

export const newCustomerData = 
	{
		"Id": 0,
		"Deptment": "未分配",
		"UName": "未分配",
		"Name": "",
		"Birthday": "",
		"Age": "",
		"CellPhone": "",
		"TmpCellphone": "",
		"LandlineNumber": "",
		"QQ": "",
		"WeChat": "",
		"Email": "",
		"Gender": 0,
		"PCode": "",
		"CCode": "",
		"DCode": "",
		"Address": "",
		"Occupation": "",
		"Education": 0,
		"Income": 0,
		"JobType": 0,
		"ContractType": 0,
		"Rank": 0,
		"RankName": "",
		"ContractName": "",
		"ContractState": 0,
		"TmpContractState": "",
		"ContractAmount": null,
		"SId": null,
		"SName": "",
		"KId": null,
		"KName": "",
		"Intention": null,
		"TmpIntention": "",
		"Message": "",
		"LeaveWordsDate": 0,
		"TmpLeaveWordsDate": "1970-01-01 08:00:00",
		"LastNegotiationDate": 0,
		"TmpLastNegotiationDate": "未联系",
		"NegotiationCount": 0,
		"Operator": "",
		"State": 0
	}