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
				icon:'../static/emptyCart.jpg'
			},
			carList:[
				{
					id:'0',
					name:'奥迪一汽',
					des:"2006年款 2.0L 手动档 三厢",
					icon:'../static/emptyCart.jpg'
				},{   
					id:'1',
					name:'大众',
					des:"2006年款 1.6L 手动档 三厢",
					icon:'../static/emptyCart.jpg'
				},{   
					id:'2',
					name:'福特',
					des:"2006年款 2.4L 手动档 三厢",
					icon:'../static/emptyCart.jpg'
				},{   
					id:'3',
					name:'特斯拉',
					des:"2006年款 2.4L 手动档 三厢",
					icon:'../static/emptyCart.jpg'
				},{   
					id:'4',
					name:'奔马',
					des:"2006年款 2.4L 手动档 三厢",
					icon:'../static/emptyCart.jpg'
				},{   
					id:'5',
					name:'悍马',
					des:"2006年款 2.4L 手动档 三厢",
					icon:'../static/emptyCart.jpg'
				},{   
					id:'6',
					name:'宝马',
					des:"2006年款 2.4L 手动档 三厢",
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
