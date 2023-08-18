<template>
    <div class="stuWorker">
        <div class="stuHeaders">
            <div class="stuHeader">
                <div class="stuHeader-top">
                    <div><img src="../../static/images/logo/logo-13279-268x50.svg"/></div>
                    <div class="felx">
                         <!-- <i class="el-icon-bell" style="margin-right:10px"></i> -->
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
                </div>
                <div class="stuHeader-bottom">
                    <div style="font-size:54px">智慧学工</div>
                    <div style="font-size:32px">助力高校学工管理数字化，信息化</div>
                </div>
            </div>
        </div>
        <div class="stuBottom">
            <!-- <el-tabs :tab-position="tabPosition" v-model="activeName">
                <el-tab-pane v-for="(item,index) in serviceList" :key="index" :label="item.name" :name="item.code">
                    <el-row :gutter="20">
                        <el-col :span="4" v-for="(item,index) in item.list" :key="index">
                            <el-card :bordered="false" class="cardHeight1" :style="colorArr[index%12]" style="cursor: pointer;" :title="item.abb" @click.native="goPath(item)">
                                <p slot="header">{{item.name}}</p>
                                <div style="text-align:center">
                                    <img :src="item.icon" style="width:124px;">
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs> -->
          <div style="display: flex;justify-content:space-between;">
            <div class="leftButton">
              <el-row style="margin-bottom:16px" v-for="(item,index) in serviceList" :key='index'>
                <el-button round :class="currentIndex == item.code?'isActive':'enActive'" class="btn" @click="swatchTab(item.code)">{{item.name}}</el-button>
              </el-row>
            </div>
            <div class="rightButton">
              <div v-for="(item,index) in serviceList" :key='index'>
                  <el-row :gutter="20" v-if="currentIndex == item.code">
                    <el-col :span="6" v-for="(item,index) in item.list" :key="index">
                          <el-card :bordered="false" class="cardHeight1" :style="colorArr[index%12]" style="cursor: pointer;" :title="item.abb" @click.native="goPath(item)">
                              <p slot="header">{{item.name}}</p>
                              <div style="text-align:center">
                                  <img :src="item.icon" style="width:100px;">
                              </div>
                          </el-card>
                      </el-col>
                  </el-row>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="bottom-index">
          <p>浙ICP备11019885号　　地址：浙江省杭州市西湖区留和路299号　xcb@zisu.edu.cn</p>
        </div> -->

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
import API from '@/assets/js/api/all-api'
export default {
    name:'TopHeader',
    props:{

    },

    data(){
        return{
            serviceList	: [],
            activeName	: '',
            currentIndex: "1",
            tabPosition: 'left',
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
            colorArr:['background:#5DD4F7','background:#F5C27C','background:#FFA8A8','background:#64E2CE','background:#76C3FC','background:#D497EF','background:#8DB3FF',
            'background:#FFDAA8','background:#70CEA6','background:#84C696','background:#8FF09A','background:#8AD9E3','background:#D2EF84'],
        }
    },
    created(){
      this.initList();
      this.username = localStorage.username||'superadmin'
      this.ruleMsg = localStorage.getItem("roles");
    },
    methods:{
        swatchTab(item){
          if(this.currentIndex != item) {
            this.currentIndex = item;
          }
        },
        initList(){
            var that = this;
            let data = {
            };
            API.getServTabs(data).then(res => {
                if (res.code==0 ) {
                   that.serviceList = res.data || [];
                   if(that.serviceList){
                     this.activeName = that.serviceList[0].code || "0"
                   }
                } else{
                    that.$message.error(res.msg);
                }
            }).catch(err => {})
            // 查询所有的服务信息
            API.getServFeatures(data).then(res => {
              if (res.code==0 ) {
                var data = res.data || [];
                localStorage.setItem("features", data);
              } else{
                that.$message.error(res.msg);
              }
            }).catch(err => {
            })
        },
         handleClick(tab, event) {
            this.activeName = tab.name;
        },
        toPage(item){
          // 内部服务，直接进行路由调整
          const activeName = this.activeName
          if(item.inner == '1'){
            if(item["path"] ){
              localStorage.setItem('sid', item.id);
              localStorage.setItem('name',  (item.abb || item.name));
              if(item["path"] == "/student_reward"){//学生奖惩 需传参数
              this.$router.push({path: item["path"] + "/KXJSHJXXB",query:{activeName:activeName}});
              } else {
                  this.$router.push({path: item["path"],query:{activeName:activeName}});
              }
            }
          } else {
            // 外部服务，进行浏览器地址修改
            window.open(item["path"], "_black").location;
          }
        },
        // 切换角色
        changeUser () {

        },
        // 跳转二级路由
        goPath (item) {
          // 内部服务，直接进行路由调整
          if(item.inner == '1'){
            if(item["path"] ){
              localStorage.setItem('sid', item.id);
              localStorage.setItem('name',  (item.abb || item.name));
              if(item["path"] == "/student_reward"){//学生奖惩 需传参数
                  this.$router.push({path: item["path"] + "/KXJSHJXXB"});
              } else {
                  this.$router.push({path: item["path"]});
              }
            }
          } else {
            // 外部服务，进行浏览器地址修改
            window.open(item["path"], "_black").location;
          }
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
    .leftButton {
      width: 14%
    }
    .rightButton {
      width: 84%
    }
    .enActive {
      color: #2EBBE8;
    }
    .btn {
      width:100%;
      height:50px;
      font-size:18px;
      opacity:1;
      border-radius:26px;
      background:#fff;
      box-shadow:1px 1px 0px rgba(204,204,204,0.3);
    }
    .isActive{
      color: #fff!important;
      background:linear-gradient(148deg,rgba(0,190,182,1) 0%,rgba(74,179,255,1) 100%);
      box-shadow:0px 1px 0px rgba(204,204,204,0.08);
    }
    /deep/ .el-tabs__item.is-active {
      color: #fff!important;
      background:linear-gradient(148deg,rgba(0,190,182,1) 0%,rgba(74,179,255,1) 100%)!important;
    }
    /deep/  .el-tabs--left .el-tabs__item.is-left{
      text-align: center;
      font-size: 16px !important;
      width:236px;
      line-height: 52px;
      height:52px;
      color: #2EBBE8!important;
      box-shadow:0px 1px 0px rgba(204,204,204,0.08);
      background:rgba(255,255,255,1);
      box-shadow:0px 1px 0px rgba(204,204,204,0.08);
      opacity:1;
      border-radius:28px;
    }
   .stuWorker{
       width: 100%;
       height: 100%;
       box-sizing: border-box;
       background:rgba(255,255,255,1);
   }
   .stuWorker .stuHeaders {
       width: 100%;
       height: 40%;
       background:url('../../static/images/headers.svg') no-repeat center;
       background-size: cover;
   }
    .stuWorker .stuHeader{
       margin: 0 128px;
       height:100%;
       color: #fff;
    }
    .stuHeader-top{
       padding-top: 26px;
       display: flex;
       justify-content: space-between;
       box-sizing: border-box;
    }
    .stuHeader-bottom{
        box-sizing: border-box;
        padding-left: 239px;
        padding-top: 50px;
    }

    .stuBottom{
        // height: calc(100% - 360px);
        // height: -webkit-calc(100% - 360px);
        // height: -moz-calc(100% - 360px);
        // min-height: 500px;
        padding: 40px 128px;
        background: #F5F5F5;
        box-sizing: border-box;
    }
    .cardLeft{
        padding-left: 15px;
        box-sizing: border-box;
    }
    .cardHeight{
        height: 20vh;
        box-sizing: border-box;
        p {
          font-size: 18px;
        }
    }
    .cardHeight1{
        height: 20vh;
        margin-top: 15px;
        box-sizing: border-box;
        color: #fff;
        p {
          font-size: 16px;
        }
    }
     /*个人事务*/
      .affair{
          background: #5DD4F7!important;
          color: #fff!important;
      }

      .affair:hover {
        cursor: pointer!important;
      }
      .affair1 {
        margin-top: 15px;
        background: #5DD4F7!important;
        color: #fff!important;
        &:hover {
          cursor: pointer;
        }
      }
      /deep/  .el-card__header{
          border: none!important;

      }

     /*图书借阅*/
      .books{
          background: #F5C27C!important;
          color: #fff!important;
      }
      .books:hover {
        cursor: pointer!important;
      }
      /deep/ .el-card__body {
        padding: 0;
      }


    /*一卡通*/

     .cards{
          background: #FFA8A8!important;
          color: #fff!important;
          cursor:pointer!important;
      }
      .card1{
          background: #2ea!important;
          color: #fff!important;
          cursor:pointer!important;
      }

    /*常用查询*/

     .query{
          background: #64E2CE!important;
          color: #fff!important;
          height:41.5vh!important;
      }



    /*我的邮件*/

     .mail{
          background: #76C3FC!important;
          color: #fff!important;
      }

    /*学费缴纳系统*/
    .tuition{
        background: #D497EF!important;
        color: #fff!important;
    }
    .bottom-index {
      height: 100px;
      line-height: 100px;
      text-align: center;
      color:rgba(204,204,204,1);
      font-size: 14px;
      box-sizing: border-box;
    }

    // .el-tabs--left.el-tabs--card .el-tabs__item.is-left{
    //     text-align: center !important;
    // }



</style>





