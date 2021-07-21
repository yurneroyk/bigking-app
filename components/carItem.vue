<template>
	<view class="bar">
		<image src="../static/emptyCart.jpg" mode="aspectFit" class="car-image"></image>
		<view class="car-detail">
			<text class="car-name">{{data.name}}</text>
			<text v-if="data.desc" class="car-desc">{{data.desc}}</text>
		</view>
		<view class="car-select" @click="remove">
			<uni-icons type="trash" color="#fc0107"></uni-icons>
			<text class="icon-text">删除</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"carItem",
		props:{
			data:{
				type:Object,
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			remove(){
				console.log(11)
			}
		}
	}
</script>

<style lang="scss">
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
		font-size:$font-sm;
		.icon-text{
			color: $font-color-spec;
			margin-right: 8upx;
		}
	}
}
</style>
