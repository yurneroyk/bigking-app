<template>
	<view :class="{ 'uni-collapse-cell--disabled': disabled,'uni-collapse-cell--notdisabled': !disabled,'uni-collapse-cell--hide':!isOpen }"
	 class="uni-collapse-cell">
		<view class="uni-collapse-cell__title" @click="onClick">
			<image v-if="thumb" :src="thumb" class="uni-collapse-cell__title-img" />
			<uni-icons
			    v-if="icon"
				:size="20"
				class="uni-collapse-check"
				:color="isOpen?'#147dff':'#bbb'"
				type="checkbox-filled"
			/>
			
			<view class="uni-collapse-cell__title-text">
				<view class="name">
					{{ title }}
					<uni-tag :text="tag" size="small" type="primary" class="detail" ></uni-tag>
				</view>
				<view class="suggest" v-if="note">{{ note }}</view>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<view :class="{ 'uni-collapse-cell__title-arrow-active': isOpen, 'uni-collapse-cell--animation': showAnimation === true }"
			 class="uni-collapse-cell__title-arrow">
				<uni-icons color="#bbb" size="20" type="arrowdown" />
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			 <view class="uni-collapse-cell_price">
			 	<text :class="{ 'price-active': isOpen}">
			 		¥{{price }}
			 	</text>
				<text class="originalPrice">
					(¥{{originalPrice}})
				</text>
			 </view>	 
			<!-- #endif -->
		</view>
		<view :class="{'uni-collapse-cell__content--hide':!isOpen}" class="uni-collapse-cell__content">
			<view :class="{ 'uni-collapse-cell--animation': showAnimation === true }" class="uni-collapse-cell__wrapper" :style="{'transform':isOpen?'translateY(0)':'translateY(-50%)','-webkit-transform':isOpen?'translateY(0)':'translateY(-50%)'}">
				<slot />
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue';
	import uniBadge from '../uni-badge/uni-badge.vue';
	export default {
		name: 'UniCollapseItem',
		components: {
			uniIcons
		},
		props: {
			icon: {
				type: String,
				default: 'checkbox-filled'
			},
			title: {
				// 列表标题
				type: String,
				default: ''
			},
			bage:{
				//标签
				type: String,
				default: '详情'
			},
			tag:{
				//标签
				type: String,
				default: '详情'
			},
			note:{
				// 列表二级标题
				type: String,
				default: ''
			},
			name: {
				// 唯一标识符
				type: [Number, String],
				default: 0
			},
			price:{
				type:[Number, String],
				default:'15'
			},
			originalPrice:{
				type:[Number, String],
				default:'15'
			},
			
			disabled: {
				// 是否禁用
				type: Boolean,
				default: false
			},
			showAnimation: {
				// 是否显示动画
				type: Boolean,
				default: false
			},
			open: {
				// 是否展开
				type: Boolean,
				default: false
			},
			thumb: {
				// 缩略图
				type: String,
				default: ''
			},
			isSpu:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isOpen: false
			}
		},
		watch: {
			open(val) {
				this.isOpen = val
			}
		},
		inject: ['collapse'],
		created() {
			this.isOpen = this.open;
			this.nameSync = this.name ? this.name : this.collapse.childrens.length
			this.collapse.childrens.push(this)
			if (String(this.collapse.accordion) === 'true') {
				if (this.isOpen) {
					let lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
					if (lastEl) {
						this.collapse.childrens[this.collapse.childrens.length - 2].isOpen = false
					}
				}
			}
		},
		methods: {
			onClick() {
				if (this.disabled) {
					return
				}
				if (String(this.collapse.accordion) === 'true') {
					this.collapse.childrens.forEach(vm => {
						if (vm === this) {
							return
						}
						vm.isOpen = false
					})
				}
				this.isOpen = !this.isOpen
				this.collapse.onChange && this.collapse.onChange()
				this.$forceUpdate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';

	.uni-collapse-cell {
		flex-direction: column;
		border-color: $uni-border-color;
		border-bottom-width: 1upx;
		// border-bottom-style: solid;
	}
	.uni-collapse-check {
		margin-right:10upx 
	}
	.uni-collapse-cell--hover {
		background-color: $uni-bg-color-hover;
	}

	.uni-collapse-cell--open {
		background-color: $uni-bg-color-hover;
	}

	.uni-collapse-cell--disabled {
		background-color: $uni-bg-color-hover;
		opacity: 0.3;
	}


	.uni-collapse-cell--hide {
		height:100upx;
		
	}

	.uni-collapse-cell--animation {
		// transition: transform 0.3s ease;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.uni-collapse-cell__title {
		padding: 0 24upx;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		height: 100upx;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.uni-collapse-cell_price {
		font-size: $font-base;
		.price-active{
			color: red;
			font-size: $font-base;
		}
		.originalPrice{
			font-size: $font-sm;
			color: $font-color-light;
			text-decoration:line-through
		}
	}
	.uni-collapse-cell__title:active {
		background-color: $uni-bg-color-hover;
	}

	.uni-collapse-cell__title-img {
		height: $uni-img-size-base;
		width: $uni-img-size-base;
		margin-right: 10px;
	}

	.uni-collapse-cell__title-arrow {
		width: 20px;
		height: 20px;
		transform: rotate(0deg);
		transform-origin: center center;

	}

	.uni-collapse-cell__title-arrow-active {
		transform: rotate(180deg);
	}

	.uni-collapse-cell__title-text {
		flex: 1;
		font-size: $font-base;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		color: inherit;
		/* #endif */
		/* #ifdef APP-NVUE */
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
		.name{
			display: flex;
			.detail{
				margin-left: 24upx;
				text-align: center;
			}
		}
		.suggest{
			font-size: $font-sm;
			color: $font-color-light;
			margin-top: 3upx;
		}
	}

	.uni-collapse-cell__content {
		overflow: hidden;
	}

	.uni-collapse-cell__wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-collapse-cell__content--hide {
		height: 0px;
		line-height: 0px;
	}
</style>
