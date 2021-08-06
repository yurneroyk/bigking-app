<template>
	<view class="main">
		<view v-if="userInfo.carList.length" >
			<view v-for="car in userInfo.carList" :key="car.id" class="bar">
				<image :src="car.icon" mode="aspectFit" class="car-image"></image>
				<view class="car-detail">
					<text v-if="car.name" class="car-name">{{car.name}}</text>
					<text v-if="car.des" class="car-desc">{{car.des}}</text>
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
		<button class="add-btn" @click="navTocarList('/pages/car/carlist')">添加爱车</button>
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
.add-btn {
	position: fixed;
	left: 30upx;
	right: 30upx;
	bottom: 16upx;
	z-index: 995;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	font-size: 32upx;
	color: #fff;
	background-color: $uni-color-primary;
	border-radius: 10upx;
}
</style>
