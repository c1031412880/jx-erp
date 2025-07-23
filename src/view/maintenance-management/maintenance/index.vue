<template>
    <div class="staff-manage">
      <div class="" v-show="showCollapse == 'first'">
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
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedList"
          style="margin-top:10px"
        >
         <template slot-scope="scope" slot="state_detail_name">
                <div  v-if="scope.data.state == 1">
            <div style="color: #d71345;">
            <p class = "mark" style="background-color: #d71345;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
          <div  v-else-if="scope.data.state == 2">
            <div style="color: #18BE6B;">
            <p class = "mark" style="background-color: #18BE6B;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
          <div   v-else-if="scope.data.state == 3">
          <div style="color: #c88400;">
            <p class = "mark" style="background-color: #c88400;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
          <div   v-else-if="scope.data.state == 4">
          <div style="color: #ffc20e;">
            <p class = "mark" style="background-color: #ffc20e;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
          <div   v-else-if="scope.data.state == 5">
          <div style="color: #409EFF;">
            <p class = "mark" style="background-color: #409EFF;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
          <div   v-else-if="scope.data.state == 7" >
          <div style="color: #77787b;">
            <p class = "mark" style="background-color: #77787b;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
        </template>
          <template slot-scope="scope" slot="vehicle_number">
            <span v-if="scope.data.vehicle_info == null" ></span>
              <el-button v-else type="text" size="mini" @click="jumpVehInfoPage(scope.data)">{{scope.data.vehicle_info.vehicle_number}}</el-button>
          </template>
          <template slot-scope="scope" slot="vehicle_name">
            <span v-if="scope.data.vehicle_info == null" ></span>
            <span v-else>{{scope.data.vehicle_info.vehicle_name}}</span>
          </template>
            <template slot-scope="scope" slot="department_name">
          <span v-if="scope.data.vehicle_info == null" ></span>
          <span v-else>{{scope.data.vehicle_info.department_name}}</span>
        </template>
        <template slot-scope="scope" slot="vehicle_kind_name">
          <span v-if="scope.data.vehicle_info == null" ></span>
          <span v-else>{{scope.data.vehicle_info.vehicle_kind_name}}</span>
        </template>
        <template slot-scope="scope" slot="check_time">
          <span v-if="scope.data.repair_check == null" ></span>
          <span v-else>{{scope.data.repair_check.check_time}}</span>
        </template>
        <template slot-scope="scope" slot="check_describe">
          <span v-if="scope.data.repair_check == null" ></span>
          <span v-else>{{scope.data.repair_check.check_describe}}</span>
        </template>
        <template slot-scope="scope" slot="state_child">
          <span v-if="scope.data.repair_check == null" ></span>
          <span v-else>{{scope.data.repair_check.state_child}}</span>
        </template>
        <template slot-scope="scope" slot="total_hours">
          <span v-if="scope.data.repair_items == null" ></span>
          <span v-else>{{scope.data.total_hours}}</span>
        </template>
        <template slot-scope="scope" slot="material_fee">
          <span v-if="scope.data.repair_items == null" ></span>
          <span v-else>{{scope.data.material_fee}}</span>
        </template>
         <template slot-scope="scope" slot="item_name">
          <span v-if="scope.data.item_name == null" ></span>
          <span v-else>{{scope.data.item_name}}</span>
        </template>
        <template slot-scope="scope" slot="person_name">
          <span v-if="scope.data.person_name == null" ></span>
          <span v-else>{{scope.data.person_name}}</span>
        </template>
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
            :customSettingList="showCollapse == 'first'?customSettingFirstList:customSettingSecondList"
            :canRendererTableHeader="showCollapse == 'first'?canRendererTableHeader:canRendererTableHeaderSecond"
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
    name: "maintenance",
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
          pageSize: 20,
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
            label: "自编号",
            prop: "vehicle_number",
            width: "150",
            align: "center",
            signIndex:0,
            sortable:true
          },
          {
            id: 2,
            label: "车牌号",
            prop: "vehicle_name",
            width: "140",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "所属组织",
            prop: "department_name",
            width: "110",
            align: "center",
            signIndex:2,
            sortable:true
          },
          {
            id: 4,
            label: "车辆型号",
            prop: "vehicle_kind_name",
            width: "110",
            align: "center",
            signIndex:3,
            sortable:true
          },
          {
            id: 5,
            label: "工单号码",
            prop: "work_code",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:true
          },
          {
            id: 6,
            label: "工单状态",
            prop: "state_name",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:true
          },
          {
            id: 7,
            label: "工单类别",
            prop: "type_child_name",
            width: "130",
            align: "center",
            signIndex:6,
            sortable:true
          },
          {
            id: 8,
            label: "报修时间",
            prop: "repair_time",
            width: "120",
            align: "center",
            signIndex:7,
            sortable:true
          },
          {
            id: 9,
            label: "报修地点",
            prop: "repair_address",
            width: "120",
            align: "center",
            signIndex:8,
            sortable:true
          },
          // {
          //   id: 10,
          //   label: "电工修理项目",
          //   prop: "elc_name",
          //   width: "150",
          //   align: "center",
          //   signIndex:9,
          //   sortable:true
          // },
          // {
          //   id: 11,
          //   label: "电工工时",
          //   prop: "elc_hours",
          //   width: "135",
          //   align: "center",
          //   signIndex:10,
          //   sortable:true
          // },
          //  {
          //   id: 11,
          //   label: "电工修理人",
          //   prop: "elc_person",
          //   width: "135",
          //   align: "center",
          //   signIndex:10,
          //   sortable:true
          // },
          // {
          //   id: 12,
          //   label: "装配工修理项目",
          //   prop: "ins_name",
          //   width: "160",
          //   align: "center",
          //   signIndex:11,
          //   sortable:true
          // },
          // {
          //   id: 13,
          //   label: "装配工时",
          //   prop: "ins_hours",
          //   width: "110",
          //   align: "center",
          //   signIndex:12,
          //   sortable:true
          // },
          // {
          //   id: 14,
          //   label: "装配工修理人",
          //   prop: "ins_person",
          //   width: "110",
          //   align: "center",
          //   signIndex:13,
          //   sortable:true
          // },
          // {
          //   id: 15,
          //   label: "胎工修理项目",
          //   prop: "tire_name",
          //   width: "150",
          //   align: "center",
          //   signIndex:14,
          //   sortable:true
          // },
          // {
          //   id: 15,
          //   label: "胎工工时",
          //   prop: "tire_hours",
          //   width: "150",
          //   align: "center",
          //   signIndex:14,
          //   sortable:true
          // },
          // {
          //   id: 16,
          //   label: "胎工修理人员",
          //   prop: "tire_person",
          //   width: "150",
          //   align: "center",
          //   signIndex:15,
          //   sortable:true
          // },
          {
            id: 10,
            label: "维修总工时",
            prop: "total_hours",
            width: "120",
            align: "center",
            signIndex:9,
            sortable:false
          },
            {
            id: 11,
            label: "物料费用",
            prop: "total_materials",
            width: "120",
            align: "center",
            signIndex:10,
            sortable:false
          },
            {
            id: 12,
            label: "完工时间",
            prop: "finish_check_time",
            width: "120",
            align: "center",
            signIndex:11,
            sortable:false
          },
            {
            id: 13,
            label: "出厂时间",
            prop: "out_time",
            width: "120",
            align: "center",
            signIndex:12,
            sortable:false
          },
            {
            id: 14,
            label: "工单备注",
            prop: "remark",
            width: "120",
            align: "center",
            signIndex:11,
            sortable:false
          },
            {
            id: 15,
            label: "检验员",
            prop: "finish_check_name",
            width: "120",
            align: "center",
            signIndex:14,
            sortable:false
          },
            {
            id: 16,
            label: "录入人",
            prop: "create_name",
            width: "120",
            align: "center",
            signIndex:15,
            sortable:false
          },
          {
            id: 17,
            label: "操作",
            prop: "operation",
            width: "250",
            align: "center",
            signIndex:16,
            sortable:false
          }
        ],
        customSettingSecondList: [],
        frontFixedNum:1, //前几行固定
        backFixedNum:1, //后几行固定
        canRendererTableHeader: null,
        canRendererTableHeaderSecond: null,
        customSettingShowList: null,
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.head.onSubmit();
        this.setHead('initialize');
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
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
          params.ids = ids
        }
        this.$client.exporMaintRepairOrder(params)
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
      updateTableHeader(newestTableHeaderList) {
        if(this.showCollapse == 'first') {
          this.canRendererTableHeader = null;
          this.customSettingShowList = null;
          this.customSettingShowList = newestTableHeaderList;
          this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
            let obj = {
              id: index +1,
              label: sing.label,
              prop: sing.prop,
              width: sing.width,
              align: sing.align,
              signIndex: index,
              sortable: sing.sortable,
            }
            return obj
          });
        }else{
          this.canRendererTableHeaderSecond = null;
          this.canRendererTableHeaderSecond = newestTableHeaderList;
        }
        this.$forceUpdate()
      },
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
        this.$confirm('', '确认删除', {
          message:h('div',null, [
            h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
            h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认删除？'),
            h('p',{ style:'margin:10px 0 0 40px;' },'当前选中'+i+'条工单记录，确认删除吗')
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
      this.$client.updateOrderScrap(params)
      .then(res => {
        if (res.head.result == "200") {
          this.$refs.head.onSubmit();
          this.$message({
            showClose: true,
            message: "作废成功",
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
        console.log(params);
        params.page_index = this.pageInfoFirst.pageIndex;
        params.page_size = this.pageInfoFirst.pageSize;
        this.$client.getByPageSimpletMaintRepairOrder(params)
          .then(res => {
            if (res.head.result == "200") {
              this.generalStaffData = res.context.list;
              this.pageInfoFirst.pageCount = res.context.total
              res.context.list.forEach(ele => {
                console.log(ele.repair_items.length)
                if(ele.repair_items.length>0){
                  const itemList =[]
                  const person_name =[]
                  ele.repair_items.forEach(element => {
                    itemList.push(element.item_name)
                    person_name.push(element.person_name)
                  });
                  var i = this.generalStaffData.findIndex(item=>{return item.id == ele.id})
                  this.$set(this.generalStaffData[i],'item_name',itemList.toString())
                  let person_name1 = this.unique(person_name);
                  this.$set(this.generalStaffData[i],'person_name',person_name1.toString())
                }
               });
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
          this.$client.updateSimpleMaintRepairOrder(params)
         .then(res => {
          if(res.head.result == '200') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
            const message ={work_code:res.context.work_code,vehicle_info:res.context.vehicle_info,order_id:res.context.id,maint_dept:res.context.maint_dept}
            this.$refs['addStaffDialog'].addMessage(message)
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
        this.$client.addSimpleMaintRepairOrder(params)
        .then(res => {
          if(res.head.result == '200') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
            const message ={work_code:res.context.work_code,vehicle_info:res.context.vehicle_info,order_id:res.context.id,maint_dept:res.context.maint_dept}
             this.$refs['addStaffDialog'].addMessage(message)
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
        this.customSettingShowList = this.customSettingFirstList;
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
    watch: {
      addStaffDialogShow() {
        if(!this.addStaffDialogShow) {
          this.curChangeType = ''
        }
      }
    }
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
