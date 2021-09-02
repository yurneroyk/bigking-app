<template>
	<view v-if="show" class="mask" @click="toggleMask" @touchmove.stop.prevent="stopPrevent"
		:style="{backgroundColor: backgroundColor}"
	>
		<view 
			class="mask-content"
			@click.stop.prevent="stopPrevent"
			:style="[{
				height: config.height, 
				transform: transform
			}]"
		>   
			<view class="header">更换配件</view>
			<scroll-view class="view-content" scroll-y>
				<view v-if="skuList.length">
					<view
						v-for="(item, index) in skuList" :key="item.id"
						class="service-prod"
						hover-class="hoverClass"
						@click="change(item)"
					>
						<image :src="item.img||'/static/mycar.png'" mode="aspectFit" class="good-img"></image>
						<view class="good-detail">
							<view class="name">
								<view class="first-right">
									<text>{{item.title}}</text>
									<text v-if="item.label" class="note">{{item.label}}</text>
								</view>
								<view class="price">¥{{item.price}}</view>
							</view>
							<view class="des">
								<text>{{item.specification}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				show: false,
				select:'',
				config: {},
			};
		},
		props:{
			contentHeight:{
				type: Number,
				default: 0
			},
			hasTabbar:{
				type: Boolean,
				default: false
			},
			skuList:{
				type: Array,
				default: function(){
					return [];
				}
			},
		},
		created() {
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		methods:{
			change(item){
				this.transform = this.config.transform;
				setTimeout(()=>{
					this.show = false;
					this.backgroundColor = 'rgba(0,0,0,0)';
				}, 200)
				this.$emit("selectProd",item)
			},
			toggleMask(){
				//防止高频点击
				if(this.timer == 1){
					return;
				}
				this.timer = 1;
				setTimeout(()=>{
					this.timer = 0;
				}, 500)
				if(this.show){
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					setTimeout(()=>{
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 100)
					return;
				}
				this.show = true;
				setTimeout(()=>{
					this.backgroundColor = this.config.backgroundColor;
					this.transform = 'translateY(0px)';
				}, 10)
				
				
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
		}
		
	}
</script>

<style lang='scss' scoped>
	.mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 20000;
		transition: .6s;
		.bottom{
			position:absolute;
			left: 0;
			bottom: var(--window-bottom);
			display:flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 40upx);
			height: 90upx;
			margin: 20upx;
			background: #0f80ff;
			z-index: 9;
			font-size: $font-base + 2upx;
			color: #FFFFFF;
		}
	}
	.mask-content{
		width: 100%;
		border-top-right-radius: 16rpx;
		border-top-left-radius: 16rpx;
		height: 580upx;
		transition: .3s;
		background: #fff;
		.header{
			height: 80upx;
			font-size: $font-lg;
			display:flex;
			align-items:center;
			border-radius:20rpx;
			border:1px solid #F1F1F1;
			justify-content: space-between;
			padding:12upx 24upx;
			margin: 12upx 16upx;
		}
		.view-content{
			height: 100%;
			.service-prod{
				display: flex;
				padding:10upx;
				border:1px solid #F5F5F5;
				border-radius: 8upx;
				margin:24upx;
				justify-content: space-between;
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
							justify-content: space-between;
							align-items: center;
							.note{
								margin-left: 20upx;
								color: #f5a623 ;
								font-size: $font-sm;
								border: 1upx solid #f5a623;
								border-radius: 2px;
							}
							.price{
								margin-left: auto;
							}
						}
					}
					.des{
						display: flex;
						justify-content: space-between;
						color: $font-color-light;
						.change{
							color: $uni-color-primary;
						}
					}
				}
			}
			.hoverClass{
				opacity: 0.7;
				background-color: #f7f7f7;
			}
		}
	}
	
</style>
