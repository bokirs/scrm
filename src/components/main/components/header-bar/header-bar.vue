<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
		<span style="float: left;">
			<span style="margin-right: 20px;">{{ '当前时间：' + times  }}</span>
			<span style="margin-right: 20px;">
				<span v-text="CompanyName"></span>
				<strong style="font-weight: 400;color: #7478a2;">{{ "【" + myRole + "】" }}</strong>
				<em style="color: #59b3ff;font-style: normal;"> {{ RealName }} </em> ，您好！
			</span>
		</span>
			 
		<slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
import { dateFtt } from '@/libs/tools.js'
import { getRole, getRealName, getCName } from '@/libs/util.js'

export default {
  name: 'HeaderBar',
	data(){
		return{
			times:'',
		}
	},
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
	nowTime(){
		return new Date()
	},
	myRole(){
		// return this.$store.state.user.Role;
		return getRole()
	},
	RealName(){
		// return this.$store.state.user.RealName;
		return getRealName()
	},
	CompanyName(){
		return getCName();
	},
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    },
	showTime(){
		setInterval( () => {
			const date = new Date();
			this.times = dateFtt( "yyyy-MM-dd hh:mm:ss",date )
		}, 1000);
		}
	},
	mounted() {
		this.showTime();
	}
  }
</script>
