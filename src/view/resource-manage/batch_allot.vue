<template>
    <div class="scrm-page-content batch-allot">
		<filterBox rightClassName="none" :hidSearch="true">
			<template slot="left">
				分配明细：当前有 
				<span 
					style="font-size: 16px;color: #2d8cf0;padding: 0 2px;"
				>{{ count }}</span> 条资源没有分配
			</template>
		</filterBox>
		
		<Row class="batch-allot-wrapper" type="flex" :gutter="24">
			<Col span="12">
				<Card class="batch-allot-box">
					<div class="batch-allot-head">
						<Row>
							<Col span="12">
								组名
							</Col>
							<Col span="12">
								分配数量 <span class="count" :class=" handleSum > count ? 'red' : 'green' ">（当前总数：{{ handleSum }} ）</span>
							</Col>
						</Row>
					</div>
					<div class="batch-allot-body">
						<Row v-for="(item,index) in Group" :key="item.Item1">
							<Col span="12">
								{{ item.Item2 }}
							</Col>
							<Col span="12">
								<Button size="small" icon="md-remove" @click="reduce(index)"></Button>
								<Input 
									size="small" 
									:number = "true"
									v-model="num[index]"
									@on-change = "batchNumChange(num[index])"
									style="width: 50px;margin: 0 2px;" />
								<Button size="small" icon="md-add" @click="add(index)"></Button>
							</Col>
						</Row>
					</div>
					<div class="batch-allot-foot">
						<Button 
							type="primary" 
							@click="handleBatch"
						>资源分配</Button>
					</div>
				</Card>
			</Col>
			
			
			<Col span="12">
				<Card class="batch-allot-box">
					<div class="batch-allot-head">
						<Row>
							<Col span="12">
								组名
							</Col>
							<Col span="12">
								分配数量
							</Col>
						</Row>
					</div>
					<div class="batch-allot-body">
						<Row v-for="(item,index) in Group" :key="item.Item1">
							<Col span="12">
								{{ item.Item2 }}
							</Col>
							<Col span="12">
								<span>{{ sucNum[index] }}</span>
							</Col>
						</Row>
					</div>
				</Card>
			</Col>
		</Row>
    </div> 
</template>
<script>
	import filterBox from '@/components/common/filter.vue'
	import { getToken } from '@/libs/util.js'
	import { _post, _get, GlobalMsg } from '@/api/query.js'
	
	export default{
		data(){
			return{
				num: [],
				count: 0,//未分配资源总数
				Group: [],
				Customer: [],
				sucNum: [],
				handleSum: 0,//手动填写的分配数量总和
			}
		},
		methods: {
			init() {
				this.getBatch().then(() => {
					this.batchNum();
				})
			},
			// 获取分配资源
			getBatch(){
				return _get("/api/v1/customer/getBatch/" + this.token).then(res => {
					const data = res.data.Data;
					const Group = data.filter(item => item.Item3 == "Group" || item.Item3 == "Member" );
					const Customer = data.filter(item => item.Item3 == "Customer");
					this.count = this.handleSum = Customer.length;
					this.Group = Group;
					this.Customer = Customer;
				});
			},
			// 计算各组的分配数量
			batchNum(){
				const GroupLen = this.Group.length;
				//近似的分配数量 ==> 总数除以组数四舍五入
				const about =  Math.round(this.count / GroupLen);
				// 新建一个数组 [about,about,about]
				let num = new Array(GroupLen).fill(about);
				// 新数据各项的总和
				const sum = about * GroupLen;
				// 比较四舍五入的和  跟 资源总数
				num[0] = ( this.count - sum ) + about;
				// 各组的资源分配数量
				this.num = num;
				this.sucNum = new Array(GroupLen).fill(0);
			},
			// 改变 分配数量
			batchNumChange(data){
				let sum = 0;
				this.num.forEach(item => {
					const num = !item ? 0 : parseInt(item);
					sum += num;
				})
				this.handleSum = sum;
			},
			// 提交 资源分配
			handleBatch(){
				let sum = 0;
				const beforeCount = this.count;
				this.num.forEach(item => {
					const num = !item ? 0 : parseInt(item);
					sum += num;
				})
				if ( sum > this.count ) {
					this.$Message.error("分配数量不得大于总数：" + this.count)
				} else {
					const customer = this.Customer.slice(0,sum);
					let n = 0, ret = 0, arr = [];
					this.Group.forEach((Group,index) => {
						const num = !this.num[index] ? 0 : this.num[index];
						const Batching = customer.slice( n , n += num);
						const CIds = Batching.map(item => item.Item1)
						const data = {
							Id: Group.Item1,
							CIds: CIds.join()
						}
						_post("/api/v1/customer/batchInsert/" + this.token, data).then(res => {
							if ( !res.data.Err ) {
								const sucCount = num;
								arr[index] = sucCount;
								if ( (index+1) >= this.Group.length ) {
									this.getBatch().then(() => {
										this.batchNum();
										const difference = beforeCount - this.count;
										this.$Message.info("成功导入"+ difference +"条数据！");
										this.sucNum = arr;
										return false;
									})
								}
							} else {
								if ( (index+1) >= this.Group.length ) {
									GlobalMsg.call(this,res);
									return false;
								}
							}
						}).catch(err => console.log(err));
					})
				}
			},
			reduce(n){
				if ( this.num[n] < 1 ) {
					return false
				}
				this.handleSum -= 1;
				this.num.splice(n,1,this.num[n]-1)
			},
			add(n){
				if ( this.num[n] == this.count ) {
					return false
				}
				this.handleSum += 1;
				this.num.splice(n,1,this.num[n]+1)
			}
		},
		computed: {
			token() {
				return getToken()
			}
		},
		mounted(){
			this.init();
		},
		components:{
			filterBox,
		}
	}
</script>
<style scoped>
.count {
	font-size: 10px;
}
.red {
	color: red;
}
.green {
  color: green;
}
</style>

<style>
.batch-allot-wrapper{
	height: 620px;
}
.batch-allot-box{
	text-align: center;
	height: 100%;
}	
.batch-allot-box .batch-allot-head{
	padding:0 20px 10px;
	border-bottom: 1px #ddd solid;
}
.batch-allot-box .batch-allot-body{
	width: 100%;
	height: 500px;
	box-sizing: border-box;
	overflow-y: auto;
	padding: 0 20px;
}
.batch-allot-box .batch-allot-body>div{
	width: calc(100% + 17px);
	height: 40px;
	line-height: 40px;
}
.batch-allot-box .batch-allot-body>div:nth-child(2n){
	background-color: #FCFCFC;
}
.batch-allot-box .batch-allot-foot{
	padding: 20px 0 0;
}
</style>