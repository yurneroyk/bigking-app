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
			<view class="share-header" @click="navTo('/pages/car/mycar')">
			  <text>我的爱车</text>
			  <text class="right">编辑</text>
			</view>
			<scroll-view class="view-content" scroll-y>
				<view v-if="userInfo.carList.length" class="share-list">
					<carItem 
						v-for="item in userInfo.carList" 
						:key="item.id" 
						:data="item"
						:select="select"
						@selectItem="change(item)"
					></carItem>
				</view>
				<view v-else class="empty">
					<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
					<view class="empty-tips">
						空空如也
					<view class="navigator" @click="navTo('/pages/car/carlist')">去添加></view>	
					</view>
				</view>
			</scroll-view>
			<button v-if="showButton" class="bottom b-t" @click="navTo('/pages/car/carlist')">其他车型</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import carItem from '@/components/carItem.vue';
	import empty from '@/components/empty.vue';
	export default {
		components:{
			carItem,
			empty
		},
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
			showButton:{
				type: Boolean,
				default: true
			},
			//是否是tabbar页面
			hasTabbar:{
				type: Boolean,
				default: false
			},
			carList:{
				type: Array,
				default: function(){
					return [];
				}
			}
		},
		computed:{
			...mapState(['userInfo'])
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
			navTo(url){
				setTimeout(()=>{
					this.show = false;
					// if(!this.hasLogin){
					// 	url = '/pages/public/login';
					// }
					uni.navigateTo({  
						url
					})
					this.hasTabbar && uni.showTabBar();
				}, 100)  
			}, 
			change(item){
				if(this.select === item.id){
					this.select=''
				}else{
					this.select = item.id
					setTimeout(()=>{
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 100)
					this.userInfo.car = item
				}
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
				//等待mask重绘完成执行
				if(this.hasTabbar){
					uni.hideTabBar({
						success: () => {
							setTimeout(()=>{
								this.backgroundColor = this.config.backgroundColor;
								this.transform = 'translateY(0px)';
							}, 10)
						}
					});
				}else{
					setTimeout(()=>{
						this.backgroundColor = this.config.backgroundColor;
						this.transform = 'translateY(0px)';
					}, 10)
				}
				
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
		}
		
	}
</script>

<style lang='scss'>
	.mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 998;
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
		height: 580upx;
		transition: .3s;
		background: #fff;
		&.has-bottom{
			padding-bottom: 90upx;
		}
		.view-content{
			height: 100%;
		}
	}
	.share-header{
		height: 110upx;
		font-size: $font-base+2upx;
		display:flex;
		align-items:center;
		justify-content: space-between;
		padding: 24upx;
		.right{
			color: $uni-color-primary;
		}
	}
	.share-list{
		padding-bottom: 210upx;
	}
	.empty{
		display:flex;
		align-items:center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		height:calc(100%-90upx);
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
</style>
