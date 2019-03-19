export default{
	state:{
		frameTitle:'',
	},
	mutations:{
		setFrameTitle(state, msg) {
		  state.frameTitle = msg
		},
	},
	getters:{
		
	},
	actions:{
		changeFrameTitle({ state, commit },name){
			commit("setFrameTitle",name)
		}
	}
}