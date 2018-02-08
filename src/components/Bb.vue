<template>
	<div id="goodsinfo">
		<div v-for="(item,index) in keys">
			<div class="tabContent">
				{{item.name}}:
				<input type="button" 
						class="sku" 
						@click="tabInfoChange(index,cindex,citem.id,$event)"  
						v-for="(citem,cindex) in item.value"  
						:class="{notClick:citem.notClick,active:citem.isActiveC}" 
						:attr_id="citem.id" 
						:value="citem.id" />
			</div>
		</div>

		<span id="price">{{nowPrice}}</span>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default{
		data(){
			return{
				keys:[
					{
						name:"颜色",
						isActive:true,
						value:[
							{
								id:'24',
								cname:"黄色",
								isActiveC:false,
								notClick:false,
							},
							{
								id:'25',
								cname:"红色",
								isActiveC:false,
								notClick:false,
							}
						],
					},
					{
						name:"属性",
						isActive:false,
						value:[
							{
								id:'12',
								cname:"大",
								isActiveC:false,
								notClick:false,
							},
							{
								id:'13',
								cname:"小",
								isActiveC:false,
								notClick:false,
							}
						],
					},
					{
						name:"尺寸",
						isActive:false,
						value:[
							{
								id:'31',
								cname:"长方形",
								isActiveC:false,
								notClick:false,
							},
							{
								id:'32',
								cname:"圆形",
								isActiveC:false,
								notClick:false,
							}
						],
					},
				],
				data:{
					"24;12;31": {
						price: 366.00,
						count: 46
					},
					"25;12;32": {
						price: 406,
						count: 66
					}
				},
				SKUResult:{},
				nowPrice:"--",
			}
		},
		methods:{
			/*商品详情数据*/
			queryDGoodsById(){
				
				this.initSKU();//初始化，得到SKUResult
				/*根据SKUResult得到初始化的时候哪些不能点击*/
				for(let i=0;i<this.keys.length;i++){
					for(let j=0;j<this.keys[i].value.length;j++){
						if(this.SKUResult[this.keys[i].value[j].id] == null){
							this.keys[i].value[j].notClick = true;
						}
					}
				}
				console.log(this.SKUResult);
			},
			//获得对象的key
			getObjKeys(obj) {
				if(obj !== Object(obj)) throw new TypeError('Invalid object');
				var keys = [];
				for(var key in obj)
					if(Object.prototype.hasOwnProperty.call(obj, key))
						keys[keys.length] = key;
				return keys;
			},
	
			//把组合的key放入结果集SKUResult
			add2SKUResult(combArrItem, sku) {
				var key = combArrItem.join(";");
				if(this.SKUResult[key]) { //SKU信息key属性·
					this.SKUResult[key].count += sku.count;
					this.SKUResult[key].prices.push(sku.price);
				} else {
					this.SKUResult[key] = {
						count: sku.count,
						prices: [sku.price]
					};
				}
			},
	
			//初始化得到结果集
			initSKU() {
				var i, j, skuKeys = this.getObjKeys(this.data);
				for(i = 0; i < skuKeys.length; i++) {
					var skuKey = skuKeys[i]; //一条SKU信息key
					var sku = this.data[skuKey]; //一条SKU信息value
					var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
					skuKeyAttrs.sort(function(value1, value2) {
						return parseInt(value1) - parseInt(value2);
					});
	
					//对每个SKU信息key属性值进行拆分组合
					var combArr = this.combInArray(skuKeyAttrs);
					for(j = 0; j < combArr.length; j++) {
						this.add2SKUResult(combArr[j], sku);
					}
	
					//结果集接放入SKUResult
					this.SKUResult[skuKeyAttrs.join(";")] = {
						count: sku.count,
						prices: [sku.price]
					}
				}
			},
	
			/**
			 * 从数组中生成指定长度的组合
			 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
			 */
			combInArray(aData) {
				if(!aData || !aData.length) {
					return [];
				}
	
				var len = aData.length;
				var aResult = [];
	
				for(var n = 1; n < len; n++) {
					var aaFlags = this.getCombFlags(len, n);
					while(aaFlags.length) {
						var aFlag = aaFlags.shift();
						var aComb = [];
						for(var i = 0; i < len; i++) {
							aFlag[i] && aComb.push(aData[i]);
						}
						aResult.push(aComb);
					}
				}
	
				return aResult;
			},
	
			/**
			 * 得到从 m 元素中取 n 元素的所有组合
			 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
			 */
			getCombFlags(m, n) {
				if(!n || n < 1) {
					return [];
				}
	
				var aResult = [];
				var aFlag = [];
				var bNext = true;
				var i, j, iCnt1;
	
				for(i = 0; i < m; i++) {
					aFlag[i] = i < n ? 1 : 0;
				}
	
				aResult.push(aFlag.concat());
	
				while(bNext) {
					iCnt1 = 0;
					for(i = 0; i < m - 1; i++) {
						if(aFlag[i] == 1 && aFlag[i + 1] == 0) {
							for(j = 0; j < i; j++) {
								aFlag[j] = j < iCnt1 ? 1 : 0;
							}
							aFlag[i] = 0;
							aFlag[i + 1] = 1;
							var aTmp = aFlag.concat();
							aResult.push(aTmp);
							if(aTmp.slice(-n).join("").indexOf('0') == -1) {
								bNext = false;
							}
							break;
						}
						aFlag[i] == 1 && iCnt1++;
					}
				}
				return aResult;
			},
			/*商品条件筛选*/
			tabInfoChange(index,cindex,cid,e){
				let orderInfo = this.keys/*所有规格*/
				let orderInfoChild = this.keys[index].value;/*当前点击的规格的所有子属性内容*/
				//选中自己，兄弟节点取消选中
				if(orderInfoChild[cindex].notClick != true){
					if(orderInfoChild[cindex].isActiveC == true){
						orderInfoChild[cindex].isActiveC = false;
					}else{
						for(let i=0;i<orderInfoChild.length;i++){
							orderInfoChild[i].isActiveC = false;
						}
						orderInfoChild[cindex].isActiveC = true;
					}
				}
				
				Vue.set(this.keys, index, this.keys[index]);
				//已经选择的节点
				let haveChangedId = [];
				for(let i=0;i<this.keys.length;i++){
					for(let j=0;j<this.keys[i].value.length;j++){
						if(this.keys[i].value[j].isActiveC == true){
							haveChangedId.push(this.keys[i].value[j].id);
						}
					}
				}
				if(haveChangedId.length) {
					//获得组合key价格
					haveChangedId.sort(function(value1, value2) {
						return parseInt(value1) - parseInt(value2);
					});
					var len = haveChangedId.length;
					var prices = this.SKUResult[haveChangedId.join(';')].prices;
					var maxPrice = Math.max.apply(Math, prices);
					var minPrice = Math.min.apply(Math, prices);
					this.nowPrice = maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice;
					//用已选中的节点验证待测试节点 underTestObjs
					let daiceshi = [];//待测试节点
					let daiceshiId = [];
					for(let i=0;i<this.keys.length;i++){
						for(let j=0;j<this.keys[i].value.length;j++){
							if(this.keys[index].value[cindex].id != this.keys[i].value[j].id){
								daiceshi.push({
									index:i,
									cindex:j,
									id:this.keys[i].value[j].id
								});
								daiceshiId.push(this.keys[i].value[j].id);
							}
						}
					}
					for(let i=0;i<haveChangedId.length;i++){
						var indexs = daiceshiId.indexOf(haveChangedId[i]);
						if (indexs > -1) {
							daiceshi.splice(indexs, 1);
						}
					}
					for(let i=0;i<daiceshi.length;i++){
						let testAttrIds = []; //从选中节点中去掉选中的兄弟节点
						let siblingsId = "";
						for(let m=0; m<this.keys[daiceshi[i].index].value.length; m++){
							if(this.keys[daiceshi[i].index].value[m].isActiveC == true){
								siblingsId = this.keys[daiceshi[i].index].value[m].id;
							}
						}
						if(siblingsId != ""){
							for(let j=0;j<len;j++){
								(haveChangedId[j] != siblingsId) && testAttrIds.push(haveChangedId[j]);
							}
						}else{
							testAttrIds = haveChangedId.concat();
						}
						testAttrIds = testAttrIds.concat(this.keys[daiceshi[i].index].value[daiceshi[i].cindex].id);
						testAttrIds.sort(function(value1, value2) {
							return parseInt(value1) - parseInt(value2);
						});
						if(!this.SKUResult[testAttrIds.join(';')]) {
							this.keys[daiceshi[i].index].value[daiceshi[i].cindex].notClick = true;
							this.keys[daiceshi[i].index].value[daiceshi[i].cindex].isActiveC = false;
						} else {
							this.keys[daiceshi[i].index].value[daiceshi[i].cindex].notClick = false;
						}
					}
				} else {
					console.log(123);
					//设置默认价格
					this.nowPrice = "--"
					//设置属性状态
					for(let i=0;i<this.keys.length;i++){
						for(let j=0;j<this.keys[i].value.length;j++){
							if(this.SKUResult[this.keys[i].value[j].id]){
								this.keys[i].value[j].notClick = false;
							}else{
								this.keys[i].value[j].notClick = true;
								this.keys[i].value[j].isActiveC = false;
							}
						}
					}
				}
			},
		},
		created(){
			this.queryDGoodsById();
		},
		watch:{
		},
		filters:{
			
		}
	}
</script>

<style>
	.bh-sku-selected {
		color: red;
	}
	.notClick{
		background:black;
		color:white;
	}
	#goodsinfo .tabContent .active{
		background:red;
	}
</style>