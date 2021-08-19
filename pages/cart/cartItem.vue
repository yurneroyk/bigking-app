<template>
	<view class="order-item">
		<view  @click="navToDetail(data.id)">
			<!-- 当前下单车辆 -->
			<view class="bar">
				<image :src="data.carImage" mode="aspectFit" class="car-image"></image>
				<view class="car-detail">
					<text class="car-name">{{data.carName}}</text>
					<text class="car-desc">{{data.carDes}}</text>
				</view>
			</view>
			<!-- 订单内容 -->
			<view class="main">
				<view class="lable">
					<text>2021-07-26 (周一)</text>
					<text class="price">￥{{data.totalPrice||"--"}}</text>
				</view>
				<view class="lable">
					<text>程鹏</text>
					<text class="tag" :class="{success:data.status=='10'}">{{data.status=='0'? "订单已取消":"订单已创建"}}</text>
				</view>
				<view class="lable">
					<text>上海市黄浦区上海市政府-正门</text>
				</view>
				<view class="lable">
					<text>机油、机滤、空调滤、空气滤、上门服务费</text>
				</view>
			</view>
		</view>
		<!-- 操作区 -->
		<view class="action-box" >
			<button :disabled="submiting" class="action-btn" @click="cancelOrder(data)" v-if="data.status == 10">取消预约</button>
			<button class="action-btn recom" @click="payOrder(data)" v-if="data.status == 10">立即支付</button>
			<button :disabled="submiting" class="action-btn " @click="refundOrder(data)" v-if="data.status == 20">重新下单</button>
			<button :disabled="submiting" class="action-btn recom" @click="appraiseOrder(data)" v-if="data.status == 40">立即评价</button>
		</view>
	</view>
</template>
<script>
	export default {
		props:{
			data:{
				type:Object,
				default:{}
			},
		},
		data(){
			return{
				submiting: false,
			}
		},
		methods:{
			// 查看订单详情
			navToDetail(id){
				uni.navigateTo({
					url: '/pages/order/detail?orderid='+id
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
			// 跳转支付
			payOrder(item) {
				uni.navigateTo({
					url: '/pages/pay/pay?orderno='+ item.orderNo + '&price=' + item.actualPrice
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

<style lang="scss" scoped>
.order-item {
	display: flex;
	flex-direction: column;
	padding:24upx;
	background: #FFFFFF;
	border-radius: 16upx;
	margin: 16upx 24upx;
	.bar{
		display: flex;
		align-items: center;
		padding-bottom: 10upx;
		border-bottom: 1upx solid rgba(0,0,0,0.06);
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
}

.main{
	.lable{
		display: flex;
		align-items: center;
		padding: 10rpx 0 0 10upx;
		font-size: $font-base;
		// color: $font-color-disabled;
		justify-content: space-between;
	}
}	
.action-box {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 60upx;
	margin-top: 24upx;
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
	border-radius: 100upx;
	&:after {
		border-radius: 100upx;
	}
	&.recom {
		background: $uni-color-primary;
		color: #fff;
		&:after {
			border-color: $uni-color-primary;
		}
	}
}
.price{
	color: #ff5151;
	font-weight: bold;
	font-family: monospace;
}
.tag{
	color: #fff;
	padding: 0 10upx;
	border-radius: 8upx;
	background-color: #C1C1C1;
}
.success{
	background-color: $uni-color-success
}
</style>
