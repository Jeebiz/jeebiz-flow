<template>
	<div style="padding: 24px;height:100%;">
		<div class="wrap-search">
			<el-form ref="searchForm" :model="searchForm" inline label-position="right" label-width="70px" >
				<el-form-item prop="grade">
					<el-select size="small" v-model="searchForm.roleId" clearable filterable placeholder="请选择角色">
						<el-option
						v-for="item in roleList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="status">
					<el-select size="small" v-model="searchForm.status" clearable  filterable placeholder="请选择状态">
						<el-option
						v-for="item in statusList"
						:key="item.key"
						:label="item.value"
						:value="item.key">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="name">
					<el-input size="small" v-model="searchForm.keywords" placeholder="请输入关键词" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" icon="el-icon-search" round type="primary"  @click="searchUserList()">搜索</el-button>
				</el-form-item>
			</el-form>
      	</div>
		<!-- 添加用户等等 按钮 -->
		<div class="data-change">
			<el-button size="small" round v-for="(item, index) in btnList" :key="index" @click="btnClick(index, item)">
				{{item.name}}
			</el-button>
		</div>
		<!-- 添加用户弹出框 -->
		<el-dialog :visible.sync="dialogFormVisible" width="24%" center :close-on-click-modal="false">
			<h3 style="margin-bottom:20px;">{{tableArr[title]}}</h3>
			<el-form ref="dataForm" :model="dataForm" label-width="80px" label-position = "right" :rules="rules">
				<el-form-item label="姓名" prop="alias">
					<el-input style="width:95%;" size="small" v-model="dataForm.alias" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="学工号" prop="code">
					<el-input style="width:95%;" size="small" v-model="dataForm.code" autocomplete="off" placeholder="请输入学号或工号"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input style="width:95%;" size="small" v-model="dataForm.phone" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input style="width:95%;" size="small" v-model="dataForm.email" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<!-- <el-form-item label="登录名" prop="username">
					<el-input style="width:95%;" size="small" v-model="dataForm.username" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item> -->
				<el-form-item label="默认密码" prop="password" v-show="title == 'new'">
					<el-input style="width:95%;" size="small" v-model="dataForm.password" autocomplete="off" placeholder="请输入" type="password"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="roles">
					<el-checkbox-group v-model="rolecheck" @change="handleCheckedRoleChange">
						<el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch
						v-model="dataForm.status"
						active-color="#8DD87E"
						active-value="1"
						inactive-color="#FF6666"
						inactive-value="0"
						@change="changeZt">
					</el-switch>
				</el-form-item>
				<el-form-item style="margin-left: 40px;">
					<el-button size="small" @click="closeForm" round>取消</el-button>
					<el-button size="small" @click="confirm(dataForm)" round>确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
    <el-dialog
      title="数据授权"
      :visible.sync="authorizeDialog"
      width="40%"
      center
      :close-on-click-modal="false"
      >
      <!-- <el-select v-model="qxz" placeholder="权限组" size="small" clearable filterable>
        <el-option v-for="item in qxzList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select> -->
      <el-transfer
        style="text-align: left; display: inline-block"
        filterable
        v-model="qxz"
        :titles="['可分配权限组', '已分配权限组']"
        :render-content="renderFunc"
        :data="datas"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        >
      </el-transfer>
      <span slot="footer">
        <el-button style="width: 90px;" @click="authorizeDialog = false">取 消</el-button>
        <el-button style="width: 90px;" type="primary" @click="confirmAuthorsize">确 定</el-button>
      </span>
    </el-dialog>

		<div class="data-table">
			<el-table :data="tableList"   @selection-change="handleSelectionChange" :loading="loading" size="medium" :header-cell-style="{background:'rgba(248,248,248,1)', color:'#606266'}">
				<el-table-column
				type="selection"
				width="55">
				</el-table-column>
				<el-table-column v-for="item in columns" :key="item.key" :property="item.key" :label="item.title">
				<template slot-scope="scope">
					{{scope.row[scope.column.property]}}
				</template>
				</el-table-column>
				<el-table-column label="状态" align="center" width="">
				<template slot-scope="scope">
					<el-switch
					v-model="scope.row.status"
					active-color="#8DD87E"
					active-value="1"
					inactive-color="#FF6666"
					inactive-value="0"
					@change="changeSwitch(scope.row)">
					</el-switch>
				</template>
				</el-table-column>
				<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="medium" type="text" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="medium" v-show="hasPermission('user:delete')" type="text"
          @click.native.prevent="deleteRow(scope.$index, tableList,scope.row)">删除</el-button>
					<el-button size="medium" type="text" style="color:#FFB961" @click="authorize(scope.row)">数据授权</el-button>
				</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-row class="data-pag">
				<el-col>
          <pagination :pager="pager" @query="getPagedList" @setPager="setPager"></pagination>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script >
import Pagination from "@/components/common/pagination";
import API from '@/assets/js/api/all-api';
import utils from '@/assets/js/utils';
import permissionMix from '@/mixin/permissionMix';

var validate_phone = (rule, value, callback) => {//手机号
	utils.validate_phone(rule, value, callback)
};
var validate_email = (rule, value, callback) => {//验证邮箱
	utils.validate_email(rule, value, callback)
};

export default {
	props: ['btnList','permList'],
	mixins : [permissionMix],
  	components: {
		Pagination
  	},
	data () {
		return {
			searchForm:{
				roleId	: '',
				status	: '',
				keywords: '',
			},
			roleList: [],
			// 是否启用(0:停用,1:启用)
			statusList: [{key: '0', value: '停用'}, {key: '1', value: '启用'}],
			// 表格数据
      tableList: [],
      authorizeDialog: false,
      qxz: [],
      qxzList: [],
			dataForm: {
				alias	: '',
				code	: '',
				phone	: '',
				email	: '',
				username: '',
				password: '',
				roles	: [],
				status	: '1' // 0关闭 1 开启
      		},
     	 	rolecheck: [],
			columns: [
				{
					title: '用户名称',
					key: 'alias'
				},
				{
					title: '学工号',
					key: 'username'
				},
				{
					title: '手机号',
					key: 'phone'
				},
				{
					title: '角色',
					key: 'roleName'
				}
        ],
        datas: [],
        renderFunc(h, option) {  // 穿梭框显示的格式和内容
          return <span>{ option.name }</span>;
        },
				dialogFormVisible: false,
				multipleSelection: [],
				loading: false,
				currentPage: 1,
				tableArr: {'new': '添加用户', 'renew': '编辑用户'},
				title: '',
				pager: {
					total: 0,
					pageNo: 1,//当前第几页
					limit: 10,//每页显示的条数
        },
        uid: '',
				rules: {
					alias: [
						{required: true, message: '请输入用户名称', trigger: 'blur'},
					],
					code: [
						{required: true, message: '请输入学号/教工号', trigger: 'blur'},
					],
					phone: [
						{required: true,validator:validate_phone, message: '请输入正确的手机号码', trigger: 'blur'},
						{required: true, message: '请输入手机号码', trigger: 'blur'}
					],
					email: [
						{required: true,validator:validate_email, message: '请输入正确的电子邮箱', trigger: 'blur'},
						{required: true, message: '请输入电子邮箱', trigger: 'blur'}
					],
					username: [
						{required: true, message: '请输入登录名', trigger: 'blur'},
					],
					password: [
						{required: true, message: '请输入默认密码', trigger: 'blur'},
					],
					status: [
						{required: true, message: '用户状态必选', trigger: 'change'},
					],
					roles: [
						{required: true, message: '请至少选择一个角色', trigger: 'blur'},
					]
				}
			}
		},
		created() {
			this.pager.pageNo = 1;
			this.getPagedList();
			this.getRoles();
		},
		mounted(){
		},
		methods: {
    // 数据授权
    authorize(row) {
      this.qxz = [];
      this.uid = row.id;
      this.authorizeDialog = true;
      let data = {
        uid: this.uid
      }
      API.dbpermsGroupPairs(data).then(res => {
        if(res.code == 0) {
          if(res.data) {
            this.datas = res.data;
            this.qxz = res.data.filter(item => {
              return item.checked == "1"
            }).map(item => {
              return item.id
            });
            console.log(this.datas);
            console.log(this.qxz);
          }
        }
      })
    },
    confirmAuthorsize() {
      let data = {
        groups: this.qxz,
        uid: this.uid,
        perms: [],
      }
      API.dbpermsAllotUser(data).then(res => {
        if(res.code == 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.authorizeDialog = false;
          this.getPagedList();
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
		// 添加用户的时候清空dialog内容
		clearForm () {
			var dataForm = this.dataForm;
			for(var item in dataForm) {
				dataForm[item] = '';
			}
		},
		getRoles(){
			API.getRoles().then(res=>{
				if(res.code==0){
					this.roleList = res.data;
				}
			});
		},
		handleCheckedRoleChange(value) {
			let checkedCount = value.length;
			console.log(value)
      		this.dataForm.roles = value;
		},
		/*更改页码数据*/
      	setPager (pager) {
       		this.pager.page = pager.pageNo;
        	this.pager.rows = pager.limit;
      	},
		searchUserList(){
			this.pager.pageNo = 1;
			this.getPagedList();
		},
		btnClick (index, item) {
			var that = this;
			that.rolecheck = [];
			if(item.perms == "user:new") {
				// this.clearForm();
				this.title = "new";
				this.dialogFormVisible = true;
				let dataForm = this.$refs.dataForm;
				if(dataForm){dataForm.resetFields();}
				this.rolecheck = [];
				this.dataForm = {
					alias	: '',
					code	: '',
					phone	: '',
					email	: '',
					username: '',
					password: '',
					roles	: [],
					status	: '1'
				}
			} else if(item.perms == "user:resetpwd") {
				var ids = this.multipleSelection.map((item)=>{
					return item.id;
				});
				if(ids && ids.length > 0) {
					this.$confirm('您将重置所选的用户密码, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							ids: ids.join(",")
						};
						API.resetPwd(data).then(res =>{
							if(res.code == 0 ){
								that.$message({
									message: res.msg,
									type: 'success'
								});
								window.setTimeout(function(){
									that.getPagedList();
								}, 500);
							} else {
								that.$message.error(res.msg);
							}
						})
					}).catch(() => {
						this.$message({ type: 'info', message: '已取消操作' });
					});
				} else {
					this.$message({
						message: "请选择需重置密码的用户！"
					});
				}
			} else if(item.perms == "user:delete") {
				var ids = this.multipleSelection.map((item)=>{
					return item.id;
				});
				if(ids && ids.length > 0) {
					this.$confirm('您将删除所选的用户信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							ids: ids.join(",")
						};
						API.deleteByIds(data).then(res =>{
							if(res.code == 0 ){
								that.$message({
									message: res.msg,
									type: 'success'
								});
								window.setTimeout(function(){
									that.getPagedList();
								}, 500);
							} else {
								that.$message.error(res.msg);
							}
						})
					}).catch(() => {
						this.$message({ type: 'info', message: '已取消操作' });
					});
				} else {
					this.$message({
						message: "请选择需删除的用户！"
					});
				}
			}
		},
		confirm (dataForm) {
			var that = this;
			this.dataForm.username = this.dataForm.code;   // username 传入教工号 code 值
			if(this.title === "new") {
				this.$refs.dataForm.validate((valid) => {
					if(valid) {
						API.addUser(dataForm).then(res => {
							if(res.code == 0 ){
								this.dialogFormVisible = false;
								that.$message({
									message: res.msg,
									type: 'success'
								});
								window.setTimeout(function(){
									that.getPagedList();
								}, 500);
							} else {
								that.$message.error(res.msg);
							}
						}).catch(function (error) {
							this.$message.error(res.msg);
						})
					}
				})
			} else if (this.title === "renew") {
				this.$refs.dataForm.validate(valid => {
					if(valid) {
						API.editUser(dataForm).then(res => {

							if(res.code == 0 ){
								this.dialogFormVisible = false;
								that.$message({
									message: res.msg,
									type: 'success'
								});
								window.setTimeout(function(){
									that.getPagedList();
								}, 500);
							} else {
								that.$message.error(res.msg);
							}
						}).catch(function (error) {
							this.$message.error(res.msg);
						})
					}
				})
			}
		},
		closeForm () {
			if(this.title == "new") {
				this.$nextTick(() => {
					this.$refs.dataForm.clearValidate();
					this.$refs.dataForm.resetFields();
				})
			}
			this.dialogFormVisible = false;
		},
		// 切换状态
		changeZt (option) {
			console.log(option);
		},
		// 表格全选
		handleSelectionChange (val) {
			var newArr = [];
			val.map(index => {
				newArr.push({id:index.id});
			});
			this.multipleSelection = newArr;
		},
		// switch开关
		changeSwitch (object) {

			var id=object.id;
			let data = {
				id:id,
				status:object.status,
			};
			this.loading = true;
			API.setUserStatus(data).then(res=>{
					this.$message({
					message:res.msg,
				});
			});
		},
		// 编辑 和添加用户通用一个dialog
		handleEdit (row) {
			this.dialogFormVisible = true;
			this.title = "renew";
			let dataForm = this.$refs.dataForm;
			if(dataForm){dataForm.resetFields();}
			if(row["roleId"] != null){
				this.rolecheck = row["roleId"].split(",");
			};
			this.dataForm = JSON.parse(JSON.stringify(row));
			this.dataForm.roles = this.rolecheck;
		},
		// 删除
		deleteRow (index, row,rowdata) {
			this.$confirm('您将删除本行数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				row.splice(index, 1);
				let data = {
					id:rowdata.id
				};
				API.deleteUser(data).then(res=>{
					if(res.code==0){
						that.$message({
							message: res.msg,
							type: 'success'
						});
						window.setTimeout(function(){
							that.getPagedList();
						}, 500);
					} else {
						that.$message.error(res.msg);
					}
				}).catch(function (error) {
					this.$message.error(res.msg);
				})
			}).catch(() => {
				this.$message({ type: 'info', message: '已取消删除' });
			});
		},
		doSearch() {
			this.pager.pageNo = 1;
			this.getPagedList();
		},
		/*表格分页查询*/
      	getPagedList() {
			this.tableList = [];
			let data = {
				pageNo	: this.pager.pageNo,
				limit	: this.pager.limit,
				roleId	: this.searchForm.roleId,
				status	: this.searchForm.status,
				keywords: this.searchForm.keywords,
			};
			this.loading = true;
			API.getPagedUserList(data).then(res=>{
				if(res.total != 0) {
					console.log(res);
					this.pager.total = res.total;
					this.tableList = res.rows;
				}
			}).catch(function (error) {
				that.$message.error(res.msg);
			})
      	}
    }
}
</script>

<style lang="scss" scoped>

  .data-search {
    padding-bottom: 24px;
    .el-select {
      padding-right: 24px;
      /deep/ &>.el-input {
        width: 168px;
        height: 32px;
        border-color: rgba(237,237,237,1);
      }
      /deep/ .el-input--suffix .el-input__inner {
        border-radius: 16px;
      }
    }
    /deep/ .el-button--small, .el-button--small.is-round {
      width: 90px;
      font-size: 14px!important;
    }
  }
  .data-change {
    /deep/ .el-button--small, .el-button--small.is-round {
      width: 100px;
      font-size: 14px!important;
      border-color: rgba(46,187,232,1);
      color: #2EBBE8;
      font-weight: 400;
    }
  }
  .data-table {
    padding-top: 24px;
    .el-button+.el-button {
      margin-left: 16px;
      color: red;
    }
  }
  /deep/ .el-transfer-panel {
    width: 300px;
  }
  .active {
    background: #2EBBE8;
    color: #fff!important;
  }
  .data-pag {
    margin-top: 24px;
  }
  .el-form-item__content .el-button--small {
    width: 90px;
    border-color: #2EBBE8;
  }
  /deep/ .el-input__inner {
    border-radius: 16px!important;
    border:1px solid rgba(0,0,0,0.08);
  }
  /deep/ .el-input--mini .el-input__inner {
    border-radius: 0!important;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
</style>
