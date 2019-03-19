import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import bus from './module/bus'
import permission from './module/permission'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    bus,
    permission
  }
})
