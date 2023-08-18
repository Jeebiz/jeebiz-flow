<template>
  <div class="content">
    <div class="center" ref="rightBox">
        <div class="btnBox" ref="btnBox">
          <el-select size="small" v-model="gtexts" filterable placeholder="分组" clearable>
            <el-option
              v-for="item in gtextList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
          <el-select size="small" v-model="type" filterable placeholder="状态" clearable>
            <el-option
              v-for="item in statuList"
              :key="item.value+'aa'"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入关键词" class="inputBox" v-model="keyword"></el-input>
         <el-button size="small" icon="el-icon-search" round type="primary" @click="search">搜索</el-button>
        </div>

         <div class="btnBoxes" style="padding:24px 0" ref="btnBoxes">
            <!-- <el-button size="small" round @click="addClick">创建数据</el-button>
            <el-button size="small" round @click="batchDelete">删除数据</el-button>
            <el-button size="small" round>导入数据</el-button>
            <el-button size="small" round>导出数据</el-button> -->
            <el-button size="small" round v-for="(item, index) in btnList" :key="index" @click="btnClick(index, item)">
			      	{{item.name}}
			      </el-button>
         </div>
        <el-table
          :height="tableHeight"
          :data="tableData"
          v-loading="loading"
          size="medium"
          style="width: 100%;"
          :header-cell-style="{background:'rgba(248,248,248,1)', color:'#606266'}"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="order" label="排序"></el-table-column>
           <el-table-column  prop="gtext" label="分组"></el-table-column>
            <el-table-column  prop="key" label="数据代码"></el-table-column>
            <el-table-column prop="value" label="数据值" ></el-table-column>
          <el-table-column prop="status" label="状态" >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#8DD87E"
                  active-value="1"
                  inactive-color="#FF6666"
                  inactive-value="0"
                  @change="changeSwitch(scope.row)">
                </el-switch>
          </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="medium" type="text" v-show="hasPermission('keyvalue:renew')" @click="editClick(scope.row)" >编辑</el-button>
              <el-button size="medium" type="text" v-show="hasPermission('keyvalue:delete')" @click="deleteClick(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination style="margin-top: 24px;" :pager="pager" @query="getItemList" @setPager="setPager"></pagination>
        <!-- 基础数据弹出框 -->
        <el-dialog  :visible.sync="dialogFormVisible" width="30%" :title="titles" center :close-on-click-modal="false">
          <el-form :model="form" ref="form" :rules="rules" >
            <el-form-item label="分组" :label-width="formLabelWidth" prop="gtext">
                <el-select size="small" v-model="form.gtext" filterable placeholder="分组" clearable >
                    <el-option
                      v-for="items in gtextLists"
                      :key="items.key"
                      :label="items.value"
                      :value="items.key">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="数据代码" :label-width="formLabelWidth" prop="key">
              <el-input size="small" v-model="form.key" autocomplete="off" style="max-width:215px;" placeholder="请输入分类级别"></el-input>
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth" prop="order">
              <el-input size="small" v-model="form.order" autocomplete="off" style="max-width:215px;" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="数据值" :label-width="formLabelWidth" prop="value">
              <el-input size="small" v-model="form.value" autocomplete="off" style="max-width:215px;" placeholder="请输入简述"></el-input>
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
               <el-switch
                  v-model="form.status"
                  active-color="#8DD87E"
                  active-value="1"
                  inactive-color="#FF6666"
                  inactive-value="0"
                  >
                </el-switch>
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
  import validator from '@/assets/js/validation/regexp';
  import permissionMix from '@/mixin/permissionMix';

  export default {
    props: ['btnList'],
	  mixins : [permissionMix],
    name: "campus_manage",
    components: {
      Pagination
    },
    created() {
      this.getItemList();
      this.getGroups();//查询下拉列表
    },
    mounted(){
    },
    data() {
      return {
        type: '',
        titles:'',//标题
        gtexts:'',
        status:'',
        gtextLists:[],
        gtextList: [],
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
        formLabelWidth: '120px',
        loading: false,
        tableHeight: null,
        form: {
          gtext:"",
          key:"",
          value:"",
          status:"1",
        },
        pager: {
          total: 1,
          pageNo: 1,//当前第几页
          limit: 10,//每页显示的条数
        },
        rules: {
          gtext: [
            {required: true, message: '必选', trigger: 'change'},
          ],
          order: [
            {required: true, message: '请输入排序数字', trigger: 'blur'},
            // {required: true, message: '请输入数字', pattern: validator.cnumber , trigger: 'blur'},
          ],
          key: [
            {required: true, message: '请输入简述', trigger: 'blur'},
          ],
          value: [
            {required: true, message: '请输入关键字', trigger: 'blur'},
          ],
          status: [
            {required: true, message: '必选', trigger: 'change'},
          ],
        },
        deletePopoverVisible: false,
      };
    },
    methods: {
      // searchClick(){
      //   this.getItemList();
      // },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      search(){
        this.pager.pageNo = 1;
        this.getItemList();
      },
      getGroups(){
        API.keyvalueGroups().then(res => {
          if (res.code==0) {
              this.gtextList = res.data
              this.gtextLists = res.data
          }

          }).catch(err => {

        })

      },
      editClick(data) {
        this.dialogFormVisible = true;
        this.titles = '编辑基础数据'
        let form =this.$refs['form'];
        if(form){form.resetFields();}
        this.form = JSON.parse(JSON.stringify(data));
      },

      btnClick (index, item) {
        if (item.perms == "keyvalue:new") {
          this.dialogFormVisible = true;
          this.titles = '新增基础数据'
          let form =this.$refs['form'];
          if(form){form.resetFields();}
          this.form = {
            gtext:"",
            key:"",
            value:"",
            status:"1",
          }
        }if (item.perms == "keyvalue:delete") {
           //批量删除
          let that = this;
          if(that.multipleSelection.length === 0){
            this.$message({
              message: '请选择基础数据!',
              type: 'info',
              duration: 1000
            });
          }else{
            let ids = '';
            that.$confirm('确认删除？','提示',{
              type: 'error'
            }).then(_ => {
              that.multipleSelection.map((item)=>{
                ids += item.id + ',';
              });
              if(ids.length > 1){
                ids = ids.substring(0,ids.length-1);
              }
              this.delete(ids);
            }).catch(_ => {
            });
          }
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
            pageNo:this.pager.pageNo+'',
            limit:this.pager.limit+'',
            gkey:this.gtexts,
            status:this.type,
            value:this.keyword
        };
        API.keyvalueList(data).then(res => {
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
           const data = {
             gkey:this.form.gtext,
             label:this.form.gtext,
             order: this.form.order,
             key:this.form.key,
             value:this.form.value,
             status:this.form.status,
          }
          const data1={
             gkey:this.form.gtext,
             label:this.form.gtext,
             order: this.form.order,
             key:this.form.key,
             value:this.form.value,
             status:this.form.status,
             id:this.form.id
          }
            if(this.form.id){//编辑
              API.keyvalueRenew(data1)
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

              })
            }else {
              API.keyvalueNew(data)
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
                }).catch(err => {
              })
            }
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
        API.keyvalueStatus(data).then(res=>{
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
        API.keyvalueDelete(data)
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
