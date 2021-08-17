<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/list?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{addressData.consignee}}</text>
						<text class="mobile">{{addressData.phone}}</text>
					</view>
					<text class="address">{{addressData.province}} {{addressData.city}} {{addressData.county}} {{addressData.address}} </text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</navigator>
	    <!-- 表单 -->
		<view class="yt-list">
			<view class="yt-list-cell">
				<text class="cell-tit clamp">服务时间</text>
				<uni-datetime-picker v-model="single" />
			</view>
			<view class="yt-list-cell ">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view>
			<view class="yt-list-cell" >
				<text class="cell-tit clamp">技工选择</text>
				<text class="cell-tip active">程鹏</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="orderReqeust.mono" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 支付方式-->
		<view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					支
				</view>
				<text class="cell-tit clamp">支付方式</text>
				<text class="cell-tip active">
					{{orderReqeust.coupon?orderReqeust.coupon.title : '选择支付方式'}}
				</text>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{(orderReqeust.totalPrice - (orderReqeust.coupon?orderReqeust.coupon.discount:0) + orderReqeust.freightPrice) / 100.0}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" >
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="pay-title">
					支付方式
				</view>
				<radio-group @change="radioChange">
					<label class="pay-item" v-for="(item, index) in payTypes" :key="item.value">
						<view class="title">{{item.title}}</view>
						<view class="radio">
							<radio :value="item.value" :checked="value === current" />
						</view>
					</label>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datetimerange: ['2021-03-20 20:10:10', '2021-05-10 10:10:10'],
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
				single: '2021-04-3',
				skuCategoryPriceMap: {},
				payType:'0',
				maskState: 0, //优惠券面板显示状态
				payTypes: [
					{
						title:'在线支付',
						value:'0'
					},{
						title:'现场支付',
						value:'1'
					},
				],
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
				submiting: false,
				current:0
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
			radioChange(evt) {
				this.current=this.payTypes.find((type)=>{
					type.value === evt.detail.value
				}).value
				console.log(evt)
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
				const that = this
				if (that.submiting) {
					return
				}
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
				uni.redirectTo({
					url: '/pages/pay/pay?parentorderno='+ res.data + '&price=' + ((that.orderReqeust.totalPrice - (that.orderReqeust.coupon?that.orderReqeust.coupon.discount:0) + that.orderReqeust.freightPrice))
				})
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
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	.yt-list-cell {
		display: flex;
		// justify-content: space-around;
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
				max-width: 200upx;
			}
		}

		.desc {
			flex: 1;
			margin-left: 20upx;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index:0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
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
			background-color: $font-color-spec;
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
			background: #f3f3f3;
			border-top-right-radius: 16rpx;
			border-top-left-radius: 16rpx;
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
	.pay-title{
		margin: 20upx 24upx;
		font-size: $font-lg;
	}
	.pay-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20upx 24upx;
		padding: 8upx 16upx;
		border-radius: 20upx;
		background: #fff;
		.title {
			font-size: $font-lg;
			padding: 10upx;
			color: $font-color-dark;
		}
	}
</style>
