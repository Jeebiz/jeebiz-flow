<template>
  <div>
    <div v-if="isShow">
      <div style="padding: 24px 0;">
        <el-input v-model="qxgz" placeholder="请输入关键字" size="small" style="width: 220px;" clearable></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="getList"
        >搜索</el-button>
      </div>
      <div style="margin-bottom: 24px;">
        <el-button type="primary" @click="addList" v-if="hasPermission('authz-dbperms:new')">添加权限规则</el-button>
      </div>
      <el-table
          :data="dataTable"
          style="width:100%"
          :highlight-current-row="true"
          :header-row-style="{height:'40px'}"
          :row-style="{height:'40px'}"
          v-loading="loading"
          >
          <el-table-column prop="name" label="权限规则名称"></el-table-column>
          <el-table-column prop="table" label="权限对象"></el-table-column>
          <el-table-column prop="items[0].name" label="数据字段"></el-table-column>
          <el-table-column prop="items[0].conditionStr" label="限制条件"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :disabled="hasPermission('authz-dbperms:status') ? false : true"
                @change="changeStatus(scope.row)"
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
              <el-button size="small" v-if="hasPermission('authz-dbperms:renew')" type="text" @click="edit(scope.row.id)">编辑</el-button>
              <el-button size="small" v-if="hasPermission('authz-dbperms:delete')" type="text" @click="deleteList(scope.row.id)" style="color:#f56c6c"
              >删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <pagination :pager="pager" @query="getList" @setPager="setPager" style="margin-top: 16px"></pagination>
    </div>
    <div v-else>
      <perms-detail @getList="getList" @back="back" :id="id" :zt="zt"></perms-detail>
    </div>
  </div>
</template>

<script>
  import API from "@/assets/js/api/all-api";
  import Pagination from "@/components/common/pagination";
  import permsDetail from '@/components/authz/dbperms/perms-detail'
  import permissionMix from "@/mixin/permissionMix";
  export default {
    components: {
      Pagination,permsDetail
    },
    mixins: [permissionMix],
    data() {
      return {
        dataTable: [],
        loading: false,
        isShow: true,
        qxgz: '',
        id: '',
        zt: false, // 新增还是编辑
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
        API.authzDbpermsStatus(data).then(res => {
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
      addList() {
        this.zt = false;
        this.isShow = false;
      },
      getList() {
        this.loading = true;
        let data = {
          name: this.qxgz || "",
          limit: this.pager.limit,
          pageNo: this.pager.pageNo
        };
        API.dbpermsList(data).then(res => {
          this.loading = false;
          if(res.code == 0) {
            this.dataTable = res.rows;
            this.pager.total = Number(res.total);
          }
        }).catch(err => {
          console.log(err)
        })
      },
      edit(id) {
        this.id = id; // 每行的id
        this.zt = true;
        this.isShow = false;
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
          API.dbpermsDelete(data).then(res => {
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
