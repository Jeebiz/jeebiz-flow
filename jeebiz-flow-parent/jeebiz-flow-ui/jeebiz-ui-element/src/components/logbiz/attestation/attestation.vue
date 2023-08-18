<template>
  <div class="content">

    <div class="center" ref="rightBox">
        <div class="btnBox" ref="btnBox">

          <el-select size="small" v-model="roleId" filterable placeholder="角色" clearable>
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

           <el-select size="small" v-model="opts" filterable placeholder="操作类型" clearable>
            <el-option
              v-for="item in optsList"
              :key="item.key"
              :label="item.desc"
              :value="item.key">
            </el-option>
          </el-select>

          <el-select size="small" v-model="level" filterable placeholder="日志级别" clearable>
            <el-option
              v-for="item in levelList"
              :key="item.key"
              :label="item.desc"
              :value="item.key">
            </el-option>
          </el-select>
          <el-input placeholder="请输入关键词" class="inputBox" v-model="keywords"></el-input>
         <el-button size="small" icon="el-icon-search" round type="primary" @click="search()">搜索</el-button>
          <!-- <el-button class="el-button--primary" icon="el-icon-add" @click="addClick">添加</el-button> -->
        </div>

        <el-table
          :height="tableHeight"
          :data="tableData"
          v-loading="loading"
          size="medium"
          style="width: 100%;min-height:400px;"
          :header-cell-style="{background:'rgba(248,248,248,1)', color:'#606266'}"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column  prop="userId" label="ID编号"></el-table-column> -->
          <el-table-column  prop="userName" label="认证对象"></el-table-column>
          <el-table-column  prop="opt" label="操作类型"></el-table-column>
          <el-table-column  prop="protocol" label="认证协议"></el-table-column>
          <el-table-column prop="level" label="日志级别" ></el-table-column>
          <el-table-column prop="addr" label="请求来源IP" ></el-table-column>
          <el-table-column prop="status" label="认证结果" ></el-table-column>
          <el-table-column prop="msg" label="请求信息" ></el-table-column>
          <el-table-column prop="exception" label="异常信息" ></el-table-column>
          <el-table-column prop="time24" label="认证时间" ></el-table-column>

        </el-table>
        <pagination :pager="pager" @query="getItemList" @setPager="setPager"></pagination>

    </div>
  </div>
</template>

<script>
  import Pagination from "@/components/common/pagination";
  import API from '@/assets/js/api/all-api'
  import utils from '@/assets/js/utils'

  export default {
    name: "campus_manage",
    components: {
      Pagination
    },
    created() {
      this.getItemList();
      this.getRols();//获取角色信息
      this.getOpts();//获取操作类型
      this.getLeaves();//获取日志级别
    },
    mounted(){
      var that=this;
      that.resizeTable();
      window.onresize=function () {
        that.resizeTable();
      }
    },
    data() {
      return {
        roleId: '',
        roleList: [],
        opts:'',
        optsList:[],
        level:'',
        levelList:[],
        keywords:"",
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        loading: false,
        tableHeight: null,
        pager: {
          total: 1,
          pageNo: 1,//当前第几页
          limit: 10,//每页显示的条数
        },

        deletePopoverVisible: false,
      };
    },
    methods: {
      //获取角色信息
      getRols(){

        API.roleRoles().then(res => {
            if (res.code==0) {
                this.roleList = res.data;
            }

          }).catch(err => {

        })

      },

       //获取操作类型
      getOpts(){

        API.bizOpts().then(res => {
            if (res.code==0) {
                this.optsList = res.data;
            }
        }).catch(err => {

        })

      },
       //获取日志级别
      getLeaves(){
         API.bizLevels().then(res => {
            if (res.code==0) {
                this.levelList = res.data;
            }

          })
      },
      searchClick(){
        this.pager.pageNo = 1;
        this.getItemList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

     search(){
       this.getItemList();
     },

      /*表格分页查询*/
      getItemList() {
        let data = {

            pageNo:this.pager.pageNo+'',
            limit:this.pager.limit+'',
            roleId:this.roleId,
            level:this.level,
            opt:this.opts,
            keywords:this.keywords

        };
        API.authzList(data)
          .then(res => {
              if (res.code==0) {
                this.tableData = res.rows;
                this.pager.total = parseFloat(res.total);
              }
          })
      },
      setPager(pager) {
        this.pager = pager;
      },


      /*表格样式动态调整*/
      resizeTable(){
        let that=this;
        let btnBoxHeight=that.$refs.btnBox.offsetHeight;
        let rightBox=that.$refs.rightBox.offsetHeight;
        //let btnBoxes = that.$refs.btnBoxes.offsetHeight;
        that.tableHeight=rightBox - btnBoxHeight  - 40;

      }
    }
  }
</script>

<style scoped>

  .rightBox{
    width:100%;
    height: 100%;
  }
  .inputBox {
    width: 200px;
  }
</style>
