<template>
	<frameBox @close="close" classname="mid" mytitle="客户小结">
		<template slot="frame-form">
			<section class="basic-info">
				<div class="tips">
					<div class="">基本信息</div>
				</div>
				<Row>
					<Col span="11" offset="1">
						<label>姓名：</label>
						<span>{{ NoteProps.info.Name }}</span>
					</Col>
					<Col span="11" offset="1">
						<label>性别：</label>
						<span>{{ GenderMap[NoteProps.info.Gender] }}</span>
					</Col>
				</Row>
				<Row style="padding-bottom: 20px;">
					<Col span="23" offset="1">
						<label>手机号：</label>
						<span>{{ NoteProps.info.CellPhone }}</span>
					</Col>
				</Row>
			</section>
			
			<section class="basic-info">
				<div class="tips">
					<div class="">添加小结</div>
				</div>
				 <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
					<FormItem label="洽谈方式" prop="CWay">
						<Select :number="true" v-model="formValidate.CWay" placeholder="选择洽谈方式">
							<Option v-for="(item,index) in CWaySel" :value="index+2" :key="index">{{ item }}</Option>
						</Select>
					</FormItem>
					
					<FormItem label="小结内容" prop="Message">
						<Input v-model="formValidate.Message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写小结内容..."></Input>
					</FormItem>
					
					<FormItem>
						<Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
					</FormItem>
				</Form>
			</section>
			
			<section class="basic-info">
				<div class="tips">
					<div class="">洽谈记录</div>
				</div>
				<Table :columns="noteTabHead" :data="NoteProps.note">
					<template slot-scope="{ row }" slot="createdate">
						<span>{{ formatTime( row.createdate ) }}</span>
					</template>
					
					<template slot-scope="{ row }" slot="CWay">
						<span>{{ formatCWay(row.CWay) }}</span>
					</template>
				</Table>
			</section>
		</template>
	</frameBox>
</template>

<script>
	import frameBox from '../../common/frame.vue'
	import { getDate } from '@/libs/tools.js'
	
	export default {
		props: {
			NoteProps: {
				type: Object
			}
		},
		data() {
			return {
				formValidate: {
					CWay: null,
					Message: "",
				},
				ruleValidate: {
					CWay: [
						{ required: true, type: 'number', message: '请选择洽谈方式', trigger: 'change' }
					],
					Message: [
						{ required: true, type: 'string', message: '请填写小结内容', trigger: 'change' }
					]
				},
				// 分别对应 2~8
				CWaySel: ["电话","在公司面谈","拜访","微信","QQ","电子邮件","其它方式"],
				CWayMap: ["未知","资源划分","电话","在公司面谈","拜访","微信","QQ","电子邮件","其它方式"],
				GenderMap: ["未知","男","女"],
				noteTabHead: [
					{
						title: "时间",
						slot: "createdate",
						width: 150
					},
					{
						title: "洽谈人",
						key: "uName",
						width: 80
					},
					{
						title: "洽谈方式",
						slot: "CWay",
						width: 80
					},
					{
						title: "小结内容",
						key: "content"
					}
				],
				noteTabMain: [
					{
						"createdate": 1542362621,
						"uName": "系统",
						"CWay": 1,
						"content": "长时间未联系，自动释放到“公共资源”"
					}, {
						"createdate": 1542362621,
						"uName": "系统",
						"CWay": 1,
						"content": "长时间未联系，即将自动释放到公库，请及时回访！"
					}, {
						"createdate": 1542362621,
						"uName": "熊剑心",
						"CWay": 1,
						"content": "邓坤的资源已达上限，系统将此资源划分给总公库中"
					}, {
						"createdate": 1542362621,
						"uName": "总监测试",
						"CWay": 1,
						"content": "总监测试将此资源划分给野狼组"
					}
				]
			};
		},
		methods:{
			close(data){
				this.$emit("close",data)
			},
			handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
						const n = !this.formValidate.CWay ? 0 : this.formValidate.CWay;
						const newNote = {
							"Id": 0,
							"CId": this.NoteProps.info.Id,
							"UName": null,
							"CWay": this.formValidate.CWay,
							"TmpCWay": this.CWayMap[n],
							"Content": this.formValidate.Message,
							"Clock": -28800,
							"TmpClock": "无",
							"CreateDate": 0,
							"TmpCreateDate": "1970-01-01 08:00:00"
						}
						this.$emit("on-create-note",newNote);
						this.formValidate = {
							CWay: null,
							Message: "",
						}
                    } else {
                        this.$Message.error('表单格式错误!');
                    }
                })
            },
			formatTime(time){
				return getDate(time,'year');
			},
			formatCWay( type ){
				return type < 1 || type > 8 ? "未知" : this.CWayMap[type];
			}
		},
		components:{
			frameBox
		}
	}
</script>

<style>
.basic-info label{
	display: inline-block;
	line-height: 20px;
	width: 5em;
	padding: 10px 10px 10px 0;
	text-align: right;
}
</style>
