<template>
	<view>
		<view class="bar">
			<image src="../static/emptyCart.jpg" mode="aspectFit" class="car-image"></image>
			<view class="car-detail">
				<text class="car-name">{{userInfo.car.name}}</text>
				<text class="car-desc">{{userInfo.car.des}}</text>
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
		watch:{
			currentCar(val){
				const { car } = this.userInfo;
				val = car
			}
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
				currentCar:{},
				mycars:[]
			};
		},
		methods:{
			update(){
				console.log(11)
				this.$refs.share.toggleMask();
				console.log(this.userInfo)
			}	
		},
		created(){
			const { car } = this.userInfo
			this.currentCar = car
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
