import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {
			car:{
				id:'0',
				name:'奥迪一汽',
				des:"2006年款 2.4L 手动档 三厢",
				icon:'/static/car.png'
			},
			carList:[
				{
					id:'0',
					name:'奥迪一汽',
					des:"2006年款 2.4L 手动档 三厢",
					icon:'/static/car.png'
				},
			],
		},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorageSync('userInfo', provider)
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorageSync('userInfo')
		}
	},
	actions: {
	
	},
	getters: {
		getUserInfo(state) {
			return state.userInfo
		}
	}
})

export default store
