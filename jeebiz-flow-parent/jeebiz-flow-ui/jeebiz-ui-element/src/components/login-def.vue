<template>
  <div>
    <div class="loginContent">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="form_content">
        <div class="form_tt">
          <div class="form_title">{{loginName}}</div>
          <div class="form_code">
            <img id="changeimg" src="../../static/images/login/ewm.svg" title="点击切换登录方式" alt="点击切换登录方式" @click="goToCode"/>
          </div>
        </div>
        <div class="form_main">
          <el-form ref="formData" :model="formData" :rules="ruleValidate" v-if="isPhoneLogin">
            <el-form-item style="margin-bottom: 24px;" prop="loginAccount">
              <el-input class="user_name" v-model="formData.loginAccount" placeholder="账号" :maxlength="20">
                <img slot="prepend" width="21px" src="../../static/images/login/zhanghu.svg" alt="">
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 24px;" prop="loginPwd">
              <el-input class="password_name" type="password" v-model="formData.loginPwd" :maxlength="20" placeholder="密码" @keyup.enter.native="onSubmit('formData')">
                <img slot="prepend" width="21px" src="../../static/images/login/icon-lock.svg" alt="">
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 24px;" prop="loginCaptchcode" v-if="isPass">
              <div class="captch_code">
                <el-input type="text" v-model="formData.loginCaptchcode" :maxlength="4" placeholder="验证码" />
                <div><img src="../../static/images/login/yzm.svg" alt=""></div>
              </div>
            </el-form-item>
            <el-button class="btn_login" @click="onSubmit('formData')">登录</el-button>
            <div class="go_reg" style="display:none">
              <el-checkbox value="remember-me" v-model="rememberPassword">记住账户密码</el-checkbox>
              <router-link :to="{path: ''}" class="forget_pass" style="text-decoration: none;"> 忘记密码?</router-link>
            </div>
            <div>
              <div class="third_login" v-show="!isPass">第三方账户登录</div>
              <div class="go_tx">
                <div><img src="../../static/images/login/qq.svg" alt=""></div>
                <div><img src="../../static/images/login/wx.svg" alt=""></div>
              </div>
            </div>
          </el-form>
          <div v-show="!isPhoneLogin">
            <img :src='srcUrl' alt="">
            <div class="ewm_tips">请使用移动端APP扫描二维码登录</div>
            <div class="change_user" @click="goToCode">账号密码登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/assets/js/api/all-api';

export default {
  data() {
    return {
      single: false,
      rememberPassword: false, // 记住密码
      loginName: '登录',
      isPass: false,  // 验证码显示/隐藏
      isPhoneLogin: true, // 用户登录输入框 显示/隐藏
      codeImg: {
        imgdata: "../../static/images/login/yzm.svg"
      },
      formData: {
        loginAccount: "",
        loginPwd: "",
        loginCaptchCode: ""
      },
      ruleValidate: {
        loginAccount: [{ required: true, message: "请填写用户名哦~", trigger: "blur" }],
        loginPwd: [{ required: true, message: "请填写密码哦~", trigger: "blur" }],
        loginCaptchcode: [{ required: true, message: "验证码也要填哦~", trigger: "blur" }]
      },
      logo : "/static/images/logo/logo-268x50.svg",
      srcUrl:"../../static/images/login/-.svg",
      timer:null,
      uuid:'',
    };
  },
  methods: {
    // 切换登录方式
      goToCode () {
        if(this.isPhoneLogin) {
          var img = document.getElementById('changeimg');
          img.src = "../../static/images/login/ewm.png";
          this.loginName = "二维码登录";
          //获取二维码
          this.getQrcode();
        } else {
          var img = document.getElementById('changeimg');
          img.src = "../../static/images/login/ewm.svg";
          this.loginName = "登录";
          clearInterval(this.timer)
        }
          this.isPhoneLogin = !this.isPhoneLogin;
      },

      onSubmit(formName) {
        // 为表单绑定验证功能
        let that = this;
        // var remember = that.form.radio==1 ? "on" : "off" ;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
            var data={
              username: that.formData.loginAccount,
              password: that.formData.loginPwd,
              captcha:'',
            };
            API.login(data).then(res=>{
              if(res.code==0){
                res.profile = res.profile || {};
                res.profile.info = res.profile.info || {};
                localStorage.setItem('yxid', res.profile.info.dwh);
                localStorage.setItem('roles',res.roles);
                localStorage.setItem('token',res.token);
                localStorage.setItem('userid',res.userid);
                localStorage.setItem('userkey',res.userkey);
                localStorage.setItem('username',res.alias);
                localStorage.setItem('usercode',res.usercode);
                that.$message({
                  message: '登录成功',
                  type: 'success',
                  duration:500
                });
                setTimeout(function () {
                  that.$router.push({path: '/portal'});//跳转到模块选择界面
                },1000)
              }else {
                that.$message({
                  message: '用户名或者密码错误',
                  type: 'warning',
                  duration:2000
                });
              }
            }).catch(function (error) {
                that.$router.push({path:'/'})
            })


          } else {
            this.dialogVisible = true;
            return false;
          }
        });
      },
      //获取二维码
      getQrcode(){
          API.qrcodeInfo().then(res=>{
              if(res.code==0){
                  this.srcUrl = res.qrcode;
                  this.uuid = res.uuid
                  this.timer = setInterval(()=>{
                      this.getQrcodeBind();
                  },3000)
              }
          })
      },
      //动态轮训数据
      getQrcodeBind(){
          const data = {
            uuid:this.uuid
          }
          API.qrcodeBind(data).then(res=>{
            if(res.status=="bound" && res.code==0){
                  localStorage.setItem('roles',res.data.roles);
                  localStorage.setItem('token',res.data.token);
                  localStorage.setItem('userid',res.data.userid);
                  localStorage.setItem('userkey',res.data.userkey);
                  localStorage.setItem('username',res.data.alias);
                  localStorage.setItem('usercode',res.data.usercode);
                  this.$message({
                    message: '登录成功',
                    type: 'success',
                    duration:500
                  });
                  var that = this;
                  setTimeout(function () {
                    that.$router.push({path: '/portal'});//跳转到模块选择界面
                  },1000)
              }else if(res.status=="expired" && res.code==0){
                API.qrcodeInfo().then(res=>{
                  if(res.code==0){
                      this.srcUrl = res.qrcode;
                      this.uuid = res.uuid;
                  }
                })
            }
          })
      },
    },
    destroyed(){
        if(this.timer) { //如果定时器在运行则关闭
            clearInterval(this.timer);
        }
    },

};
</script>
<style lang="scss" scoped>
 @import "../../css/login.scss";
</style>
