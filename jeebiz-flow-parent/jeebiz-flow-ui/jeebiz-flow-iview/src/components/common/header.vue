<template>
  <div class="stuHeader-top">
    <div @click="toRoot" style="cursor: pointer;"><img src="../../../static/images/logo/logo-14535.png"/></div>
    <div class="felx">
         <i class="el-icon-bell" style="margin-right:10px"></i>
         <el-dropdown style="color:#fff">
            <span class="nav-menu">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><a @click='changeUser'>切换角色</a></el-dropdown-item>
                <el-dropdown-item><a @click='changePassword'>修改密码</a></el-dropdown-item>
                <el-dropdown-item><a @click='loginOut'>退出系统</a></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="centerDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      center>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="text-align: center;">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" size="small" v-model="form.oldPassword" placeholder="请输入现在的密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" size="small" v-model="form.password" placeholder="请输入新的密码" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" round @click="centerDialogVisible = false">取 消</el-button>
          <el-button size="small" round type="primary" @click="confirmPassword">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
       form: {
          oldPassword: '',
          password: ''
        },
        centerDialogVisible: false,
        searchValue: '',
        memberMenu: false,
        isHover: false,
        username: '',
        num:'',
        rules: {
          oldPassword: [{required: true, trigger: 'blur', message: '请输入原始密码'}],
          password: [{required: true, trigger: 'blur', message: '请输入新的密码'}]
        },
        ruleMsg:'',
      }
    },
    created(){
        this.username = localStorage.username||'superadmin'
        this.ruleMsg = localStorage.getItem("roles");

    },
    methods: {
      toRoot() {
        this.$router.push({path: '/portal'});
      },
      // 切换角色
        changeUser () {

      },
       // 修改密码
        changePassword () {
          this.centerDialogVisible = true;
          let form = this.$refs.form;
          if(form){form.resetFields()}
        },
        confirmPassword () {
          this.$refs.form.validate(valid => {
            if(valid) {
              let data = {
                oldPassword:this.form.oldPassword,
                password: this.form.password
              }
              API.resetPassword(data).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.centerDialogVisible = false;
              }).catch(err => {})
            }
          })
        },
        loginOut(){
            localStorage.clear()
            this.$router.push({path: '/'});
        },
    },
     watch: {
      $route (to, from) {
        let path = to.path;
        this.username = localStorage.username||'superadmin';
        this.ruleMsg = localStorage.getItem("roles");
      }
    }
  }
</script>

<style lang="scss" scoped>
.stuHeader-top{
  padding-top: 26px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 0 92px;
  color: #fff;
}
</style>
