<template>
    <div class="staff-manage">
      <div class="">
        <sub-req-first ref="head"
          @on-add="addStaffInfo"
          @on-ok="onSubmit"
          @on-edit="editSatff"
          @on-import="openfiledialog"
          @on-export="exportFile"
          @on-screen="onScreen"
          @delete-select="deleteSelect"
        ></sub-req-first>
        <!-- //高级筛选 -->
         <drawer-dialog ref="drawerDialog" :drawer.sync="isShowDrawerDialog" @on-ok="onSubmit"></drawer-dialog>
        <tr-table
          ref="table"
          :selectionShow="true"
          :data="generalStaffData"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading || headerLoading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedList"
          style="margin-top:10px"
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="staffRowInfo(scope.data)">详情</el-button>
            <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteRowInfo(scope.data,c)" >删除</el-button>
             <!-- <el-button slot="reference" type="danger"  @click="editrepair(scope.data)"  size="mini" style="margin-left: 10px;" :disabled="$isPowerShow('repair')&&scope.data.state!=1">接修</el-button> -->
             <!-- <el-button type="primary" size="mini" @click="showComplete(scope.data)"  :disabled="$isPowerShow('complete')&&scope.data.state!=2">完工</el-button> -->
          </template>
        </tr-table>
        <el-dialog
            title="完工确认"
            :visible.sync="completeDialog"
            width="50%"
            >
            <el-form size="mini" label-width="115px">
        <div class="show-flex-box-r">
          <el-col :span="10">
            <el-form-item label="完工负责人:" prop="i_height">
            <get-user-select   ref="tree"
              v-model="finish_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择完工负责人'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'">
              </get-user-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="完工时间:" prop="c_marry">
              <el-date-picker
                v-model="finish_time	"
                type="datetime"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
               >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </div>
         <div class="show-flex-box-r">
          <el-col :span="20">
            <el-form-item label="完工意见:" prop="i_height">
                <el-input v-model="finish_content" type="textarea" placeholder="备注"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </div>
        </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="completeDialog = false">取 消</el-button>
              <el-button type="primary" @click="doComplete">确 定</el-button>
            </span>
          </el-dialog>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfoFirst.pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfoFirst.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfoFirst.pageCount">
        </el-pagination>

      </div>


      <div class="dialog-box">
        <!-- 添加普通员工、驾驶员信息 -->
         <add-staff-dialog
           ref="addStaffDialog"
           :dialogBool.sync="addStaffDialogShow"
           :showCollapse="showCollapse"
           :curChangeType="curChangeType"
            @sure-save-staff-info="sureSaveStaffInfo"
            @sure-save-Materiel="sureSaveMateriel"
            @sure-save-repair-info="addRepairInfo"
            @add-order-Item="addOrderItem"
            @sure-save-complete-info="showComplete"
          ></add-staff-dialog>
          <!-- 添加线路车辆弹窗 -->
          <circuit-allocation-dialog
            ref="circuitAllocationDialog"
            :dialogBool.sync="circuitAllocationDialogShow"
          ></circuit-allocation-dialog>
          <!-- 上传文件 导出文件弹窗组件 -->
          <file-dialog
            :dialogBool.sync="filedialogVisible"
            :fileData="FileData"
            :typeMessage ="typeMessage"
          ></file-dialog>
          <!-- 表格自定义组件 -->
          <custom-setting
            :dialogBool.sync="customSettingVialogVisible"
            :customSettingList="customSettingFirstList"
            :canRendererTableHeader="canRendererTableHeader"
            :customSettingShowList="customSettingShowList"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
          ></custom-setting>
      </div>

    </div>
</template>
<script type="text/ecmascript-6">
  import getUserSelect from 'components/base/formModel/tree/get-user-select'
  import {getSession, getUser} from '@/utils/auth'
  import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
  import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
  import drawerDialog from "./component/dialog/drawer-dialog";
  import subReqFirst from './component/sub-req-first'
  import subReqSecond from './component/sub-req-second'
  import fileDialog from '@/components/fileDialog/file-dialog'
  import AddStaffDialog from './component/dialog/add-staff-dialog'
  import circuitAllocationDialog from './component/dialog/circuit-allocation-dialog'
  import leaveStaffDialog from './component/dialog/leave-staff-dialog'
  import { formatDateTime } from "@/utils/index";
  export default {
    name: "third-services",
    components: {
      subReqFirst,subReqSecond,fileDialog,drawerDialog,getUserSelectTree,getDriverSelectTree,getUserSelect,
      AddStaffDialog,circuitAllocationDialog,leaveStaffDialog
    },
    data() {
      return {
        c:'1',
        finish_id:'',
        finish_time:'',
        finish_content:'',
        completeDialog:false,
        showCollapse: 'first', // first普通员工 second驾驶员
        curChangeType: 'add', //add添加  edit编辑  detail详情
        typeMessage: '人员',
        pageInfoFirst: { //普通员工列表分页
          pageIndex: 1,
          pageSize: 100,
          pageCount: 0
        },
        pageInfoSecond: { //驾驶员工列表分页
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0
        },
        filedialogVisible: false,
        FileData: {
          url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/工单记录模板.xlsx",
        },
        order_id:'',
        form: {},
        firstQueryform: {},
        secondQueryform: {},
        generalStaffData: [], //普通员工列表
        driverData:[], //驾驶员列表
        loading: false,
        loadingSecond: false,
        TableHeight: 500,
        informationDialogShow: false,
        addStaffDialogShow: false, //添加员工信息
        circuitAllocationDialogShow: false, //添加车辆 线路
        leaveStaffDialogShow: false, //离职人员
        isShowDrawerDialog:false,
        customSettingVialogVisible: false,
        tyreFailIds:[],
        customSettingFirstList:[
          {
            id: 1,
            label: "车牌号",
            prop: "lp_num",
            width: "100",
            align: "center",
            signIndex:0,
            sortable:true
          },
          {
            id: 2,
            label: "自编号",
            prop: "v_num",
            width: "100",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "所属组织",
            prop: "group_name",
            width: "110",
            align: "center",
            signIndex:2,
            sortable:true
          },
          {
            id: 4,
            label: "线路",
            prop: "line_name",
            width: "110",
            align: "center",
            signIndex:3,
            sortable:true
          },
          {
            id: 5,
            label: "车辆型号",
            prop: "vehicle_kind",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:true
          },
          {
            id: 6,
            label: "报修时间",
            prop: "repair_date",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:true
          },
          {
            id: 7,
            label: "三包维修内容",
            prop: "content",
            width: "150",
            align: "center",
            signIndex:6,
            sortable:true
          },
          {
            id: 8,
            label: "三包维修厂家",
            prop: "vender_name",
            width: "150",
            align: "center",
            signIndex:7,
            sortable:true
          },
          {
            id: 9,
            label: "检验员",
            prop: "check_name",
            width: "120",
            align: "center",
            signIndex:8,
            sortable:true
          },
          {
            id: 10,
            label: "备注",
            prop: "remark",
            width: "120",
            align: "center",
            signIndex:9,
            sortable:true
          },
          {
            id: 11,
            label: "录入人",
            prop: "created_name",
            width: "135",
            align: "center",
            signIndex:10,
            sortable:true
          },
          {
            id: 12,
            label: "录入时间",
            prop: "created_date",
            width: "140",
            align: "center",
            signIndex:11,
            sortable:true
          },
          {
            id: 13,
            label: "操作",
            prop: "operation",
            width: "250",
            align: "center",
            signIndex:12,
            sortable:false
          }
        ],
        frontFixedNum:1, //前几行固定
        backFixedNum:1, //后几行固定
        canRendererTableHeader: null,
        canRendererTableHeaderSecond: null,
        customSettingShowList: null,
        titlesId:'', //当前表头的id
        menu_code:'',
        headerLoading: false
      }
    },
    created() {
      this.menu_code = this.$route.meta.code
      this.reqTitleTable()
    },
    mounted() {
      this.$nextTick(() => {
        this.setHead('initialize');
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
        this.$refs.head.onSubmit();
      })
    },
    watch: {
      completeDialog(bool) {
        if (bool === false) {
          this.resetData();
          // Object.assign(this.$data, this.$options.data());
        }
      },
    },
    methods: {
      // 更新表格头部
      updateTableHeader(newestTableHeaderList) {
        this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
          this.canRendererTableHeader = null;
          this.customSettingShowList = null;
          this.reqTitleTable()
        }).catch(err => {

        })
      },
      // 获取表头
      reqTitleTable() {
        this.headerLoading = true;
        this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingFirstList).then(res => {
          this.titlesId = res.titlesId;
          this.canRendererTableHeader = res.canRendererTableHeader;
          this.customSettingFirstList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
          this.$forceUpdate();
          setTimeout(() =>{
            this.headerLoading = false;
          },600)
        }).catch(err => {
          setTimeout(() =>{
            this.headerLoading = false;
          },600)
        })
      },
      jumpVehInfoPage(info){
        console.log(info)
        this.$router.push({
          name:'vehinfo-manage',
          params:{
            numberId: info.vehicle_info.vehicle_number
          }
        })
      },
      // 高级筛选
      onScreen() {
        this.isShowDrawerDialog = true;
      },

      // 导入员工信息Excel

      // 导出Excel普通员工和驾驶员信息
      exportFile(){
        let params = Object.assign({}, this.showCollapse == 'first'? this.firstQueryform : this.secondQueryform);
        let ids = [ ...this.tyreFailIds ]
        if (ids.length) {
          params.ids = ids.toString()
        }
        this.$client.exportMaintRepairPackage(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })

      },
      resetData(){
            this.$refs.tree.onClear();
            this.finish_time = ''
      },
      // 添加员工信息
      addStaffInfo(){
        this.addStaffDialogShow = true
        this.curChangeType = 'add'
        this.$refs['addStaffDialog'].resetData()
      },
      // 更新表格头部
      // updateTableHeader(newestTableHeaderList) {
      //   if(this.showCollapse == 'first') {
      //     this.canRendererTableHeader = null;
      //     this.canRendererTableHeader = newestTableHeaderList;
      //   }else{
      //     this.canRendererTableHeaderSecond = null;
      //     this.canRendererTableHeaderSecond = newestTableHeaderList;
      //   }
      //   this.$forceUpdate()
      // },
      // 打开自定义表格头部弹窗
      openSettingPageEvent() {
        this.customSettingVialogVisible = true;
      },
      // 表格选中一行 sub-req 上点击编辑时
      editSatff(){
        // let val = this.$refs['table'].curSelectedRowInfo
        // if(val){
        //   this.addStaffDialogShow = true
        //   this.$refs['addStaffDialog'].setData(val)
        // }else{
        //   this.$message({type: 'warning', message: '请先选择一条数据'})
        // }
      },
    // 批量删除
    deleteSelect() {
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: "warning",
        });
        return
      }
      const info = null
      this.deleteRowInfo(info,this.tyreFailIds.length);
    },
    editrepair(val){
        const h = this.$createElement
          this.$confirm('', '确认接修', {
          message:h('div',null, [
            h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
            h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认接修？'),
            h('p',{ style:'margin:10px 0 0 40px;' },'接修后，工单状态将变为"维修中",并开始计算维修时长。')
          ]),
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(() => {
          this.$client.updateOrderState({context:{order_id:val.id,state:2}})
          .then(res => {
            if (res.head.result == "200") {
                this.$message({
                type: 'success',
                message: res.head.describle
                });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
            this.$refs.head.onSubmit();
            this.loading = false;
          })
        }).catch(() => {
        });
      },
    //选择
    selectedUpkeepPlanList(tyreFailList) {
      this.tyreFailIds = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
      });
      console.log(JSON.stringify(this.tyreFailIds))
    },
    //删除
    deleteRowInfo(info,i) {
        const h = this.$createElement
        this.$confirm('', '确认删除？', {
          message:h('div',null, [
            h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
            h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认删除？'),
            h('p',{ style:'margin:10px 0 0 40px;' },'当前选中'+i+'条三包维修记录，确认删除吗')
          ]),
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(() => {

       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.deleteRecordMaintRepairPackage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.$refs.head.onSubmit();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
      })
      })
    },
      // 表格上点击编辑时
      editStaffInfo(val){
        this.addStaffDialogShow = true
        this.curChangeType = 'edit'
        this.$refs['addStaffDialog'].setData(val)
      },
      addStaffInfo(){
        this.addStaffDialogShow = true
        this.curChangeType = 'add'
      },
      editrepair(val){
        const h = this.$createElement
          this.$confirm('', '确认接修', {
          message:h('div',null, [
            h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
            h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认接修？'),
            h('p',{ style:'margin:10px 0 0 40px;' },'接修后，工单状态将变为"维修中",并开始计算维修时长。')
          ]),
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(() => {
          this.$client.updateOrderState({context:{order_id:val.id,state:2}})
          .then(res => {
            if (res.head.result == "200") {
                this.$message({
                type: 'success',
                message: res.head.describle
                });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
            this.$refs.head.onSubmit();
            this.loading = false;
          })
        }).catch(() => {
        });
      },
      showComplete(val){
        this.order_id =val.id
        setTimeout(() => {
        let userInfo = JSON.parse(getUser());
        this.finish_id = Number(userInfo.user_id)
         this.finish_time = formatDateTime(new Date())
         this.completeDialog = true
         })
      },
      doComplete(){
        if(!this.finish_id){
           this.$message({ type: "warning", message: "填写完工负责人" });
          return
        }
          if(!this.finish_time){
           this.$message({ type: "warning", message: "填写完工时间" });
          return
        }

         this.$client.updateOrderState({context:{order_id:this.order_id,state:3,finish_id:this.finish_id,finish_time:this.finish_time,finish_content:this.finish_content}})
          .then(res => {
            if (res.head.result == "200") {
                this.$message({
                type: 'success',
                message: res.head.describle
                });
                 this.$refs.head.onSubmit();
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
            this.loading = false;
          })
          this.completeDialog = false
          // this.$refs.driverTree1.onClear();
          this.finish_time=''
          this.finish_content=''
      },
      // 员工详情
      staffRowInfo(val) {
        this.addStaffDialogShow = true
        this.curChangeType = 'detail'
        this.$refs['addStaffDialog'].setData(val)
      },
      //路线分配
      openRouteAllocationPop(staffInfo) {
        this.circuitAllocationDialogShow = true;
        this.$refs.circuitAllocationDialog.ruleForm.c_name = staffInfo.c_name;
        this.$refs.circuitAllocationDialog.ruleForm.department = staffInfo.department;
        this.$refs.circuitAllocationDialog.department_name = staffInfo.department_name;
      },
      // 打开导入文件弹窗
      openfiledialog(){
        this.filedialogVisible = true
      },
      // 分页切换事件
      handleCurrentChange(idx) {
        if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = idx
          this.loadDataGeneralStaff()
        }else{
          this.pageInfoSecond.pageIndex = idx;
        }
      },
    //     onSelectChange(vehs,nodes) {
    //   // alert(JSON.stringify(nodes))
    //   if(nodes && nodes.length > 0) {

    //     nodes.forEach((item,index) => {
    //       delete item.children
    //     });
    //     this.ruleForm.reminders = nodes
    //   }else{
    //     this.ruleForm.reminders = []
    //   }
    // },
      // 切换每页条数
      handleSizeChange(sizes) {
        if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageSize = sizes;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff()
        }else{
          this.pageInfoSecond.pageIndex = 1;
          this.pageInfoSecond.pageSize = sizes;
          this.pageInfoSecond.pageCount = 0;
        }
      },
      // 查询
      onSubmit(form) {
        console.log(form)
        this.firstQueryform = {};
        this.secondQueryform = {}
        if(this.showCollapse == 'first') {
          this.firstQueryform = form;
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff();
        }else{
          this.secondQueryform = form;
          this.pageInfoSecond.pageIndex = 1;
          this.pageInfoSecond.pageCount = 0;
        }
      },
      // 加载工单列表
      loadDataGeneralStaff() {
        this.loading = true
        let params = {};
        if(this.showCollapse == 'first') {
          params = Object.assign({},this.firstQueryform);
        }
        params.page_index = this.pageInfoFirst.pageIndex;
        params.page_size = this.pageInfoFirst.pageSize;
        this.$client.getByPageMaintRepairPackage(params)
          .then(res => {
            if (res.head.result == "200") {
              this.generalStaffData = res.context.list;
              this.pageInfoFirst.pageCount = res.context.total
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
            this.loading = false;
          })
      },
      //去重
       unique(arr) {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr) && res.set(arr, 1));
        },
    //保存物料清单
     sureSaveMateriel(context){
        let params = {
          context: context
        };
       this.$client.addMaterialMaintRepairOrder(params)
         .then(res => {
          if(res.head.result == '200') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
            if(context.activeName){
            }else{
            this.addStaffDialogShow = false;
            }
            this.$refs.head.onSubmit();
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
     },

      // 编辑、保存
      sureSaveStaffInfo(context){
        let params = {
          context: context
        };
        if(this.curChangeType=='edit'){
          this.$client.setRecordMaintRepairPackage(params)
         .then(res => {
          if(res.head.result == '200') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
            // const message ={work_code:res.context.work_code,vehicle_info:res.context.vehicle_info,order_id:res.context.id,maint_dept:res.context.maint_dept}
            // this.$refs['addStaffDialog'].addMessage(message)
            if(context.activeName){
            }else{
              this.addStaffDialogShow = false;
              }
            this.$refs.head.onSubmit();
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
        }else{
        this.$client.setRecordMaintRepairPackage(params)
        .then(res => {
          if(res.head.result == '200') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
            // const message ={work_code:res.context.work_code,vehicle_info:res.context.vehicle_info,order_id:res.context.id,maint_dept:res.context.maint_dept}
            //  this.$refs['addStaffDialog'].addMessage(message)
            if(context.activeName){
            }else{
              this.addStaffDialogShow = false;
              }
            this.$refs.head.onSubmit();
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
        }
      },
      addOrderItem(context){
        console.log
        let params = {
          context: context
        };
        this.$client.addOrderItem(params)
        .then(res => {
          if(res.head.result == '200') {
            // this.addStaffDialogShow = false;
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
             if(context.activeName){
            }else{
              this.addStaffDialogShow = false;
              }
             this.$refs.head.onSubmit();
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
      },
      addRepairInfo(context){
        console.log(context,777)
        let params = {
          context: context
        };
        this.$client.AddOrderFile(params)
        .then(res => {
          if(res.head.result == '200') {
            this.addStaffDialogShow = false;
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
             if(context.activeName){
            }else{
              this.addStaffDialogShow = false;
              }
             this.$refs.head.onSubmit();
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
      },
      // 打开已离职人员列表
      openLeaveOfficeUser() {
        this.leaveStaffDialogShow = true;
      },
      // 选中的员工ID
      selectedList(tyreFailList) {
      this.tyreFailIds = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
      });
      console.log(this.tyreFailIds)
      },
      // 计算表格高度
      setHead(type) {
        if(type == 'initialize') {
          this.canRendererTableHeader = this.customSettingFirstList;
        }
        setTimeout(() => {
          let maxh = this.$el.offsetHeight;
          let th = this.$refs.head.$el.offsetHeight;
          let paginationH = this.$refs.paginationH.$el.offsetHeight;
          this.TableHeight = maxh - th - paginationH;
          console.log(this.TableHeight);
        }, 60);
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  .staff-manage
    width 100%
    height 100%
    .mark {
        width: 5px;
        height: 5px;
        border-radius:20px;
        display: inline-block;
        margin-bottom: 2px

    }
</style>
