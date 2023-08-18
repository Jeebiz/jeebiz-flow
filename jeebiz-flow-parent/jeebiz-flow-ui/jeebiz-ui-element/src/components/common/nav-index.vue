<template>
  <Slide
    :title="title"
    :features="features"
    :bread1="bread1"
    :bread2="bread2"
    :bread3="bread3"
    :showflag="showflag"
    style="width：100%;"
  />
</template>

<script>
import Slide from "@/components/common/nav-slide";
import API from "@/assets/js/api/all-api";
export default {
	components: {
		Slide
	},
	data() {
		return {
		title: "XX管理",
		features: [],
		bread1: "服务中心",
		bread2: "XX管理",
		bread3: "XX管理",
		showflag: 2
		};
	},
	created() {
		this.initBinding();
	},
	methods: {
		initBinding() {
			var that = this;
			that.sid = localStorage.getItem("sid");
			that.title = localStorage.getItem("name");
			API.visitService({
				id: that.sid
			}).then(res => {});
			// 先从全局缓存获取功能菜单
			var features = localStorage.getItem("features");
			let initFeatures = function(features) {
				// 检查缓存
				if (features && features.length > 0) {
					features.forEach((item, index) => {
						if (item.parent == that.sid) {
							that.title = item.name || that.title;
							that.bread2 = item.name || that.title;
							that.features = item.children || [];
							if (that.features.length > 0) {
								that.bread3 = that.features[0].name || "";
							}
							that.features.forEach(function(feature, index, array) {
								feature.path = feature.url;
							});
						}
					});
				} else {
					// 通过备用方式：接口查询
					API.getChildFeatures({
						servId: that.sid
					}).then(res => {
						if (res.code == 0) {
							let data = res.data || [];
							that.title = data.name || that.title;
							that.bread2 = data.name || that.title;
							that.features = data.children || [];

							if (that.features.length > 0) {
								that.bread3 = that.features[0].name;
							}
							that.features.forEach(function(feature, index, array) {
								feature.path = feature.url;
								// console.log(feature);
							});
						} else {
							that.$message.error(res.msg);
						}
					})
					.catch(err => {});
				}
			};
			// 查询所有的服务信息
			API.getServFeatures({}).then(res => {
				if (res.code == 0) {
					var data = res.data || [];
					localStorage.setItem("features", JSON.stringify(data));
					features = data;
					initFeatures(features);
				} else {
					that.$message.error(res.msg);
				}
			}).catch(err => {
				features = [];
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
