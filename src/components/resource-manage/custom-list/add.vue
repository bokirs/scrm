<template>
	<frameBox @close="close" classname="large" :mytitle="frameTitle" :class="{'add': isAdd}" >
		<template slot="frame-form">
			<div class="tips">
				<div class="">基本信息</div>
			</div>
			<Form  
				ref="newCustomerData" 
				:rules="ruleValidate" 
				:model="newCustomerData" 
				class="customer-form1 clear" 
				:label-width="70"
			>
				<Row>
					<Col span="11">
						<Row>
							<Col span="17">
								<FormItem label="客户姓名" prop="Name">
									<Input v-model="newCustomerData.Name" placeholder="姓名(只能是英文或中文)"></Input>
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="17">
								<FormItem label="手机号码" prop="CellPhone">
									<Input v-model="newCustomerData.CellPhone" placeholder=""></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>    
							<Col span="17">
								<FormItem label="座机号码">
									<Input v-model="newCustomerData.LandlineNumber" placeholder="请输入座机号码..."></Input>
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="12">
								<FormItem label="微信">
									<Input v-model="newCustomerData.WeChat" placeholder="请输入微信号..."></Input>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="QQ">
									<Input v-model="newCustomerData.QQ" placeholder="请输入QQ号..."></Input>
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="17">
								<FormItem label="出生日期">
									<DatePicker v-model="newCustomerData.Birthday" type="date" placeholder="选择日期..."></DatePicker>
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="12">
								<FormItem label="文化程度">
									<Select 
										clearable 
										v-model="newCustomerData.Education">
										<Option v-for="(i,n) in selectData.Education" :value=" i.value" :key="n">{{ i.label }}</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="收入">
									<Select
										clearable 
										v-model="newCustomerData.Income">
										<Option v-for="(i,n) in selectData.Income" :value=" i.value" :key="n">{{ i.label }}</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="17">
								<FormItem label="省份">
									<Select
										clearable
										placeholder="" 
										v-model="newCustomerData.PCode"
										@on-change = "areaShengChange"
									>
										<Option 
											v-for="sheng in district"
											:value="sheng.value"
											:key="sheng.value"
										>
											{{ sheng.label }}
										</Option>
									</Select>
								</FormItem>	
							</Col>
						</Row>
						
						<Row>
							<Col span="17">
								<FormItem label="地级(城)市">
									<Select
										clearable
										placeholder="" 
										v-model="newCustomerData.CCode"
										@on-change = "areaShiChange"
									>
										<Option 
											v-for="shi in cityData"
											:value="shi.value"
											:key="shi.value"
										>
											{{ shi.label }}
										</Option>
									</Select>
								</FormItem>	
							</Col>
						</Row>
						
						<Row>
							<Col span="17">
								<FormItem label="县市区">
									<Select
										clearable
										placeholder="" 
										v-model="newCustomerData.DCode"
									>
										<Option 
											v-for="xian in countyData"
											:value="xian.value"
											:key="xian.value"
										>
											{{ xian.label }}
										</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						
						<FormItem label="详细地址">
							<Input v-model="newCustomerData.Address" placeholder="填写详细地址..."></Input>
						</FormItem>
					</Col>
					
					<Col span="11" offset="2">
						<Row>
							<Col span="17">
								<FormItem label="关键词">
									<Select 
										clearable
										placeholder="请选择关键词" 
										v-model="newCustomerData.KId"
									>
										<Option 
											v-for="(i,n) in resources.KName" 
											:value="i.value" 
											:key="n"
										>{{ i.label }}</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="17">
								<FormItem label="客户来源" prop="SId">
									<Select
										placeholder="请选择客户来源" 
										v-model="newCustomerData.SId"
									>
										<Option 
											v-for="(i,n) in resources.source" 
											:value="i.value" 
											:key="n"
										>{{ i.label }}</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						
						<FormItem label="电子邮箱" prop="Email">
							<Input placeholder="Email" v-model="newCustomerData.Email"></Input>
						</FormItem>
						
						<Row>
							<Col span="12">
								<FormItem label="性别">
									<Select clearable  v-model="newCustomerData.Gender">
										<Option :value="1">男</Option>
										<Option :value="2">女</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="年龄">
									<Input placeholder="填写年龄..." v-model="newCustomerData.Age"></Input>
								</FormItem>
							</Col>
						</Row>
						
						
						<FormItem label="行业">
							<Select 
								clearable  
								placeholder="请选择所属行业" 
								v-model="newCustomerData.JobType"
							>
								<Option 
									v-for="(i,n) in selectData.JobType" 
									:value=" i.value" 
									:key="n"
								>{{ i.label }}</Option>
							</Select>
						</FormItem>
						
						<Row>
							<Col span="17">
								<FormItem label="职业">
									<Input 
										placeholder="请填写职业..." 
										v-model="newCustomerData.Occupation"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="17">
								<FormItem label="客户意向" prop="Intention">
									<Select 
										clearable 
										placeholder="请选择客户意向" 
										v-model = "newCustomerData.Intention"
									>
										<Option 
											v-for="(i,n) in selectData.purpose" 
											:value=" i.value" 
											:key="n"
										>{{ i.label }}</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="17">
								<FormItem label="状态">
									<Select 
										clearable 
										placeholder="请选择客户状态" 
										v-model="newCustomerData.ContractState"
										@on-change = "IntentionChange"
									>
										<Option 
											v-for="(i,n) in selectData.contractState" 
											:value="i.value" 
											:key="n">
											{{ i.label }}
										</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="17">
								<FormItem label="合同版本" prop="ContractType">
									<Select 
										clearable 
										:disabled="newCustomerData.ContractState !== 2" 
										placeholder="签约必选" 
										v-model="newCustomerData.ContractType"
									>
										<Option 
											v-for="(i,n) in resources.ContractType" 
											:value="i.value"
											:key="n"
										>{{ i.label }}</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						
						<FormItem label="合同金额" prop="ContractAmount">
							<Input 
								:number = "true"
								:disabled="newCustomerData.ContractState !== 2"
								placeholder="签约必填(999~999999)" 
								v-model="newCustomerData.ContractAmount"
							></Input>
						</FormItem>
						
					</Col>
				</Row>
				
				<FormItem style="width:100%;" class="form-item-textarea" label="留言内容">
					<Input 
						v-model="newCustomerData.Message" 
						style="width:100%;" type="textarea" 
						:autosize="{ minRows: 4,maxRows: 8 }" 
						placeholder="留言内容...">
					</Input>
				</FormItem>
				
				
				<FormItem style="margin-top: 24px;">
					<Button
						type="primary" 
						class="scrm-sub-btns"
						@click="handleSubmit('newCustomerData',SubUserInfo)">
						保存
					</Button>
				</FormItem>
			</Form>
 			
			<div v-if="!isAdd">
				<div class="tips" style="margin-top: 50px;">
					<div class="">便签信息</div>
				</div>
				<Form 
					ref="customer-form2" 
					:rules = "ruleValidate" 
					:model = "note" 
					class="clear customer-form2" 
					:label-width="70">
					
					<Row :gutter="8">
						<Col span="6">
							<FormItem label="洽谈方式" prop="Cway">
								<Select clearable :number="true" v-model="note.Cway">
									<Option
										v-for="(item,index) in CwayMap" 
										:key="item" :value="index+2">
										{{ item }}
									</Option>
								</Select>
							</FormItem>
						</Col>
						<Col offset="1" span="8">
							<FormItem label="设置闹钟" prop="Clock">
								<DatePicker 
									type="datetime" 
									:disabled="!note.enabled" 
									v-model="note.Clock" 
									placeholder="选择日期">
								</DatePicker>
							</FormItem>
						</Col>
						<Col style="padding: 6px 0 0 10px;" offset="1" span="5">
							<span style="vertical-align: middle;margin-right: 10px;">启用闹钟</span>
							<i-switch
								@click.native.stop = "clockSwitchChange"
								v-model = "note.enabled">
								<Icon type="md-checkmark" slot="open"></Icon>
								<Icon type="md-close" slot="close"></Icon>
							</i-switch>
						</Col>
					</Row>
									
					<Row>
						<Col span="24">
							<FormItem style="width:100%;" class="form-item-textarea" label="小结内容" prop="msg">
								<Input 
									v-model="note.msg" 
									style="width:100%;" 
									type="textarea" 
									:autosize="{minRows: 2,maxRows: 4}" 
									placeholder="小结内容..." />
							</FormItem>
						</Col>
					</Row>
					
					<FormItem style="margin-bottom:50px;">
						<Button 
							type="primary" 
							class="scrm-sub-btns"
							@click="handleSubmit('customer-form2',SubNote)"
						>
							保存
						</Button>
					</FormItem>
				</Form>

				<div class="tips">
					<div class="">小节记录</div>
				</div>
				
				<Table :columns="tableHead" :data="tableData">
					<template slot-scope="{ row }" slot="createdate">
						{{ formatTime(row.createdate) }}
					</template>
					
					<template slot-scope="{ row }" slot="Clock">
						{{ formatTime(row.Clock) }} 
					</template>
					
					<template slot-scope="{ row }" slot="CWay">
						{{ formatCway(row.CWay) }}
					</template>
					
					<template slot-scope="{ row }" slot="action">
						<div class="table-btns">
							<Poptip
								v-author = "1"
								confirm
								title="您确定删除吗？"
								@on-ok="DelNote(row.id)"
							>
								<a> 删除 </a>
							</Poptip>
						</div>
					</template>
				</Table>
			</div>	
		</template>
		
	</frameBox>
</template>

<script> 
	import frameBox from '../../common/frame.vue'
	import { selectData,dataMap } from './data.js'
	import { getDate, hidTel } from '@/libs/tools.js'
	import district from '@/assets/static/district.json'
	
	export default {
		props:{
			resources: Object,
			newCustomerData: Object,
			frameTitle:{
				type: String,
				default: "新增用户"
			},
			btnTip:{
				type: String,
				default: "新增",
			},
			isAdd: Boolean,
			tableHead: {
				type: Array,
				default(){
					return [
						{
							title: '时间',
							slot: 'createdate',
							width: 150,
							align: 'center'
						},
						{
							title: '洽谈人',
							key: 'uname',
							width: 80,
							align: 'center'
						},
						{
							title: '方式',
							slot: 'CWay',
							width: 80,
							align: 'center'
						},
						{
							title: '内容',
							key: 'content',
							align: 'center'
						},
						{
							title: '闹钟时间',
							slot: 'Clock',
							width: 150,
							align: 'center'
						},
						{
							title: '操作',
							align: 'center',
							slot: 'action',
							width: 120,
							align: 'center'
						},
					]
				}
			},
			tableData:  Array,
			note: {
				type: Object,
				default(){
					return {
						Cway: 0,
						Clock: null,
						enabled: false,
						msg: ""
					}
				}
			}
		},	
		data() {
			return {
				SId: null,
				Intention: null,
				selectData,
				dataMap,
				ruleValidate: {
					Name: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' },
						{ 
							type: 'string',
							pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
							message: '必填，中文或英文', 
							trigger: 'blur'
						}
					],
					CellPhone: [
						{ required: true, message: '手机号不能为空', trigger: 'blur' },
						{ 
							type: 'string', 
							pattern: /1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}/,
							message: '手机号格式有误', 
							trigger: 'blur'
						}
					],
					ContractType: [],
					ContractAmount: [],
					SId: [
						{ required: true, type: 'number', message: '必选', trigger: 'change' },
					],
					Intention: [
						{ required: true, type: 'number', message: '必选', trigger: 'change' },
					],
					Cway: [
						{ 
							required: true, 
							type: 'number', 
							min: 1,
							message: '请选择洽谈方式', 
							trigger: 'change' ,
						},
						{ type: 'number', message: '格式有误', trigger: 'change' }
					],
					msg: [
						{ required: true, message: '请填写小结内容', trigger: 'blur' }
					],
					Clock: []
				},
				CwayMap: ["电话","在公司面谈","拜访","微信","QQ","电子邮件","其它方式"],
				customInfo: {}, //客户信息
				notContracted: true,
				district: {}, //全国省市县数据
				cityData: [], // 当前省的市级数据
				countyData: [],// 当前市的县级数据
				KeyWordText: "", // 关键词
				SourceText: "", // 来源
			};
		},
		methods:{
			close(data){
				this.$emit("close",data)
			},
			handleSubmit(name,callback){
				this.IntentionChange();
				this.$refs[name].validate((valid) => {
					if (valid) {
						callback();
					} else {
						this.$Message.error('表单格式错误!');
					} 
				});	
			},
			IntentionChange(){
				const data = this.newCustomerData.ContractState;
				// data === 2 是已签约
				if ( data == 2 ) {
					this.notContracted = false;
					this.ruleValidate.ContractType = [
						{ 
							required: true,
							type: 'number',
							min: 1,
							max: 99,
							message: '签约必填', 
							trigger: 'blur',
						}
					];
					this.ruleValidate.ContractAmount = [
						{ required: true, type: 'number', message: ' ', trigger: 'blur' },
						{
							required: true, 
							type: 'number',
							min: 999,
							max: 999999,
							message: ' ', 
							trigger: 'blur',
						}
					]; 
				} else{
					this.ruleValidate.ContractType = [];
					this.ruleValidate.ContractAmount = [];
					this.notContracted = true;
					this.newCustomerData.ContractType = 0;
					this.newCustomerData.ContractAmount = 0;
				}
			},
			/* 区域选择 */
			areaShengChange(){
				/* 每次选择省 就把市县级的数据清空 */
				this.cityData = [];
				this.countyData = [];
				this.newCustomerData.CCode = "";
				this.newCustomerData.DCode = "";
				
				const PCode = this.newCustomerData.PCode;
				this.district.forEach(sheng => {
					if ( sheng.value == PCode ) {
						this.cityData = sheng.children;
						return;
					}
				})
			},
			
			areaShiChange(){
				/* 每次选择市 就把县级的数据清空 */
				this.countyData = [];
				this.newCustomerData.DCode = "";
				if ( !this.cityData || !this.cityData instanceof Array ) {
					return false;
				} else {
					const CCode = this.newCustomerData.CCode;
					const shi = this.cityData.filter(shi => shi.value == CCode);
					try{
						if ( shi.length < 1 ) {
							return false;
						} else {
							this.countyData = shi[0].children;
						}
					}catch(e){
						console.log( e )
					}
				}
			},
			
			// 提交用户信息
			SubUserInfo(){
				const data = this.formatData();
				this.$emit("on-add-user",data);
			},
			// 保存便签信息
			SubNote(){
				const newNoteData = this.formatNewNote();
				this.$emit("noteSub",newNoteData);
			},
			// 删除小结
			DelNote(id){
				this.$emit("DelNote",id);
			},

			formatData(){
				const data = this.newCustomerData;
				
				// 关键词
				const kid = !data.KId ? 0 : data.KId *1;
				const KName = !data.KId ? "" : this.dataMap.KNameMap["KId" + kid];
				
				// 客户来源
				const sid = !data.SId ? 0 : data.SId *1;
				const SName = !data.SId ? "" : this.dataMap.sourceMap['val'+ sid];

				// 意向
				const intention = !data.Intention ? 0 : data.Intention *1;
				const TmpIntention = intention == 0 ? "未选择" : this.selectData.purpose[intention-1].label;
				
				// 状态
				const state = !data.contractState ? 0 : data.contractState *1;
				const TmpContractState = this.dataMap.contractStateMap[state];
				 
				// 手机号
				const tel = data.CellPhone;
				
				let customInfo = {
					"Id": !data.Id ? 0 : data.Id,
					"Deptment": !data.Deptment ? "未分配" : data.Deptment,
					"UName": !data.UName ? "未分配" : data.Deptment,
					"Name": data.Name,
					"Birthday": this.formatDate(data.Birthday),
					"Age": data.Age,
					"CellPhone": data.CellPhone,
					"TmpCellphone": hidTel(tel),
					"LandlineNumber": data.LandlineNumber,
					"QQ": data.QQ,
					"WeChat": data.WeChat,
					"Email": data.Email,
					"Gender": data.Gender,
					"PCode": data.PCode,
					"CCode": data.CCode,
					"DCode": data.DCode,
					"Address": data.Address,
					"Occupation": data.Occupation,
					"Education": data.Education,
					"Income": data.Income,
					"JobType": data.JobType,
					"ContractType": data.ContractType,
					"Rank": 0,
					"RankName": "",
					"ContractName": null,
					"ContractState": data.ContractState,
					"TmpContractState": TmpContractState,
					"ContractAmount": !data.ContractAmount ? 0 : data.ContractAmount,
					"SId": sid,
					"SName": SName,
					"KId": kid,
					"KName": KName,
					"Intention": intention,
					"TmpIntention": TmpIntention,
					"Message": data.Message,
					"LeaveWordsDate": 0,
					"TmpLeaveWordsDate": "1970-01-01 08:00:00",
					"LastNegotiationDate": 0,
					"TmpLastNegotiationDate": "未联系",
					"NegotiationCount": 0,
					"Operator": "",
					"State": 0
				}
				return customInfo;
			},
			formatTime(t){
				if ( t === 0 ) return "无";
				return getDate(t,"year")
			},
			formatDate(date){
				if ( !date instanceof Date || !date ) {
					return ""
				} else {
					const y = date.getFullYear(),
						  m = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1,
						  d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
					const birthday = y + "-" + m + "-" + d;
					return birthday;
				}
			},
			formatCway(Cway){
				return this.CwayMap[Cway-2]
			},
			// 添加新的便签 需要传的数据
			formatNewNote(){
				const now = parseInt(new Date().getTime() / 1000);
				const Clock = !this.note.Clock || !this.note.enabled ? 0 : parseInt(new Date(this.note.Clock).getTime() / 1000);
				const TmpCWay = !this.note.Cway ? "" : this.formatCway(this.note.Cway);
				const newNoteData = {
					"Id": 0,
					"CId": this.newCustomerData.Id,
					"UName": this.$store.state.user.RealName,
					"CWay": this.note.Cway,
					"TmpCWay": TmpCWay,
					"Content": this.note.msg,
					"Clock": Clock,
					"TmpClock": this.formatTime(Clock),
					"CreateDate": now,
					"TmpCreateDate": this.formatTime(now)
				}
				return newNoteData;
			},
			// 设置关键词和来源词典
			setDataMap(){
				const data = this.resources;
				data.KName.forEach(item => {
					this.dataMap.KNameMap['KId' + item.value] = item.label;
				})
				data.source.forEach(item => {
					this.dataMap.sourceMap['val' + item.value] = item.label;
				})
			},
			// 三级联动
			initDistrict(){
				// 存储 省级联动json数据
				this.district = district;
				const PCode = this.newCustomerData.PCode,
					  CCode = this.newCustomerData.CCode,
					  DCode = this.newCustomerData.DCode;
					  
				const PCodes = this.district.map(P => P.value);
				// 如果是编辑
				if ( !this.isAdd && PCodes.includes(PCode) ) {
					// 市级数据
					let cityData = [];
					this.district.forEach(P => {
						if ( P.value == PCode ) {
							cityData = P.children;
						}
					})
					this.cityData = cityData;
					// 县级数据
					let countyData = [];
					cityData.forEach(C => {
						if ( C.value == CCode ) {
							countyData = C.children;
						}
					})
					this.countyData = countyData;
				}
			},
			init(){
				this.setDataMap();
				this.initDistrict();
			}
		},
		
		components:{
			frameBox,
		},
		mounted(){
			this.init();
		}
	}
</script>
<style>
	.full-fixd.large.add > .frame-wrapper{
		height: 90%;
		max-height: 710px;
	}
	.full-fixd.large.add > .frame-wrapper > .frame-form-main{
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		max-height: 100%;
	}
	
	.ivu-input,
	.ivu-select-selection{
		background-color: #fbfbfb;
	}
	.customer-form1 .ivu-form-item{
		margin-bottom: 8px;
	}
	.customer-form1 .ivu-form-item-error-tip{
		display: flex;
		position: absolute;
		padding: 0;
		margin-left: 5px;
		left: 100%;
		top: 0;
		align-items: center;
		top: 50%;
		transform: translateY(-50%);
		font-size: 12px;
		line-height: 16px;
		width: 50%;
	}
</style>