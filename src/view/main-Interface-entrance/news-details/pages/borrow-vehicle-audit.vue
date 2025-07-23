<template>
  <div class="bus-refueling-audit">
    <div v-loading="loading">
      <div class="head-image">
        <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state_child === 2" alt="">
        <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state_child === 7" alt="">
        <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state_child === 3" alt="">
      </div>
      <title-box-new :title="formData.title">
        <div class="head-content">
          <p style="color: #BBBBBB;">审批编号:{{formData.borrow_flow_code}}</p>
          <p :style="{'color': outColor(formData.state_child)}">
            {{formData.state === 0  ? '发起审批' : formData.state_name}}
          </p>
        </div>
      </title-box-new>
      <item-box-new title="基本信息">
        <el-row :gutter="20">
          <el-col :span="12">
            <p>申请人</p>
            <em>{{formData.borrow_name}}</em>
          </el-col>
          <el-col :span="12">
            <p>申请部门</p>
            <em>{{formData.department}}</em>
          </el-col>
          <el-col :span="12">
            <p>借车时间</p>
            <em>{{formData.borrow_time}}</em>
          </el-col>
          <el-col :span="12">
            <p>预计还车时间</p>
            <em>{{formData.expect_back_time}}</em>
          </el-col>
          <el-col :span="24">
            <p>用车类型</p>
            <!-- <el-select v-model="formData.use_type" size="mini" disabled placeholder="请选择用车类型">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <em>{{formData.use_type_name}}</em>
          </el-col>
          <el-col :span="12">
            <p>驾驶员</p>
            <em>{{formData.borrow_driver_name}}</em>
          </el-col>
          <el-col :span="12">
            <p>乘车人数</p>
            <em>{{formData.passengers}}</em>
          </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <p>出发地</p>
              <em>{{formData.from_address}}</em>
            </el-col>
           <el-col :span="12">
            <p>目的地</p>
            <em>{{formData.to_address}}</em>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="!(flowFields.bus_id === 3)">
          <el-col :span="12">
            <p>车辆别名</p>
            <em v-if="flowFields.bus_id === 1">{{formData.name}}</em>
            <el-select v-model="formData.bus_id" @change="changeSelectBus" v-loading="selectLoading" size="mini" placeholder="请选择车辆" style="width: 100%" v-if="flowFields.bus_id === 2">
              <el-option
                v-for="(item, index) in busList"
                :key="item.code + index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> 
          </el-col>
          <el-col :span="12">
            <p>车牌号</p>
            <em>{{formData.code}}</em>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="!(flowFields.bus_id === 3)">
          <el-col :span="12">
            <p>出车里程</p>
            <em>{{formData.borrow_mile}}</em>
          </el-col>
          <el-col :span="12">
            <p>停放位置</p>
            <em>{{formData.borrow_position}}</em>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <p>申请事由</p>
            <!-- <em>{{formData.purpose}}</em> -->
            <el-input v-model="formData.purpose" autosize type="textarea" class="richText" disabled ></el-input>
          </el-col>
        </el-row>
        <el-row class="image-box">
          <image-file-upload
            :images="formData.img_list"
            :files="formData.file_list"
            :isShowBox="false"></image-file-upload>
        </el-row>
      </item-box-new>
      <!-- 撤回流程 -->
      <item-box-new title="审批流程" v-if="cancelStepList.length">
        <approve-schedule
          :flowData="cancelStepList.length ? cancelStepList : []"
          :isCancel="true">
        </approve-schedule>
      </item-box-new>
      <item-box-new :title="cancelStepList.length ? '撤回流程' : '审批流程'">
        <div v-if="!!formData.borrow_flow_id && !loading">
          <approve-schedule ref="approveSchedule" style="margin-left: 10px;" :isFlow="false" :flow_id="formData.borrow_flow_id" @out-data="getStepData" @on-get="loadData"></approve-schedule>
        </div>
      </item-box-new>
      <div class="bottom-box">
        <div class="btn-left show-flex-box-r">
          <div class="btn-item show-flex-box-r"  v-if="formData.created_id === userId && formData.state_child < 2" @click="openUrgeDialog()">
            <img :src="require('../../../../assets/approverStepIcon/cuiban.png')" alt="">
            <span>催办</span>
          </div>
          <div class="btn-item show-flex-box-r"  v-if="formData.created_id === userId && formData.state_child <= 2" @click="cancelFlow()">
            <i class="el-icon-remove-outline"></i>
            <span>撤销</span>
          </div>
          <div class="btn-item show-flex-box-r" @click="openCommentDialog()">
            <img :src="require('../../../../assets/approverStepIcon/pinglun(1).png')" alt="">
            <span>评论</span>
          </div>
          <div class="btn-item show-flex-box-r" @click="onPrintAudit">
            <i class="el-icon-printer"></i>
            <span>打印</span>
          </div>
          <div class="btn-item show-flex-box-r" @click="markApply">
            <i class="el-icon-s-flag" :style="{'color': setColor(this.markState)}"></i>
            <span>标记</span>
          </div>
        </div>
        <div  v-if="formData.user_ids && formData.user_ids.includes(userId)">
          <el-dropdown trigger="click"  @command="handleCommand">
            <el-button size="small">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="3">退  回</el-dropdown-item>
              <el-dropdown-item command="4">转  交</el-dropdown-item>
              <el-dropdown-item command="5" v-if="!!isAddCheck">加  签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="small" @click="openOpinionDialog(2)">拒 绝</el-button>
          <el-button size="small" type="primary" @click="openOpinionDialog(1)">同 意</el-button>
        </div>
        <div v-show="formData.created_id === userId && formData.state_child == 7">
          <el-button size="small" type="primary" @click="UpdateContract(1)">重新发起</el-button>
        </div>
        <!-- <div v-show="formData.created_id === userId && formData.state == 1">
          <el-button size="small" type="primary" @click="UpdateContract(0)">重新提交</el-button>
        </div> -->
      </div>
      <!-- 同意拒绝 -->
      <el-dialog
        width="500px"
        :title="opinionTitle"
        :visible.sync="opinionShow"
        append-to-body
      >
        <el-form label-width="80px">
          <el-form-item label="意见: ">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="subForm.remark">
            </el-input>
          </el-form-item>
        </el-form>
         <div class="itemBox">
          <el-row>
            <el-col :span="24" style="margin-bottom:10px">
              <span>审批常用语：</span> 
              <el-select v-model="wordIds" @change="getWordsList" filterable multiple collapse-tags placeholder="请选择">
                <el-option
                  v-for="item in commonWordsList"
                  :key="item.id"
                  :label="item.language"
                  :value="item.language">
                  <span style="float: left;max-width:110px;overflow: hidden;text-overflow: ellipsis;">{{ item.language }}</span>
                </el-option>
              </el-select>
              <el-button style="margin-left:10px" type="primary" @click="saveForm">设为常用语</el-button>
            </el-col>
            <el-col :span="6" v-for="(item,index) in wordsList" :key="index" class="commonWords">
                <div class="box" @click="addCommonWords(item.language)">
                  {{item.language}}
                </div>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="opinionShow = false">取 消</el-button>
          <el-button type="primary" @click="submitFormData">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 退回转发 -->
      <return-forward-dialog
        :subForm="subForm"
        :returnUsers="returnUsers"
        :isReturnToOriginator="isReturnToOriginator"
        :dialogBool.sync="returnShow"
        @on-load="loadData"
        @on-opinion="opinionShow = false"
      ></return-forward-dialog>
      <!-- 标记 -->
      <edit-mark
        :markForm="markInfo"
        :markState="markState"
        :markTitle="markTitle"
        :dialogBool.sync="isShowMarkDialog"
        @on-edit="saveMarkForm"
        @on-del="delMarkForm"
        @on-save="saveMarkForm"
      ></edit-mark>
      <!-- 借车审请 -->
      <borrow-form-dialog
         ref="borrowFormDialog"
        :borrowType="borrowType"
        @save-add-edit="saveAddEdit"
        :isShowBorrowUser="isShowBorrowUser"
        :dialogBool.sync="isShowBorrowFormDialog"
      ></borrow-form-dialog>
        <!-- @save-add-draft="saveAddDraft" -->
      <!-- 打印弹窗 -->
    <el-dialog
      width="360px"
      title="选泽打印模板"
      :visible.sync="printShow">
      <el-form ref="printForm" size="mini" :model="printForm" :rules="printRules" label-suffix=":">
        <el-form-item label="打印模板" prop="print_name">
          <el-select v-model="printForm.print_name" placeholder="请选择打印模板">
            <el-option
              v-for="item in printList"
              :key="item.file_name"
              :label="item.temp_name"
              :value="item.file_name">
            </el-option>
          </el-select> 
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="selectPrintForm">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import borrowFormDialog from "@/view/company-management/utility-vehicle-book/component/book-vehicle-table/component/borrow-form-dialog"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import approveSchedule from "@/components/approve-echo/approve-schedule2";
import editMark from "../../launch-affair/component/tableData/edit-mark";                   
import multipleFilesUpload from "@/components/multiple-files-upload";
import returnForwardDialog from '../component/return-forward-dialog';
import imageFileUpload from "@/components/imageFileUpload/index";
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
// 撤回流程
import { getUser } from "@/utils/auth";
export default {
  name: "bus-refueling-audit",
  components: {
    editMark,
    itemBoxNew,
    titleBoxNew,
    approveSchedule,
    imageFileUpload,
    borrowFormDialog,
    multipleFilesUpload,
    getDepartmentSelect,
    returnForwardDialog
  },
  mounted() {
    this.getBusInfoList()
    this.$nextTick(() => {
      this.loadData();
    });
  },
  data() {
    return {
      busList: [], //未使用车辆列表
      loading: false,
      formData: {
        flow_id:0,
        img_list: [],
        file_list: [],
      },
      subForm:{
        flow_id:'', //流程记录id
        step_id:'', //节点id
        state:'', //状态(0待处理1通过2拒绝3退回4转交)
        object_id:'', //对象id(退回节点id/转交用户id)
        remark:'', //备注
      },
      opinionTitle: '审核意见',
      opinionShow: false,
      userId:'',
      returnShow: false,
      returnUsers:[],
      cancelShow: false,  // 是否可以撤回
      isAddCheck:0 , //是否允许加签 0否  1是
      typeList: [
        {label: "本地用车", value: 1},
        {label: "出市用车", value: 2},
        {label: "节假日用车", value: 3},
        {label: "过夜用车", value: 4},
      ],
      isReturnToOriginator: true , //是否允许退回到发起人
      markState: 0,
      markInfo: {},
      isShowMarkDialog: false,
      markTitle: '添加标记',
      isShowBorrowFormDialog: false,
      borrowType: '',
      isShowBorrowUser: true,
      cancelStepList: [], //撤回过的流程

      commonWordsList: [],
      wordsList: [],
      wordIds: [],
      buttons: '',

      selectLoading: false,
      flowFields: {
        bus_id: 1,
        // use_type_name: 1,
      },
      printList: [],
      printShow: false,
      printForm: {
        print_name: '',

      },
      printRules: {
        print_name: [
          {
            required: true,
            message: "请选择打印模板",
            trigger: "change",
          },
        ],
      }
    }
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    model: {
      type: Number,
      default: 0,
    }
  },
  watch: {
    id() {
      if (this.id) {
        this.loadData();
      }
    },
    opinionShow() {
      if(!this.opinionShow) {
        this.subForm.remark = '';
      }
    },
    returnShow() {
      if(!this.returnShow) {
        this.subForm.object_id = '';
        this.subForm.remark = '';
      }
    },
    printShow() {
      if(!this.printShow) {
        // this.printForm.print_name = ''
        this.$refs.printForm.resetFields()
      }
    }
  },
  methods: {
    // 获取未使用车辆列表
    getBusInfoList() {
      let params = {
        state: 0, //未使用
        is_borrow: 2,
        page_index: 1,
        page_size: 10000,
      }
      this.selectLoading = true
      this.$client.getByPageBusManage(params).then(res => {
        this.selectLoading = false;
        if (res.head.result == "200") {
          this.busList = JSON.parse(JSON.stringify(res.context))
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    changeSelectBus(id) {
      this.busList.forEach(item => {
        if(item.id == id) {
          this.formData.code = item.code ? item.code : ''
          this.formData.borrow_mile = item.last_mile ? item.last_mile : ''
          this.formData.borrow_position = item.last_position ? item.last_position : ''
        }
      })
      let params = {
        context: {
          form_data: this.formData,
          step_data: null
        }
      }
      this.$client.UpdateBorrowBus(params).then(res => {})
    },
    // 添加常用语
    saveForm() {
      if (!this.subForm.remark) {
        this.$message({
          showClose: true,
          message: "常用语不能为空，请输入内容",
          type: "warning",
        });
        return
      }
      let parmas = {
        context: {
          sort: -1,
          type: -1,
          buttons: [1,2,3,4],
          is_all: 1,
          form_ids: [],
          language: this.subForm.remark,
        }
      };
      this.$client.AddCommonPhrase(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: "success",
            });
            this.GetListCommonPhrase(this.buttons)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 获取常用语列表
    getWordsList(list) {
      let info = ''
      list.forEach(item => {
        info += item
      })
      this.subForm.remark += info
      this.wordIds = []
    },
    addCommonWords(info){
      this.subForm.remark += info
    },
    // 获取常用语
    GetListCommonPhrase(buttons) {
      let params = {
        context: {
          page_index: 1,
          page_size: 999,
          buttons: [buttons],
          form_ids: [Number(this.model)],
          is_enable: 1
        }
      }
      this.wordIds = []
      this.$client.GetListCommonPhrase(params)
        .then(res => {
          if (res.head.result == "200") {
            this.commonWordsList = res.context.list;
            this.wordsList = this.commonWordsList.slice(0,8)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },

    outColor(state) {
      switch (state) {
        case 1:
          return '#F58A40'
          break;
        case 2:
          return '#0CB780'
          break;
        case 3:
          return '#F2260E'
          break;
        case 7:
          return '#999999'
          break;
      }
    },
    setColor(state) {
      switch (state) {
        case 1:
          return '#F2260E'
          break;
        case 2:
          return '#ff9900'
          break;
        case 3:
          return '#0CB780'
          break;
        default:
          return '#999999'
      }
    },
    // 撤回
    cancelFlow() {
      this.$confirm('此操作将撤回这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: this.subForm.flow_id }).then((req) => {
          setTimeout(() => {
            this.loadData();
          }, 100)
          if (req.head.result === "200") {
            this.cancelShow = false
            this.$message({
              message: req.head.describle,
              type: "success",
            });
          } else {
            this.$message.error(req.head.describle);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤回'
        });
      });
    },
    loadData() {
      if (!this.id) {
        return false;
      }
      this.userId = JSON.parse(getUser()).user_id;
      console.log(this.userId);
      this.loading = true;
      this.$client.LookBorrowDetail({ id: this.id}).then((res) => {
        eventOn.$emit('update-upcoming-matter')
        if(res.head.result == '200') {
          this.formData = Object.assign({}, res.context)
          this.subForm.flow_id = res.context.borrow_flow_id
          let obj = {
            id: res.context.bus_id,
            name: res.context.name,
            code: res.context.code,
            last_mile: res.context.borrow_mile,
            last_position: res.context.borrow_position,
          }
          this.busList.push(obj)
        }else{
          this.$message({
            type: 'error',
            message: res.head.describle,
            showClose: true
          })
        }
        this.loading = false;
      });
    },
    // 0待处理1通过2拒绝3退回4转交5其他人处理6撤销7加签
    handleCommand(command) {
      // 3退回, 4转交, 5,加签
      this.subForm.state = command
      if(command == 5) {
        // 打开加签弹窗
        this.$refs.approveSchedule.countersignDialogVisible = true
        return
      }
      // alert(this.subForm.state)
      console.log(this.returnUsers)
      if(this.subForm.state == 3 && !this.returnUsers.length) {
        this.$message({ message: '没有审核成功退回节点,不能退回!', type: "warning"});
        return
      }
      this.returnShow = true
    },
    // 打开填写理由弹窗
    openOpinionDialog(type) {
      if (type == 2) {
        this.buttons = 3
      } else {
        this.buttons = 4
      }
      this.GetListCommonPhrase(this.buttons)

      this.opinionShow = true
      this.subForm.state = type
      this.opinionTitle = type == 1 ? '审核同意意见' : '审核驳回意见'
    },
    // 获取节点数据
    getStepData(data, info, list){
      this.markInfo = info
      this.markState =  info.state ? info.state : 0
      this.cancelStepList = list.length ? JSON.parse(JSON.stringify(list)) : []
      try{
        if (this.userId === data[0].users[0].id) {
          this.cancelShow = true
        }
        if (data[data.length - 1].state === 8) {
          this.cancelShow = false
        }
      } catch (e) {}
      let isFirst = true;
      if(data && !!data.length) {
        data.forEach((item,index) => {
          if(isFirst && item.state === 1) {
            this.subForm.step_id = item.id
            isFirst = false
          }
          if(index== 0 && item.oper_type==4) {
            this.isAddCheck = item.is_add_check
          }
          // if (index== 0 && item.oper_type==4) {
          //   this.isReturnToOriginator = item.return_back == 0 ? false : true
          // }
          if (this.formData.state == 0 && item.state === 10) {
            this.subForm.step_id = item.id
          }
        });
      }
      this.reqReturnStepData();
      console.log(this.formData.user_ids, this.flowFields, '------------------');
      // if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
      //   this.getFlowFields(this.subForm.step_id)
      // }else {
      //   Object.assign(this.flowFields, this.$options.data().flowFields)
      // }
    },
    // 获取表单字段控制
    getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client.GetFlowFieid(params).then((res) => {
        if (res.head.result == "200") {
          let data = res.context
          let fields = Object.keys(this.flowFields)
          if(data && data.length) {
            data.forEach(item => {
              if(fields.indexOf(item.fieid_code) > -1) {
                this.flowFields[item.fieid_code] = item.type
              }
            })
          }
        }
      }).catch((err) => {});
    },
    // 获取节点数据
    reqReturnStepData() {
      if(!!this.subForm.flow_id && !!this.subForm.step_id) {
        let params = {
          flow_id: this.subForm.flow_id,
          step_id: this.subForm.step_id,
        };
        this.$client.GetBackStepFlowRecord(params).then((res) => {
          if(res.head.result == '200') {
            let retureList = res.context? res.context : []
            this.buildReturnStep(retureList)
          }else{
            this.$message({
              type: 'error',
              message: res.head.describle,
              showClose: true
            })
          }
        });
      }
    },
    // 构建转交节点
    buildReturnStep(data) {
      this.returnUsers = [];
      if(data && !!data.length) {
        data.forEach((item,index) => {
          let obj = {
            seq: item.id,
            title: item.title
          }
          this.returnUsers.push(obj)
        });
      }
       // 如果允许退回到发起人
      if (this.isReturnToOriginator) {
        this.returnUsers.unshift({
          seq: 0,
          title: "退回到发起人"
        })
      }
    },
    // 提交同意和拒绝
    submitFormData() {
      // if(!this.subForm.remark) {
      //   this.$message({
      //     message: '请填写意见',
      //     type: 'warning'
      //   });
      //   return
      // }
      this.suerSubmitInfo();
    },
    // 转交、退回
    returnOk() {
      // if(!this.subForm.remark && this.subForm.state === 3) {
      //   this.$message({
      //     message: '请填写退回理由',
      //     type: 'warning'
      //   });
      //   return
      // }
      this.suerSubmitInfo();
    },
    // 打开评论弹窗
    openCommentDialog() {
      this.$refs.approveSchedule.commentDialogVisible = true
    },
    //  打开催办弹窗
    openUrgeDialog() {
      this.$refs.approveSchedule.urgeDialogVisible = true
    },
    // 确定提交
    suerSubmitInfo() {
      let info = this.$outFormData(this.subForm)
      this.$client.checkFlowRecord({ context: info }).then((req) => {
        setTimeout(() => {
          this.loadData();
        }, 100)
        if (req.head.result === "200") {
          if(this.subForm.state === 1 || this.subForm.state === 2) {
            this.opinionShow = false
          }else{
            this.returnShow = false
          }
          this.$message({
            message: req.head.describle,
            type: "success",
          });
        } else {
          this.$message.error(req.head.describle);
        }
      });
    },
    // 打印
    onPrintAudit() {
      // this.$PrintTemplate(20,this.formData.flow_id)
      let params = {
        context: {
          object_id: 20,
          enable: 1
        }
      }
      this.$client.GetByPage(params).then((req) => {
        let data = req.context.list
        if(!data.length) {
          this.$message({
            showClose: true,
            message: '暂无该表单打印模板,请到打印模板管理确认.',
            type: "error",
          });
          return false
        }
        if(data.length > 1) {
          this.printList = JSON.parse(JSON.stringify(data))
          this.printShow = true
        }else {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + data[0].file_name + '&flow_id=' + this.formData.flow_id
          window.open(url, '_blank')
        }
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: '服务出错,请联系开发人员.',
          type: "error",
        });
      })
    },
    selectPrintForm() {
      this.$refs.printForm.validate((valid) => {
        if (valid) {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + this.printForm.print_name + '&flow_id=' + this.formData.flow_id
          window.open(url, '_blank')
        } else {
          return false;
        }
      });
    },
    // 标记审批单
    markApply() {
      this.markTitle = this.markState ? '取消标记' : '添加标记'
      this.isShowMarkDialog = true
    },
    // 添加编辑标记
    saveMarkForm(val) {
      if(!val.state || !val.remark) {
        this.$message.warning('请填写标记状态及备注')
        return
      }
      let params = {
        context: {
          flow_id: this.formData.borrow_flow_id,
          user_id: this.userId
        }
      }
      params.context = Object.assign({}, params.context, val)
      this.$client.AddFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.$refs.approveSchedule.loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 取消标记
    delMarkForm() {
      let params = {
        context: this.formData.borrow_flow_id,
      }
      this.$client.DelFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.$refs.approveSchedule.loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 撤回重新发起
    UpdateContract(type) {
      this.isShowBorrowUser = true
      if(!!type) {
        let params = { form_id : 20}
        this.$client.GetBehalfByIdFlowManage(params).then(res => {
          if(res.head.result == '200') {
            this.isShowBorrowUser = !res.context
          }
        })
      }
      this.borrowType = !type ? 'commit' : 'update'
      this.isShowBorrowFormDialog = true
      this.$nextTick(() => {
        this.$refs.borrowFormDialog.is_audit = type
        this.$refs.borrowFormDialog.form.is_audit = type
        this.$refs.borrowFormDialog.changeNum = 0
        this.$refs.borrowFormDialog.setData(this.formData)
      })
      
    },
    // 退回到发起人重新发起借车
    saveAddEdit(form,step_data) {
      if(this.borrowType === 'update') {
        let parmas = {
          context: {
            form_data: form,
            step_data: step_data,
          }
        };
        this.$client
          .CreateBorrow(parmas)
          .then((res) => {
            if (res.head.result == "200") { 
              this.loadData()
              this.isShowBorrowFormDialog = false;
              this.$message({
                showClose: true,
                message: '提交借车申请成功',
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
          .catch((err) => {});
      }else {
        alert('编辑后重新提交！')
        // let params = {
        //   context: {}
        // }
        // params.context = Object.assign({}, form)
        // this.$client.UpdateWorkDeal(params).then((req) => {
        //   if (req.head.result === "200") {
        //       this.BackCommitFlowRecord()
        //   } else {
        //     this.$message.error(req.head.describle);
        //   }
        // })
      }
    },
    // 退回至发起人的 重新提交
    BackCommitFlowRecord() {
      let info = {
        flow_id: this.subForm.flow_id,
        step_id: this.subForm.step_id
      }
      this.$client.BackCommitFlowRecord({ context: info }).then((req) => {
        if (req.head.result === "200") {
          this.$message({
            message: req.head.describle,
            type: "success",
          });
        } else {
          this.$message.error(req.head.describle);
        }
        setTimeout(() => {
          this.loadData();
        }, 100)
      });
    },
    // 保存还车草稿
    saveAddDraft(formData) {
      this.$client
        .SaveBorrowDraft({context: {form_data:formData}})
        .then((res) => {
          if (res.head.result == "200") { 
            this.isShowBorrowFormDialog = false;
            this.$message({
              showClose: true,
              message: '借车草稿保存成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bus-refueling-audit {
  .head-image {
    position: absolute
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .head-content {
    position: relative
    width: 100%;
    p {
      font-size: 12px;
      font-weight: 400;
      margin-top: 15px
    }
  }
  .el-row {
    .el-col {
      margin-bottom: 22px;
    }
    p {
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-bottom: 6px
    }
    em, /deep/ .el-textarea__inner {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
  .image-box {
    margin-bottom: 0px;
  }

  .bottom-box {
    width: 915px;
    position: fixed;
    bottom: 12px;
    z-index: 666;
    display: flex
    justify-content: space-between
    padding: 13px
    background: #FFFFFF
    box-shadow: 0px -1px 5px 1px rgba(0,0,0,0.2)
    .btn-item {
      flex-direction: column
      margin-right: 12px
      cursor: pointer
      img {
        height: 22px
        width: 22px
      }
      i {
        font-size: 22px
      }
      span {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .richText {
    width: 100%;
    /deep/ {
      .el-textarea__inner {
        background-color: #fff; 
        border: none;
        cursor: auto;
        padding: 0;
      }
    }
  }
}
.itemBox {
  .commonWords {
    .box {
      padding: 10px;  
      cursor: pointer;
      margin: 5px;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      border-radius: 5px;
      background: #E8E7E7;
      color: #333333;
    }
  }
}

</style>
