<template>
	<view class="good">
		<view class="first-line">
			<image :src="prod.img" mode="aspectFit" class="good-img"></image>
			<view class="good-detail">
				<view class="name">
					{{prod.title}}
					<view class="first-right">
					  <text>¥{{ prod.original_price||"--" }}{{price}}</text>
					  <view class="splite">|</view>
					  <uni-icons
					  	:size="20" 
					  	type="checkbox-filled"
						:color="prod.checked?'#4399fc':'#bbb'"
					  	@click="selectItem(prod)"
					  />
					</view>
				</view>
				<view class="des">{{prod.weight}}升</view>
			</view>
		</view>
		<view class="second-line">
			<text class="left-second">机油更换工时</text>
			<text class="right-second">$50</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"serviceItem",
		props:{
			prod:{
				type:Object
			}
		},
		watch:{
			prod(val){
				console.log(val)
			}
		},
		data() {
			return {
				item:{}
			};
		},
		methods:{
			selectItem(val){
				this.$emit('check',val)
			}
		}
	}
</script>

<style lang="scss">
.good{
	padding: 24upx;
	font-size: $font-base;
	color: $font-color-dark;
	background-color: #fff;
	.first-line{
		display: flex;
		align-items: center;
		.good-img{
		  width: 90rpx;
		  height: 90rpx;
		}
		.good-detail{
			width: 100%;
			margin-left: 20upx;
			font-size: $font-sm;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.name{
				display: flex;
				justify-content: space-between;
				font-size: $font-base;
				.first-right{
					display: flex;
					align-items: center;
					.splite{
						padding: 0 8upx;
					}
				}
			}
			.des{
				padding-bottom: 10upx;
				color: $font-color-light;
			}
			.note{
				color: #f5a623 ;
				font-size: $font-sm;
				border: 1upx solid #f5a623;
				border-radius: 2px;
			}
			.checked{
				color: $uni-color-primary;
			}
			
		}
	}
	.second-line{
		display: flex;
		margin-top:20upx;
		justify-content: space-between;
	}
}
</style>
