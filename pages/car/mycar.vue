<template>
	<view class="main">
		<view v-if="mycars.length" >
			<uni-list v-for="car in mycars" :key="car.id" class="service">
				<carItem :data="car"></carItem>
			</uni-list>
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
	import {
		mapState
	} from 'vuex';
	import currentCar from '@/components/current-car.vue';
	import carItem from '@/components/carItem.vue';
	export default {
		components: {
			currentCar,
			carItem
		},
		data() {
			return {
				mycars:[
					{
						id:'0',
						name:'奥迪一汽',
					},{   
						id:'1',
						name:'奥迪进口',
					},{   
						id:'2',
						name:'奥迪一汽A6',
					}
				],
			};
		},
		
		onShow() {},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			navTocarList(url){
				uni.navigateTo({  
					url
				})
			}, 
		}
	}
</script>

<style lang='scss'>
.main{
	position: fixed;
	left: 0;
	top: var(--window-top);
	width: 100%;
	border-radius: 20rpx;
	.service{
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
