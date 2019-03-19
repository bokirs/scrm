<template>
  <div class="scrm-page-content resource-manage-custom-list">
    <filterBox>
      <template slot="left">
				<div class="input-wrapper input-wrapper-small">
          <label>业务员:</label>
          <Select v-model="queryData.bId" clearable style="width: 85px;">
            <Option 
							v-for="p in DepartmentList[0].personnels"
							:value="p.UId"
							:key="p.UId"> 
							{{ p.UName }} 
						</Option>
          </Select>
        </div>

        <div class="input-wrapper input-wrapper-small">
          <label>客户姓名:</label>
          <Input type="text" v-model="queryData.CName" placeholder="客户姓名" style="width: 100px;"/>
        </div>
        <div class="input-wrapper">
          <label>手机:</label>
          <Input type="text" v-model="queryData.CellPhone" placeholder="手机号" style="width: 120px;"/>
        </div>

        <div class="input-wrapper">
          <label>留言时间:</label>
          <DatePicker
            v-model="timeZone"
            type="daterange"
            split-panels
            placeholder="选择时间区间"
            style="width: 190px"
          ></DatePicker>
        </div>

        <div class="input-wrapper">
          <label>洽谈次数:</label>
          <Select v-model="queryData.Count" clearable style="width: 85px;">
            <Option
              v-for="item in selectData.count"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>

        <div class="input-wrapper">
          <label>意向:</label>
          <Select
            v-model="queryData.Intention"
            style="background-color: #f6f6f6;width: 70px;"
            clearable
          >
            <Option
              v-for="item in selectData.purpose"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <Button type="primary" icon="ios-search" @click="handleSearch">查询</Button>
      </template>

      <template v-author ="authorObj.add" slot="right">
        <Tooltip content="批量分配">
          <Button
						:disabled = "darkAllocateBtns"
            @click="batchAllocate"
            size="large"
            type="primary"
            shape="circle"
            icon="md-git-network"
          ></Button>
        </Tooltip>

        <Tooltip content="刷新">
          <Button
            ref="refresh"
            size="large"
            type="primary"
            shape="circle"
            icon="md-refresh"
            @click="refresh"
          ></Button>
        </Tooltip>
      </template>
    </filterBox>

    <tableWrapper>
      <template slot="table">
        <Table
          size="small"
          ref="selection"
          @on-select="mySelections"
          @on-select-all="mySelections"
          @on-selection-change="mySelections"
          stripe
          :columns="tableHeadData"
          :data="tableMainData"
        >
          <template slot="actions" slot-scope="{ row,index }">
            <div class="table-btns">
              <a 
								v-author="authorObj.dis"
								@click="soloAllocate(row.State, row.Id, index)"
							>分配</a>
              <a v-author="authorObj.del" @click="clickDel(row.Id)">删除</a>
            </div>
          </template>

          <template slot="Name" slot-scope="{ row }">
            <div class="table-btns">
              <a @click="reviseRowData(row)">
                {{ row.Name }}
              </a>
            </div>
          </template>

          <template slot="CellPhone" slot-scope="{row}" >
              <span>
                {{ HidTel( row.CellPhone ) }}
              </span>
          </template>

          <template slot="Intention" slot-scope="{ row }">
            <span>{{format_intention(row.Intention)}}</span>
          </template>

          <template slot="LeaveWordsDate" slot-scope="{ row }">
            <span>{{ formatDate(row.LeaveWordsDate) }}</span>
          </template>

          <template slot="LastNegotiationDate" slot-scope="{ row }">
            <span>{{ formatDate(row.LastNegotiationDate) }}</span>
          </template>

          <template slot="ContractState" slot-scope="{ row }">
            <span>{{ formatState(row.ContractState) }}</span>
          </template>
		  
					<template slot="SName" slot-scope="{ row }">
						<span>{{ !row.SName ? "未选择" : row.SName }}</span>
					</template>
					<template slot="Deptment" slot-scope="{ row }">
						<span>{{ !row.Deptment ? "未分配" : row.Deptment }}</span>
					</template>
					
					<template slot="UName" slot-scope="{ row }">
						<span>{{ !row.UName ? "未分配" : row.UName }}</span>
					</template>
					
					<template slot="KName" slot-scope="{ row }">
						<span>{{ !row.KName ? "未选择" : row.KName }}</span>
					</template>
				</Table>
      </template>
      <template slot="paging">
        <paging :pageData="pageData" @on-switch-page="switchPage"></paging>
      </template>
      <template slot="loading">
        <Spin size="large" fix v-if="spinShow">
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </template>
    </tableWrapper>

		<!-- 编辑、新增客户 -->
    <transition name="slide-fade">
      <add-custom
        v-if="isShowAddCustom"
        :resources = "resources"
        :newCustomerData="newCustomerData"
        :frameTitle="title"
        :btnTip="btnTip"
        :isAdd="isAdd"
        :note="note"
        :tableData="negorecords"
        @on-add-user="addNewUser"
        @noteSub="noteSub"
        @DelNote="DelNote"
        @close="removeFrame"
      ></add-custom>
    </transition>

    <!-- 分配 -->
    <transition name="slide-fade">
      <batch-allocate
        v-if="isShowBatchAllocate"
        :frameTitle="frameTitle"
        :DepartmentList="DepartmentList"
        @on-allocate-user="allocateUser"
        @close="removeFrame"
      ></batch-allocate>
    </transition>

    <!-- 确定删除弹层 -->
    <transition name="slide-fade">
      <Delete 
				@close="removeFrame" 
				@on-cancle="removeFrame" 
				@on-confirm="del" 
				v-if="isDelete"
			>
			</Delete>
    </transition>
  </div>
</template>
<script>
import filterBox from "@/components/common/filter.vue";
import tableWrapper from "@/components/common/table-wrapper.vue";
import paging from "@/components/common/paging.vue";
import addCustom from "@/components/resource-manage/custom-list/add.vue";
import batchAllocate from "@/components/resource-manage/batch-allocate.vue";
import {formatDepartmentList} from "@/components/resource-manage/batch-allot/index.js";
import Delete from "@/components/common/delete.vue";
import { dateFtt, hidTel } from "@/libs/tools.js";
import {
  tableMainData,
  tableHeadData,
  selectData,
  newCustomerData,
  sourceMap
} from "@/components/resource-manage/custom-list/data.js";
import { getToken, getAuthority, setAutorArr, uniq, swicthCase, getRealName } from '@/libs/util.js';
import {
  search,
  _post,
  _get,
  _del,
  _lock,
  AXIOSrequest,
  GlobalMsg
} from "@/api/query.js";
import { getDate } from "@/libs/tools.js";
import moment from "dayjs";

export default {
  data() {
    return {
      flag: true,
      authorObj: {},
      selectData,
      tableHeadData,
      tableMainData,
      isShowAddCustom: false,
      isShowBatchAllocate: false,
      frameTitle: "批量分配",
      isDelete: false,
      queryData: {
        "RowIndex": 0,
				"PageCapacity": 20,
				"bId": 0,
				"CName": "",
				"CellPhone": "",
				"StartTime": 0,
				"EndTime": 0,
				"Count": -1,
				"Intention": 0
      },
      timeZone: [null,null], //要查询的时间区间
      pageData: {
        row: 0, //共多少行
        pageRow: 20, //一页20行
        pageIndex: 1, //当前第一页
        pageSum: 1, //总共*页
        toIndex: null //跳转到
      },
      newCustomerData, // 默认的初始数据
      btnTip: "",
      title: "",
      isAdd: true,
      // 意向词典
      intentionMap: [
        "未选择",
        "第一次未接通",
        "回访未接通",
        "初次沟通加微,Q发资料",
        "想开实体",
        "不接受费用",
        "意向一般",
        "意向中等",
        "意向强烈",
        "考察中",
        "已到访",
        "未留言",
        "号码错误",
        "无意向"
      ],
      // 客户状态 词典
      contractStateMap: [
        "未选择",
        "洽谈中",
        "已签约",
        "组公库",
        "总共库",
        "系统未分配",
        "组未分配",
        "垃圾资源"
      ],
      // 客户来源词典
      sourceMap,
      resources: {}, //客户来源、合同版本、关键词
      rowID: 0, //操作的数据id
      rowIDs: [],
      lock: false, //锁定
			lockInfo: "锁定",
			// 部门列表数据
      DepartmentList: [
				{
					groupName:"",
					DId:0,
					personnels:[]
				}
			], 
      negorecords: [], // 小结记录
      note: {
        Cway: 0,
        Clock: null,
        enabled: false,
        msg: ""
      },
      spinShow: false,
			darkAllocateBtns: true, // 批量分配按钮不可点击
      gotDepartmentList: false, //已经获取到了部门列表数据
    };
  },
  methods: {
    //查询
    handleSearch() {
      // 默认查询90天内的
      this.queryData.StartTime = !this.timeZone[0]
        ? ~~(+new Date / 1000) - 3600 * 24 * this.$config.days
        : parseInt(Date.prototype.getTime.call(this.timeZone[0]) / 1000);

      this.queryData.EndTime = !this.timeZone[1]
        ? ~~(+new Date / 1000)
        : parseInt(Date.prototype.getTime.call(this.timeZone[1]) / 1000);

      return search("/api/v1/customer/group/" + this.token, this.queryData)
        .then(res => {
					this.tableMainData = res.data.Data;
          if ( !res.data.Err ) {
						this.pageData.row = res.data.Ret;
						// 总页数
						this.pageData.pageSum = Math.ceil( res.data.Ret / this.pageData.pageRow );
					} else if ( res.data.Err === -1000 ) {
						this.$Message.error("登录过期请重新登录！")
					}
					return res.data.Err;
        })
        .catch(err => console.warn(err));
    },

    //翻页
    switchPage(to) {
      this.queryData.RowIndex = (to - 1) * 20;
      search("/api/v1/customer/group/" + this.token, this.queryData)
        .then(res => {
          GlobalMsg.call(this, res);
          this.tableMainData = res.data.Data;
        })
        .catch(err => console.log(err));
    },
    // 提交新用户信息
    addNewUser(data) {
      this.isShowAddCustom = false;
      const msg = this.isAdd ? "添加" : "修改";
      if ( this.isAdd ) {
        _post("/api/v1/customer/nonQuery/" + this.token, data)
          .then(res => {
            GlobalMsg.call(this, res, msg + "成功");
            this.handleSearch();
          })
          .catch(err => console.log(err));
      } else {
        const DATA = JSON.parse(JSON.stringify(data));

        DATA.LastNegotiationDate = DATA.LeaveWordsDate = parseInt(
          new Date().getTime() / 1000
        );

        DATA.TmpLeaveWordsDate = DATA.TmpLastNegotiationDate = getDate(
          DATA.LeaveWordsDate,
          "year"
        );

        DATA.RankName = "";
        DATA.ContractName = "";

        delete DATA.OperatorId;

        AXIOSrequest(
          "/api/v1/customer/nonQuery/" + this.token + "_" + this.rowID,
          "PATCH",
          DATA
        )
          .then(res => {
            GlobalMsg.call(this, res, msg + "成功");
          })
          .then(res => {
            this.handleSearch(); //新增用户后 重新获取列表
          })
          .catch(err => console.log(err));
      }
    },

    // 编辑行数据
    reviseRowData(row) {
			// 把当前的用户数据填到表单中
			this.spinShow = true;
      this.rowID = row.Id;
      this.btnTip = "提交";
      this.title = "编辑客户信息";
      this.isAdd = false;
      const propData = Object.assign({},row);
			const birthday = !row.Birthday ? "" : row.Birthday.padStart(10, 'YYYY-MM-DD');
			propData.Birthday = !birthday ? "" : new Date(birthday);
			propData.Message = row.message
      this.newCustomerData = propData;
      // 获取小结记录
      this.getNote(row.Id).then(() => {
				this.spinShow = false;
				this.isShowAddCustom = true;
			})
    },

    // 获取小结记录
    getNote(id) {
      return _get("/api/v1/negorecords/query/" + this.token + "_" + id).then(
        res => {
          const data = res.data.Data;
          this.negorecords = data;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 添加新的便签
    noteSub(data) {
      _post("/api/v1/negorecords/nonQuery/" + this.token, data)
        .then(res => {
          GlobalMsg.call(this, res, "添加成功！");
					this.isShowAddCustom = false;
					this.handleSearch();
        })
        .then(() => {
          this.note = {
            Cway: null,
            Clock: null,
            enabled: false,
            msg: ""
          };
        });
    },
    // 删除便签
    DelNote(id) {
      AXIOSrequest(
        "/api/v1/negorecords/delete/" + this.token + "_" + id,
        "DELETE"
      ).then(res => {
        GlobalMsg.call(this, res, "删除成功！");
        this.getNote(this.rowID);
      });
    },

    // 获取部门信息
    getDepartmentList() {
      if ( !this.gotDepartmentList ) {
        _get("/api/v1/deptment/take/" + this.token).then(res => {
					const data = res.data.Data;
					if ( data.length > 0 ) {
						this.DepartmentList = formatDepartmentList(data);
					}
          this.gotDepartmentList = true;
        }).catch(err => console.warn(err))
      }
    },

    removeFrame(data) {
      this.isShowAddCustom = this.isShowBatchAllocate = this.isDelete = data;
    },
    // 提示是否删除
    clickDel(id) {
      this.isDelete = true;
      this.rowID = id;
    },
    // 确定删除数据
    del() {
			this.isDelete = false;
      _del(this.rowID, this.token).then(res => {
        GlobalMsg.call(this, res, "删除成功！");
      }).then(() => {
        this.handleSearch();
     	}).catch(err => console.log(err));
    },

    // 刷新
    refresh() {
      this.spinShow = true;
      this.handleSearch().then(() => {
        setTimeout(() => {
          this.spinShow = false;
        }, 1000);
      });
    },
		// 监听表格选择器
    mySelections(data) {
			if ( data.length > 1 ) {
				this.darkAllocateBtns = false;
			} else {
				this.darkAllocateBtns = true;
			}
      const ids = data.map(row => row.Id);
      this.rowIDs = ids;
		},
		
    // 单条分配
    soloAllocate(isLocked, id, index) {
      if (isLocked === 2) {
        return this.$Message.error("资源锁定状态，无法分配!");
      } else {
        this.rowID = id;
        this.frameTitle = "资源分配";
        this.isShowBatchAllocate = true;
      }
    },
		// 批量分配按钮
    batchAllocate() {
      if (this.rowIDs.length >= 2) {
        this.frameTitle = "批量分配";
        this.isShowBatchAllocate = true;
      } else {
        this.$Message.error("请您至少选中两个用户!");
      }
    },
    // 提交分配
    allocateUser(data) {
      if (this.rowIDs.length >= 2) {
        data.CIds = this.rowIDs.join(",") + ",";
        _post("/api/v1/customer/batch/" + this.token, data)
          .then(res => {
            this.isShowBatchAllocate = false;
            GlobalMsg.call(this, res, "批量分配成功！");
          })
          .then(suc => {
            this.rowIDs = [];
            this.handleSearch();
          })
          .catch(err => console.log(err));
      } else {
        data.CId = this.rowID;
        _post("/api/v1/customer/distribute/" + this.token, data)
          .then(res => {
            this.isShowBatchAllocate = false;
            GlobalMsg.call(this, res, "资源分配成功！");
          })
          .then(suc => {
            this.handleSearch();
          })
          .catch(err => console.log(err));
      }
		},
		
    // 隐藏手机号的中间四位
    HidTel(phone){
      return hidTel(phone);
    },

    // 格式化意向Intention
    format_intention(type) {
      return this.intentionMap[type];
    },
    // 格式化日期
    formatDate(time) {
      return time.toString().length === 10 && typeof time === "number"
        ? getDate(time, "year")
        : time;
    },
    // 格式化状态
    formatState(n) {
      n = !n ? 0 : n;
      return this.contractStateMap[n];
    },
		// 初始化搜索时间
		initTime(){
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * this.$config.days);
			this.timeZone = [start, end];
		},
		getBlock () {
			let list = []
      this.authorObj =  swicthCase(uniq(setAutorArr(getAuthority(), list)))
      if (getAuthority() == -1) {
        	if (this.tableHeadData.length > 13) {
					this.tableHeadData.splice( -1, 1 )
				}
      } else if (!this.authorObj.dis && !this.authorObj.del && getAuthority() >= 0 && !this.flag) {
				if (this.tableHeadData.length > 13) {
					this.tableHeadData.splice( -1, 1 )
				}
			} else {
				if (this.tableHeadData.length <= 13) {
					this.tableHeadData.push({
	    				title: '操作',
	    				slot: 'actions',
	    				align: 'center',
						  width: 180
					})
				}
      } 
    },

    // 获取来源列表 关键词 合同版本
    getResources(){
      _get("/api/v1/resources/part/" + this.token + "_1,2,3")
      .then(res => {
        let source = [], KName = [], ContractType = [];
        res.data.Data.forEach(item => {
          if ( item.Item3 === 1 ) {
            source.push({
              value: item.Item2,
              label: item.Item1
            })
          } else if( item.Item3 === 2 ) {
            KName.push({
              value: item.Item2,
              label: item.Item1
            })
          } else if ( item.Item3 === 3 ) {
            ContractType.push({
              value: item.Item2,
              label: item.Item1
            })
          }
        })
        const resources = {
          source,
          KName,
          ContractType
        }
        this.resources = resources;
      })
      .catch(err => console.log(err));
    },
		//初始化
		init(){
			// 默认搜索的时间区间
			this.initTime();
			// data 是请求的错误码
      this.handleSearch().then(data => {
				if (data === 0) {
					// 获取来源列表 关键词 合同版本
					this.getResources();
					// 获取员工列表
					this.getDepartmentList();
					this.getBlock();
				} else {
					return false;
				}
			})
		}
  },
  computed: {
    token() {
      return getToken();
    },
		AuthorArrList(){
			return this.$store.getters.AuthorArrs;
		},
		getAuthority(){
			return getAuthority();
    },
    RealName(){
      return getRealName();
    }
  },
  mounted() {
    this.init();
  },
  components: {
    filterBox,
    tableWrapper,
    paging,
    addCustom,
    batchAllocate,
    Delete
  }
};
</script>

<style>
.badge-custom-list > sup{
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.resource-manage-custom-list {
  min-width: 1462px;
}
.badge-huifang {
  /* background-color: #f90; */
	background-color: transparent;
	color: #f90;
}
.badge-daoqi {
  /* background-color: #ed4014; */
	background-color: transparent;
	color: #ed4014;
}
.badge-new {
  /* background-color: #2d8cf0; */
	background-color: transparent;
	color: red;
}
.badge-weilianxi {
  background-color: transparent;
	color: #2db7f5;
}
.badge-qita {
  background-color: transparent;
	color: #19be6b;
}
.cellPhone {
  color:#515a6e;
  position: relative;
}
</style>