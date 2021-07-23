<template>
	<view>
		<view class="bar">
			<image src="../static/emptyCart.jpg" mode="aspectFit" class="car-image"></image>
			<view class="car-detail">
				<text class="car-name">{{car.name}}</text>
				<text class="car-desc">{{car.des}}</text>
			</view>
			<view class="car-select" @click="update">
				<text class="icon-text">更换</text>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</view>
		<selectCar
			ref="share" 
			:showButton="showButton"
			:contentHeight="580"
		></selectCar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'; 
	import uniIcons from './uni-icons/uni-icons.vue';
	import selectCar from '@/components/select-car.vue';
	export default {
		name:"current-car",
		components:{
			uniIcons,
			selectCar
		},
		props:{
			showButton:{
				type:Boolean,
				default:true
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				car:{
					name:"奥迪(一汽)A4",
					des:"2006年款 2.4L 手动档 三厢",
				},
				mycars:[]
			};
		},
		methods:{
			update(){
				this.$refs.share.toggleMask();
				console.log(this.userInfo)
			}	
		},
		created(){}
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
			font-size: $font-xs;
			height: 28upx;
			line-height: 28upx;
			text-align: left;
		}
	}
	.car-select{
		margin-left:auto;
		font-size:$font-base ;
		.icon-text{
			color: $uni-color-primary;
			margin-right: 8upx;
		}
	}
}
</style>
