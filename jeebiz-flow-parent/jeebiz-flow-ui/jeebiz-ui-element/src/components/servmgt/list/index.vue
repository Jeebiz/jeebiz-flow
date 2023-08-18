<template>
  <div>
    <div style="padding: 24px;height:100%;" ref="allBox" v-show="!showForm">
      	<div class="data-search" ref="serBox">
      	<el-select size="small" v-model="role" filterable clearable placeholder="所属角色" style="margin-bottom: 16px;">
          <el-option
            v-for="item in roleList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
      	</el-select>
			<el-select size="small" v-model="category" filterable clearable placeholder="服务分类" style="margin-bottom: 16px;">
				<el-option
					v-for="item in categoryList"
					:key="item.key"
					:label="item.value"
					:value="item.key">
				</el-option>
			</el-select>
			<el-select size="small" v-model="authc" filterable clearable placeholder="认证方式" style="margin-bottom: 16px;">
				<el-option
					v-for="item in authcList"
					:key="item"
					:label="item"
					:value="item">
				</el-option>
			</el-select>

			<el-select size="small" v-model="rec" filterable clearable placeholder="是否推荐">
				<el-option
					v-for="item in recList"
					:key="item.key"
					:label="item.value"
					:value="item.key">
				</el-option>
			</el-select>
			<el-select size="small" v-model="status" filterable clearable placeholder="是否启用">
				<el-option
					v-for="item in statusList"
					:key="item.key"
					:label="item.value"
					:value="item.key">
				</el-option>
			</el-select>
      		<el-input size="small" v-model="keywords" placeholder="请输入关键词" style="width:180px;"></el-input>
      		<el-button size="small" icon="el-icon-search" round type="primary" @click="getPagedList">搜索</el-button>
      		<!-- <el-button size="small" round @click="addService">创建服务</el-button> -->
          	<el-button size="small" round v-for="(item, index) in btnList" :key="index" @click="btnClick(index, item)">
				{{item.name}}
			</el-button>
      	</div>
      	<!-- 表格的card -->
      	<div style="margin-top: 31px;">
			<el-row :gutter="24" style="min-height:500px;">
				<el-col :span="6" v-for="(item, index) in cardList" :key="index" style="margin-bottom: 24px;">
					<el-card shadow="always" :body-style="{padding:'16px'}">
						<div style="display: flex;">
							<div style="width: 64px; height: 64px;background: #2EBBE8;">
								<img :src="item.icon" width="100%">
							</div>
							<div style="padding-left: 10px;">
								<h4>{{item.name}}</h4>
							</div>
						</div>
						<div class="data-button">
							<div>
								<el-button style="font-size:16px;" v-show="hasPermission('serv:renew')" size="medium" type="text" @click="editCard(item)">编辑</el-button>
								<el-button style="font-size:16px;" size="medium" type="text" @click="deletCard(item)" v-show="item.inner == '0'">删除</el-button>
							</div>
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
					</el-card>
				</el-col>
			</el-row>
      		<!-- 分页 -->
			<el-row class="data-pag">
				<el-col>
					<pagination :pager="pager" @query="getPagedList" @setPager="setPager"></pagination>
				</el-col>
			</el-row>
      	</div>
    </div>
    <!-- 创建服务--编辑服务 -->
    <div v-show="showForm" style="padding: 24px;">
      	<div class="service-back" @click="goPre"><i class="el-icon-back"></i>返回服务管理首页</div>
		<el-row>
			<el-col :span="4">
				<div class="grid-content bg-purple">&nbsp;
					<el-tree class="filter-tree"  v-show="FormData.inner == '1'"
						node-key="id"
						ref="tree"
						:data="features"
						:props="defaultProps"
						highlight-current
						default-expand-all>
					</el-tree>
				</div>
			</el-col>
			<el-col :span="20">
				<div :class="FormData.inner == '1'? 'grid-content bg-purple-light':'grid-content bg-purple-light1'">
					<div class="service-wrap">
						<div class="service-title">{{serviceArr[title]}}</div>
						<div>
							<el-form :model="FormData" label-width="60" ref="addForm" :rules="rules" inline>
								<el-tabs v-model="activeName" @tab-click="handleClick">
									<el-tab-pane label="基础信息" name="0">

										<div class="service-basic">
											<el-form-item label="服务名称" prop="name">
												<el-input size="small" type="text" v-model="FormData.name" placeholder="请输入" @keyup.native="featureTree()"></el-input>
											</el-form-item>
											<el-form-item label="服务简称" prop="abb">
												<el-input size="small" type="text" v-model="FormData.abb" placeholder="请输入"></el-input>
											</el-form-item>
											<el-form-item label="开发厂商" prop="vendor">
												<el-input size="small" type="text" v-model="FormData.vendor" placeholder="请输入"></el-input>
											</el-form-item>
											<el-form-item label="服务分类" prop="category">
												<el-select size="small" v-model="FormData.category" placeholder="请选择">
													<el-option
														v-for="item in categoryList"
														:key="item.key"
														:label="item.value"
														:value="item.key">
													</el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="服务简介" prop="intro">
												<el-input size="small" type="textarea" v-model="FormData.intro" placeholder="请输入"></el-input>
											</el-form-item>
											<div>
												<el-form-item label="服务图标" prop="url">
													<el-upload action="#" class="avatar-uploader" list-type="picture-card"
														:show-file-list="true"
														:file-list="logoList"
														:limit="1"
														:before-upload="beforeLogoUpload"
														:http-request="uploadLogo"
														:on-success="handleLogoSuccess">
														<i class="el-icon-plus avatar-uploader-icon"></i>
													</el-upload>
												</el-form-item>
											</div>
											<el-form-item label="服务类型" prop="type">
												<el-radio-group v-model="FormData.type">
													<el-radio v-for="(item, index) in typeList" :key="index" :label="item.key">
													{{item.value}}
													</el-radio>
												</el-radio-group>
											</el-form-item>
											<div v-show="FormData.inner != '1'">
												<el-form-item label="服务地址" prop="path">
													<el-input size="small" type="text" v-model="FormData.path" placeholder="请输入"></el-input>
												</el-form-item>
											</div>
											<el-form-item label="认证方式" prop="authc" v-show="FormData.inner != '1'">
												<el-radio-group v-model="FormData.authc" @change="handleCheckedCitiesChange">
													<el-radio v-for="way in authcList" :label="way" :key="way">{{way}}</el-radio>
												</el-radio-group>
											</el-form-item>
											<div>
											<el-form-item label="推荐服务" prop="rec">
												<el-radio-group v-model="FormData.rec">
													<el-radio v-for="(item, index) in booleanList" :key="index" :label="item.id">
													{{item.name}}
													</el-radio>
												</el-radio-group>
												<!-- <el-radio v-model="FormData.radio2" label="1">是</el-radio>
												<el-radio v-model="FormData.radio2" label="2">否</el-radio> -->
											</el-form-item>
											</div>
											<el-form-item label="是否启用" prop="status">
												<el-radio-group v-model="FormData.status">
													<el-radio v-for="(item, index) in statusList" :key="index" :label="item.key">
													{{item.value}}
													</el-radio>
												</el-radio-group>
												<!-- <el-radio v-model="FormData.radio3" label="1">是</el-radio>
												<el-radio v-model="FormData.radio3" label="2">否</el-radio> -->
											</el-form-item>
										</div>
									</el-tab-pane>
									<el-tab-pane label="办事指南信息" name="1">
										<div class="service-guide">
											<el-form-item label="办理部门">
												<el-select size="small" v-model="FormData.guide.dept" filterable clearable placeholder="请选择">
													<el-option
													v-for="item in collegeList"
													:key="item.key"
													:label="item.value"
													:value="item.key">
													</el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="咨询电话">
												<el-input size="small" type="text" v-model="FormData.guide.tel" placeholder="请输入"></el-input>
											</el-form-item>
											<el-form-item label="办理地点">
												<el-input class="service-input" size="small" type="text" v-model="FormData.guide.addr" placeholder="请输入"></el-input>
											</el-form-item>
											<el-form-item label="办理模式">
												<el-radio-group v-model="FormData.guide.mode">
													<el-radio v-for="(item, index) in modelList" :key="index" :label="item.id">
													{{item.name}}
													</el-radio>
												</el-radio-group>
											</el-form-item>
											<div>
												<el-form-item label="是否收费">
													<el-radio-group v-model="FormData.guide.charge">
														<el-radio v-for="(item, index) in booleanList" :key="index" :label="item.id">
														{{item.name}}
														</el-radio>
													</el-radio-group>
												</el-form-item>
												<el-form-item label="收费代码">
													<el-input size="small" type="text" v-model="FormData.guide.sfdm" placeholder="请输入" :disabled="FormData.guide.charge == 0"></el-input>
												</el-form-item>
											</div>
											<div>
												<el-form-item label="是否开放">
													<el-radio-group v-model="FormData.guide.open">
														<el-radio v-for="(item, index) in booleanList" :key="index" :label="item.id">
														{{item.name}}
														</el-radio>
													</el-radio-group>
												</el-form-item>
												<el-form-item label="开放时间">
													<el-date-picker
														:disabled="FormData.guide.open == 0"
														size="small"
														v-model="FormData.guide.opening"
														type="daterange"
														range-separator="至"
														start-placeholder="开始日期"
														end-placeholder="结束日期">
													</el-date-picker>
												</el-form-item>
											</div>
											<div>
												<el-form-item label="承诺期限(日)">
													<el-input size="small" type="text" v-model="FormData.guide.term" placeholder="请输入"></el-input>
												</el-form-item>
											</div>
											<div>
											<el-form-item label="办事流程">
												<el-input
													type="textarea"
													autosize
													placeholder="请输入内容"
													v-model="FormData.guide.process">
												</el-input>
											</el-form-item>
											</div>
											<div>
											<el-form-item label="办事指南">
												<el-input
													type="textarea"
													autosize
													placeholder="请输入内容"
													v-model="FormData.guide.intro">
													</el-input>
											</el-form-item>
											</div>
										</div>
                    <div style="text-align: center;">
										<el-button size="small" style="width:90px" round @click="goPre">取消</el-button>
										<el-button size="small" style="width:90px" round @click="confirm(FormData)">保存</el-button>
									</div>
									</el-tab-pane>
									</el-tabs>

								</el-form>
							</div>
						</div>
					</div>
			</el-col>
		</el-row>
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
				activeName	: '0',
				uploadURL   : "",
				role		: '',
				category	: '',
				authc		: '',
				status		: '',
				rec			: '',
				keywords	: '',
				showForm    : false,
				serviceArr	: {add: '创建服务', edit: '编辑服务'},
				title		: '',
				isOpen		: false,
				logoList	: [],
				picList		: [],
				metList		: [],
				roleList	: [],
				cardList	: [],
				categoryList: [],
				// radio单选框的列表
				typeList: [
					{
						key: '0',
						value: '网页'
					},{
						key: '1',
						value: '网页+移动（iOS、Android、H5、小程序）'
					}
				],
				// 是否推荐(0:不推荐,1:推荐)
				recList	: [{key: '0', value: '不推荐'}, {key: '1', value: '推荐'}],
				// 是否启用:0:停用,1:启用
				statusList	: [{key: '0', value: '停用'}, {key: '1', value: '启用'}],
				// 认证方式
				authcList	: ["CAS","HTTP","JWT","KISSO","LDAP","OAUTH2","OPENID","SMAL"],
				// 是否列表
				booleanList	: [{id: '1', name: '是'}, {id: '0', name: '否'}],
				modelList	: [{id: '1', name: '线上'}, {id: '2', name: '线下'}, {id: '3', name: '线上线下结合'}],
				openList	: [{id: '1', name: '开放'}, {id: '2', name: '定期开放'}, {id: '3', name: '不定期开放'}],
				collegeList : [],
				// 创建服务的表单
				FormData	: {
					id		: '', 	// 服务ID
					icon	: '', 	// 服务图标路径
					name	: '',	// 服务名称
					abb		: '',	// 服务简称
					intro	: '',  	// 服务简介
					vendor	: '',  	// 开发厂商
					path	: '',	// 服务地址/路由
					authc	: 'JWT',// 认证方式：CAS、HTTP、JWT、KISSO、LDAP、OAUTH2、OPENID、SMAL
					type	: '1',	// 服务类型(0:网页、1:网页+移动（iOS、Android、H5、小程序） )
					category: '',	// 服务类别
					rec		: '0',	// 是否推荐(0:不推荐,1:推荐)
					status	: '0',	// 是否启用(0:停用,1:启用)
					order	: '0',	// 服务显示顺序
					tags	: [],	// 服务标签
					// 服务指南
					guide	: {
						dept	: '',	// 办理部门
						sfdm	: '',	// 收费代码
						leading	: '',	// 负责人
						tel		: '',	// 咨询电话
						addr	: '',	// 办理地点
						term	: '',	// 承诺期限(工作日)
						mode	: '',	// 办理模式
						process	: '', 	// 办事流程
						opening	: '',	// 开放时间
						intro	: ''	// 业务介绍
					}
				},
				pager: {
					total: 1,
					pageNo: 1,//当前第几页
					limit: 12,//每页显示的条数
				},
				rules: {
					name: [
						{ required: true, message: '请输入服务名称', trigger: ['blur', 'change']},
						{ required: true, pattern: REGEXP.word_cn, message: '服务名称只允许输入汉字', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '服务名称长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
					],
					abb: [
						{ required: true, message: '请输入服务简称', trigger: ['blur', 'change'] },
						{ required: true, pattern: REGEXP.word_cn, message: '服务简称只允许输入汉字', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '服务简称长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
					],

					intro: [
						{ required: true, message: '请输入服务简介', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '服务简介长度在 3 到 200 个字符', trigger: ['blur', 'change'] }
					],
					url: [
						{ required: true, message: '请选择服务图标', trigger: ['blur', 'change'] },
					],
					vendor: [
						{ required: true, message: '请输入开发厂商信息', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '开发厂商长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
					],
					category: [
						{ required: true, message: '请选择服务分类', trigger: ['blur', 'change'] }
					],
					path: [
						{ required: true, message: '请输入服务地址', trigger: ['blur', 'change'] },
						{ minlength: 3, maxlength: 20, message: '服务地址长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
					],
					type: [
						{ required: true, message: '请选择服务类型', trigger: ['blur', 'change'] },
					],
					authc: [
						{ required: true, message: '请选择认证方式', trigger: ['blur', 'change'] }
					],
					rec: [
						{ required: true, message: '请选择是否推荐', trigger: 'change'}
					],
					status: [
						{ required: true, message: '请选择是否启用', trigger: 'change'}
					],
					order: [
						{ required: true, message: '请输入分类排序', trigger: ['blur', 'change']},
						{ minlength: 1, maxlength: 3, message: '必须是长度在 1 到 3 个字符的数字', trigger: ['blur', 'change'] },
						{ required: true, pattern: REGEXP.cnumber, message: '排序必须为数字值', trigger: 'blur'}
					]
				},
				currentPage: 1,
				checkedList: [],
				filterText: '',
				features: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
    },
    created () {
			this.initList();
			this.getPagedList();
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
    },
    methods: {

			initList(){
				var that = this;
				API.getRolePairs({}).then(res => {
					if (res.code == 0 ) {
						that.roleList = [].concat(res.data || []) ;
					} else {
							that.$message.error(res.msg);
					}
				}).catch(err => {})
				API.getServCategorys({}).then(res => {
					if (res.code == 0 ) {
						that.categoryList = [].concat(res.data || [])  ;
					} else{
							that.$message.error(res.msg);
					}
				}).catch(err => {})
				let val = {
					dwlbm: '1'
					};
        API.getCollegePairs(val).then(res => {
					if (res.code == 0 ) {
						that.collegeList = res.data || [] ;
					} else{
							that.$message.error(res.msg);
					}
				}).catch(err => {})
			},
			// 回到首页
			goPre () {
				this.showForm = false;
			},
			handleClick (tab) {
				console.log(tab.name)
			},
			btnClick (index, item) {
				var that = this;
				that.activeName = '0';
				// 创建服务
				if(item.perms == "serv:new") {
					this.title = "add";
					this.showForm = true;
					let addForm = this.$refs.addForm;
					if(addForm){addForm.resetFields();}
					that.features =  [];
					this.FormData =  {
						id		: '', 	// 服务ID
						icon	: '', 	// 服务图标路径
						name	: '',	// 服务名称
						abb		: '',	// 服务简称
						intro	: '',  	// 服务简介
						vendor	: '',  	// 开发厂商
						path	: '',	// 服务地址/路由
						authc	: 'JWT',// 认证方式：CAS、HTTP、JWT、KISSO、LDAP、OAUTH2、OPENID、SMAL
						type	: '1',	// 服务类型(0:网页、1:网页+移动（iOS、Android、H5、小程序） )
						category: '',	// 服务类别
						inner	: '0',	// 是否内部服务
						rec		: '0',	// 是否推荐(0:不推荐,1:推荐)
						status	: '0',	// 是否启用(0:停用,1:启用)
						order	: '0',	// 服务显示顺序
						tags	: [],	// 服务标签
						// 服务指南
						guide	: {
							dept	: '',	// 办理部门
							charge	: '0',	// 是否收费
							sfdm	: '',	// 收费代码
							leading	: '',	// 负责人
							tel		: '',	// 咨询电话
							addr	: '',	// 办理地点
							term	: '',	// 承诺期限(工作日)
							mode	: '',	// 办理模式
							process	: '', 	// 办事流程
							opening	: '',	// 开放时间
							intro	: ''	// 业务介绍
						}
					};
					that.logoList = [];
				}
			},
			featureTree() {
				if (this.title == "add") {
					this.features =  [{
						id 			: '0',
						name		: this.FormData.name,
						children 	: []
					}];
				}
			},
			// 保存
			confirm (data) {
				var that = this;
				let addForm = this.$refs.addForm;
				addForm.validate(valid => {
					if(valid) {
						data.icon = data.url;
						if (this.title == "add") {
							// 创建服务信息
							API.newServ(data).then(res => {
								if (res.code == 0 ) {
									this.$message({
										message: res.msg,
										type: 'success',
										duration: 1000
									});
									that.showForm = false;
									window.setTimeout(function(){
										that.getPagedList();
									},1000);
								} else{
									that.$message.error(res.msg);
								}
							}).catch(err => {
							})
						}
						else if (this.title == "edit") {
							// 修改服务信息
							API.renewServ(data).then(res => {
								if (res.code == 0 ) {
									this.$message({
										message: res.msg,
										type: 'success',
										duration: 1000
									});
									that.showForm = false;
									window.setTimeout(function(){
										that.getPagedList();
									},1000);
								} else{
									that.$message.error(res.msg);
								}
							}).catch(err => {
							})
						}
					}
				});
			},
			// 点击上传图标
			uploadLogo(data) {
				var that = this;
				let file = data.file;
				const formData = new FormData();
				formData.append("files",file);
				API.uploadFiles(formData).then(res => {
					var fileList = res.data || [];
					fileList.forEach(item => {
						console.log(item);
						that.FormData.icon = item.path;
						that.FormData.url = item.url;
						console.log(that.FormData.url)
					})
				}).catch(err => {})
			},
			// 上传图片
			handleLogoSuccess (file, picList) {
				console.log(file, picList);
			},
			// 上传材料
			beforeLogoUpload (file, metList) {
				const isImg = file.type.indexOf('image') != -1;
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isImg) {
					this.$message.error('只能选择图片上传！');
				}
				if (!isLt2M) {
					this.$message.error('图片大小不能超过 2MB!');
				}
				return isImg && isLt2M;
			},
			// 认证方式checkBox
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				//this.checkAll = checkedCount === this.authcList.length;
			},
			editCard (item) {
				var that = this;
				that.activeName = '0';
				this.title = "edit";
				this.showForm = true;
				let addForm =this.$refs.addForm;
				if(addForm){
					addForm.resetFields();
				}
				this.FormData = JSON.parse(JSON.stringify(item));
				console.log(this.FormData);
				this.FormData.order = this.FormData.order + "";
				this.FormData.url = this.FormData.icon;

				that.logoList = [{name: 'food.jpg', url: this.FormData.icon}];

				//API.getFilesByPath()

				// 通过备用方式：接口查询
				API.getChildFeatures({
					"servId" : item.id
				}).then(res => {
					if (res.code==0 ) {
						let data = res.data || {};
						data.id = data.id || '0';
						data.name = data.name || that.FormData.name;
						data.label = data.label || that.FormData.name;
						data.abb = data.abb || that.FormData.abb;
						data.children = data.children || [];
						that.features =  [data];
					} else{
						that.$message.error(res.msg);
					}
				}).catch(err => {
				})
			},
			deletCard (item) {
				var that = this;
				// 删除服务信息
				API.deleteServ({
					"id" 		: item.id
				}).then(res => {
					if (res.code == 0 ) {
						this.$message({
							message: res.msg,
							type: 'success',
							duration: 1000
						});
						window.setTimeout(function(){
							that.getPagedList();
						},500)
					} else{
						that.$message.error(res.msg);
					}
				}).catch(err => {
				})
			},
			// switch改变状态
			changeZt(item) {
				var that = this;
				// 更新服务状态
				API.setServStatus({
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
			/*更改页码数据*/
			setPager(pager) {
        this.pager = pager;
			},
			// 获取列表
			getPagedList () {
		  	var that = this;
				// 查询常用服务信息
				API.getPagedServList({
					"limit" 	: that.pager.limit,
					"pageNo" 	: that.pager.pageNo,
					"jsId"		: that.role || "",
					"category"	: that.category || "",
					"authc"		: that.authc || "",
					"rec"		: that.rec || "",
					"status"	: that.status || "",
					"keywords"	: that.keywords || ""
				}).then(res => {
					console.log(res);
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
		getCheckedNodes() {
			console.log(this.$refs.tree.getCheckedNodes());
		},
		getCheckedKeys() {
			console.log(this.$refs.tree.getCheckedKeys());
		}
	}
}
</script>

<style lang="scss" scoped>

	/deep/ .bg-purple-light {
		border-left: 2px dashed #ccc;
		padding-left: 15px;
	}

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

  .service-back {
    width: 200px;
    color: #2EBBE8;
    margin-bottom: 24px;
    &:hover {
      cursor: pointer;
    }
  }
  .service-wrap {
    width: 80%;
    .service-title {
      margin-top: 24px;
      margin-bottom: 24px;
      font-weight: 600;
      text-align: center;
      font-size: 18px;
    }
    .service-info {
      margin-bottom:17px;
      border-left:4px solid #2EBBE8;
      padding-left:10px;
      font-size:16px;
      font-weight:600;
    }
    /deep/ .el-form--inline .el-form-item__label {
      font-weight: 540;
    }
    .el-form--inline .el-form-item {
      margin-right: 32px;
    }
    /deep/ .el-input--small .el-input__inner {
      width: 312px!important;
    }
    .service-basic {
      display: inline-block;
    }
    /deep/ .service-input .el-input__inner {
      width: 312px!important;
    }
    /deep/ .el-textarea__inner {
      width: 312px;
      border-radius: 0;
      height: 90px!important;
    }
  }
  	.addr /deep/ .el-input__inner {
	  width: 312px!important;
  }
   /deep/ .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
	width: 64px;
    height: 64px;
	line-height: 64px;
  }
/deep/ .el-upload-list__item-actions{
	   width: 64px;
    height: 64px;
 }
  /deep/ .el-upload-list__item{
	   width: 64px;
    height: 64px;
 }



  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 64px;
    height: 64px;
    line-height: 64px;
    text-align: center;
  }
  .avatar {
    width: 64px;
    height: 64px;
    display: block;
  }
</style>
