<template>
  <div class="content">
    <div class="center" ref="rightBox">
        <div class="btnBox" ref="btnBox">
          <el-select size="small" v-model="type" filterable placeholder="状态" clearable>
            <el-option
              v-for="item in statuList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入关键词" class="inputBox" v-model="keyword"></el-input>
         <el-button size="small" icon="el-icon-search" round type="primary" @click="search()">搜索</el-button>
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
          <el-table-column  prop="gkey" label="分组"></el-table-column>
          <el-table-column  prop="label" label="名称"></el-table-column>
          <el-table-column  prop="key" label="代码"></el-table-column>
          <el-table-column  prop="value" label="参数值"></el-table-column>
          <el-table-column  prop="placeholder" label="说明"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="medium" type="text" v-show="hasPermission('setting:renew')" @click="editClick(scope.row)" >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

         <pagination style="margin-top: 24px;" :pager="pager" @query="getItemList" @setPager="setPager"></pagination>
        <el-dialog  :visible.sync="dialogFormVisible" width="30%" :title="titles" center :close-on-click-modal="false">
           <!-- <h3 style="margin-bottom:20px;">{{titles}}</h3> -->
          <el-form :model="form" ref="form" :rules="rules" >
            <el-form-item label="分组" :label-width="formLabelWidth" prop="gkey">
              <el-input size="small" v-model="form.gkey" autocomplete="off" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" :label-width="formLabelWidth" prop="label">
              <el-input size="small" v-model="form.label" autocomplete="off" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="代码" :label-width="formLabelWidth" prop="key">
              <el-input size="small" v-model="form.key" autocomplete="off" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="参数值" :label-width="formLabelWidth" prop="value" >
              <el-input size="small" v-model="form.value" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="说明" :label-width="formLabelWidth" prop="placeholder">
              <el-input size="small" v-model="form.placeholder" autocomplete="off" placeholder="请输入" disabled></el-input>
            </el-form-item>



          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small"  @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submit">确 定</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
  import Pagination from "@/components/common/pagination";
  import API from '@/assets/js/api/all-api'
  import utils from '@/assets/js/utils'
  import permissionMix from '@/mixin/permissionMix';
  export default {
    name: "campus_manage",
    mixins : [permissionMix],
    components: {
      Pagination
    },
    created() {
      this.getItemList();

    },
    mounted(){

      this.resizeTable();
      window.onresize=function () {
        this.resizeTable();
      }
    },
    data() {
      return {
        type: '',
        titles:'',//标题
        status:'',
        statuList:[
          {
            name:'不可用',
            value:0
          },
          {
            name:'可用',
            value:1
          }
        ],
        keyword:"",
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        formLabelWidth: '65px',
        loading: false,
        tableHeight: null,
        form: {
          gkey:"",
          label:'',
          key:"",
          value:"",
          placeholder:"",
        },
         pager: {
          total: 1,
          pageNo: 1,//当前第几页
          limit: 10,//每页显示的条数
        },

        rules: {

          gkey: [
            {required: true, message: '请输入', trigger: 'blur'},
          ],
           label: [
            {required: true, message: '请输入', trigger: 'blur'},
          ],
          key: [
            {required: true, message: '请输入', trigger: 'blur'},
          ],
          value: [
            {required: true, message: '请输入', trigger: 'blur'},
          ],
          placeholder: [
            {required: false,  message: '请输入', trigger: 'blur'},
          ],
        },
        deletePopoverVisible: false,
      };
    },
    methods: {

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      search(){
        this.getItemList();
      },

      editClick(data) {
        this.dialogFormVisible = true;
        this.titles = '编辑系统参数'
        let form =this.$refs['form'];
        if(form){form.resetFields();}
        this.form = JSON.parse(JSON.stringify(data));
      },

      /*表格分页查询*/
      getItemList() {
        let data = {
            pageNo:this.pager.pageNo+'',
            limit:this.pager.limit+'',
            status:this.type,
            value:this.keyword
        };
        API.settingsList(data).then(res => {
              if (res.code==0) {
                this.tableData = res.rows;
                this.loading = false;
                this.pager.total = parseFloat(res.total);
              }
          }).catch(err => {
        })
      },
      /*更改页码数据*/
      setPager(pager) {
        this.pager = pager;
      },
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
          const data1={
             value:this.form.value,
             id:this.form.id
          }
            //编辑
            API.settingsRenew(data1)
              .then(res => {
                 if(res.code==0){
                    this.dialogFormVisible = false;
                    this.getItemList();
                    this.$message({
                        message: res.msg,
                        type: 'info',
                        duration: 1000
                    });
                  }else{
                    this.$message({
                        message: res.msg,
                        type: 'info',
                        duration: 1000
                    });
                  }
              }).catch(error => {
                // loading.close();
            })


          }
        });
      },
       // switch开关
      changeSwitch (object) {
        var id=object.id;
        let data = {
            id:id,
            status:object.status,
        };
        API.groupStatus(data).then(res=>{
            this.$message({
                        message: res.msg,
                        type: 'info',
                        duration: 1000
                    });
        });
      },
      //删除
      delete(id) {
        let data = {
          ids:id
        }
        API.groupDelete(data)
          .then(res => {
            this.getItemList();
             this.$message({
                        message: res.msg,
                        type: 'info',
                        duration: 1000
                    });

          }).catch(err => {
        })
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
 @import '../../../assets/css/nav.scss';
  .rightBox{
    width:100%;
    height: 100%;
  }
  .inputBox {
    width: 200px;
  }
</style>
