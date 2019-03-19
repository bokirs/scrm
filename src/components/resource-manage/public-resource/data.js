export const tableDataHeader = [
	{
	    title: '所属组',
	    key: 'Deptment',
	},
	{
	    title: '业务员',
	    key: 'UName',
	},
	{
	    title: '客户姓名',
	    slot: 'Name',
	},
	{
	    title: '意向',
	    slot: 'Intention',
	},
	{
	    title: '手机号',
	    slot: 'CellPhone',
		width: 180,
	}, 
	{
	    title: '留言时间',
	    slot: 'LeaveWordsDate',
		width: 150,
	},
	{
	    title: '最后时间',
	    slot: 'LastNegotiationDate',
		width: 150,
	},
	{
	    title: '状态',
	    slot: 'ContractState',
	}, 
	{
	    title: '洽谈数',
	    key: 'NegotiationCount',
	},
	{
	    title: '操作',
	    slot: 'actions',
	    align: 'center',
		width: 180,
	},
]

export const tableMainData = [
	{
		"Id": 3090,
		"Deptment": "野狼组",
		"UId": 11,
		"UName": "邓坤",
		"Age": "",
		"Birthday": "2018-04-08",
		"Name": "我收菜的人",
		"CellPhone": "18507125467",
		"LandlineNumber": "",
		"QQ": "",
		"WeChat": "",
		"Email": "",
		"Gender": 0,
		"PCode": "110000",
		"CCode": "110100",
		"DCode": "110101",
		"Address": "",
		"message": "测试的人呀",
		"Occupation": "",
		"Education": 0,
		"Income": 0,
		"JobType": 0,
		"ContractType": 0,
		"ContractName": "",
		"ContractState": 4,
		"ContractAmount": 0,
		"LeaveWordsDate": 1542362621,
		"LastNegotiationDate": 1542362621,
		"SId": 0,
		"SName": "",
		"KId": 0,
		"KName": "",
		"Intention": 6,
		"NegotiationCount": 0,
		"OperatorId": 11,
		"Operator": "邓坤"
	}
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
        },
    ],
    purpose:[
        {
            label: "一般",
            value: "一般",
        },
        {
            label: "强烈",
            value: "强烈",
        },
        {
            label: "考察中",
            value: "考察中",
        },
    ]
}