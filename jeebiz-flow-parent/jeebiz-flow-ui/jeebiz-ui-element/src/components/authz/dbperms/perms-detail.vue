<template>
  <div v-loading="loading">
    <div class="go-back" @click="goback">
      <i class="el-icon-back"></i>返回上一级
    </div>
    <el-form :model="form" ref="form" label-width="130px" :rules="rules" size="small">
      <el-form-item label="权限规则名称" prop="name">
        <el-input v-model="form.name" style="width:215px;" placeholder="请填写"></el-input>
      </el-form-item>
       <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          active-text="开"
          :active-value="1"
          :inactive-value="0"
          inactive-text="关"
          active-color="#8DD87E"
          inactive-color="#FF8282"
          >
        </el-switch>
      </el-form-item>
      <el-form-item label="权限对象" prop="table">
        <el-select v-model="form.table" placeholder="请选择" clearable filterable @change="targetColumns">
          <el-option v-for="item in qxdxList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据字段" prop="column">
        <el-select v-model="form.column" placeholder="请选择" clearable filterable @change="targetList">
          <el-option v-for="item in sjzdList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限制条件" prop="condition">
        <el-select v-model="form.condition" placeholder="请选择" clearable filterable>
          <el-option v-for="item in xztjList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div>
      <el-transfer
        style="text-align: left; display: inline-block"
        filterable
        v-model="form.perms"
        :titles="['可分配数据项', '已分配数据项']"
        :render-content="renderFunc"
        :data="datas"
        :props="{
          key: 'key',
          label: 'value'
        }"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        >
      </el-transfer>
    </div>
    <div style="text-align: center;margin-top: 24px;">
      <el-button style="width: 90px;" size="small" @click="goback">取消</el-button>
      <el-button style="width: 90px;" size="small" type="primary" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
  import API from "@/assets/js/api/all-api";
  import TreeTransfer from 'el-tree-transfer'

  export default {
    components: { TreeTransfer },
    props: {
      id: {
        type: String
      },
      zt: {
        type: Boolean
      }
    },
    data() {
      return {
        form: {
          name: '', // 权限名称
          table: '', // 对象
          status: 1,
          column: '', // 字段
          condition: '', // 条件
          perms: [], // 穿梭框
        },
        rules: {
          name: [{required: true, message: '请输入', trigger: 'blur'}],
          column: [{required: true, message: '请选择', trigger: 'change'}],
          table: [{required: true, message: '请选择', trigger: 'change'}],
          condition: [{required: true, message: '请选择', trigger: 'change'}]
        },
        options: [],
        selectKeys:[],
        qxdxList: [],
        sjzdList: [],
        xztjList: [],
        datas: [],
        loading: false,
        renderFunc(h, option) {  // 穿梭框显示的格式和内容
          return <span>{ option.value }</span>;
        }
      }
    },
    created () {
      this.targetTables();
      this.targetConditions();
      if(this.zt == true) { // 编辑
        this.loading = true;
        let form = this.$refs.form;
        if(form) {form.clearValidate()};
        this.dbpermsDetail();
      }else {
        let form = this.$refs.form;
        if(form) {form.resetFields()}
        this.form = {
          name: '', // 权限名称
          table: '', // 对象
          status: 1,
          column: '', // 字段
          condition: '', // 条件
          perms: [], // 穿梭框
        }
      }

    },
    watch: {
      'form.table' (n, o) {
        if(!n) {
          this.form.column = "";
        }
      }
    },
    methods: {
      // 编辑时获取form
      dbpermsDetail() {
        let data = {
          id: this.id || ""
        }
        API.dbpermsDetail(data).then(res => {
          if(res.code == 0) {
            let data = res.data;
            this.form = Object.assign({}, data);
            this.targetColumns(this.form.table);
            this.$set(this.form, 'column', data.items[0].column) // 数据字段
            this.targetList(this.form.column);
            this.$set(this.form, 'condition', data.items[0].condition) // 限制条件
            this.form.status = Number(data.status);
            this.$set(this.form, 'perms', data.items[0].perms.split(',') || [])
            console.log(this.form,'111')
          }
        })
      },
      // 获取穿梭框数据
      targetList(val) {
        let data = {
          id: this.form.column,
          pageNo: 1,
          limit: 20000
        };
        API.targetList(data).then(res => {
          if(res.code == 0) {
            this.datas = res.rows || [];
          }
        })
      },
      // 获取数据字段
      targetColumns(val) {
        // this.$set(this.form, 'column', '');
        // this.targetList(val);
        let data = {
          tid: val
        };
        API.targetColumns(data).then(res => {
          if(res.code == 0) {
            this.sjzdList = res.data || [];
          }
          this.loading = false;
        })
      },
      // 穿梭框操作
      handleChange(value, direction, movedKeys) {},
      targetConditions() {
        API.targetConditions().then(res => {
          if(res.code == 0) {
            this.xztjList = res.data || [];
          }
        })
      },
      dbpermsNew(data) {
        API.dbpermsNew(data).then(res => {
          if(res.code == 0) {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 2000
            });
            this.$emit('back');
            this.$emit('getList');
          } else {
            this.$message({
              message: res.msg,
              type: 'warning',
              duration: 1500
            });
          }
        })
      },
      dbpermsRenew(data) {
        API.dbpermsRenew(data).then(res => {
          if(res.code == 0) {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 2000
            });
            this.$emit('back');
            this.$emit('getList');
          } else {
            this.$message({
              message: res.msg,
              type: 'warning',
              duration: 1500
            });
          }
        })
      },
      onSubmit() {
        this.$refs.form.validate(valid => {
          if(valid) {
            let data = this.form;
            let perms = data.perms.join(',');
            if(!perms) {
              this.$message({
                message: '数据项不能为空',
                type: 'warning'
              });
              return;
            }
            let name = "";
            this.sjzdList.forEach(item => { // 不仅传了key 后端也要求传value
              if(item.key = data.column) {
                name = item.value
              }
            })
            let newArr = [
              {
                column: data.column,
                perms: perms,
                name: name,
                condition: data.condition,
                status: data.status
              }
            ]
            this.$set(data, 'items', newArr);
            data.intro = "无";
            if(this.zt == false) { // 新增
              this.dbpermsNew(data);
            }else {                // 编辑
              this.dbpermsRenew(data);
            }
          }
        })
      },
      goback() {
        this.$emit('back');
        this.$emit('getList');
      },
      targetTables() {
        API.targetTables().then(res => {
          if(res.code == 0) {
            this.qxdxList = res.data || [];
          }
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-transfer-panel {
    width: 400px;
    height: 400px;
  }
  /deep/ .el-transfer-panel__list.is-filterable {
    height: 300px;
  }
  .go-back {
    color:#2EBBE8;
    padding: 24px 0;
  }
  .go-back:hover {
    cursor: pointer;
  }
  // .transfer-footer {
  //   padding: 6px 5px;
  // }
  // /deep/ .el-button--primary.is-disabled, .el-button--primary.is-disabled:hover,
  // .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
  //   border-radius: 100%!important;
  //   padding: 12px!important;
  //   width: 40px!important;
  //   height: 40px!important;
  // }
</style>
