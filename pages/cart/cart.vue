<template>
	<view class="content">
		<view class="nav">
			<currentCar :showButton="false"></currentCar>
			<view class="navbar">
				<view 
					v-for="(item, index) in navList" 
					:key="index" 
					class="nav-item" 
					:class="{current: tabCurrentIndex === index}"
					@click="tabClick(index)"
				>
					{{item.text}}
				</view>
			</view>
		</view>
		<view class="swiper-box">
			<!-- 空白页 -->
			<view v-if="!hasLogin || empty===true" class="empty">
				<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
				<view v-if="hasLogin" class="empty-tips">
					空空如也
					<navigator class="navigator" v-if="hasLogin" url="/pages/index/index" open-type="switchTab">随便逛逛></navigator>
				</view>
				<view v-else class="empty-tips">
					空空如也
					<view class="navigator" @click="navToLogin">去登陆></view>
				</view>
			</view>
			<view v-else  class="cart-list">
				<view
					class="cart-item" 
					v-for="(item, index) in cartList" :key="item.id"
					:class="{'b-b': index!==cartList.length-1}"
				>
					<view class="image-wrapper">
						<image :src="(item.skuImg?item.skuImg:item.spuImg) + '?x-oss-process=style/200px'" 
							:class="loadedItemIds.has(item.id) ? 'loaded': ''"
							mode="aspectFill" 
							lazy-load 
							@load="onImageLoad(item)" 
							@error="onImageError('cartList', index)"
						></image>
						<view 
							class="yticon icon-xuanzhong2 checkbox"
							:class="{checked: item.checked}"
							@click="check('item', index)"
						></view>
					</view>
					<view class="item-right">
						<text class="clamp title">{{item.title}}</text>
						<text class="attr">{{item.skuTitle}} <text style="color: #FF570A;" v-show="item.num > item.stock">{{ ' (库存不足 剩余:' + item.stock + ')' }}</text></text>
						<text class="price"><text v-if="item.originalPrice > item.price" style="text-decoration:line-through">¥{{isVip ? (item.vipPrice / 100 + '[VIP]') : item.originalPrice / 100.0}}</text> ¥{{item.price / 100.0}}</text>
						<uni-number-box 
							class="step"
							:min="1" 
							:value="item.num"
							:isMin="item.num===1"
							:index="index"
							@eventChange="numberChange"
						></uni-number-box>
					</view>
					<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import currentCar from '@/components/current-car.vue';
	export default {
		components: {
			currentCar,
			uniNumberBox,
		},
		data() {
			return {
				totalItems: 0, //总数量
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				tabCurrentIndex: 0,
				navList: [{
						text: '全部',
					},
					{
						text: '待完成',
					},
					{
						text: '已完成',
					},
					{
						text: '已取消',
					}
				],
				cartList: [
					{   
						id:'1',
						title:'1',
						checked:false,
						skuTitle:'一',
					}
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
.content {
	position: fixed;
	left: 0;
	top: var(--window-top);
	height: 100%;
	width: 100%;
	background: #fff;
	
}
.nav{
	height:188upx;
	.navbar {
		display: flex;
		height: 80upx;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current {
				color: #0f80ff;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid #0f80ff;
				}
			}
		}
	}
}
.swiper-box{
	height: calc(100% - 188upx);
	display:flex;
	align-items:center;
}
/* 空白页 */
.empty{
	display:flex;
	align-items:center;
	justify-content: center;
	flex-direction: column;
	position: relative;
	padding-bottom: 180upx;
	height: 100%;
	width: 100%;
	background: #fff;
	image{
		width: 240upx;
		height: 160upx;
		margin-bottom:30upx;
	}
	.empty-tips{
		display:flex;
		font-size: $font-sm+2upx;
		color: $font-color-disabled;
		.navigator{
			color: $uni-color-primary;
			margin-left: 16upx;
		}
	}
}
/* 购物车列表项 */
.cart-list{
	.cart-item{
		display:flex;
		/* position:relative; */
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
}	
/* 底部栏 */
</style>
