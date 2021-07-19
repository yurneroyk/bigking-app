<template>
	<view>
		<list-cell class="header" icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#34dac5" title="全部车型" tips="更换" @eventClick="navToBusList('/pages/bus/busList')"></list-cell>
		<view class="main">
			<uni-list @change="change" v-for="(ele,index) in serviceList" :key="index" class="service">
				<view class="ele-title">{{ele.title}}</view>
				<uni-collapse>
					<uni-collapse-item  
						v-for="(item,index) in ele.List" 
						:key="index" 
						:title="item.title"
						open
						thumb="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png"
					>
						<!-- <view v-if="item.goods.length>0"> -->
							<view v-for="(good,index) in item.goods" :key="index" style="padding: 30rpx;">
								{{good.name}}
							</view>
						<!-- </view> -->
					</uni-collapse-item>
				</uni-collapse>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import listCell from '@/components/mix-list-cell';
	export default {
		components: {
			listCell
		},
		data() {
			return {
				totalItems: 0, //总数量
				total: 0, //总价格
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
								checked:true,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},{   
								id:'1',
								title:'大保养服务',
								checked:false,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},{   
								id:'1',
								title:'可视化空调清洗',
								checked:false,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},{   
								id:'1',
								title:'节气门清洗',
								checked:false,
								goods:[]
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
								id:'1',
								title:'服务1',
								checked:false,
								goods:[
									{name:"1"},
									{name:"2"},
									{name:"3"}
								]
							},{   
								id:'1',
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
				loadedItemIds: new Set()
			};
		},
		onLoad(){
			
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
			//请求数据
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
	margin-top:80upx;
	padding: 20upx 0;
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

/* 底部栏 */
.action-section{
	/* #ifdef H5 */
	/* margin-bottom:100upx; */
	/* #endif */
	position:fixed;
	left: 30upx;
	bottom:30upx;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 690upx;
	height: 100upx;
	padding: 0 30upx;
	background: rgba(255,255,255,.9);
	box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
	border-radius: 16upx;
	.checkbox{
		height:52upx;
		position:relative;
		image{
			width: 52upx;
			height: 100%;
			position:relative;
			z-index: 5;
		}
	}
	.clear-btn{
		position:absolute;
		left: 26upx;
		top: 0;
		z-index: 4;
		width: 0;
		height: 52upx;
		line-height: 52upx;
		padding-left: 38upx;
		font-size: $font-base;
		color: #fff;
		background: $font-color-disabled;
		border-radius:0 50px 50px 0;
		opacity: 0;
		transition: .2s;
		&.show{
			opacity: 1;
			width: 120upx;
		}
	}
	.total-box{
		flex: 1;
		display:flex;
		flex-direction: column;
		text-align:right;
		padding-right: 40upx;
		.price{
			font-size: $font-lg;
			color: $font-color-dark;
		}
		.coupon{
			font-size: $font-sm;
			color: $font-color-light;
			text{
				color: $font-color-dark;
			}
		}
	}
	.confirm-btn{
		padding: 0 38upx;
		margin: 0;
		border-radius: 100px;
		height: 76upx;
		line-height: 76upx;
		font-size: $font-base + 2upx;
		background: $uni-color-primary;
		box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
	}
}
/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked{
	color: $uni-color-primary;
}
</style>
