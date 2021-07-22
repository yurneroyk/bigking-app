<template>
	<view class="main">
		<view v-if="userInfo.carList.length" >
			<view v-for="car in userInfo.carList" :key="car.id" class="bar">
				<image src="@/static/emptyCart.jpg" mode="aspectFit" class="car-image"></image>
				<view class="car-detail">
					<text v-if="car.name" class="car-name">{{car.name}}</text>
					<text v-if="car.desc" class="car-desc">{{car.desc}}</text>
				</view>
				<view  class="car-select" @click="remove(car)">
					<uni-icons
						:size="20" 
						color="#0f80ff"
						type="trash"
					/>
					<text class="remove">删除</text>
				</view>
				
			</view>
		</view> 
		<view v-else class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view class="empty-tips">空空如也</view>
		</view>
		<view class="footer" @click="navTocarList('/pages/car/carList')">
			<text class="submit">添加爱车</text>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	
	export default {
		components: {},
		data() {
			return {};
		},
		computed:{
			...mapState(['userInfo'])
		},
		onShow() {
			console.log(11)
			console.log(this.userInfo)
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
		methods: {
			navTocarList(url){
				uni.navigateTo({  
					url
				})
			},
			remove(val){
				this.userInfo.carList = this.userInfo.carList.filter(item => item.id !==val.id)
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
	height: 100%;
	border-radius: 20rpx;
}

.bar {
	padding:24upx;
	height: 108upx;
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
			font-size: $font-base;
			height: 28upx;
			line-height: 28upx;
			text-align: left;
		}
	}
	.car-select{
		margin-left:auto;
		.remove{
			font-size: $font-sm;
		}
		
	}
}
.empty{
	display:flex;
	align-items:center;
	justify-content: center;
	flex-direction: column;
	position: relative;
	height: calc(100% - 90upx);
	width: 100%;
	background: #fff;
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
