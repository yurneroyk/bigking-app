<template>
	<view>
		<currentCar></currentCar>
		<view class="main">
			<uni-list @change="change" v-for="category in categoryList" :key="category.id" class="service">
				<view class="ele-title">{{category.title}}</view>
				<uni-collapse 
					@change="allCheck"
				>
					<uni-collapse-item
					    v-for="service in category.serviceList"
					    :key="service.id"
					    :name="service.id"
						:note="service.description"
						:title="service.title"
					>
						<service-item 
							v-for="product in service.productList" 
							:key="product.id" 
							:good="product"
							@check="checkItem(product,service,category)"
						>
						</service-item>
					</uni-collapse-item>
				</uni-collapse>
			</uni-list>
		</view>
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
			<text class="submit" @click="submit">提交订单</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import currentCar from '@/components/current-car.vue';
	import serviceItem from '@/components/serviceItem.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	export default {
		components: {
			currentCar,
			serviceItem,
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
				categoryList:[
					{	
						id:'0',
						title:'推荐保养项目',
						original_price:'',
						serviceList:[
							{
								id:'0-0',
								title:'小保养服务',
								description:'建议车内出现异味时立刻清洗',
								productList:[
									{	
										id:"0-0-0",
										name:"美孚机油",
										des:'美孚速霸矿物油 5w-304升',
										note:'矿物质',
										price:"60",
										
									}, 
									{    
										id:"0-0-1",
										name:"索菲玛机滤",
										description:'索菲玛S3291R1',
										price:"60",
										
									},
									{	
										id:"0-0-2",
										name:"索菲机滤",
										description:'索菲玛S3291R1s',
									},
								]
							},{   
								id:'0-1',
								title:'大保养服务',
								description:'建议车内出现异味时立刻清洗',
								productList:[
									{	
										id:"0-1-0",
										name:"美孚机油",
										description:'美孚速霸矿物油 5w-304升',
									},
									{   
										id:"0-1-1",
										name:"索菲玛机滤",
										description:'索菲玛S3291R1',
									},
									{	
										id: "0-1-2",
										name:"索菲机滤",
										description:'索菲玛S3291R1s',
									},
								]
							}
						]
					},
					{   
						id:'1',
						title:'自主保养项目',
						serviceList:[
							{
								id:'1-0',
								title:'服务1',
								checked:false,
								productList:[
									{	
										id:"1-0-0",
										name:"美孚机油",
										description:'美孚速霸矿物油 5w-304升',
									},
									{   
										id:"1-0-1",
										name:"索菲玛机滤",
										description:'索菲玛S3291R1',
									},
									{	
										id: "1-0-2",
										name:"索菲机滤",
										description:'索菲玛S3291R1s',
									},
								]
							},
							{
								id:'1-1',
								title:'服务2',
								productList:[
									{	
										id:"1-1-0",
										name:"美孚机油",
										description:'美孚速霸矿物油 5w-304升',
									},
									{   
										id:"1-1-1",
										name:"索菲玛机滤",
										description:'索菲玛S3291R1',
									},
									{	
										id: "1-1-2",
										name:"索菲机滤",
										description:'索菲玛S3291R1s',
									},
								]
							}
						]
					},
				],
				loadedItemIds: new Set(),
				tid: ''
			};
		},
		onLoad(options){
			const that = this
			that.tid = options.tid
			console.log("aaa"+options.tid);
		},
		onShow() {
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
			checkItem(val,val2,val3){
				console.log(val,val2,val3);
				val.checked = !val.checked
			},
			navToBusList(url){
				uni.navigateTo({  
					url
				})
			},
			async loadData(){
				const that = this
				that.$api.request('cart', 'getCartList').then(res => {
					res.data.forEach(item => {
						item.checked = true
					})
					that.cartList = res.data
					that.cartList = 
					[
					    {   
						   id:'1',
						   title:'1',
						   checked:false,
						   skuTitle:'一',
					    }
				     ]
					that.calcTotal();  //计算总价
				})
			},
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
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			allCheck(val){
				console.log(val)
			},
			check(val){
				val.checked = !val.checked
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			// 数量
			numberChange(data){
				const that = this
				that.$api.request('cart','updateCartItemNum', {
					cartId: that.cartList[data.index].id,
					num: data.number
				}, failres => {
					uni.showToast({
						title: failres.errmsg,
						icon: 'none'
					});
					that.cartList[data.index].num = that.cartList[data.index].num
				}).then(res => {
					that.cartList[data.index].num = data.number;
					that.calcTotal();
				})
			},
			//删除
			deleteCartItem(index){
				const that = this
				that.$api.request('cart', 'removeCartItem', {
					cartId: that.cartList[index].id
				}).then(res => {
					that.cartList.splice(index, 1);
					that.calcTotal();
					//uni.hideLoading();
				})				
			},
			//清空
			clearCart(){
				const that = this
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							that.$api.request('cart','removeCartAll').then(res => {
								that.cartList = []
							})
						}
					}
				})
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
				//滤除未被选择的item
				let selectedItems = []
				this.cartList.forEach(item => {
					if (item.checked) {
						selectedItems.push(item)
					}
				})
				if (selectedItems.length === 0) {
					this.$api.msg('您没有选中任何商品')
					return
				}
				console.log(selectedItems)
				this.$api.globalData.skuList = selectedItems
				uni.navigateTo({
					url: `/pages/order/create?takeway=cart`
				})
			}
		}
	}
</script>

<style lang='scss'>
.header{
	position: fixed;
	left: 0;
	top: var(--window-top);
	width: 100%;
	box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
	z-index: 10;
	height: 80upx;
	background: #fff;
	.bar{
		width: 100%;
		z-index: 10;
	}
	
}
.main{
	border-radius: 20rpx;
	.service{
		.ele-title{
		    padding: 12upx 0 12upx 30upx;
			font-size: $font-base;
			color:$font-color-disabled;
			background-color: #f5f5f5;
		}
	} 
}
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
