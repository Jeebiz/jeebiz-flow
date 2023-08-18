<template>
	<div class="contentWrapper">
		<!--标题-->
		<div class="title">{{title}}</div>
		<el-row v-if="showflag==1">
			<!--内容-->
			<div class="mainWrapper" ref="main">
				<router-view />
			</div>
		</el-row>
		<div v-if="showflag==2">
			<!--面包屑-->
			<div style="display:flex;justify-content:space-between;">
				<div>&nbsp;</div>
			</div>
			<el-row class="contentBox">
				<!--左侧按钮-->
				<el-col :span="2" class="stuBtn leftButton">
					<el-row style="margin-bottom:24px" v-for="(item,index) in features" :key='index'>
						<el-button round :class="{ isActive:currentIndex == index}" @click="swatchTab(index,item)">{{item.name}}</el-button>
					</el-row>
				</el-col>
				<!--右侧内容-->
				<el-col :span="22">
					<div style="display:flex;justify-content:space-between;" v-show=" subFeatures.length > 0">
						<!--选项卡-->
						<div>
							<el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
								<el-tab-pane v-for="(item,index) in subFeatures" :key='index' :label="item.name" :name="item.id"></el-tab-pane>
							</el-tabs>
						</div>
					</div>
					<!--内容-->
					<div class="mainWrapper" ref="main">
						<router-view :btnList="btnList" :key="$route.fullPath"/>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	export default {
		// 通过父组件传进不同的数据 title--标题  features--数组  bread--面包屑
		props: ['title','features', 'bread1', 'bread2', 'bread3', "showflag"],
		data () {
			return {
				activeName	: "0",
				currentIndex: 0,
				height		: {
					height: ''
				},
				br3			: this.bread3,
				subFeatures : [],
				btnList		: []
			}
		},
		mounted () {
      		this.initList();
		},
		methods: {
			// 菜单切换：同时改变按钮集合
			swatchTab (index, item) {
				this.$router.push({path: item.path, query: {code: item.code}});
				if(index != this.currentIndex){
					this.currentIndex = index;
					this.br3 = item.name;
					if(this.features){
						let feature = this.features[this.currentIndex] || {};
						console.log(feature);
						// 叶子节点
						if(feature.leaf){
							this.btnList = (feature.opts || feature.children || []).filter( (item) => {
								return item.visible == 1;
							});
						} else {
							this.subFeatures = (feature.children || []).filter( (item) => {
								return item.visible == 1;
							});
							this.activeName	= (this.subFeatures[0]||{}).id;
						}
					}
				}
			},
			handleTabClick (tab, event) {
				//console.log(tab);
				let item = this.subFeatures[tab.index];
				this.$router.push({path: item.path, query: {code: item.code}});
			},
			initList () {
				var that = this;
				this.features.map((item,index)=>{
					if(item.path == this.$route.fullPath){
						this.currentIndex = index;
					}
				});
				if(this.features){
					let feature = this.features[0] || {}
					// 叶子节点
					if(feature.leaf){
						this.btnList = (feature.opts || feature.children || []).filter( (item) => {
							return item.visible == 1;
						});
					} else {
						this.subFeatures = (feature.children || []).filter( (item) => {
							return item.visible == 1;
						});
						this.activeName	= (this.subFeatures[0]||{}).id;
					}
					// 还原
					that.features.forEach(function(feature, index, array) {
						// 叶子节点
						if(feature.leaf && feature.path === path){
							that.currentIndex = index;
						} else {
							console.log(that.subFeatures);
							that.subFeatures.forEach(function(item, index2, array) {
								if(item.path === path){
									that.currentIndex = index;
									this.activeName	= (item||{}).id;
								}
							});
						}
					});
				}
			},
			changeLocalPath (path) {
				this.currentIndex = this.features.findIndex(item => item.path === path);
      		},
		},
		watch: {
			$route (to, form) {
				let path = to.path;
				if(path=='/comprehensive_evaluate/peopleDiscussNext' || path=='/comprehensive_evaluate/peopleDiscussNext2' || path=='/scholarship-system/declarationItem' || path=='/scholarship-system/declarationColumn'){
				  return false
        }else{
          this.changeLocalPath(path);
        }
			},
			bread3 (newValue, oldValue) {
				this.br3 = newValue;
			},
			// 子组件渲染前提取当前菜单对应的按钮
			features (features, oldFeatures) {
				if(features && features.length > 0){
					let feature = features[this.currentIndex] || {}
					features.map((item,index)=>{
						if(item.path == this.$route.path){
							this.currentIndex = index;
						}
					});
					// 叶子节点
					if(feature.leaf){
						this.btnList = (feature.opts || feature.children || []).filter( (item) => {
							return item.visible == 1;
						});
					} else {
						this.subFeatures = (feature.children || []).filter( (item) => {
							return item.visible == 1;
						});
						this.activeName	= (this.subFeatures[0]||{}).id;
					}
        		}
			},
		}
	};
</script>

<style lang="scss" scoped>
	.contentBox{
		width: 100%;
		display: flex;
		box-sizing: border-box;
		height:100%;
	}
	.leftButton{
		flex: 0 0 170px ;
		width:170px;
		height: 100%;
	}
	.mainWrapper{
		flex: 1;
	}
	/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
		background-color: #fff!important;
		height: 36px;
		line-height: 36px;
		color: #868383 !important;
	}
	/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
		background: #2ebbe8 !important;
   		color: #FFFFFF!important;
	}
	/deep/ .el-tabs__header {
		margin: 0 0 5px;
	}
  .el-breadcrumb:hover {
    cursor: pointer;
  }
</style>
