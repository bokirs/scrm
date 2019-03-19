<template>
    <div class="scrm-page-content resource-manage-batch-import">
        <filterBox rightClassName="none" :hidSearch="true">
        	<template slot="left">
        		<Button type="primary" @click="showTemplet">查看模板</Button>
				<Upload 
					style = "margin: 8px 20px 0;"
					action="" 
					:before-upload="handleBeforeUpload" 
					accept=".xls, .xlsx">
				  <Button
					type="primary" 
					icon="ios-cloud-upload-outline" 
					:loading="uploadLoading" 
					@click="handleUploadFile">上传文件</Button>
				</Upload>
				<Row style="margin-right: 10px;" >
				  <div class="ivu-upload-list-file" v-if="file !== null">
				    <Icon type="ios-stats"></Icon>
				      {{ file.name }}
				    <Icon 
						v-show="showRemoveFile" 
						type="ios-close" 
						class="ivu-upload-list-remove" 
						@click.native="handleRemove()">
					</Icon>
				  </div>
				</Row>
        		
				<div class="input-wrapper">
        			<label>资源来源:</label>
        			<Select v-model="filter.fName" clearable style="width: 85px;">
						<Option 
							v-for="item in resourcList" 
							:value="item.value" 
							:key="item.value">{{ item.name }}</Option>
					</Select>
        		</div>
				<Button type="primary" @click="handleImport">开始导入</Button>
        	</template>
        </filterBox>
		
        <div v-if="tableHid">
			<Card title="导入EXCEL">
				<Row type="flex" justify="center">
					请按照模板格式编写excel
					（可先 <ins @click="showTemplet" style="cursor: pointer; color: #666;">查看模板</ins> ），
					否则无法读取和导入！
				</Row>
			</Card>
		</div>
		
        <tableWrapper v-if="!tableHid">
        	<template slot="table">	
        		<Table 
					size="small" 
					stripe 
					:loading="tableLoading"
					:columns="tableTitle" 
					:data="tableData">
        		</Table>
        	</template>
        	<template slot="paging">
        		<paging 
					v-if = "excelArrData.length > pageData.pageRow" 
					:pageData="pageData" 
					@on-switch-page="switchPage">
				</paging>
        	</template>
        </tableWrapper>
    </div>
</template>

<script>

import filterBox from '@/components/common/filter.vue'
import tableWrapper from '@/components/common/table-wrapper.vue'
import paging from '@/components/common/paging.vue'
import { selectDataInfo } from '@/components/resource-manage/junk-resource/data.js'
import { _post, GlobalMsg } from '@/api/query.js'
import { getToken } from '@/libs/util.js'
import XLSX from 'xlsx'

export default{
	data () {
		return {
			tableTitle: [
				{
					title: "姓名",
					key: "Name"
				},
				{
					title: "手机",
					key: "CellPhone"
				},
				{
					title: "留言内容",
					key: "Message"
				},
				{
					title: "地址",
					key: "Address"
				},
			],
			filter: {
				fName: 0
			},
			resourcList: selectDataInfo.resourcList,
			isShowPreview: false,
			frameTitle: "",
			excelArrData: [],
			// previewTableData: [],
			pageData: {
				row: 0,//共多少行
				pageRow: 20,//一页20行 
				pageIndex: 1,//当前第一页
				pageSum: 1,//总共2页
				toIndex: null//跳转到
			},
			canClickPaging: false,
			uploadLoading: false,
			progressPercent: 0,
			showProgress: false,
			showRemoveFile: false,
			file: null,
			tableData: [],
			tableLoading: false,
			tableHid: true,
		}
	},
	methods:{
		// 查看模板
		showTemplet(){
			this.tableHid = false;
			this.tableData = [
				{
					Name: "测试数据",
					CellPhone: "13012341234",
					Message: "留言",
					Address: "地址"
				},
				{
					Name: "测试数据",
					CellPhone: "13012341234",
					Message: "留言",
					Address: "地址"
				},
				{
					Name: "测试数据",
					CellPhone: "13012341234",
					Message: "留言",
					Address: "地址"
				},
				{
					Name: "测试数据",
					CellPhone: "13012341234",
					Message: "留言",
					Address: "地址"
				},
			]
		},
		
		initUpload(){
			this.tableHid = true;
			this.file = null;
			this.showProgress = false;
			this.loadingProgress = 0;
			this.tableData = [];
			this.excelArrData = [];
		},
		// 手动上传文件
		handleUploadFile(){
			this.initUpload()
		},
		// 上传文件前
		handleBeforeUpload(file){
			const fileExt = file.name.split('.').pop().toLocaleLowerCase()
			if ( fileExt === 'xlsx' || fileExt === 'xls' ) {
				this.file = file;
				this.formatFile(file);
			} else {
			  this.$Notice.warning({
				title: '文件类型错误',
				desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
			  })
			}
			return false
		},
		// 读取文件
		formatFile (file) {
			let workbook;
		    const rABS = false //是否将文件读取为二进制字符串
			const fileName = !file ? false : file.name;
			const reader = new FileReader();
			if ( !fileName ) return false;
			if( rABS ) {
				reader.readAsArrayBuffer(file)
			} else {
				reader.readAsBinaryString(file)
			}
			reader.onloadstart = e => {
				this.uploadLoading = true
				this.tableLoading = true
				this.showProgress = true
			}
			reader.onprogress = e => {
				this.progressPercent = Math.round(e.loaded / e.total * 100)
			}
			reader.onerror = e => {
				this.$Message.error('文件读取出错')
			}
			reader.onload = e => {
				const data = e.target.result
				let arr = String.fromCharCode.apply(null, new Uint8Array(data))
				if(rABS) {
					workbook = XLSX.read(btoa(fixdata(arr)), {
						type: 'base64'
					})
				} else {
					workbook = XLSX.read(data, {
						type: 'binary'
					});
				}
				let excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
				let excelArrData = [];
				excelJson.forEach(item => {
					const obj = {
						Name: item["姓名"],
						CellPhone: item["手机"],
						Message: item["留言内容"],
						Address: item["地址"]
					}
					excelArrData.push(obj)
				})
				if ( !!excelArrData[0].Message && !!excelArrData[0].Address && !!excelArrData[0].CellPhone && !!excelArrData[0].Name ) {
					this.$Message.info('文件读取成功');
				} else {
					excelArrData = [];
					this.$Message.info('excel编写格式不合要求无法成功读取');
				}
				this.excelArrData = excelArrData;
				this.uploadLoading = false;
				this.tableLoading = false;
				this.showRemoveFile = true;
				this.handlePreviewData();
			}
		},
		// 选择文件后预览数据
		handlePreviewData(){
			// 展示表格
			this.tableHid = false;
			const PreviewData = this.excelArrData;
			const showPreviewData = PreviewData.slice(0, 20);
			this.tableData = showPreviewData;
			this.pageData = {
				row: PreviewData.length,//共多少行
				pageRow: 20,//一页20行 
				pageIndex: 1,//当前第一页
				pageSum: Math.ceil( PreviewData.length / 20),//总共2页
				toIndex: null//跳转到
			}
			this.canClickPaging = true;
		},
		handleRemove(){
			this.initUpload();
			this.$Message.info('上传的文件已删除！')
		},
		// 分页
		switchPage(to){
			if ( this.canClickPaging ) {
				const toPage = to > 0 ? parseInt(to) : 1;
				const showPreviewData = this.excelArrData.slice( toPage*20 - 20, 20*toPage);
				this.tableData = showPreviewData;
			} else {
				return false
			}
		},
		// 开始导入
		handleImport(){
			const data = this.excelArrData;
			if ( !(data instanceof Array) || !data.length ) {
				this.$Message.error( '未选择文件或者文件读取失败！' );
				return false;
			}
			// 点击开始导入后 先清空展示的数据
			this.tableData = [];
			let sucData = [];
			const fName = this.filter.fName;
			const Sid = !fName ? 0 : fName;
			let count = 0, res, suc = 0, err = 0;
			
			data.forEach(item => {
				item.Sid = Sid
				_post("/api/v1/customer/import/" + this.token, item).then(res => {
					res = res;
					count += 1;
					if ( count < data.length ) {
						if ( !res.data.Err && res.data.Ret > 0 && res.status === 200 ) {
							suc++;
							sucData.push( item );
						} else {
							err++;
							if ( err === 1 ) {
								GlobalMsg.call(this, res)
							}
						}
					} else {
						this.tableData = sucData.slice(0, 20);
						this.pageData = {
							row: suc,//共多少行
							pageRow: 20,//一页20行 
							pageIndex: 1,//当前第一页
							pageSum: Math.ceil( (suc + 0.1) / 20),//总共2页
							toIndex: null//跳转到
						}
						this.canClickPaging = true;
						setTimeout(() => this.$Message.info( '导入成功' + suc + "条数据！"), 1000);
						return false;
					}
				}).catch(err => console.log(err))
			})
		},
	},
	computed: {
		token(){
			return getToken()
		}
	},
	components:{
		filterBox,
		tableWrapper,
		paging,
	}
}
</script>