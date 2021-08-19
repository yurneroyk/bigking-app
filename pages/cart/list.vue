<template>
	<view class="content">
		<!-- <view v-if="!hasLogin" class="empty">
			<image src="/static/mycar.png" mode="aspectFit"></image>
			<view class="empty-tips">
				<text>登录查看订单内容</text>
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else class="box"> -->
		<view class="box">
			<currentCar :showButton="false"/>
			<view class="navbar">
				<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
				 @click="tabClick(index)">
					{{item.text}}
				</view>
			</view>
			<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab" >
				<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
					<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
						<!-- 空白页 -->
						<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
						<!-- 订单-->
						<cartItem 
							:data="item" 
							v-for="(item,index) in tabItem.orderList" 
							:key="index"
						/>
						<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
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
	import {
		mapState
	} from 'vuex';
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	
	import currentCar from '@/components/current-car.vue';
	import cartItem from './cartItem.vue'
	export default {
		components: {
			empty,
			uniLoadMore,
			neilModal,
			currentCar,
			cartItem
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
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
						loaded:true,
						orderList:[
							{
								id:'1',
								status:'10',
								carName:"奥迪(一汽)A4",
								carImage:'/static/defaultcar.png',
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							},
							{
								id:'2',
								status:'10',
								carName:"奥迪(一汽)A4",
								carImage:'/static/defaultcar.png',
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							},
							{
								id:'3',
								status:'10',
								carName:"奥迪(一汽)A4",
								carImage:'/static/defaultcar.png',
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'200'
							},
							{
								id:'4',
								status:'40',
								carName:"奥迪(一汽)A4",
								carImage:'/static/defaultcar.png',
								carDes:"2006年款 2.4L 手动档 三厢",
								gmtCreate:'2020-01-01',
								totalPrice:'5000'
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
								carName:"奥迪(一汽)A4",
							    carDes:"2006年款 2.4L 手动档 三厢",
								carImage:'/static/car.png',
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
		// onLoad(options) {
		// 	/**
		// 	 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
		// 	 * 替换onLoad下代码即可
		// 	 */
		// 	this.tabCurrentIndex = 0
		// 	for (let i = 0; i < this.navList.length; i++) {
		// 		if (this.navList[i].state === parseInt(options.state)) {
		// 			this.tabCurrentIndex = i
		// 		}
		// 	}
		// 	// #ifndef MP
		// 	this.loadData()
		// 	// #endif
		// 	// #ifdef MP
		// 	if (options.state == 0) {
		// 		this.loadData()
		// 	}
		// 	// #endif

		// },

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
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
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
			// showShipTrace(item) {
			// 	uni.navigateTo({
			// 		url: "/pages/order/trace?orderno=" + item.orderNo
			// 	})
			// },
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
		.empty{
			display:flex;
			align-items:center;
			background-color: #fff;
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
		.box{
			height: 100%;
		}
	}
	.navbar {
		display: flex;
		height: 40px;
		background: #fff;
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
	.swiper-box {
		height: calc(100% - 40px);
		padding-bottom: 20upx;
	}
	.list-scroll-content {
		height: 100%;
	}
	.uni-swiper-item {
		height: auto;
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
