<template>

    <div class="content">
   
    <div class="center" ref="rightBox">
        <div class="btnBox" ref="btnBox">
          <el-select size="small" v-model="type" filterable placeholder="通知类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          
          <el-input placeholder="请输入关键词" class="inputBox" v-model="keyword"></el-input>
         <el-button size="small" icon="el-icon-search" round type="primary">搜索</el-button>
          <!-- <el-button class="el-button--primary" icon="el-icon-add" @click="addClick">添加</el-button> -->
        </div>

         <div class="btnBoxes" style="padding:24px 0" ref="btnBoxes">
            <el-button size="small" round>删除</el-button>
            <el-button size="small" round>已读</el-button>
            
         </div>
        <el-table
          :height="tableHeight"
          :data="tableData"
          v-loading="loading"
          size="medium" 
          style="width: 100%"
          :header-cell-style="{background:'rgba(248,248,248,1)', color:'#606266'}"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column  prop="name" label="标题"></el-table-column>
          <el-table-column  prop="name" label="通知类型"></el-table-column>
          <el-table-column  prop="name" label="发布日期"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button @click="deleteClick(scope.row.id)" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pager="pager" @query="getItemList" @setPager="setPager"></pagination>
        <el-dialog :close-on-click-modal=false  title="添加文章分类" :visible.sync="dialogFormVisible">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="级别" :label-width="formLabelWidth" prop="grade">
              <el-input v-model="form.grade" autocomplete="off" placeholder="请输入分类级别"></el-input>
            </el-form-item>
            <el-form-item label="简述" :label-width="formLabelWidth" prop="metaDescription">
              <el-input v-model="form.metaDescription" autocomplete="off" placeholder="请输入简述"></el-input>
            </el-form-item>
            <el-form-item label="关键字" :label-width="formLabelWidth" prop="metaKeywords">
              <el-input v-model="form.metaKeywords" autocomplete="off" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="form.orderList" autocomplete="off" placeholder="请输入排序"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">保 存</el-button>
          </div>
        </el-dialog>
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
        type: '',
        options: [],
        keyword:"",
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        loading: false,
        tableHeight: null,
        form: {
          name:"",
          metaDescription:"",
          metaKeywords:"",
          orderList:"",
          grade:"",
        },
        pager: {
          total: 100,
          page: 1,//当前第几页
          rows: 10,//每页显示的条数
        },
        rules: {
          name: [
            {required: true, message: '请输入文章分类名称', trigger: 'blur'},
          ],
          metaDescription: [
            {required: true, message: '请输入简述', trigger: 'blur'},
          ],
          metaKeywords: [
            {required: true, message: '请输入关键字', trigger: 'blur'},
          ],
          grade: [
            {required: true, message: '请输入级别', trigger: 'blur'},
          ],
        },
        deletePopoverVisible: false,
      };
    },
    methods: {
      searchClick(){
        this.pager.page = 1;
        this.getItemList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
          name:"",
          metaDescription:"",
          metaKeywords:"",
          orderList:"",
          grade:"",
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
        let data = {
          params:{
            pageNo:this.pager.page+'',
            limit:this.pager.rows+'',
            keyword:this.keyword
          }
        };
        this.loading = true;
        API.getArticleCategoryList(data)
          .then(res => {
            this.loading = false;
            //console.info("文章分类信息", res);
            if(this.checkPass(res)){
              if (res.data) {
                this.tableData = res.data;
                this.loading = false;
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
              params: this.form
            };
            let loading = utils.showLoading(this);
            if(this.form.id){//编辑
              API.editArticleCategory(data)
                .then(res => {
                  loading.close();
                  //console.info("编辑文章分类信息", res);
                  if(this.checkPass(res)){
                    this.dialogFormVisible = false;
                    this.getItemList();
                  }
                }).catch(err => {
                loading.close();
              })
            }else {
              API.addArticleCategory(data)
                .then(res => {
                  loading.close();
                  //console.info("提交文章分类信息", res);
                  if(this.checkPass(res)){
                    this.dialogFormVisible = false;
                    this.getItemList();
                  }
                }).catch(err => {
                loading.close();
              })
            }
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
        API.deleteArticleCategory(data)
          .then(res => {
            loading.close();
            //console.info("删除文章分类", res);
            if(this.checkPass(res)){
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
        //let btnBoxes = that.$refs.btnBoxes.offsetHeight;
        that.tableHeight=rightBox - btnBoxHeight  - 40;
        console.log(that.tableHeight,'aaa')
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
