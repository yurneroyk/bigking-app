<template>
	<view class="main">
		<view v-if="mycars.length" >
			<uni-list v-for="car in mycars" :key="car.id" class="service">
				<uni-list-item
					:showArrow="false"
					:showBadge="true"
					badgeText="删除"
					:title="car.name"
					@click="deletCar"
				/>
			</uni-list>
		</view> 
		<view v-else class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view class="empty-tips">空空如也</view>
		</view>
		<view class="footer" @click="navTocarList('/pages/car/carList')">
			<text class="submit" @click="submit">添加爱车</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import currentCar from '@/components/current-car.vue';
	export default {
		components: {
			currentCar
		},
		data() {
			return {
				mycars:[
					{
						id:'0',
						name:'奥迪一汽',
					},{   
						id:'1',
						name:'奥迪进口',
					},{   
						id:'2',
						name:'奥迪一汽A6',
					}
				],
			};
		},
		onLoad(options){
			const that = this
			that.tid = options.tid
			console.log("aaa"+options.tid);
		},
		onShow() {
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			navTocarList(url){
				uni.navigateTo({  
					url
				})
			}, 
			//请求数据
			async loadData(){
				const that = this
				that.$api.request('cart', 'getCartList').then(res => {
					res.data.forEach(item => {
						item.checked = true
					})
					that.cartList = res.data
					that.cartList = 
					[
					    {   
						   id:'1',
						   title:'1',
						   checked:false,
						   skuTitle:'一',
					    }
				     ]
					that.calcTotal();  //计算总价
				})
			},
			//监听image加载完成
			onImageLoad(item) {
				this.loadedItemIds.add(item.id)
				this.$forceUpdate()
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].skuImg = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			allCheck(val){
				console.log(val)
			},
			check(val){
				val.checked = !val.checked
			},
			 //选中状态处理
			// check(type, index){
			// 	if(type === 'item'){
			// 		this.cartList[index].checked = !this.cartList[index].checked;
			// 	}else{
			// 		const checked = !this.allChecked
			// 		const list = this.cartList;
			// 		list.forEach(item=>{
			// 			item.checked = checked;
			// 		})
			// 		this.allChecked = checked;
			// 	}
			// 	this.calcTotal(type);
			// },
			//数量
			numberChange(data){
				const that = this
				that.$api.request('cart','updateCartItemNum', {
					cartId: that.cartList[data.index].id,
					num: data.number
				}, failres => {
					uni.showToast({
						title: failres.errmsg,
						icon: 'none'
					});
					that.cartList[data.index].num = that.cartList[data.index].num
				}).then(res => {
					that.cartList[data.index].num = data.number;
					that.calcTotal();
				})
			},
			//删除
			deleteCartItem(index){
				const that = this
				that.$api.request('cart', 'removeCartItem', {
					cartId: that.cartList[index].id
				}).then(res => {
					that.cartList.splice(index, 1);
					that.calcTotal();
					//uni.hideLoading();
				})				
			},
			//清空
			clearCart(){
				const that = this
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							that.$api.request('cart','removeCartAll').then(res => {
								that.cartList = []
							})
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				const that = this
				let list = that.cartList;
				if(list.length === 0){
					that.empty = true;
					return;
				}
				let total = 0;
				let totalItems = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						totalItems += item.num
						total += (that.isVip ? item.vipPrice : item.price) * item.num;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.totalItems = totalItems
			},
			//创建订单
			createOrder(){
				//滤除未被选择的item
				let selectedItems = []
				this.cartList.forEach(item => {
					if (item.checked) {
						selectedItems.push(item)
					}
				})
				if (selectedItems.length === 0) {
					this.$api.msg('您没有选中任何商品')
					return
				}
				console.log(selectedItems)
				this.$api.globalData.skuList = selectedItems
				uni.navigateTo({
					url: `/pages/order/create?takeway=cart`
				})
			}
		}
	}
</script>

<style lang='scss'>
.main{
	position: fixed;
	left: 0;
	top: var(--window-top);
	width: 100%;
	border-radius: 20rpx;
	.service{
	} 
}
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 995;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 998;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);
	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: #0f80ff;
	}
}
</style>
