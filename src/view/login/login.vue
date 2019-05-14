<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" :bordered="false">
        <div class="form-con">
					<div class="login-title">欢迎用户登录</div>
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
		
		<div class="scrm-name"> 
			B-SCRM系统
		</div>
		
		<div class="scrm-copyright">
			{{ $config.copyright }}
		</div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import {login} from '../../api/user.js'
import routers from '../../router/routers.js'
import initRouter from '../../router/routerss.js'
import { fncc } from '@/libs/util.js'
import { AXIOSrequest } from '@/api/query.js'
import Main from '@/components/main/main.vue'
import { setRoute, setAuthorFunc, setAuthority } from '@/libs/util.js'

export default {
  data () {
    return {
      token: '',
      routeList: [],
      filterRouteList: [],
      initRouteList: [],
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    getAddRoute (list) {
      let result = []
      this.routeList.map(item => {
        if (list.indexOf(item.Id) !== -1) {
          result.push(item)
        }
      })
      let listParams = []
      listParams = fncc(result, 0)
      // this.$router.addRoutes(listParams)
      window.localStorage.setItem('routes', JSON.stringify(listParams))
      this.$store.dispatch('GenerateRoutes', listParams)
      this.$router.push({
        path: this.$config.homeName
      })
    },
    getFilterRoute (row) {
      row.map((item, index) => {
          this.routeList.push({
              Id: item.Id ? item.Id : '',
              PId: item.PId ? item.PId : '' ,
              meta: item.meta,
              name: item.name,
              path:item.path
          })
          if (item.children && item.children.length > 0) {
             this.getFilterRoute(item.children)
          }
      })
    },
    getArray (list) {
      let rel = []
      for (var i=0; i<list.length; i++){ 
        rel.push(list[i])
      }
      return rel
    },
		handleSubmit ({ userName, password }) {
      let that = this
			const obj = { userName, password }
			this.getUserInfo( obj ).then(res => {
        if ( res.data.Err === -1004 || res.data.Err === -1003  ) {
          this.$Message.error("账号或密码不正确！")
        } else if ( !!this.$store.state.user.token && !!res.data.Data.Token && res.data.Err === 0 ) {
           this.$store.dispatch('SetAuthorityInfo', res.Authority)
           setAuthority(res.data.Data.Authority)
					 this.token = res.data.Data.Token;
					 AXIOSrequest('api/v1/menus/take/' + this.token, 'get').then(Res => {
             console.log( Res )
						if (Res.data.Err === 0) {
                let data = Res.data.Data
								that.$store.dispatch('setButtonList', data)
								// let list = []
								// data.map(item => {
								// 	list.push(item.Id)
                // })
								that.getAddRoute(data)
						}
					})
				}
			}).catch(err => console.log(err));
		},
  },
  mounted () {
    this.routeList = []
    this.getFilterRoute(routers)
  }
}
</script>
