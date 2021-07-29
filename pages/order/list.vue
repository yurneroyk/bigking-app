<template>
	<view>
		<currentCar></currentCar>
		<view class="main">
			<uni-list @change="change" v-for="category in categoryList" :key="category.id" class="service">
				<view class="ele-title">{{category.title}}</view>
				<uni-collapse
					@change="serviceCheck"
				>
					<uni-collapse-item
					    v-for="service in category.serviceList"
					    :key="service.id"
					    :name="service.id"
						:note="service.description"
						:title="service.title"
					>
						<serviceItem 
							v-for="product in service.productList" 
							:key="product.id" 
							:prod="product"
							@check="checkItem"
						>
						</serviceItem>
					</uni-collapse-item>
				</uni-collapse>
			</uni-list>
		</view>
		<view class="footer">
			<view class="price-content">
				<view class="first-line">
					<text>合计:</text>
					<text class="order-price">¥{{total}}</text>
					<text class="other-price">(含{{workPrice}}元上门费)</text>
				</view>
				<view class="second-line">
					<text class="origin-price">原价:{{originPrice}}</text>
					<text >已优惠:{{coupon}}</text>
				</view>
			</view>
			<text class="submit" @click="createOrder">下一步</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import currentCar from '@/components/current-car.vue';
	import serviceItem from '@/components/serviceItem.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	export default {
		components: {
			currentCar,
			serviceItem,
		},
		data() {
			return {
				totalItems: 0, //总数量
				total: 100, //总价格
				workPrice: 50, // 上门费
				originPrice: 150, // 原价
				coupon: 50,
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				tabCurrentIndex: 0,
				categoryList:[],
				loadedItemIds: new Set(),
				tid: ''
			};
		},
		onLoad(options){
			const that = this
			that.tid = options.tid
			console.log("aaa"+options.tid);
			uni.showLoading({
				title: '正在加载'
			})
			that.$api.request('integral', 'getIndexData', failres => {
				that.$api.msg(failres.errmsg)
				uni.hideLoading()
			}).then(res => {
				let data = res.data
				//轮播
				if (data.advertisement.t1) {
					data.advertisement.t1.forEach(item => {
						if (!item.color) {
							item.color = 'rgb(205, 215, 218)'
						}
					})
					that.carouselList = data.advertisement.t1
					that.swiperLength = data.advertisement.t1.length
					that.titleNViewBackground = data.advertisement.t1[0].color
				}
				//员工推荐
				if (data.advertisement.t2) {
					that.bestStaffList = data.advertisement.t2
				}
				//横幅
				if (data.advertisement.t3 && data.advertisement.t3.length > 0) {
					that.banner = data.advertisement.t3[0]
				}
				// //热销
				// if (data.salesTop) {
				// 	that.salesTop = data.salesTop
				// }
				//分类5Buttom
				if (data.advertisement.t4) {
					that.categoryButtomList = data.advertisement.t4
				}
				//两栏广告
				if (data.advertisement.t9) {
					this.windowSpuList = data.advertisement.t9
				}
				//公告
				if (data.advertisement.t6) {
					this.postMsgs = data.advertisement.t6.map(item => item.title)
				}
				uni.hideLoading()
			})
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
			checkItem(val){
				console.log(val.checked)
				this.categoryList.forEach((item)=>{
					item.serviceList.forEach(service=>{
						service.productList.forEach(product=>{
							product.checked = !product.checked 
						})
					})
				})
			},
			serviceCheck(val){
				console.log(val)
			},
			async loadData(){
				const that = this
				that.$api.request('product', 'getProductPage').then(res => {
					that.categoryList = res.data.items
					that.categoryList.forEach((item)=>{
						item.serviceList.forEach(service=>{
							service.checked = false
							service.productList.forEach(product=>{
								product.checked = true
							})
						})
					})
					console.log(that.categoryList)
					// that.calcTotal();  //计算总价
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
			
			check(val){
				val.checked = !val.checked
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			// 数量
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
				// let selectedItems = []
				// this.cartList.forEach(item => {
				// 	if (item.checked) {
				// 		selectedItems.push(item)
				// 	}
				// })
				// if (selectedItems.length === 0) {
				// 	this.$api.msg('您没有选中任何商品')
				// 	return
				// }
				// console.log(selectedItems)
				// this.$api.globalData.skuList = selectedItems
				uni.navigateTo({
					url: `/pages/order/create?takeway=cart`
				})
			}
		}
	}
</script>

<style lang='scss'>
.header{
	position: fixed;
	left: 0;
	top: var(--window-top);
	width: 100%;
	box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
	z-index: 10;
	height: 80upx;
	background: #fff;
	.bar{
		width: 100%;
		z-index: 10;
	}
	
}
.main{
	border-radius: 20rpx;
	padding-bottom: 100upx;
	.service{
		.ele-title{
		    padding: 12upx 0 12upx 30upx;
			font-size: $font-base;
			color:$font-color-disabled;
			background-color: #f5f5f5;
		}
	} 
}
/* 底部栏 */
.footer {
	position: fixed;
	left: 0;
	bottom:0;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 95;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);
	.price-content {
		padding-left: 30upx;
		.first-line {
			display: flex;
			align-items: center;
			font-size: 30upx;
			height: 42upx;
			line-height: 42upx;
			text-align: left;
			font-weight: 700;
			.order-price {
				color:#ff5151
			}
			.other-price{
				font-size: 24upx;
				height: 42upx;
				line-height: 42upx;
				color: #b8b8b8;
				font-weight: 400;
			}
		}
		.second-line{
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: $font-color-disabled;
			line-height: 34upx;
			height: 34upx;
			text-align: left;
			.origin-price{
				margin-right: 6upx;
			}
		}
	}
	.price-tip {
		color: $font-color-spec;
		margin-left: 8upx;
	}

	.price {
		font-size: 36upx;
		color: $base-color;
	}

	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280upx;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: $font-color-spec;
	}
}
</style>
