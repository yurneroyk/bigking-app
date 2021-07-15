<template>
	<view>
		<view class="hot-brand">
			热门品牌
		</view>
		<view class="cate-section">
			<view v-for="(item, index) in categoryButtomList" :key="index" @click="navToAdvertTargetPage(item)" class="cate-item">
				<image :src="item.imgUrl"></image>
				<text>{{item.title}}</text>
			</view>
		</view>
		 <!-- 列表 -->
		 <view class="list">
		 	<view class="list-item" v-for="(item, index) in carList" :key="index">
		 		<image :src="item.imgUrl"></image>
		 		<text>{{item.title}}</text>
		 	</view>
		 </view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				categoryButtomList: [
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					}
				],
				carList:[
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},
					{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					},{
						title: "大众",
						imgUrl: "../../static/pro-hhs.png"
					}
				],
			}
		}
	}
</script>

<style lang='scss'>
	.hot-brand{
		margin: 10px;
		padding: 8px 20px;
		background-color: #00BFFF;
	}
	.cate-section {
		display: flex;
		margin: 10px;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 20upx 20upx; 
		background-color: #f2ff29;
		.cate-item {
			display: flex;
			width: 24%;
			flex-shrink: 0;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(0, 238, 225, 0.3);
		}
	}
	.list{
	   background-color: #edd8bc;
	   margin: 10px;
	   .list-item{
		   display: flex;
		   align-items: center;
		   justify-content: space-between;
		   margin: 0 5px;
		   padding: 5px 40px 5px 20px;
		   border-bottom: 1px solid #cacaca;
		   image {
		   	width: 66upx;
		   	height: 66upx;
		   	margin: 0 20upx 14upx;
		   	border-radius: 50%;
		   	box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		   }
	   }
	}
	   
</style>
