<template>
	<view>
		<!-- 订单卡片 -->
		<view class="order-status-bg">
			<view class="order-status-box">
				<view class="left-box">
					<view class="first-line">
						<view class="image-box">
							<image src="../../static/icon/preparing_icon.jpg" mode="aspectFit" class="order-imag"></image>
						</view>
						<text class="order-status">订单已取消</text>
					</view>
					<view class="action-box" >
						<a  class="action-btn call" href="tel:18394176643" @click="cancelOrder(item)">联系客服</a>
						<button class="action-btn recom" @click="payOrder(item)">重新下单</button>
					</view>
				</view>
				<view class="right-box">
					<image src="../../static/icon/preparing_icon.jpg" mode="aspectFit" class="order"></image>
				</view>
			</view>
		</view>
		<!-- 预约信息 -->
		<view class="order-box">
			<text class="header">预约信息</text>
			<view class="order-line">
				<text class="order-line-title">预约日期</text>
				<text class="order-line-value">2021-08-02</text>
			</view>
			<view class="order-line">
				<text class="order-line-title">服务地址</text>
				<view class="order-line-value">
					<text>龙之梦雅仕大厦</text>
					<text>程鹏 18394176643</text>
				</view>
			</view>
			<view class="order-line">
				<text class="order-line-title">车型</text>
				<text class="order-line-value">奥迪(进口) e-tron</text>
			</view>
		</view>
		<!-- 服务项目 -->
		<view class="order-box">
			<text class="header">服务项目</text>
			<view class="order-line">
				<text class="order-line-title">预约日期</text>
				<text class="order-line-value">2021-08-02</text>
			</view>
			<view class="order-line">
				<text class="order-line-title">服务地址</text>
				<view class="order-line-value">
					<text>龙之梦雅仕大厦</text>
					<text>程鹏 18394176643</text>
				</view>
			</view>
			<view class="order-line">
				<text class="order-line-title">车型</text>
				<text class="order-line-value">奥迪(进口) e-tron</text>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="order-box">
			<text class="header">订单信息</text>
			<view class="order-line">
				<text class="order-line-title">支付状态</text>
				<text class="order-line-value">未支付</text>
			</view>
			<view class="order-line">
				<text class="order-line-title">支付方式</text>
				<view class="order-line-value">
					<text>现场支付</text>
				</view>
			</view>
			<view class="order-line">
				<text class="order-line-title">下单时间</text>
				<text class="order-line-value">2021-08-02</text>
			</view>
		</view>
	</view>
</template>

<script>
	const payChannelMap = {
		'WX': '微信支付',
		'ALI': '支付宝',
		'OFFLINE': '线下支付'
	}
	const statusMap = {
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
	}
	export default {
		filters: {
			priceFormat(price) {
				return price / 100.0
			},
			payChannelFilter(channel) {
				return payChannelMap[channel]
			},
			statusFilter(status) {
				return statusMap[status]
			}
		},
		data() {
			return {
				orderId: '',
				orderDetail: {
					skuList: [],
					totalOriginalPrice: 0,
					totalPrice: 0, //商品折扣（仅算VIP和限时打折）后总价
					coupon: undefined,
					mono: ''
				},
				cancelTime: '',
				confirmTime: '',
				reloadPageFlag: false
			}
		},
		onLoad(option) {
			this.orderId = option.orderid
			this.loadData()
		},
		methods: {
			//显示优惠券面板
			loadData() {
				const that = this
				that.$api.request('order', 'getOrderDetail', {
					orderId: that.orderId
				}).then(res => {
					// 深拷贝
					that.orderDetail = JSON.parse(JSON.stringify(res.data))
					if (that.orderDetail.status === 10 && that.orderDetail.cancelSec > 0) {
						that.cancelTime = that.secondsToDays(that.orderDetail.cancelSec)
						const interval = setInterval(() => {
							that.orderDetail.cancelSec--
							if (that.orderDetail.cancelSec < 0) {
								clearInterval(interval)
								that.reloadPageFlag = true
								that.loadData()
								if (that.$api.prePage().loadData) {
									that.$api.prePage().loadData()
								}
								return
							}
							that.cancelTime = that.secondsToDays(that.orderDetail.cancelSec)
						}, 1000)
					} else if (that.orderDetail.status === 30 && that.orderDetail.confirmSec > 0) {
						that.confirmTime = that.secondsToDays(that.orderDetail.confirmSec)
						const interval = setInterval(() => {
							that.orderDetail.confirmSec--
							if (that.orderDetail.confirmSec < 0) {
								clearInterval(interval)
								that.reloadPageFlag = true
								that.loadData()
								if (that.$api.prePage().loadData) {
									that.$api.prePage().loadData()
								}
								return
							}
							that.confirmTime = that.secondsToDays(that.orderDetail.confirmSec)
						}, 1000)
					}
				})
			},
			secondsToDays(sec) {
				// 对一天取模
				let days = parseInt(sec / (60 * 60 * 24))
				// 对一小时取模
				let hours = parseInt((sec % (60 * 60 * 24)) / (60 * 60))
				// 对一分钟取模
				let minutes = parseInt((sec % (60 * 60 * 24)) % (60 * 60) / 60)
				// 剩下的为秒钟
				let seconds = parseInt((sec % (60 * 60 * 24)) % (60 * 60) % 60)
				let res = ''
				res += (days?(days + '天'):'')
				res += (hours?(hours + '小时'):'')
				res += (minutes?(minutes + '分'):'')
				res += (seconds+'秒')
				return res
			},
			payOrder(){
				uni.navigateTo({
					url:"/pages/order/create"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
	.order-status-bg {
		background: linear-gradient(0deg,#00beff,#559cff);
		position: relative;
		border-radius: 10rpx;
		margin: 16rpx;
		.order-status-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 116px;
			padding: 28rpx 30rpx 24rpx;
			border-radius: 10rpx;
			.left-box{
				.first-line{
					display: flex;
					align-items: center;
					margin-bottom: 30upx;
					.image-box{
						margin-right: 16rpx;
						width: 42px;
						height: 42px;
						padding: 7.2px;
						box-sizing: border-box;
						background: #00beff;
						border-radius: 50%;
						.order-imag{
							height: 56rpx;
							width: 56rpx;
						}
					}
					.order-status{
						font-size: 18px;
						line-height: 25px;
						color: #fff;
						font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
						font-weight: 500;
					}
				}
				.action-box{
					display: flex;
					.action-btn {
						width: 160upx;
						height: 50upx;
						margin: 0;
						padding: 0;
						text-align: center;
						line-height: 50upx;
						font-size: $font-base;
						color: $font-color-dark;
						background: #fff;
						&.recom {
							background: $uni-color-primary;
							margin-left: 24rpx;
							color: #fff;
							&:after {
								border-color: $uni-color-primary;
							}
						}
						
					}
					.call{
						text-decoration: none;
						border-radius: 10rpx;
					}
				}
			}
			.right-box{
				.order{
					width: 150upx;
					height: 150upx;
				}
			}
		}
	}
	.order-box{
		border: .5px solid #eaeaea;
		padding: 0 15px;
		margin: 8px;
		border-radius: 10rpx;
		background-color: #fff;
		.header{
			height: 96rpx;
			line-height: 96rpx;
			font-size: 15px;
			font-weight: 700;
			color: #343434;
		}
		.order-line{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 14px;
			height: 48px;
			line-height: 48px;
			.order-line-title{
				color: #888;
			}
			.order-line-value{
				width: 78%;
				font-size: 14px;
				text-align: right;
				height: 100%;
			}
		}
	}
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
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

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
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
			background-color: $base-color;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}
</style>
