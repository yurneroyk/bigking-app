<template>
	<view>
		<currentCar></currentCar>
		<view class="main">
			<uni-list @change="change" v-for="(ele,index) in serviceList" :key="index" class="service">
				<view class="ele-title">{{ele.title}}</view>
				<uni-collapse 
					@change="allCheck"
				>
					<uni-collapse-item
					    v-for="item in ele.List"
						:checked = "item.id == tid"
						icon='checkbox'
					    :key="item.id"
					    :name="item.id"
						:note="item.suggest"
						:title="item.title"
					>
						<view 
							v-for="(good,index1) in item.goods" 
							:key="index1" 
							style="background-color: #fff; padding-left: 30upx;" 
						>
							<view class="good">
								<view class="first-line">
									<image src="../../static/baoyang.png" mode="aspectFit" class="good-img"></image>
									<view class="good-detail">
										<view class="name">
											{{good.name}}
											<view class="first-right">
											  <text>¥{{ good.price|| 50 }}</text>
											  <view class="splite">|</view>
											  <uni-icons
											  	:size="20" 
											  	:color="good.checked?'#fa436a':'#bbb'"
											  	type="checkbox-filled"
											  	@click="check(good)"
											  />
											</view>
										</view>
										<view class="des">{{good.des}}</view>
										<text  >
											<span v-if="good.note" class="note">{{good.note}}</span>
										</text>
									</view>
								</view>
								<view class="second-line">
									<text class="left-second">机油更换工时</text>
									<text class="right-second">$50</text>
								</view>
							</view>
						</view>
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
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopupDailog from '@/components/uni-popup/uni-popup-dialog.vue';
	export default {
		components: {
			currentCar,
			uniPopupDailog
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
				
				serviceList:[
					{
						title:'推荐保养项目',
						List:[
							{
								id:'0',
								title:'小保养服务',
								suggest:'建议车内出现异味时立刻清洗',
								goods:[
									{	
										
										name:"美孚机油",
										des:'美孚速霸矿物油 5w-304升',
										note:'矿物质',
										price:"60",
										checked:true,
									},
									{   
										name:"索菲玛机滤",
										des:'索菲玛S3291R1',
										price:"60",
										checked:true,
										
									},
									{	
										name:"索菲机滤",
										des:'索菲玛S3291R1s',
										checked:true,
									},
								]
							},{   
								id:'1',
								title:'大保养服务',
								goods:[
									{	
										
										name:"美孚机油",
										des:'美孚速霸矿物油 5w-304升',
										note:'矿物质',
										checked:true,
									},
									{   
										name:"索菲玛机滤",
										des:'索菲玛S3291R1',
										checked:true,
										
									},
									{	
										name:"索菲机滤",
										des:'索菲玛S3291R1s',
										checked:true,
									},
								]
							},{   
								id:'2',
								title:'可视化空调清洗',
								goods:[
									{	
										
										name:"美孚机油",
										des:'美孚速霸矿物油 5w-304升',
										note:'矿物质',
										checked:true,
									},
									{   
										name:"索菲玛机滤",
										des:'索菲玛S3291R1',
										checked:true,
										
									},
									{	
										name:"索菲机滤",
										des:'索菲玛S3291R1s',
										checked:true,
									},
								]
							},{   
								id:'3',
								title:'节气门清洗',
								checked:false,
								goods:[
									{	
										
										name:"美孚机油",
										des:'美孚速霸矿物油 5w-304升',
										note:'矿物质',
										checked:true,
									},
									{   
										name:"索菲玛机滤",
										des:'索菲玛S3291R1',
										checked:true,
										
									},
									{	
										name:"索菲机滤",
										des:'索菲玛S3291R1s',
										checked:true,
									},
								]
							},
							
						]
					},
					{
						title:'自主保养项目',
						List:[
							{
								id:'1',
								title:'服务1',
								checked:false,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},{   
								id:'2',
								title:'服务1',
								checked:false,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},{   
								id:'3',
								title:'服务1',
								checked:true,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},
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
			// check(type, index){
			// 	if(type === 'item'){
			// 		this.cartList[index].checked = !this.cartList[index].checked;
			// 	}else{
			// 		const checked = !this.allChecked
			// 		const list = this.cartList;
			// 		list.forEach(item=>{
			// 			item.checked = checked;
			// 		})
			// 		this.allChecked = checked;
			// 	}
			// 	this.calcTotal(type);
			// },
			//数量
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
