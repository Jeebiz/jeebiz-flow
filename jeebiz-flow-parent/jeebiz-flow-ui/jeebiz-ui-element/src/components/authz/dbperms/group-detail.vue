<template>
  <div>
    <div class="go-back" @click="goback">
      <i class="el-icon-back"></i>返回上一级
    </div>
    <el-form :model="form" ref="form" label-width="120px" :rules="rules" size="small">
      <el-form-item label="权限组名称" prop="name">
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
      <el-form-item label="简介" prop="intro">
        <el-input v-model="form.intro" rows="4" type="textarea" autoheight show-word-limit placeholder="请填写"></el-input>
      </el-form-item>
      <!-- <el-form-item label="数据限制规则" prop="relation">
        <el-select v-model="form.relation" placeholder="规则关系" clearable filterable>
          <el-option v-for="item in gzList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div>
      <el-transfer
        style="text-align: left; display: inline-block"
        filterable
        v-model="form.perms"
        :titles="['可分配数据权限', '已分配数据权限']"
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
        type: Number
      }
    },
    data() {
      return {
        form: {
          name: '',
          intro: '',
          // relation: '',
          status: 1,
          perms: [],
        },
        rules: {
          name: [{required: true, message: '请输入', trigger: 'blur'}],
          // relation:  [{required: true, message: '请选择', trigger: 'change'}],
          intro:  [{required: true, message: '请输入', trigger: 'blur'}],
        },
        gzList: [{key: 'and', value: '并且'},{key: 'or', value: '或者'}],
        options: [],
        datas: [],
        renderFunc(h, option) {  // 穿梭框显示的格式和内容
          return <span>{ option.value }</span>;
        }
      }
    },
    created () {
      this.dbpermsPairs();
      if(this.zt == 1) { // 新增
        let form= this.$refs.form;
        if(form) {form.resetFields()}
        this.form = {
          name: '',
          intro: '',
          // relation: '',
          status: 1,
          perms: [],
        }
      } else { // 编辑
        let form= this.$refs.form;
        if(form) {form.resetFields()}
        this.groupDetail();
      }
    },
    methods: {
      // 新增
      dbpermsGroupNew(data) {
        API.dbpermsGroupNew(data).then(res => {
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
      dbpermsGroupRenew(data) {
        API.dbpermsGroupRenew(data).then(res => {
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
            if(data.perms.length == 0) {
              this.$message({
                message: '请先分配数据权限',
                type: 'warning'
              });
              return;
            }
            if(this.zt == 1) { // 新增
              this.dbpermsGroupNew(data);
            }else {                // 编辑
              this.dbpermsGroupRenew(data);
            }
          }
        })

      },
      // 编辑进来获取数据
      groupDetail() {
        let data = {
          id: this.id || ""
        }
        API.dbpermsGroupDetail(data).then(res => {
          if(res.code == 0) {
            this.dbpermsPairs();
            let data = res.data;
            this.form = Object.assign({}, data);
            this.form.status = Number(this.form.status);
            console.log(this.form)

          }
        })
      },
      dbpermsPairs() {
        API.dbpermsPairs().then(res => {
          if(res.code == 0) {
            this.datas = res.data;
          }
        })
      },
      // 穿梭框操作
      handleChange(value, direction, movedKeys) {},

      goback() {
        this.$emit('back');
        this.$emit('getList');
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
  // /deep/ .el-button--primary.is-disabled, .el-button--primary.is-disabled:hover,
  // .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
  //   border-radius: 100%!important;
  //   padding: 12px!important;
  //   width: 40px!important;
  //   height: 40px!important;
  // }
</style>
