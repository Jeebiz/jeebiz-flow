<template>
  <div class="content">
    <!--<div class="header"><span>通知管理</span></div>-->
    <div class="center">
      <div class="rightBox" ref="rightBox">
        <div class="btnBox" ref="btnBox">
          <el-input v-model="condition" placeholder="通知名称" class="inputBox"></el-input>
          <el-button  @click="searchClick" type="primary" icon="el-icon-search" >搜索</el-button>
          <el-button  icon="el-icon-add" @click="addClick">添加</el-button>
        </div>
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :height="tableHeight">
          <el-table-column  prop="title" label="标题"></el-table-column>
          <el-table-column prop="content" label="内容" ></el-table-column>
          <el-table-column prop="createUser" label="发布者" ></el-table-column>
          <el-table-column prop="createTime" label="创建时间" ></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="editClick(scope.row)" size="mini" type="text">编辑</el-button>
              <el-button @click="deleteClick(scope.row.noticeId)" size="mini" type="text" style="color:#f56c6c">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pager="pager" @query="getItemList" @setPager="setPager"></pagination>
        <el-dialog :close-on-click-modal=false title="添加通知" :visible.sync="dialogFormVisible">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
              <el-input v-model="form.title" autocomplete="off" placeholder="请输入通知标题"></el-input>
            </el-form-item>
            <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
              <el-input type="textarea" v-model="form.content" autocomplete="off" placeholder="请输入通知内容"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">保 存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from "@/components/common/pagination";
  import API from '@/assets/js/api/all-api'
  import utils from '@/assets/js/utils'

  export default {
    name: "notificationManage",
    components: {
      Pagination
    },
    created() {
      this.getItemList();
    },
    mounted(){
      let that = this;
      this.resizeTable();
      window.onresize=function () {
        that.resizeTable();
      }
    },
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        loading: false,
        tableHeight: null,
        condition:"",
        form: {
          title:"",
          content:"",
        },
        pager: {
          total: 100,
          page: 1,//当前第几页
          rows: 10,//每页显示的条数
        },
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ],
          content: [
            {required: true, message: '请输入通知内容', trigger: 'blur'},
          ],
        },
        deletePopoverVisible: false,
      };
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      searchClick(){
        this.page.pager = 1;
        this.getItemList();
      },
      editClick(data) {
        this.dialogFormVisible = true;
        let form =this.$refs['form'];
        if(form){form.resetFields();}
        this.form = JSON.parse(JSON.stringify(data));
      },
      addClick() {
        this.dialogFormVisible = true;
        let form =this.$refs['form'];
        if(form){form.resetFields();}
        this.form = {
          title:"",
          content:"",
        }
      },
      deleteClick(id) {
        this.$confirm('确认删除？','提示',{
          type: 'error'
        })
          .then(_ => {
            this.delete(id);
          })
          .catch(_ => {
          });
      },
      /*表格分页查询*/
      getItemList() {
        this.loading = true;
        let data = {
          params:{
            pageNo:this.pager.page+'',
            limit:this.pager.rows+'',
            condition:this.condition
          }
        }
        API.getNotificationList(data)
          .then(res => {
            this.loading = false;
            //console.info("通知信息", res);
            if(this.checkPass(res)){
              if (res.data) {
                this.tableData = res.data;
                this.pager.total = parseFloat(res.count);
              }
            }
          }).catch(err => {
          this.loading = false;
        })
      },
      /*更改页码数据*/
      setPager(pager) {
        this.pager = pager;
      },
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let data = {
              params: {
                NoticeList: this.form
              }
            };
            let loading = utils.showLoading(this);
            API.submitNotification(data)
              .then(res => {
                loading.close();
                //console.info("提交通知信息", res);
                if(this.checkPass(res)){
                  this.$message({message: '操作成功', type: 'success', duration:1000});
                  this.dialogFormVisible = false;
                  this.getItemList();
                }
              }).catch(err => {
              loading.close();
            })
          }
        });
      },
      delete(id) {
        let data = {
          params: {
            id: id
          }
        }
        let loading = utils.showLoading(this);
        API.deleteNotification(data)
          .then(res => {
            loading.close();
            //console.info("删除通知", res);
            if(this.checkPass(res)){
              this.$message({message: '操作成功', type: 'success', duration:1000});
              this.getItemList();
            }
          }).catch(err => {
          loading.close();
        })
      },
      /*表格样式动态调整*/
      resizeTable(){
        let that=this;
        let btnBoxHeight=that.$refs.btnBox.offsetHeight;
        let rightBox=that.$refs.rightBox.offsetHeight;
        that.tableHeight=rightBox - btnBoxHeight - 40;
      }
    }
  }
</script>

<style scoped>
  .content {
    height: 100%;
    width: 100%;
  }

  .header {
    padding: 13px 20px;
    color: #333;
    font-size: 16px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    text-align: left;
  }

  .header span {
    border-left: 4px solid #009688;
    padding-left: 6px;
  }

  .center {
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    background: #f2f2f2;
  }

  .btnBox {
    padding: 10px 5px;
    text-align: left;
    background: #fff;
  }

  .rightBox{
    width:100%;
    height: 100%;
  }
  .inputBox {
    width: 200px;
  }
</style>
