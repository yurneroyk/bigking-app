<template>
	<view>
		<list-index :options="addressBook"  @click="chooseEvent" />
		<uni-drawer :visible="showRigth" mode="right" @close="closeDrawer('right')">
			<scroll-view :scroll-top="0" scroll-y="true" :style="{ height: winHeight + 'px' }">
				<block v-for="(list, idx) in vehicle" :key="idx">
					<view class="vehicle-list-item" >
						<view v-if="list.data && list.data.length" 
							:id="list.letter" 
							class="vehicle-list-item-title"
						>
							{{ list.letter }}
						</view>
						<view v-if="list.data && list.data.length" class="uni-list">
							<view 
								v-for="(item, index) in list.data" 
								:key="index" 
								class="vehicle-list-item-contect"
								hover-class="uni-list-item--hover" 
								@click="chooseVehicle(item,list.letter)"
							>
								<view class="uni-list-item__content">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</uni-drawer>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	import { addressBook } from '@/data/allBrands.js';
	import listIndex from '@/components/list-index/list-index';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	export default {
		components: { listIndex,uniDrawer },
		data() {
			return {
				title: 'Hello',
				showRigth: false,
				vehicle:[],
				select_path:[],
				winHeight:0,
				carBrands:{
					HotBrand:[],
					Brand:[],
				},
				addressBook:[]
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
		methods: {
			// 选择品牌
			async chooseEvent(data) {
				this.userInfo.car.icon = data.item.name.img;
				this.vehicle = this.select_path = []
				this.select_path.computed = false
				this.select_path.brand_name = data.data.name
				this.select_path.brand_id = data.data.md5
				let _obj = []
				let param = {
					md5:data.data.md5
				}
				let res = await this.$api.request('car', 'getSeriesList',param)
				this.showRigth = true;
				res.data.filter((item,index)=>{
					let _index = _obj.findIndex(_item =>{
						return _item.letter == item['brandType'];
					})
					if (-1 == _index){
						_obj.push({'letter':item['brandType'],'data':[{'VehicleId':item['vehicleId'],'name':item['vehicle']}]})
					}else{
						_obj[_index].data.push({'VehicleId':item['vehicleId'],'name':item['vehicle']})
					}
				})
				this.vehicle=_obj;
			},
			//选择车辆
			async chooseVehicle(data,letter){
				this.userInfo.car = {
					...this.userInfo.car,
					id: data.VehicleId,
					name: `${letter}${data.name}`
				},
				this.select_path.vehicle_id = data.VehicleId
				this.select_path.vehicle_name = data.name
				let param = {
					vehicleId:data.VehicleId
				}
				let res = await this.$api.request('car', 'getTypeList',param)
				let type = this.groupType(res.data)
				uni.setStorageSync('vehice_storage', type);
				this.showRigth = false;
				/*
				数据里包含最多三级数据 [排量,年份,款式]
				如果返回为数据长度为0则没有下级数据
				*/
				if(Object.keys(type).length == 0){
					return uni.$emit('vechice_computed',this.select_path)
				}
				uni.navigateTo({
					url: '/pages/car/vechice'
				});
			},
			groupType(list){
				let data = {}
				// 生成数据骨架
				list.forEach(item=>{
					let _d = item.displacement
					let _y = item.year
					if(!data[_d]) {
						data[_d] = {}
					}
					Object.keys(data).forEach(key=>{
						if(key == item.displacement){
							if(!data[key][_y]){
								data[key][_y] = []
							}
						}
					})
				})
				// 塞数据
				Object.keys(data).forEach(key=>{
					Object.keys(data[key]).forEach(y=>{
						let arr = []
						list.forEach(item=>{
							if(item.displacement == key &&item.year==y){
								arr.push(item.style)
							}
						})
						data[key][y] = arr
					})
				})
				return data
			},
			closeDrawer(e) {
				this.showRigth = false
			},
		},
		async created() {
			let winHeight = uni.getSystemInfoSync().windowHeight;
			this.winHeight = winHeight;
			let _obj = []
			_obj.push({'letter':'TOP','data':[]});
			let res = await this.$api.request('car', 'getBrandList')
			this.carBrands.Brand = res.data;
			this.carBrands.HotBrand = this.carBrands.Brand
			.filter(item=>item.hot == '1')
			.filter(item=>{
				let _data = item.brand.split(' - '); 
				_obj[0].data.push({'brand':item['brand'],'name':_data[1],'img':item['imageUrl'],'md5':item['md5']})
				return item.name = _data[0];
			 })
			this.carBrands.Brand.filter(item=>{
				let _data = item['brand'].split(' - ');
				let _index = _obj.findIndex(_item =>{
					return _item.letter == _data[0] ? true :false;
				})
				if (-1 == _index){
					_obj.push({'letter':_data[0],'data':[{'brand':item['brand'],'name':_data[1],'img':item['imageUrl'],'md5':item['md5']}]})
				}else{
					_obj[_index].data.push({'brand':item['brand'],'name':_data[1],'img':item['imageUrl'],'md5':item['md5']})
					
				}
			})
			this.addressBook = _obj.filter(item =>item.data.length > 0)
		},
	}
</script>

<style lang='scss'>
	.vehicle-list-item-title{
		padding: 24upx 30upx;
		line-height: 1.5;
		background-color: #f7f7f7;
		font-size: 32upx
	}
	.vehicle-list-item-contect {
		font-size: 32upx;
		padding: 24upx 30upx;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-data: center;
		border-bottom:  1rpx solid #eee;;
	}
</style>
