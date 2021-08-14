<template>
	<view class="content">
		<currentCar :showButton="false"></currentCar>
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<navigator :url="'/pages/order/detail?orderid=' + item.id">
							<!-- 当前下单车辆 -->
							<view class="bar">
								<image src="@/static/defaultcar.png" mode="aspectFit" class="car-image"></image>
								<view class="car-detail">
									<text class="car-name">{{item.carName}}</text>
									<text class="car-desc">{{item.carDes}}</text>
								</view>
							</view>
							<!-- 订单内容 -->
							<view class="main">
								<view class="lable">
									<text>2021-07-26 (周一)</text>
									<text class="price">￥{{item.totalPrice}}</text>
								</view>
								<view class="lable">
									<text>程鹏</text>
									<text class="tag" :class="{success:item.status=='10'}">{{item.status=='0'? "订单已取消":"订单已创建"}}</text>
								</view>
								<view class="lable">
									<text>上海市黄浦区上海市政府-正门</text>
								</view>
								<view class="lable">
									<text>机油、机滤、空调滤、空气滤、上门服务费</text>
									<text class="tag" :class="{success:item.status=='1'}">{{item.status=='0'? "重新下单":""}}</text>
								</view>
							</view>
						</navigator>
						<!-- 操作区 -->
						<view class="action-box" >
							<button :disabled="submiting" class="action-btn" @click="cancelOrder(item)" v-if="item.status == 10">取消预约</button>
							<button class="action-btn recom" @click="payOrder(item)" v-if="item.status == 10">立即支付</button>
							<button :disabled="submiting" class="action-btn " @click="refundOrder(item)" v-if="item.status == 20">重新下单</button>
							<button :disabled="submiting" class="action-btn recom" @click="appraiseOrder(item)" v-if="item.status == 40">立即评价</button>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<neil-modal
			:show="refundShow" 
			@close="refundShow = false" 
			title="退款" 
			@cancel="refundShow = false" 
			@confirm="refundConfirm">
			<input v-show="refundShow" v-model="inputRefundReason" style="margin:20upx" placeholder="简要描述退款理由.." />
		</neil-modal>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import currentCar from '@/components/current-car.vue';
	export default {
		components: {
			uniLoadMore,
			empty,
			neilModal,
			currentCar
		},
		data() {
			return {
				statusMap: {
					10: '未付款',
					12: '正在拼团',
					20: '待出库',
					30: '待收货',
					40: '待评价',
					50: '已完成',
					60: '退款中',
					70: '已退款',
					80: '已取消',
					90: '已取消(系统)'
				},
				submiting: false,
				refundShow: false,
				inputRefundReason: '',
				refundOrderItem: '',
				tabCurrentIndex: 0,
				navList: [
					{
						text: '全部',
						state: 10,
						loadingType: 'more',
						pageNo: 1,
						orderList:[
							{
								id:'1',
								status:'10',
								carName:"奥迪(一汽)A4",
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							},
							{
								id:'2',
								status:'10',
								carName:"奥迪(一汽)A4",
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							},
							{
								id:'3',
								status:'10',
								carName:"奥迪(一汽)A4",
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							},
							{
								id:'4',
								status:'40',
								carName:"奥迪(一汽)A4",
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							}
						]
					},
					{
						text: '待完成',
						loadingType: 'more',
						pageNo: 1,
						orderList:[
							{
								id:'1',
								status:'20',
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							}
						]
					},
					{
						text: '已完成',
						state: 30,
						loadingType: 'more',
						pageNo: 1,
						orderList:[
							{
								id:'1',
								gmtCreate:'2020-01-01',
								status:'40',
								
							}
						]
					},
					{
						text: '已取消',
						state: 30,
						loadingType: 'more',
						pageNo: 1,
						orderList:[
							{
								id:'1',
								gmtCreate:'2020-01-01',
								
							}
						]
					}
				],
				
			};
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = 0
			for (let i = 0; i < this.navList.length; i++) {
				if (this.navList[i].state === parseInt(options.state)) {
					this.tabCurrentIndex = i
				}
			}
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if (options.state == 0) {
				this.loadData()
			}
			// #endif

		},

		methods: {
			//获取订单列表
			loadData(source) {
				const that = this
				//这里是将订单挂载到tab列表下
				let index = that.tabCurrentIndex;
				let navItem = that.navList[index];
				let state = navItem.state;

				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}

				navItem.loadingType = 'loading';

				let orderList = that.$api.request('order', 'getOrderPage', {
					pageNo: navItem.pageNo,
					status: navItem.state
				}).then(res => {
					navItem.pageNo = res.data.pageNo + 1
					navItem.loadingType = res.data.pageNo < res.data.totalPageNo ? 'more' : 'noMore'
					res.data.items.forEach(item => {
						navItem.orderList.push(item);
						item.skuCount = 0
						item.skuList.forEach(skuItem => {
							item.skuCount += skuItem.num
						})
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					that.$set(navItem, 'loaded', true);
				})
			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			payOrder(item) {
				uni.navigateTo({
					url: '/pages/pay/pay?orderno='+ item.orderNo + '&price=' + item.actualPrice
				})
			},
			//取消订单
			cancelOrder(item) {
				const that = this
				uni.showModal({
					title: '取消？',
					content: '您确定要取消此订单吗？',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('order', 'cancel', {
								orderNo: item.orderNo
							}, failres => {
								that.submiting = false
								that.$api.msg(failres.errmsg)
							}).then(res => {
								that.submiting = false
								item.status = 80
							})
						}
					}
				})
				
			},
			//订单退款
			refundConfirm() {
				const that = this
				if (that.submiting) {
					return
				}
				that.submiting = true
				that.$api.request('order', 'refund', {
					orderNo: that.refundOrderItem.orderNo,
					reason: that.inputRefundReason
				}, failres => {
					that.submiting = false
					that.$api.msg(failres.errmsg)
				}).then(res => {
					that.submiting = false
					that.refundOrderItem.status = 60
					that.$api.msg('申请退款成功！')
				})
			},
			refundOrder(item) {
				const that = this
				that.refundOrderItem = item
				that.refundShow = true
				that.inputRefundReason = ''
			},
			//确认订单
			confirmOrder(item) {
				const that = this
				uni.showModal({
					title: '收货？',
					content: '您确定要确认收货吗？',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('order', 'confirm', {
								orderNo: item.orderNo
							}, failres => {
								that.submiting = false
								that.$api.msg(failres.errmsg)
							}).then(res => {
								that.submiting = false
								item.status = 40
							})
						}
					}
				})
			},
			showShipTrace(item) {
				uni.navigateTo({
					url: "/pages/order/trace?orderno=" + item.orderNo
				})
			},
			//评价订单
			appraiseOrder(item) {
				uni.navigateTo({
					url: '/pages/order/appraise?orderid=' + item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}
	.bar {
		display: flex;
		align-items: center;
		padding: 10upx;
		// border: 1px solid black;
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
	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current {
				color: $base-color;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 24upx 24upx 0;
		background: #fff;
		margin-top: 16upx;
		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
		}
		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after {
				border-radius: 100px;
			}
			&.recom {
				background: $uni-color-primary;
				color: #fff;
				&:after {
					border-color: $uni-color-primary;
				}
			}
		}
	}
	.main{
		padding: 16upx;
		border-radius: 20upx;
		color: #3f3f3f;
		border:2upx dashed $border-color-dark;
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
		// color: $font-color-disabled;
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
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
