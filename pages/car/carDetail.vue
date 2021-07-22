<template>
	<view>
		<!-- 地址 -->
		<view class="address-section">
			<view class="order-content">
				<image src="@/static/emptyCart.jpg" mode="aspectFit" class="car-image"></image>
				<view class="car-detail">
					<text class="car-name">{{carName}}</text>
					<text class="car-desc">{{carDesc}}</text>
				</view>
				<view class="car-select" @click="update">
					<text class="icon-text">删除</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">公里数</text>
				<text class="cell-tip">{{orderReqeust.totalOriginalPrice / 100.0}}KM</text>
			</view>
			<view v-if="orderReqeust.totalOriginalPrice - orderReqeust.totalPrice > 0" class="yt-list-cell b-b">
				<text class="cell-tit clamp">折扣金额</text>
				<text class="cell-tip red">-￥{{(orderReqeust.totalOriginalPrice - orderReqeust.totalPrice) / 100.0}}</text>
			</view>
			<view v-if="orderReqeust.coupon" class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠券立减</text>
				<text class="cell-tip red">-￥{{orderReqeust.coupon.discount / 100.0}}</text>
			</view>
			<view v-if="orderReqeust.freightPrice === 0" class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view>
			<view v-if="orderReqeust.freightPrice > 0" class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">¥ {{orderReqeust.freightPrice / 100.0}}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">购车时间</text>
				<input class="desc" type="text" v-model="orderReqeust.mono" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<text class="submit" @click="submit">保存</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderReqeust: {
					skuList: [],
					totalOriginalPrice: 0,
					totalPrice: 0, //商品折扣（仅算VIP和限时打折）后总价
					coupon: undefined,
					mono: '',
					takeWay: '',
					freightPrice: 0,
					addressId: undefined
				},
				skuCategoryPriceMap: {},
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				isVip: false,
				addressData: {
					consignee: '',
					phone: '',
					province: '',
					city: '',
					county: '',
					address: '',
					defaultAddress: false,
				},
				submiting: false
			}
		},
		onShow() {
			this.isVip = this.$api.isVip()
		},
		onLoad(option) {
			//商品数据
			const that = this
			that.isVip = that.$api.isVip()
			if (option.takeway) {
				that.orderReqeust.takeWay = option.takeway
			}
			that.orderReqeust.skuList = that.$api.globalData.skuList;
			let totalOriginalPrice = 0
			let totalPrice = 0
			let skuCategoryPriceMap = {}
			that.orderReqeust.skuList.forEach(item => {
				totalOriginalPrice += item.originalPrice*item.num
				totalPrice += that.isVip ? (item.vipPrice*item.num) :  (item.price*item.num)
				//构建category价格Map
				item.categoryIdList.forEach(catItem => {
					if (skuCategoryPriceMap[catItem]) {
						skuCategoryPriceMap[catItem] += that.isVip ? (item.vipPrice*item.num) :  (item.price*item.num)
					} else {
						skuCategoryPriceMap[catItem] = that.isVip ? (item.vipPrice*item.num) :  (item.price*item.num)
					}
				})
			})
			// 不同类目价格映射表
			that.skuCategoryPriceMap = skuCategoryPriceMap
			that.orderReqeust.totalOriginalPrice = totalOriginalPrice
			that.orderReqeust.totalPrice = totalPrice
			that.$api.request('coupon', 'getUserCoupons').then(res => {
				that.couponList = res.data
			})
			
			that.$api.request('address', 'getDefAddress').then(res => {
				that.addressData = res.data
				that.calcFreightPrice()
			})
			
			if (that.orderReqeust.skuList.length === 1 && that.orderReqeust.skuList[0].groupShopId) {
				//若是团购商品，则携带上团购信息
				that.orderReqeust.groupShopId = that.orderReqeust.skuList[0].groupShopId
			}

		},
		methods: {
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			calcFreightPrice() {
				const that = this
				if (that.addressData) {
					that.orderReqeust.addressId = that.addressData.id
				}
				that.$api.request('order', 'previewFreight', {
					orderRequest: JSON.stringify(that.orderReqeust)
				}).then(res => {
					that.orderReqeust.freightPrice = res.data
				})
			},
			numberChange(data) {
				this.number = data.number;
			},
			submit() {
				uni.navigateBack()
				// const that = this
				// if (that.submiting) {
				// 	return
				// }
				// that.$api.request('user', 'checkLogin')
				// 	.then(res => {
				// 		that.submiting = true
				// 		if (that.addressData.id) {
				// 			that.orderReqeust.addressId = that.addressData.id
				// 		}
				// 		const orderReqeust = that.orderReqeust
				// 		const exceptPrice = orderReqeust.totalPrice - (orderReqeust.coupon?orderReqeust.coupon.discount:0) + orderReqeust.freightPrice
				// 		that.orderReqeust.exceptPrice = exceptPrice
				// 		that.$api.request('order', 'takeOrder', {
				// 			orderRequest : JSON.stringify(that.orderReqeust),
				// 			channel: uni.getSystemInfoSync().platform
				// 		}, failres => {
				// 			that.submiting = false
				// 			that.$api.msg(failres.errmsg)
				// 		}).then(res => {
				// 			//提交订单成功后，无需再让用户提交订单
				// 			// that.submiting = false
				// 			uni.redirectTo({
				// 				url: '/pages/pay/pay?parentorderno='+ res.data + '&price=' + ((that.orderReqeust.totalPrice - (that.orderReqeust.coupon?that.orderReqeust.coupon.discount:0) + that.orderReqeust.freightPrice))
				// 			})
				// 		})
				// 	})
			},
			selectCoupon(couponItem) {
				this.orderReqeust.couponId = couponItem.id
				this.orderReqeust.coupon = couponItem
				this.maskState = 0
				this.calcFreightPrice()
			},
			stopPrevent() {},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
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
    .car-image{
		width:60upx;
		height:60upx;
		margin-right: 16upx;
	}
</style>
