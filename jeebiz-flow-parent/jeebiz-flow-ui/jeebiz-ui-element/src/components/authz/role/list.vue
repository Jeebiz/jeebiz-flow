<template>
  <div style="padding: 24px;height:100%;" ref="allBox">
    <div class="wrap-search">
      <el-form
        ref="searchForm"
        :model="searchForm"
        inline
        label-position="right"
        label-width="70px"
      >
        <el-form-item prop="status">
          <el-select size="small" v-model="searchForm.status" clearable filterable placeholder="状态">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input size="small" v-model="searchForm.name" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" round type="primary" @click="doSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-change" ref="addBox">
      <el-button
        size="small"
        round
        v-for="(item, index) in btnList"
        :key="index"
        @click="btnClick(index, item)"
      >{{item.name}}</el-button>
    </div>
    <!-- 添加角色弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="24%" center :close-on-click-modal="false">
      <h3 style="margin-bottom:20px;">{{tableArr[title]}}</h3>
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            style="width:95%;"
            size="small"
            v-model="addForm.name"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="intro">
          <el-input
            type="textarea"
            style="width:95%;"
            size="small"
            v-model="addForm.intro"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="addForm.status"
            active-color="#8DD87E"
            active-value="1"
            inactive-color="#FF6666"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否受限" prop="restrict">
          <el-switch
            v-model="addForm.restrict"
            active-color="#8DD87E"
            active-value="1"
            inactive-color="#FF6666"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item style="margin-left: 40px;">
          <el-button size="small" @click="dialogFormVisible = false" round>取消</el-button>
          <el-button size="small" @click="confirm(addForm)" round>确定</el-button>
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
      <div style="margin: 16px 0;font-weight: 550;">特殊权限: </div>
      <el-checkbox-group v-model="tsqx">
        <el-checkbox
          v-for="item in tsqxList"
          :key="item.id"
          :label="item.id"
          >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer">
        <el-button style="width: 90px;" @click="authorizeDialog = false">取 消</el-button>
        <el-button style="width: 90px;" type="primary" @click="confirmAuthorsize">确 定</el-button>
      </span>
    </el-dialog>

    <div class="data-table">
      <el-table
        :data="tableList"
        @selection-change="handleSelectionChange"
        :loading="loading"
        size="medium"
        :header-cell-style="{background:'rgba(248,248,248,1)', color:'#606266'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.key"
          :property="item.key"
          :label="item.title"
        >
          <template slot-scope="scope">{{scope.row[scope.column.property]}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" width>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#8DD87E"
              active-value="1"
              inactive-color="#FF6666"
              inactive-value="0"
              @change="changeSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button
              v-show="hasPermission('role:renew')"
              size="medium"
              type="text"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-show="hasPermission('role:allot')"
              size="medium"
              type="text"
              @click="allocateUser(scope.row)"
            >分配用户</el-button>
            <el-button
              v-show="hasPermission('role:perms')"
              size="medium"
              type="text"
              @click="doPerms(scope.row)"
            >服务授权</el-button>
            <el-button
              size="medium"
              type="text"
              v-if="(scope.row.type != '1') && hasPermission('role:delete')"
              @click.native.prevent="deleteRow(scope.row.id)"
            >删除</el-button>
            <el-button
              size="medium"
              type="text"
              style="color: #FFB961;"
              @click="authorize(scope.row)"
            >数据授权</el-button>
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
    <!-- 分配用户弹出框 -->
    <div class="data-dialog">
      <el-dialog
        :visible.sync="dialogHid"
        title="分配用户"
        width="60%"
        left
        :close-on-click-modal="false"
      >
        <el-form
          ref="searchForm"
          :model="searchForm"
          inline
          label-position="right"
          label-width="70px"
        >
          <el-form-item label="年级" prop="grade">
            <el-select
              size="small"
              v-model="searchForm.grade"
              clearable
              placeholder="请选择"
              style="width:170px"
            >
              <el-option
                v-for="item in gradeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院" prop="college">
            <el-select
              size="small"
              v-model="searchForm.college"
              filterable
              clearable
              placeholder="请选择"
              style="width:170px;"
              @change="onCollegeChanged"
            >
              <el-option
                v-for="item in collegeList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-select
              size="small"
              v-model="searchForm.major"
              filterable
              clearable
              placeholder="请选择"
              style="width:170px"
              @change="onMajorChanged"
            >
              <el-option
                v-for="item in majorList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="class">
            <el-select
              size="small"
              v-model="searchForm.class"
              filterable
              clearable
              placeholder="请选择"
              style="width:170px"
            >
              <el-option
                v-for="item in classList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="class">
            <el-select
              size="small"
              v-model="searchForm.yhlx"
              filterable
              clearable
              placeholder="请选择"
              style="width:170px"
            >
              <el-option
                v-for="item in yhlxList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字" prop="name">
            <el-input
              style="width:170px"
              size="small"
              v-model="searchForm.searchKey"
              autocomplete="off"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              icon="el-icon-search"
              round
              type="primary"
              @click="getPagedUserList()"
            >搜索</el-button>
          </el-form-item>
        </el-form>

        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="allocatedList"
          :data="userList"
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :titles="['可分配用户', '已分配用户']"
          :button-texts="['到左边', '到右边']"
          :format="{
						noChecked: '总共${total}',
						hasChecked: '总共${checked}/${total}'
					}"
          @change="handleChange"
        >
          <!-- <pagination class="transfer-footer" slot="left-footer"
              :pager="pager1" @query="getPagedUserList" @setPager="setPager1">
            </pagination>
            <pagination class="transfer-footer" slot="right-footer"
              :pager="pager2" @query="getPagedUserList" @setPager="setPager2">
          </pagination>-->
        </el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button type="success" style="width:90px;" size="small" round @click="confirmw">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 服务授权弹出框 -->
    <div class="data-dialog">
      <el-dialog
        :visible.sync="dialogShow"
        title="服务授权"
        width="60%"
        left
        :close-on-click-modal="false"
      >
        <!-- 使用树形穿梭框组件: https://www.npmjs.com/package/el-tree-transfer -->
        <tree-transfer
          :title="transferTitle"
          :button_text="transferBtns"
          :from_data="featureTree"
          :to_data="authorizedTree"
          :defaultProps="transferProps"
          :defaultCheckedKeys="transferKeys"
          :defaultTransfer="true"
          :pid="transferPid"
          :mode="transferMode"
          @addBtn="toRight"
          @removeBtn="toLeft"
          height="540px"
          filter
        ></tree-transfer>
        <span slot="footer">
          <el-button
            type="success"
            icon="el-icon-check"
            style="width:90px;"
            size="small"
            round
            @click="dialogShow = false"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import API from "@/assets/js/api/all-api";
import Pagination from "@/components/common/pagination";
import TreeTransfer from "el-tree-transfer";
import permissionMix from "@/mixin/permissionMix";

export default {
  props: ["btnList"],
  mixins: [permissionMix],
  components: {
    Pagination,
    TreeTransfer
  },
  data() {
    return {
      searchForm: {
        status: "",
        name: ""
      },
      tsqx: [],
      tsqxList: [],
      datas: [],
      renderFunc(h, option) {  // 穿梭框显示的格式和内容
        return <span>{ option.name }</span>;
      },
      // 是否启用(0:停用,1:启用)
      statusList: [{ key: "0", value: "停用" }, { key: "1", value: "启用" }],
      dialogFormVisible: false,
      multipleSelection: [],
      loading: false,
      tableArr: { new: "添加角色", renew: "编辑角色" },
      yhlxList: [{ key: "1", value: "学生" }, { key: "2", value: "教职工" }],
      title: "",
      dialogHid: false,
      dialogShow: false,
      pager: {
        total: 0,
        pageNo: 1, //当前第几页
        limit: 10 //每页显示的条数
      },
      pager1: {
        total: 1,
        pageNo: 1, //当前第几页
        limit: 10000 //每页显示的条数
      },
      pager2: {
        total: 1,
        pageNo: 1, //当前第几页
        limit: 10000 //每页显示的条数
      },

      // switValue: '',
      // 添加角色
      addForm: {
        name: "",
        intro: "",
        status: "1",
        restrict: "0"
      },
      //  表格里的内容
      tableList: [],
      columns: [
        {
          title: "角色名称",
          key: "name"
        },
        {
          title: "用户数",
          key: "users"
        },
        {
          title: "角色描述",
          key: "intro"
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        intro: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
        status: [{ required: true, message: "必选", trigger: "change" }]
      },
      authorizeDialog: false,
      qxz: [],
      qxzList: [],
      collegeList: [],
      majorList: [],
      gradeList: [],
      classList: [],
      roleId: "",
      userList: [],
      allocatedList: [],
      transferTitle: ["可用服务及功能", "已授权服务及功能"],
      transferMode: "transfer", // transfer addressList
      transferPid: "parent",
      transferProps: { label: "name" },
      transferBtns: ["功能授权", "取消授权"],
      transferKeys: [],
      featureTree: [],
      authorizedTree: [],
      authorizedPerms: [],
      rid: '',
    };
  },
  created() {
    this.getPagedList();
  },
  methods: {
    specialPairs(id) {
      let data = {
        rid: id
      }
      API.specialRolePairs(data).then(res => {
        if(res.code == 0) {
          this.tsqxList = res.data || [];
          this.tsqxList.forEach(item => {
            if(item.checked == '1') {
              this.tsqx.push(item.id);
            }
          })
        }
      }).catch(err => {})
    },
    // 数据授权
    authorize(row) {
      this.tsqx = [];
      this.specialPairs(row.id)
      this.qxz = [];
      this.rid = row.id;
      this.authorizeDialog = true;
      let data = {
        rid: this.rid
      }
      API.groupRolePairs(data).then(res => {
        if(res.code == 0) {
          if(res.data) {
            this.datas = res.data;
            this.qxz = this.datas.filter(item => {
              return item.checked == "1"
            }).map(item => {
              return item.id
            });
          }
        }
      })
    },
    confirmAuthorsize() {
      let data = {
        groups: this.qxz,
        rid: this.rid,
        perms: [],
        specials: this.tsqx
      }
      API.dbpermsAllotRole(data).then(res => {
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
    confirmw() {
      this.dialogHid = false;
      this.getPagedList();
    },

    filterMethod(query, item) {
      console.log(query, item, "ba");
    },

    // 操作
    btnClick(index, item) {
      var that = this;
      if (item.perms == "role:new") {
        this.dialogFormVisible = true;
        this.title = "new";
        this.addForm = { status: "1" };
      } else if (item.perms == "role:delete") {
        //批量删除
        let that = this;
        if (that.multipleSelection.length === 0) {
          that.$message("请选择角色!");
        } else {
          let ids = [];
          that.multipleSelection.forEach((item, index, arr) => {
            if (item.type == "1") {
              //判断类型为默认,不可删除
              that.$message("默认角色信息不可删除!");
              ids = [];
              return;
            } else {
              ids.push(item.id);
            }
          });
          if (ids.length > 0) {
            this.$confirm("您将删除所选的角色信息, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                API.batchDelRole(ids)
                  .then(res => {
                    if (res.code == 0) {
                      that.$message({
                        message: res.msg,
                        type: "success"
                      });
                      window.setTimeout(function() {
                        that.getPagedList();
                      }, 500);
                    } else {
                      that.$message.error(res.msg);
                    }
                  })
                  .catch(function(error) {
                    that.$message.error(res.msg);
                  });
              })
              .catch(() => {
                this.$message({ type: "info", message: "已取消操作" });
              });
          }
        }
      }
      if (index === 3) {
        this.dialogShow = true;
      }
    },
    /*更改页码数据*/
    setPager(pager) {
      this.pager = pager;
    },
    setPager1(pager) {
      this.pager1 = pager;
    },
    setPager2(pager) {
      this.pager2 = pager;
    },
    /** 学院下拉框监听 */
    onCollegeChanged(value) {
      var that = this;
      this.searchForm.major = "";
      if (value) {
        API.getMajorPairs(value)
          .then(res => {
            if (res.code == 0) {
              that.majorList = res.data || [];
              that.classList = [];
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(err => {});
      } else {
        that.majorList = [];
        that.classList = [];
      }
    },
    /** 专业下拉框监听 */
    onMajorChanged(value) {
      var that = this;
      if (value) {
        API.getClassPairs(value)
          .then(res => {
            if (res.code == 0) {
              that.classList = res.data || [];
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(err => {});
      } else {
        that.classList = [];
      }
    },
    // 数据分页查询
    handleSelectionChange(val) {
      // 表格全选
      var newArr = [];
      val.map(index => {
        newArr.push({ id: index.id, type: index.type });
      });
      this.multipleSelection = newArr;
    },
    doSearch() {
      this.pager.pageNo = 1;
      this.getPagedList();
    },
    handleCurrentChange(val) {
      this.pager.pageNo = val;
      this.getPagedList();
    },
    getPagedList() {
      let that = this;
      API.getPagedRoleList({
        limit: that.pager.limit,
        pageNo: that.pager.pageNo,
        status: that.searchForm.status || "",
        name: that.searchForm.name || "",
        yhlx: that.searchForm.yhlx || ""
      }).then(res => {
        that.pager.total = res.total;
        that.tableList = res.rows;
      });
    },
    // 新增角色、修改角色保存方法
    confirm() {
      var that = this;
      //添加角色
      if (that.title === "new") {
        that.$refs.addForm.validate(valid => {
          if (valid) {
            API.addRole(that.addForm)
              .then(res => {
                if (res.code == 0) {
                  that.$message({
                    message: res.msg,
                    type: "success"
                  });
                  this.dialogFormVisible = false;
                  window.setTimeout(function() {
                    that.getPagedList();
                  }, 500);
                } else {
                  that.$message.error(res.msg);
                }
              })
              .catch(function(error) {
                this.dialogFormVisible = false;
              });
          }
        });
      } else if (that.title === "renew") {
        //编辑
        this.dialogFormVisible = false;
        API.editRole(that.addForm).then(res => {
          if (res.code == 0) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            window.setTimeout(function() {
              that.getPagedList();
            }, 500);
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    },
    // 分配用户
    allocateUser(row) {
      var that = this;
      let form = this.$refs.searchForm;
      if (form) {
        form.resetFields();
      }
      this.dialogHid = true;
      this.roleId = row.id;
      let val = {
        dwlbm: "1"
      };
      API.getCollegePairs(val)
        .then(res => {
          if (res.code == 0) {
            that.collegeList = res.data || [];
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch(err => {});
      this.userList = [];
      this.allocatedList = [];
      this.getPagedUserList();
    },
    getPagedUserList() {
      var that = this;
      API.getPagedAllotUserList({
        limit: that.pager1.limit,
        pageNo: that.pager1.pageNo,
        status: that.searchForm.status || "",
        id: that.roleId || "",
        yhlx: that.searchForm.yhlx || "",
        nj: that.searchForm.grade || "",
        xyId: that.searchForm.college || "",
        zyId: that.searchForm.major || "",
        bjId: that.searchForm.class || "",
        searchKey: that.searchForm.searchKey || ""
      }).then(res => {
        that.pager1.total = res.total;
        that.userList = (res.rows || []).map(row => {
          return {
            key: row.id,
            label: row.code + " - " + (row.alias || row.username || "")
          };
        });
        this.getPagedAllocatedList();
      });
    },
    getPagedAllocatedList() {
      var that = this;
      API.getPagedAllocatedUserList({
        limit: that.pager2.limit,
        pageNo: that.pager2.pageNo,
        id: that.roleId || "",
        nj: that.searchForm.grade || "",
        yhlx: that.searchForm.yhlx || "",
        xyId: that.searchForm.college || "",
        zyId: that.searchForm.major || "",
        bjId: that.searchForm.class || "",
        searchKey: that.searchForm.searchKey || ""
      }).then(res => {
        that.pager2.total = res.total;
        (res.rows || []).forEach(row => {
          that.userList.push({
            key: row.id,
            label: row.code + " - " + (row.alias || row.username || "")
          });
        });
        that.allocatedList = (res.rows || []).map(row => {
          return row.id;
        });
      });
    },
    handleChange(value, direction, movedKeys) {
      let that = this;
      // 取消用户所属角色
      if (direction == "left") {
        API.unallotUsers({
          roleId: that.roleId,
          userIds: movedKeys
        }).then(res => {
          if (res.code == 0) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            that.getPagedUserList();
          } else {
            that.$message.error(res.msg);
          }
        });
      }
      // 指定用户所属角色
      else if (direction == "right") {
        API.allotUsers({
          roleId: that.roleId,
          userIds: movedKeys
        }).then(res => {
          if (res.code == 0) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            that.getPagedUserList();
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    },
    // switch开关
    changeSwitch(data) {
      let that = this;
      let params = {
        id: data.id,
        status: data.status
      };
      API.changeRoleStatus(params).then(res => {
        if (res.code == 0) {
          that.$message({
            message: res.msg,
            type: "success"
          });
        }
      });
    },
    // 编辑
    handleEdit(row) {
      let that = this;
      that.title = "renew";
      this.dialogFormVisible = true;
      that.addForm = row;
    },
    // 删除
    deleteRow(id) {
      var that = this;
      this.$confirm("您将删除所选的角色信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API.delRole({ id: id })
            .then(res => {
              if (res.code == 0) {
                that.$message({
                  message: res.msg,
                  type: "success"
                });
                window.setTimeout(function() {
                  that.getPagedList();
                }, 500);
              } else {
                that.$message.error(res.msg);
              }
            })
            .catch(function(error) {
              this.$message.error(res.msg);
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    // 服务授权
    doPerms(row) {
      var that = this;
      this.dialogShow = true;
      this.roleId = row.id;
      that.featureTree = [];
      that.authorizedTree = [];
      that.authorizedPerms = [];
      API.getFeatureTree({
        roleId: that.roleId
      }).then(res => {
        if (res.code == 0) {
          that.featureTree = res.data || [];
          API.getPerms({
            roleId: that.roleId
          }).then(res => {
            if (res.code == 0) {
              let data = res.data || [];
              that.authorizedPerms = data.map(item => {
                return item.value;
              });
              that.transferKeys = data.map(item => {
                return item.key;
              });
            } else {
              that.$message.error(res.msg);
            }
          });
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.transferMode == "transfer") {
        this.transferMode = "addressList";
      } else {
        this.transferMode = "transfer";
      }
    },
    // 监听穿梭框组件添加
    toRight(featureTree, authorizedTree, movedObj) {
      var that = this;
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("featureTree:", featureTree);
      console.log("authorizedTree:", authorizedTree);
      console.log("movedObj:", movedObj);
      console.log("authorizedPerms", that.authorizedPerms);
      // 给指定角色分配功能权限
      let nodes = movedObj["nodes"] || [];
      let movedPerms = [];
      nodes.forEach(node => {
        // 检查是否已经授权
        let hasPerms = that.authorizedPerms.indexOf(node.perms) >= 0;
        // 功能按钮
        if (node.perms && node.featureId && !hasPerms) {
          movedPerms.push(node.perms);
        }
      });
      console.log("movedPerms", movedPerms);
      if (movedPerms && movedPerms.length > 0) {
        let servIds = authorizedTree.map(item => {
          return item.pid;
        });

        // 执行授权
        API.doPerms({
          roleId: that.roleId,
          perms: movedPerms,
          servs: servIds
        }).then(res => {
          if (res.code == 0) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            // 新增已授权功能数组的元素
            movedPerms.forEach(perms => {
              let index = that.authorizedPerms.indexOf(perms);
              if (index < 0) {
                that.authorizedPerms.push(perms);
              }
            });
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    },
    // 监听穿梭框组件移除
    toLeft(featureTree, authorizedTree, movedObj) {
      var that = this;
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      //console.log("featureTree:", featureTree);
      //console.log("authorizedTree:", authorizedTree);
      console.log("movedObj:", movedObj);
      // 取消已分配给指定角色的权限
      let nodes = movedObj["nodes"] || [];
      let movedPerms = [];
      nodes.forEach(node => {
        // 功能按钮
        if (node.perms && node.featureId) {
          movedPerms.push(node.perms);
          let index = that.authorizedPerms.indexOf(node.perms);
          if (index >= 0) {
            that.authorizedPerms.splice(index);
          }
        }
      });
      console.log("movedPerms", movedPerms);
      if (movedPerms && movedPerms.length > 0) {
        let servIds = authorizedTree.map(item => {
          return item.pid;
        });
        API.unPerms({
          roleId: that.roleId,
          perms: movedPerms,
          servs: servIds
        }).then(res => {
          if (res.code == 0) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            // 移除已授权功能数组的元素
            movedPerms.forEach(perms => {
              let index = that.authorizedPerms.indexOf(perms);
              if (index >= 0) {
                that.authorizedPerms.splice(index);
              }
            });
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.data-change {
  /deep/ .el-button--small,
  .el-button--small.is-round {
    width: 90px;
    font-size: 14px !important;
    border-color: rgba(46, 187, 232, 1);
    color: #2ebbe8;
    font-weight: 400;
  }
}
.data-table {
  padding-top: 24px;
  .data-dialog {
    /deep/ .el-button--small,
    .el-button--small.is-round {
      width: 90px;
      font-size: 14px !important;
      border-color: rgba(46, 187, 232, 1);
      color: #2ebbe8;
      font-weight: 400;
    }
  }
  .el-button + .el-button {
    margin-left: 16px;
    color: red;
  }
}
/deep/ .el-transfer-panel {
    width: 300px!important;
  }
.data-pag {
  margin-top: 24px;
}
.el-form-item__content .el-button--small {
  width: 90px;
}
/deep/ .el-input__inner {
  border-radius: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
/deep/ .el-input--mini .el-input__inner {
  border-radius: 0 !important;
}
/deep/ .el-transfer-panel {
  width: 450px;
}

.data-devide {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 550;
  text-align: center;
}
</style>
