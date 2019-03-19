import { getDate } from '@/libs/tools.js'
export const tableDataHeader = [
	{
	    title: '序列号',
	    type: 'index'
	},
	{
	    title: '客户姓名',
        slot: 'Name'
	},
	{
	    title: '最后时间',
        slot: 'LastNegotiationDate',
        // render: (h, r) => {
		// 	return h('span', getDate(r.row.LeaveWordsDate, 'year'))
		// }
	},
	{
	    title: '合同金额',
	    slot: 'ContractAmount',
	}, 
	{
	    title: '实收金额',
	    key: 'Income',
	},
	{
	    title: '合同版本',
	    key: 'ContractName',
	}
	// {
	//     title: '操作',
	//     slot: 'actions',
	//     align: 'center',
	// },
]

export const tableMainData = [
	{
		serialNumber: 'DSERT457HSWT',
		customerName: '马化腾',
		lastTime: '2011-11-11 11:11:11',
		contractValue: 4800,
		amountReceived: 4800,
		version: "第一版",
	},
]

export const selectData = {
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
     purpose: [
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
}