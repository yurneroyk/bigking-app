<template>
	<view class="content">
		<view class="nav">
			<currentCar :showButton="false"></currentCar>
			<view class="navbar">
				<view 
					v-for="(item, index) in navList" 
					:key="index" 
					class="nav-item" 
					:class="{current: tabCurrentIndex === index}"
					@click="tabClick(index)"
				>
					{{item.text}}
				</view>
			</view>
		</view>
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="/pages/index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else >
			<view class="cart-list">
				<block  v-for="(order,index) in orderList" :key="order.id" >
					<view class="cart-item" >
						<view class="bar">
							<image src="@/static/emptyCart.jpg" mode="aspectFit" class="car-image"></image>
							<view class="car-detail">
								<text class="car-name">{{userInfo.car.name}}</text>
								<text class="car-desc">{{userInfo.car.des}}</text>
							</view>
						</view>
						<view class="main">
							<view class="lable">
								<text>2021-07-26 (周一)</text>
								<text class="price">￥{{order.totalPrice}}</text>
							</view>
							<view class="lable">
								<text>程鹏</text>
								<text class="tag" :class="{success:order.status=='1'}">{{order.status=='0'? "订单已取消":"订单已创建"}}</text>
							</view>
							<view class="lable">
								<text>上海市黄浦区上海市政府-正门</text>
							</view>
							<view class="lable">
								<text>机油、机滤、空调滤、空气滤、上门服务费</text>
								<text class="tag" :class="{success:order.status=='1'}">{{order.status=='0'? "重新下单":""}}</text>
							</view>
						</view>
						<view class="button-box" :class="{'b-b': index==orderList.length-1}">
							<text class="button">重新下单</text>
						</view>
					</view>
				</block>
			</view>
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
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
			currentCar,
		},
		data() {
			return {
				totalItems: 0, //总数量
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				tabCurrentIndex: 0,
				navList: [
					{
						text: '全部',
					},
					{
						text: '待完成',
					},
					{
						text: '已完成',
					},
					{
						text: '已取消',
					}
				],
				orderList: [
					{   
						id:'1',
						orderNo:'1',
						status:"1",
						totalPrice:'998',
						totalOriginalPrice:"",
						takeWay:''
					},
					{
						id:'2',
						orderNo:'1',
						status:"1",
						totalPrice:'998',
						totalOriginalPrice:"",
						takeWay:''
					},
					{
						id:'1',
						orderNo:'1',
						status:"1",
						totalPrice:'998',
						totalOriginalPrice:"",
						takeWay:''
					}
				],
				loadedItemIds: new Set()
			};
		},
		onLoad(){
			
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
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			navToBusList(url){
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
.content {
	left: 0;
	top: var(--window-top);
	height: calc(100vh - 100rpx);
	width: 100%;
	padding-bottom: 160upx;
	background: #F5F5F5;
}
.nav{
	height:188upx;
	.navbar {
		display: flex;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current {
				color: $uni-color-primary;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid #12227A;
				}
			}
		}
	}
}
.swiper-box{
	height: calc(100% - 288upx);
	padding-bottom: 10upx;
	width: 100%;
}
/* 空白页 */
.empty{
	display:flex;
	align-items:center;
	justify-content: center;
	flex-direction: column;
	height: 100%;
	width: 100%;
	image{
		width: 240upx;
		height: 160upx;
		margin-bottom:30upx;
	}
	.empty-tips{
		display:flex;
		font-size: $font-sm+2upx;
		color: $font-color-disabled;
		.navigator{
			color: $uni-color-primary;
			margin-left: 16upx;
		}
	}
}
/* 购物车列表项 */
.cart-item{
	display:flex;
	flex-direction: column;
	position:relative;
	background: #fff;
	.bar {
		padding: 24upx;
		display: flex;
		background-color: #fff;
		align-items: center;
		.car-image{
			width:60upx;
			height:60upx;
			margin-right: 16upx;
		}
		.car-detail{
			display: flex;
			flex-direction: column;
			.car-name{
				font-size: $font-sm;
				height: 32upx;
				line-height: 32upx;
				text-align: left;
				
			}
			.car-desc{
				font-size: $font-xs;
				height: 28upx;
				line-height: 28upx;
				text-align: left;
			}
		}
	}
	.main{
		border-top:0.5upx solid $font-color-disabled;
		padding: 24upx;
	}
	.price{
		color: #ff5151;
		font-weight: bold;
		font-family: monospace;
	}
	.lable{
		display: flex;
		align-items: center;
		padding: 10rpx 0 0 10upx;
		font-size: $font-base;
		color: $font-color-disabled;
		justify-content: space-between;
	}
	.tag{
		color: #fff;
		padding: 0 10upx;
		background-color: #C1C1C1;
	}
	.success{
		background-color: $uni-color-success
	}
	.button-box{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90upx;
		background-color:$border-color-light;
		border: 1upx solid $border-color-dark;
		.button{
			color: $uni-color-primary;
		}
	}
}	
/* 底部栏 */
/* 底部栏 */
.action-section{
	/* #ifdef H5 */
	margin-bottom:100upx;
	/* #endif */
	position:fixed;
	left: 30upx;
	bottom:30upx;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 690upx;
	height: 100upx;
	padding: 0 30upx;
	background: rgba(255,255,255,.9);
	box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
	border-radius: 16upx;
	.checkbox{
		height:52upx;
		position:relative;
		image{
			width: 52upx;
			height: 100%;
			position:relative;
			z-index: 5;
		}
	}
	.clear-btn{
		position:absolute;
		left: 26upx;
		top: 0;
		z-index: 4;
		width: 0;
		height: 52upx;
		line-height: 52upx;
		padding-left: 38upx;
		font-size: $font-base;
		color: #fff;
		background: $font-color-disabled;
		border-radius:0 50px 50px 0;
		opacity: 0;
		transition: .2s;
		&.show{
			opacity: 1;
			width: 120upx;
		}
	}
	.total-box{
		flex: 1;
		display:flex;
		flex-direction: column;
		text-align:right;
		padding-right: 40upx;
		.price{
			font-size: $font-lg;
			color: $font-color-dark;
		}
		.coupon{
			font-size: $font-sm;
			color: $font-color-light;
			text{
				color: $font-color-dark;
			}
		}
	}
	.confirm-btn{
		padding: 0 38upx;
		margin: 0;
		border-radius: 100px;
		height: 76upx;
		line-height: 76upx;
		font-size: $font-base + 2upx;
		background: $uni-color-primary;
		box-shadow: 1px 2px 5px rgba(0, 0, 93, 0.72)
	}
}
/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked{
	color: $uni-color-primary;
}
</style>
