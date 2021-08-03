<template>
	<view class="bar">
		<image :src="data.icon" mode="aspectFit" class="car-image"></image>
		<view class="car-detail">
			<text v-if="data.name" class="car-name">{{data.name}}</text>
			<text v-if="data.des" class="car-desc">{{data.des}}</text>
		</view>
		<view  class="car-select" @click="selectItem">
			<uni-icons size="20" type="checkbox-filled" :color="select===data.id?'#0f80ff':'#bbb'"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"carItem",
		props:{
			data:{
				type:Object,
			},
			select:{
				type:String,
				default:'',
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			selectItem(){
				this.$emit('selectItem')
			}
		},
		mounted() {
			console.log(this.data)
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
		.selected{
			color:$font-base;
		}
	}
}
</style>
