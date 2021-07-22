<template>
	<view class="good">
		<view class="first-line">
			<image src="@/static/baoyang.png" mode="aspectFit" class="good-img"></image>
			<view class="good-detail">
				<view class="name">
					{{good.name}}
					<view class="first-right">
					  <text>¥{{ good.price|| 50 }}</text>
					  <view class="splite">|</view>
					  <uni-icons
					  	:size="20" 
					  	:color="good.checked?'#fa436a':'#bbb'"
					  	type="checkbox-filled"
					  	@click="selectItem(good)"
					  />
					</view>
				</view>
				<view class="des">{{good.des}}</view>
				<text  >
					<span v-if="good.note" class="note">{{good.note}}</span>
				</text>
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
			good:{
				type:Object
			}
		},
		data() {
			return {
				
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
	.first-line{
		display: flex;
		align-items: center;
		.good-img{
		  width: 52px;
		  height: 52px;
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
