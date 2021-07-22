import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {
			car:{},
			carList:[
				{
					id:'0',
					name:'奥迪一汽',
					
					icon:'../static/emptyCart.jpg'
				},{   
					id:'1',
					name:'奥迪进口',
					icon:'../static/emptyCart.jpg'
				},{   
					id:'2',
					name:'奥迪进口',
					icon:'../static/emptyCart.jpg'
				},{   
					id:'3',
					name:'奥迪进口',
					icon:'../static/emptyCart.jpg'
				},{   
					id:'4',
					name:'奥迪进口',
					icon:'../static/emptyCart.jpg'
				},{   
					id:'5',
					name:'奥迪进口',
					icon:'../static/emptyCart.jpg'
				},{   
					id:'6',
					name:'奥迪进口',
					icon:'../static/emptyCart.jpg'
				}
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
