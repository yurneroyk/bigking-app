<template>
	<view class="service">
		<view class="service-title">
			<view class="name">
				{{spu.title}}
			</view>
			<uni-icons
			  v-if="spu.options!=='0'"
			  :size="20" 
			  type="checkbox-filled"
			  :color="spu.options==='0'?'#4399fc':'#bbb'"
			  @click="selectItem(spu)"
			/>
		</view>
		<view class="service-prod" v-if="skuList.length">
			<image :src="sku.img" mode="aspectFit" class="good-img"></image>
			<view class="good-detail">
				<view class="name">
					<view class="first-right">
						<text>{{sku.title}}</text>
						<text v-if="sku.label" class="note">{{sku.label}}</text>
					</view>
					<view class="price">¥{{sku.price}}</view>
				</view>
				<view class="des">
					<text>{{sku.specification}}</text>
					<text class="change" @click="changeSku">更换配件</text>
				</view>
			</view>
		</view>
		<view class="service-fine">
			<view>{{spu.title}}工时</view>
			<view>¥{{spu.price}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"serviceItem",
		props:{
			spu:{
				type:Object
			},
			name:{
				default:String
			},
		},
		data() {
			return {
				sku:{},
				skuList:[]
			};
		},
		created() {
			const { skuList } = this.spu
			this.skuList = skuList;
			if(this.skuList.length){
				this.sku = this.skuList[0]
			}
		},
		methods:{
			selectItem(val){
				this.$emit('check',val)
			},
			// 更换配件
			changeSku(){
				this.$emit("changeSku",this.skuList,this.name)
			},
		}
	}
</script>

<style lang="scss">
.service{
	padding: 8upx 48upx;
	font-size: $font-base;
	color: $font-color-dark;
	background-color: #fff;
	.service-title{
		display: flex;
		justify-content: space-between;
	}
	.service-prod{
		display: flex;
		margin:8upx 0;
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
				padding-bottom: 10upx;
				color: $font-color-light;
				.change{
					color: $uni-color-primary;
				}
			}
			.checked{
				color: $uni-color-primary;
			}
			
		}
	}
	.service-fine{
		display: flex;
		justify-content: space-between;
		font-size: $font-sm;
		color: $font-color-light;
	}
}
</style>
