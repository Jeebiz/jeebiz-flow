<template>
  <div>
     <div style="padding: 24px;height:100%;">
      	<div class="data-search" ref="serBox">
			<el-select size="small" v-model="status" filterable clearable placeholder="状态">
				<el-option
				v-for="item in statusList"
				:key="item.key"
				:label="item.value"
				:value="item.key">
				</el-option>
			</el-select>
			<el-input size="small" v-model="keywords" placeholder="请输入关键词" style="width:180px;"></el-input>
			<el-button size="small" icon="el-icon-search" round type="primary" @click="getPageList">搜索</el-button>
      	</div>
      	<div class="data-change">
      		<!-- <el-button size="small" round @click="addSort">创建分类</el-button> -->
          	<el-button size="small" round v-for="(item, index) in btnList" :key="index" @click="btnClick(index, item)">
				{{item.name}}
			</el-button>
      	</div>
      	<!-- 表格的card -->
      	<div style="margin-top: 31px;">
			<el-row :gutter="24" style="min-height:500px;">
				<el-col :span="6" v-for="(item, index) in cardList" :key="index" style="margin-bottom: 24px;">
					<el-card shadow="always" :body-style="{padding:'16px'}">
						<div style="display: flex;justify-content:space-between;">
							<div>
								<h4>{{item.name}}</h4>
							</div>
              <div>
                <el-switch
								v-model="item.status"
								active-value="1"
								inactive-value="0"
								active-color="#13ce66"
								inactive-color="#ff4949"
								@change="changeZt(item)"
							>
							</el-switch>
              </div>
						</div>
						<div class="data-button">
							<div>
								<el-button v-show="hasPermission('serv-category:renew')" style="color: #2EBBE8;font-size:16px;" size="medium" type="text" @click="editCard(item)">编辑</el-button>
								<el-button style="color: #FF6666;font-size:16px;" size="medium" type="text" @click="deletCard(item)" v-show="item.type == 2">删除</el-button>
							</div>

						</div>
					</el-card>
				</el-col>
			</el-row>

			<!-- 分页 -->
			<el-row class="data-pag">
				<el-col>
					<pagination :pager="pager" @query="getPageList" @setPager="setPager"></pagination>
				</el-col>
			</el-row>
      	</div>

		<!-- 创建分类弹出框 -->
      	<el-dialog :visible.sync="dialogFormVisible" width="24%" center :title="sortArr[title]" :close-on-click-modal="false">
			<el-form ref="addForm" :model="addForm" label-width="80px" label-position = "right" :rules="rules">
				<el-form-item label="分类编码" prop="code">
					<el-input style="width:95%;" size="small" v-model="addForm.code" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input style="width:95%;" size="small" v-model="addForm.name" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="status">
					<el-switch v-model="addForm.status"
						active-color="#8DD87E"
						active-value="1"
						inactive-color="#FF6666"
						inactive-value="0"
					/>
				</el-form-item>
				<el-form-item label="分类排序" prop="order">
					<el-input style="width:95%;" size="small" v-model="addForm.order" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item style="margin-left:-90px;text-align:center;">
					<el-button size="small" style="width:90px;border:1px solid #2EBBE8;color:#2EBBE8;" @click="dialogFormVisible = false" round>取消</el-button>
					<el-button size="small" style="width:90px;border:1px solid #2EBBE8;color:#2EBBE8;" @click="confirm(addForm)" round>确定</el-button>
				</el-form-item>
			</el-form>
    	</el-dialog>
    </div>
  </div>
</template>

<script>
  	import Pagination from '@/components/common/servicePagination'
	import API from '@/assets/js/api/all-api';
  import REGEXP from '@/assets/js/validation/regexp';
  import permissionMix from '@/mixin/permissionMix';
  	export default {
      props: ['btnList'],
      mixins : [permissionMix],
     	components: {
      		Pagination
    	},
    	data () {
      		return {
				status		: '',
				keywords	: '',
				sortArr		: {add: '创建分类', edit: '编辑分类'},
				title		: '',
				dialogFormVisible: false,
				// 是否启用:0:停用,1:启用
				statusList	: [{key: '0', value: '停用'}, {key: '1', value: '启用'}],
				cardList	: [],
				addForm: {
					id		: '',
					code	: '',
					name	: '',
					status	: '1',
					order	: '0'
				},
				pager: {
					total: 1,
					pageNo: 1,//当前第几页
					limit: 12,//每页显示的条数
				},
				rules: {
					code: [
						{ required: true, message: '请输入分类编码', trigger: ['blur', 'change'] },
						{ required: true, pattern: REGEXP.char_num, message: '分类编码必须是数字+字母组合', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
					],
					name: [
						{ required: true, message: '请输入分类名称', trigger: ['blur', 'change']},
						{ required: true, pattern: REGEXP.word_cn, message: '分类名称只允许输入汉字', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '分类名称长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
					],
					status: [
						{ required: true, message: '请选择是否启用', trigger: 'change'}
					],
					order: [
						{ required: true, message: '请输入分类排序', trigger: ['blur', 'change']},
						{ minlength: 1, maxlength: 3, message: '必须是长度在 1 到 3 个字符的数字', trigger: ['blur', 'change'] },
						{ required: true, pattern: REGEXP.cnumber, message: '排序必须为数字值', trigger: 'blur'}
					]
				}
      		}
		},
		created () {
			this.getPageList();
		},
		methods: {
			// 按钮事件
			btnClick (index, item) {
				var that = this;
				// 创建分类
				if(item.perms == "serv-category:new") {
					this.title = "add";
					this.dialogFormVisible = true;
					let addForm = this.$refs.addForm;
					if(addForm){
						addForm.resetFields();
					}
					this.addForm = {
						code	: '',
						name	: '',
						status	: '1',
						order	: '0'
					}
				}
			},
			// 编辑改变switch状态
			changeZt (item) {
				var that = this;
				// 更新服务分类状态
				API.setServCategoryStatus({
					"id" 		: item.id,
					"status" 	: item.status,
				}).then(res => {
					if (res.code == 0 ) {
						this.$message({
							message: res.msg,
              type: 'success',
              duration: 1000
						});
					} else{
						that.$message.error(res.msg);
					}
				}).catch(err => {
				})
			},
			// 确定创建分类
			confirm (data) {
				var that = this;
				let addForm = this.$refs.addForm;
				addForm.validate(valid => {
					if(valid) {
						if (this.title == "add") {
							// 创建服务分类
							API.newServCategory({
								"code" 		: that.addForm.code,
								"name" 		: that.addForm.name,
								"status" 	: that.addForm.status,
								"order" 	: that.addForm.order
							}).then(res => {
								if (res.code == 0 ) {
									this.$message({
										message: res.msg,
                    type: 'success',
                    duration: 1000
									});
									this.dialogFormVisible = false;
									window.setTimeout(function(){
										that.getPageList();
									},500);
								} else{
									that.$message.error(res.msg);
								}
							}).catch(err => {
							})
						}
						else if (this.title == "edit") {
							// 修改服务分类
							API.renewServCategory({
								"id" 		: that.addForm.id,
								"code" 		: that.addForm.code,
								"name" 		: that.addForm.name,
								"status" 	: that.addForm.status,
								"order" 	: that.addForm.order
							}).then(res => {
								if (res.code == 0 ) {
									this.$message({
										message: res.msg,
                    type: 'success',
                    duration: 1000
									});
									this.dialogFormVisible = false;
									window.setTimeout(function(){
										that.getPageList();
									},500);
								} else{
									that.$message.error(res.msg);
								}
							}).catch(err => {
							})
						}
					}
				});
			},
			// 编辑
			editCard (data) {
				this.title = "edit";
				this.dialogFormVisible = true;
				let addForm =this.$refs.addForm;
				if(addForm){
					addForm.resetFields();
				}
				this.addForm = JSON.parse(JSON.stringify(data));
				this.addForm.order = this.addForm.order + "";
			},
			deletCard (item) {
				var that = this;
				// 删除服务分类状态
				API.deleteServCategory({
					"id" 		: item.id
				}).then(res => {
					if (res.code == 0 ) {
						this.$message({
							message: res.msg,
              type: 'success',
              duration: 1000
						});
						window.setTimeout(function(){
							that.getPageList();
						},500)
					} else{
						that.$message.error(res.msg);
					}
				}).catch(err => {
				})
			},
			/*更改页码数据*/
			setPager(pager) {
				this.pager = pager;
				this.getPageList();
			},
			// 获取列表
			getPageList () {
				var that = this;
				// 查询常用服务信息
				API.getServCategoryList({
					"limit" 	: that.pager.limit,
					"pageNo" 	: that.pager.pageNo,
					"status"	: that.status || "",
					"keywords"	: that.keywords || ""
				}).then(res => {
					if (res.code == 0 ) {
						that.currentPage = res.current || res.currentPage;
						that.pager = {
							total: res.total,
							pageNo: res.current,//当前第几页
							limit: res.size,//每页显示的条数
						};
						that.cardList = res["rows"] || [];
						that.cardList.forEach(function(item, index){

							// {title: '你好',status: '1', name: '你也好', id: '0'},

					});
					} else{
						that.$message.error(res.msg);
					}
				}).catch(err => {
				})

			},
		}
  	}
</script>

<style lang="scss" scoped>
  /deep/ .el-input__inner {
    border-radius: 16px!important;
    border:1px solid rgba(0,0,0,0.08);
  }
  .data-change {
  /deep/ .el-button--small, .el-button--small.is-round {
      width: 90px;
      font-size: 14px!important;
      border-color: rgba(46,187,232,1);
      color: #2EBBE8;
      font-weight: 400;
  }
  }
  .data-button {
    padding-top:30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }


  /deep/ .el-pagination__editor.el-input .el-input__inner {
  border-radius: 0!important;
}
</style>
