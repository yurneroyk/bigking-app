<template>
	<view class="content">
		<currentCar/>
		<uni-list class="main">
			<view class="service" v-for="category in categoryList" :key="category.id">
				<view class="ele-title">{{category.title}}</view>
				<uni-collapse
					v-if="category.spuList.length"
					@change="serviceCheck"
				>
					<uni-collapse-item
						v-for="spu in category.spuList"
						:key="spu.id"
						:name="spu.id"
						:isSpu="true"
						:note="spu.description"
						:title="spu.title"
						:open="spu.checked"
						:price="spu.price"
						:originalPrice="spu.originalPrice"
					>	
					</uni-collapse-item>
				</uni-collapse>
				<uni-collapse
					v-else
					@change="serviceCheck"
				>
					<uni-collapse-item
						v-for="children in category.childrenList"
						:key="children.id"
						:name="children.id"
						:note="children.description"
						:title="children.title"
						:open="children.checked"
						:price="children.price"
						:originalPrice="children.originalPrice"
					>
						<serviceItem 
							v-for="spu in children.spuList" 
							:key="spu.id"
							:name="children.id+'-'+spu.id"
							:spu="spu"
							:ref="children.id+'-'+spu.id"
							@changeSku="changeSku"
							@check="checkItem"
						>
						</serviceItem>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</uni-list>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<view class="first-line">
					<text>合计:</text>
					<text class="order-price">¥{{total}}</text>
					<text class="other-price">(含{{workPrice}}元上门费)</text>
				</view>
				<view class="second-line">
					<text class="origin-price">原价:{{originPrice}}</text>
					<text >已优惠:{{coupon}}</text>
				</view>
			</view>
			<text class="submit" @click="createOrder">下一步</text>
		</view>
		<skuList
			ref="sku"
			@selectProd="selectProd"
			:sku="sku"
			:skuList="skuList"
			:contentHeight="580"
		></skuList>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex';
	import skuList from './skuList.vue';
	import currentCar from '@/components/current-car.vue';
	import serviceItem from './serviceItem.vue';
	
	export default {
		components: {
			currentCar,
			serviceItem,
			skuList
		},
		data() {
			return {
				totalItems: 0, //总数量
				total: 100, //总价格
				workPrice: 50, // 上门费
				originPrice: 150, // 原价
				coupon: 50,
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				tabCurrentIndex: 0,
				currentComponet:'',
				categoryList:[],
				skuList:[],
				sku:{},
				loadedItemIds: new Set(),
				tid: ''
			};
		},
		onLoad(options){
			const that = this
			that.tid = options.tid
			uni.showLoading({
				title: '正在加载'
			})
		},
		onShow() {
			uni.hideLoading();
		    this.loadData();
		},
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
			async loadData(){
				const that = this
				that.$api.request('product', 'getAllProductList').then(res => {
					that.categoryList = res.data;
				})
			},
			changeSku(val,val2){
				this.$refs.sku.toggleMask()
				this.skuList = val;
				this.currentComponet = val2;
			},
			selectProd(val){
				const name = this.currentComponet
				this.$refs[name][0].sku = val
			},
			checkItem(val){},
			serviceCheck(val){},
			//监听image加载完成
			onImageLoad(item) {
				this.loadedItemIds.add(item.id)
				this.$forceUpdate()
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].skuImg = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			check(val){
				val.checked = !val.checked
			},
			//计算总价
			calcTotal(){
				const that = this
				let list = that.cartList;
				if(list.length === 0){
					that.empty = true;
					return;
				}
				let total = 0;
				let totalItems = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						totalItems += item.num
						total += (that.isVip ? item.vipPrice : item.price) * item.num;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.totalItems = totalItems
			},
			//创建订单
			createOrder(){
				// 滤除未被选择的item
				// let selectedItems = []
				// this.cartList.forEach(item => {
				// 	if (item.checked) {
				// 		selectedItems.push(item)
				// 	}
				// })
				// if (selectedItems.length === 0) {
				// 	this.$api.msg('您没有选中任何商品')
				// 	return
				// }
				// console.log(selectedItems)
				// this.$api.globalData.skuList = selectedItems
				uni.navigateTo({
					url: `/pages/order/create?takeway=cart`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}
	.main{
		padding-bottom: 10px;
		.service{
			.ele-title{
				padding: 24upx 0 24upx 30upx;
				font-size: 26upx;
				color:$font-color-base;
				background-color: #f5f5f5;
			}
		} 
	}
/* 底部栏 */
.footer {
	position: fixed;
	left: 0;
	bottom:0;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 95;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);
	.price-content {
		padding-left: 30upx;
		.first-line {
			display: flex;
			align-items: center;
			font-size: 30upx;
			height: 42upx;
			line-height: 42upx;
			text-align: left;
			font-weight: 700;
			.order-price {
				color:#ff5151
			}
			.other-price{
				font-size: 24upx;
				height: 42upx;
				line-height: 42upx;
				color: #b8b8b8;
				font-weight: 400;
			}
		}
		.second-line{
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: $font-color-disabled;
			line-height: 34upx;
			height: 34upx;
			text-align: left;
			.origin-price{
				margin-right: 6upx;
			}
		}
	}
	.price-tip {
		color: $font-color-spec;
		margin-left: 8upx;
	}

	.price {
		font-size: 36upx;
		color: $base-color;
	}

	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280upx;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: $font-color-spec;
	}
}
</style>
