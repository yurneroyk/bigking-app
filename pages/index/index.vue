<template>
	<view class="container">
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper autoplay="true" interval="3000" duration="500" class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToAdvertTargetPage(item)">
					<image :src="item.imgUrl" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>		
		<!-- 轮播下四按钮 -->
		<view class="cate-section">
			<view v-for="(item, index) in categoryButtomList" :key="index" @click="navToAdvertTargetPage(item)" class="cate-item">
				<image :src="item.imgUrl"></image>
				<text class="item-title">{{item.title}}</text>
			</view>
		</view>
		<!-- 店铺公告 -->
		<view v-if="postMsgs && postMsgs.length > 0" class="post-section">
			<swiper style="height: 100%;" :circular="true" :autoplay="true" :vertical="true">
				<swiper-item v-for="(item, index) in postMsgs" :key="index">
					<view class="yticon icon-xiaoxi content">: {{ item }}</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view v-if="windowSpuList && windowSpuList.length == 2" class="ad-1">
			<view class="left" @click="navToAdvertTargetPage(windowSpuList[0])">
			  <text>{{ windowSpuList[0].title }}</text>
			  <image :src="windowSpuList[0].imgUrl"  mode="aspectFit" class="baoyang"></image>
			</view>
			<view class="right" @click="navToAdvertTargetPage(windowSpuList[1])">
			  <text >{{ windowSpuList[1].title }}</text>
			  <image :src="windowSpuList[1].imgUrl" mode="aspectFit" class="baoyang"></image>
			</view>
		</view>
		<!-- 员工推荐 -->
		<view  class="f-header m-t">
			<image src="/static/staff/recommend.png"></image>
			<view class="tit-box">
				<text class="tit">员工推荐</text>
			</view>
		</view>
		<view class="group-section">
			<view class="g-swiper-item">	
				<view class="g-item left"
					v-for="(item,index) in bestStaffList"
					:key="index" 
					v-if="index%2==0"
				>
					<image :src="item.avatarUrl" mode="aspectFill"></image>
					<view class="t-box">
						<text class="title clamp">{{item.des}}</text>
						<view class="price-box">
							<text class="price">一级棒,高级资质认证！</text>
						</view>
					</view>     
				</view>
				<view class="g-item right" 
					v-for="(item,index) in bestStaffList"
					:key="index"  
					v-if="index%2!==0"
				>
					<image :src="item.avatarUrl" mode="aspectFill"></image>
					<view class="t-box">
						<text class="title clamp">{{item.des}}</text>
						<view class="price-box">
							<text class="price">高级资质认证！</text> 
						</view>
					</view>
				</view>
			</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import currentCar from '@/components/current-car.vue';
	export default {
		components:{
			currentCar
		},
		data() {
			return {
				uni,
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				windowSpuList: [],
				bestStaffList: [],
				categoryButtomList: [
					{
						title: "",
						imgUrl: ""
					}
				],
				salesTop: [],
				banner: undefined,
				isVip: false,
				postMsgs: []
			};
		},
		onShow() {
			this.isVip = this.$api.isVip()
		},
		onLoad(options) {
			//#ifdef H5
			//H5进入，有可能是回调进来的
			if (options.code && options.state) {
				const that = this
				that.logining = true
				that.$api.request('user', 'thirdPartLogin', {
					loginType: 3,
					raw: options.code
				}, failres => {
					that.logining = false
					that.$api.msg(failres.errmsg)
				}).then(res => {
					//登录成功，重定向到指定目标
					that.logining = false
					that.$store.commit('login', res.data)
					uni.setStorageSync('userInfo', res.data)
					//重定向到
					//不能重定向到tabbar页面
					if (options.state === '/pages/cart/cart' || options.state === '/pages/user/user' 
					|| options.state === '/pages/index/index' || options.state === '/pages/category/category') {
						uni.switchTab({
							url: options.state
						})
					} else {
						uni.redirectTo({
							url: options.state
						})
					}
					
				})
			}
			//#endif
			this.loadData()
		},
		methods: {
			// 首页加载
			async loadData() {
				const that = this
				uni.showLoading({
					title: '正在加载'
				})
				that.$api.request('integral', 'getIndexData', failres => {
					that.$api.msg(failres.errmsg)
					uni.hideLoading()
				}).then(res => {
					let data = res.data
					//轮播
					if (data.advertisement.t1) {
						data.advertisement.t1.forEach(item => {
							if (!item.color) {
								item.color = 'rgb(205, 215, 218)'
							}
						})
						that.carouselList = data.advertisement.t1
						that.swiperLength = data.advertisement.t1.length
						that.titleNViewBackground = data.advertisement.t1[0].color
					}
					//员工推荐
					if (data.worker) {
						that.bestStaffList = data.worker
					}
					//横幅
					if (data.advertisement.t3 && data.advertisement.t3.length > 0) {
						that.banner = data.advertisement.t3[0]
					}
					//分类5Buttom
					if (data.advertisement.t4) {
						that.categoryButtomList = data.advertisement.t4
					}
					//两栏广告
					if (data.advertisement.t9) {
						this.windowSpuList = data.advertisement.t9
					}
					//公告
					if (data.advertisement.t6) {
						this.postMsgs = data.advertisement.t6.map(item => item.title)
					}
					uni.hideLoading()
				})
			},
			// 轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].color;
			},
			// 跳转到广告目标页
			navToAdvertTargetPage(advert) {
				// 针对Advert Type 不同做不同跳转
				if(uni.getStorageSync('userInfo')){
					const {unionType, unionValue} = advert
					let url = '/pages/index/index'
					if (unionType === 1) {
						url = '/pages/product/detail?id=' + unionValue
					} else if (unionType === 2) {
						url = '/pages/product/list?tid=' + unionValue
					} else if (unionType === 3) {
						url = '/pages/order/list?tid=1236911'
					} else if (unionType === 5) {
						url = '/pages/staff/detail?id=' + unionValue
					}else if (unionType === 4) {
						url = unionValue
					}
					uni.navigateTo({
						url: url,
					})
				}else{
					// 针对首页未登录的情况，先跳到登录页进行微信登录
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}
				
				
			}
		},
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:$font-color-base;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	page{
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
		
		.post-section {
			margin-top: 16upx;
			height: 60upx;
			line-height: 60upx;
			background-color: white;
			padding-left: 20upx;
			.content {
				height: 60upx;
				line-height: 60upx;
				font-size: 28upx;
				text-overflow: ellipsis;
				overflow: hidden;
				color: $uni-color-primary;
				white-space: nowrap;
			}
		}
	}
	/* #endif */
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}
		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}
	.carousel {
		width: 100%;
		height: 350upx;
		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}
		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;
		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}
		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}
	/* 分类 */
	.cate-section {
		position:relative;
		z-index:5;
		border-radius:16upx 16upx 0 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 16upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(0, 0, 0, 0.3);
		}
	}
	.ad-1{
		margin-top: 16rpx;
		width: 100%;
		height: 150upx;
		padding: 5upx 5upx;
		background: #fff;
		display: flex;
		// flex-wrap: wrap;
		align-items: center;
		font-size: 26rpx;
		color: #fff;
		.left{
			flex: 1 1 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-left: 10px;
			margin-right: 9px;
			padding:5px 10px;
			border-radius:4px;
			background-image: url(../../static/bg_blue.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.baoyang{
			  width: 48px;
			  height: 48px;
			}
		}
		.right{
			flex: 1 1 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-right: 10px;
			padding:5px 10px;
			border-radius:4px;
			background-image: url(../../static/bg_red.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.baoyang{
			  width: 48px; 
			  height: 48px;
			}
		}
	}
	/* 秒杀专区 */
	.seckill-section{
		padding: 4upx 30upx 24upx;
		background: #fff;
		.s-header{
			display:flex;
			align-items:center;
			height: 92upx;
			line-height: 1;
			.s-img{
				width: 140upx;
				height: 30upx;
			}
			.tip{
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}
			.timer{
				display:inline-block;
				width: 40upx;
				height: 36upx;
				text-align:center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0,0,0,.8);
			}
			.icon-you{
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}
		.floor-list{
			white-space: nowrap;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
	}
	
	.f-header{
		display:flex;
		align-items:center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		image{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit{
			font-size: $font-lg +2upx;
			color: $font-color-dark;
			line-height: 1.3;
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
		.icon-you{
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}
	/* 团购楼层 */
	.group-section{
		background: #fff;
		.g-swiper{
			height: 650upx;
			padding-bottom: 30upx;
		}
		.g-swiper-item{
			width: 100%;
			padding: 0 30upx;
			display:flex;
		}
		image{
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}
		.g-item{
			display:flex;
			flex-direction: column;
			overflow:hidden;
		}
		.left{
			flex: 1.2;
			margin-right: 24upx;
			.t-box{
				padding-top: 20upx;
			}
			
		}
		.right{
			flex: 0.8;
			flex-direction: column-reverse;
			.t-box{
				padding-bottom: 20upx;
			}
		}
		.t-box{
			height: 160upx;
			font-size: $font-base+2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}
		.price{
			color:$uni-color-primary;
		}
		.m-price{
			font-size: $font-sm+2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}
		.pro-box{
			display:flex;
			align-items:center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}
		.progress-box{
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}
	/* 分类推荐楼层 */
	.hot-floor{
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;
		.floor-img-box{
			width: 100%;
			height:320upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255,255,255,.06) 30%, #f8f8f8);
			}
		}
		.floor-img{
			width: 100%;
			height: 100%;
		}
		.floor-list{
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top:-140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0,0,0,.2);
			position: relative;
			z-index: 1;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
		.more{
			display:flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;
			text:first-child{
				margin-bottom: 4upx;
			}
		}
	}
	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>