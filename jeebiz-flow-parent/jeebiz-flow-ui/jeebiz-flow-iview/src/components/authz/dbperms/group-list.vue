<template>
  <div>
    <div v-if="isShow">
      <div style="padding: 24px 0;">
        <el-input v-model="qxgz" placeholder="权限组名称" size="small" style="width: 220px;margin: 0 16px;" clearable></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="getList"
        >搜索</el-button>
      </div>
      <div style="margin-bottom: 24px;">
        <el-button type="primary" @click="addList" v-if="hasPermission('authz-dbperms-group:new')">添加分组</el-button>
        <el-button @click="deleteAllList" style="color: #f66;border-color: #f66" v-if="hasPermission('authz-dbperms-group:delete')">删除分组</el-button>
      </div>
      <el-table
          :data="dataTable"
          style="width:100%"
          :highlight-current-row="true"
          :header-row-style="{height:'40px'}"
          :row-style="{height:'40px'}"
          v-loading="loading"
          @selection-change="select"
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="权限组名称"></el-table-column>
          <el-table-column label="数据权限">
            <template slot-scope="scope">
              <div>
                {{scope.row.perms.join(',')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="intro" label="简介"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change="changeStatus(scope.row)"
                :disabled="hasPermission('authz-dbperms-group:status') ? false : true"
                active-text="开"
                active-value="1"
                inactive-value="0"
                inactive-text="关"
                active-color="#8DD87E"
                inactive-color="#FF8282"
                >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" v-if="hasPermission('authz-dbperms-group:renew')" @click="edit(scope.row.id)">编辑</el-button>
              <el-button size="small" type="text" v-if="hasPermission('authz-dbperms-group:delete')" @click="deleteList(scope.row.id)" style="color:#f56c6c"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pager="pager" @query="getList" @setPager="setPager" style="margin-top: 16px"></pagination>
    </div>
    <div v-else>
      <group-detail @back="back" :zt="zt" :id="id" @getList="getList"></group-detail>
    </div>
  </div>
</template>

<script>
  import API from "@/assets/js/api/all-api";
  import Pagination from "@/components/common/pagination";
  import groupDetail from '@/components/authz/dbperms/group-detail'
  import permissionMix from "@/mixin/permissionMix";
  export default {
    components: {
      Pagination,groupDetail
    },
    mixins: [permissionMix],
    data() {
      return {
        dataTable: [],
        multipleSelection: [],
        loading: false,
        isShow: true,
        id: '',
        zt: 1,
        qxgz: '',
        pager: {
          total: 0,
          limit: 10,
          pageNo: 1
        },
      }
    },
    created () {
      this.getList();
    },
    methods: {
      changeStatus (row) {
        let data = {
          id: row.id,
          status: row.status
        }
        API.dbpermsGroupStatus(data).then(res => {
          if(res.code == 0) {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 2000
            });
            this.getList();
          } else {
            this.$message({
              message: res.msg,
              type: 'warning',
              duration: 1500
            });
          }
        })
      },
      getList() {
        let data = {
          name: this.qxgz || "",
          limit: this.pager.limit,
          pageNo: this.pager.pageNo
        };
        API.dbpermsGroupList(data).then(res => {
          if(res.code == 0) {
            this.dataTable = res.rows;
            this.pager.total = Number(res.total);
          }
        }).catch(err => {
          console.log(err)
        })
      },
      select(val) {
        this.multipleSelection = val;
      },
      addList() {
        this.zt = 1;
        this.isShow = false;
      },
      edit(id) {
        this.id = id;
        this.zt = 0;
        this.isShow = false;
      },
      deleteAllList() {
        this.$confirm('确认删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '删除',
          type: 'warning'
        }).then(() => {
          let newArr = [];
          if(this.multipleSelection) {
            newArr = this.multipleSelection.join(',')
          }
          let data = {
          ids: newArr || ""
          }
          API.dbpermsGroupDelete(data).then(res => {
            if(res.code == 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.getList();
            }else {
              this.$message({
                message: '操作失败,请重试',
                type: 'warning'
              });
            }
          })
        }).catch(() => {});
      },
      deleteList(id) {
        this.$confirm('确认删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '删除',
          type: 'warning'
        }).then(() => {
          let data = {
          ids: id
          }
          API.dbpermsGroupDelete(data).then(res => {
            if(res.code == 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.getList();
            }else {
              this.$message({
                message: '操作失败,请重试',
                type: 'warning'
              });
            }
          })
        }).catch(() => {});
      },
      setPager(pager) {
        this.pager = pager;
      },
      back() {
        this.isShow = true;
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
