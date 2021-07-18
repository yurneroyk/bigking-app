<template>
	<view>
		<view class="example-title">{{ vehicle_select_title }}</view>
		<uni-list v-for="(value,key,index) in vehicle_select" :key="index">
			<uni-list-item  
				:show-arrow="value.next" 
				:title="value.name"
				@click="choose(value.data,value.name,value.next)" 
			/>
		</uni-list>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				vehicle:[],
				vehicle_select_title : '请选择排量',
				vehicle_select:[]
			}
		},
		created(){
			this.vehicle = uni.getStorageSync('vehice_storage')
		},
		mounted(){
			this.vehicle = this.is_next(this.vehicle)
			this.vehicle_select = this.vehicle
		},
		methods: {
			is_next(s){
				var _arr = JSON.parse(JSON.stringify(s))
				var _tmp = []
				Object.keys(_arr).map((value, index, array) => {
						_tmp.push({'name':value,'data':[],'next':true});
						Object.keys(_arr[value]).map((v1,i1,a1)=>{
							_tmp[index].data.push({'name':v1,'data':[],'next':true})
							_arr[value][v1].map((v2,i2,a2)=>{
								_tmp[index]['data'][i1].data.push({'name':v2,'data':[],'next':false})
							})
						})
				});
				return _tmp		
			},
			choose(data,name,next){
				if (!next){
					console.log(name)
					uni.$emit('vechice_computed',name)
					return uni.navigateBack({})
				}
				if(this.vehicle_select_title == '请选择排量'){
					this.vehicle_select_title = name +' - 请选择年份'
				}else{
					this.vehicle_select_title = this.vehicle_select_title.replace('请选择年份','') + name +' - 请选择款式'
				}
				this.vehicle_select = data
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4
	}
	view {
		font-size: 28upx;
		line-height: inherit
	}
	.example {
		padding: 0 30upx 30upx
	}
	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx 30upx 30upx 50upx;
		margin-top: 0upx;
		position: relative;
		background-color: #fdfdfd;
		border-bottom: 1px #f5f5f5 solid
	}
	.example-title__after {
		position: relative;
		color: #031e3c
	}
	.example-title:after {
		content: '';
		position: absolute;
		left: 30upx;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 6upx;
		height: 32upx;
		background-color: #ccc
	}
	.example .example-title {
		margin: 40upx 0
	}
	.example-body {
		padding: 30upx;
		background: #fff
	}
	.example-info {
		padding: 30upx;
		color: #3b4144;
		background: #fff
	}
</style>