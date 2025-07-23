<template>
  <div class="accident-detail-dispose" v-loading="loading">
    <el-card class="box-card" style="margin-bottom: 20px;">
      <div class="show-flex-box-r" style="justify-content: space-between;align-items: center; margin-bottom:20px;" v-if="formData.user_ids && formData.user_ids.includes(userId)">
        <span style="font-weight: 700;font-size: 18px;">事故详情{{ (formData.replace_name ? ('(' + formData.replace_name + ')') : '')}}</span>
        <div >
          <el-button type="primary" size="mini" @click="openOpinionDialog(1)">同意</el-button>
          <el-button type="primary" size="mini" @click="openOpinionDialog(2)">驳回</el-button>
          <el-button type="" size="mini" class="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div style="padding: 0 20px;">
        <el-descriptions :title="formData.title">
          <el-descriptions-item label="事故编号">{{formData.c_accident_code}}</el-descriptions-item>
          <el-descriptions-item label="处理流程状态">{{formData.ex_state}}</el-descriptions-item>
      </el-descriptions>
      </div>
    </el-card>
    <el-card class="box-card">
      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">基本信息</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="自编号">{{formData.vehicle_number}}</el-descriptions-item>
            <el-descriptions-item label="车牌号">{{formData.lincense_plate_number}}</el-descriptions-item>
            <el-descriptions-item label="线路">{{formData.line}}</el-descriptions-item>
            <el-descriptions-item label="所属组织">{{formData.department_name}}</el-descriptions-item>
            <el-descriptions-item label="事故驾驶员">{{formData.driver_name}}</el-descriptions-item>
            <el-descriptions-item label="事故性质">{{formData.accident_nature}}</el-descriptions-item>
            <el-descriptions-item label="事故发生时间">{{formData.d_accident_date}}</el-descriptions-item>
            <el-descriptions-item label="事故责任">{{formData.accident_duty}}</el-descriptions-item>
            <el-descriptions-item label="事故分类">{{formData.accident_type}}</el-descriptions-item>
            <el-descriptions-item label="事故等级">{{formData.accident_category}}</el-descriptions-item>
            <el-descriptions-item label="事故原因">{{formData.accident_reason}}</el-descriptions-item>
            <el-descriptions-item label="事故地点类别">{{formData.accident_address_type}}</el-descriptions-item>
            <el-descriptions-item label="事故地点类别">{{formData.accident_address_type}}</el-descriptions-item>
            <el-descriptions-item label="事故地点 ">{{formData.c_accident_address}}</el-descriptions-item>
            <el-descriptions-item label="事故类型">{{formData.accident_lx}}</el-descriptions-item>
            <el-descriptions-item label="事故天气">{{formData.accident_weather}}</el-descriptions-item>
            <el-descriptions-item label="是否私了">{{formData.is_person_wound ? '是' : '否'}}</el-descriptions-item>
            <el-descriptions-item label="金钱流向" v-if="formData.is_person_wound">{{formData.money_reten}}</el-descriptions-item>
            <el-descriptions-item label="客伤评定无责事故">{{formData.is_responsibility ? '是' : '否'}}</el-descriptions-item>
            <el-descriptions-item label="事故描述">{{formData.c_describe}}</el-descriptions-item>
            <!-- <el-descriptions-item label="事故教育">

            </el-descriptions-item> -->
            <!-- <el-descriptions-item label="附件">{{formData.c_accident_code}}</el-descriptions-item> -->

          </el-descriptions>
          <div class="list-data-list show-flex-box-r" style="margin-bottom:10px;">
            <span style="font-size: 14px;color: #606266; margin-right: 10px;white-space: nowrap;">事故图片:</span>
            <div v-if="imagesList && imagesList.length > 0">
              <ul class="list-data" v-for="(item,index) in imagesList" :key="index">
                <li class="item" v-if="item">
                  <image-box :src="item" :id="index+1"></image-box>
                </li>
                <!-- <li class="item unchecked" v-else @click="uploadFile()">
                  <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                </li> -->
              </ul>
            </div>
            <span v-else style="font-size: 12px; color:#909399">暂无事故现场图片</span>

          </div>
          <div class="list-data-list show-flex-box-r">
            <span style="font-size: 14px;color: #606266;height: 100px; margin-right: 10px; flex-shrink: 0;">附件:</span>
            <div v-if="fileLists && fileLists.length" style="flex-grow: 1;">
              <multiple-files-upload :filesList="fileLists" :disabled="true"></multiple-files-upload>
            </div>
            <span v-else style="font-size: 12px; color:#909399">暂无附件</span>
          </div>

        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">费用信息</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="预估费用(元)">{{formData.n_fee}}</el-descriptions-item>
            <el-descriptions-item label="医疗费用(元)">{{formData.n_medical_fee}}</el-descriptions-item>
            <el-descriptions-item label="误工费用(元)">{{formData.n_missed_fee}}</el-descriptions-item>
            <el-descriptions-item label="护理费用(元)">{{formData.n_nursing_fee}}</el-descriptions-item>
            <el-descriptions-item label="伙食费用(元)">{{formData.n_food_fee}}</el-descriptions-item>
            <el-descriptions-item label="交通费用(元)">{{formData.n_traffic_fee}}</el-descriptions-item>
            <el-descriptions-item label="实际维修费用(元)">{{formData.n_actual_fee}}</el-descriptions-item>
            <el-descriptions-item label="保险提交金额(元)">{{formData.n_insurance_post_fee}}</el-descriptions-item>
            <el-descriptions-item label="保险赔付金额(元)">{{formData.n_insurance_pay_fee}}</el-descriptions-item>
            <el-descriptions-item label="他人赔付金额(元)">{{formData.n_personal_fee}}</el-descriptions-item>
            <el-descriptions-item label="事故净损失(元)"><span style="color: #D9001B">{{formData.n_loss_fee}}</span></el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div style="margin-bottom: 20px;" v-for="(item,index) in tableHeaderKey" :key="index">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">{{tableHeaderKeyName[item]}}</span>
        </div>
        <div style="padding: 0 20px;">
          <tr-table
            :selectionShow="false"
            :data="dataMap[item]"
            :tableHeaderList="tableHeaderData[item]"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false"
          >
          </tr-table>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">事故处理</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="事故经办人">{{formData.agent}}</el-descriptions-item>
            <el-descriptions-item label="处理日期">{{formData.d_result_date}}</el-descriptions-item>
            <el-descriptions-item label="处理人">{{formData.disposer}}</el-descriptions-item>
            <el-descriptions-item label="处罚依据">{{formData.according_to}}</el-descriptions-item>
            <el-descriptions-item label="安全奖扣款">{{formData.n_result_cost}}</el-descriptions-item>
            <el-descriptions-item label="扣分">{{formData.n_deduct_points}}</el-descriptions-item>
            <el-descriptions-item label="处理方式">{{formData.handling_method}}</el-descriptions-item>
            <el-descriptions-item label="处理意见">{{formData.c_result_remark}}</el-descriptions-item>
            <!-- <el-descriptions-item label="安全里程">{{formData.n_result_mile}}</el-descriptions-item>
            <el-descriptions-item label="处理意见">{{formData.c_result_remark}}</el-descriptions-item>
            <el-descriptions-item label="罚款">{{formData.n_result_cost}}</el-descriptions-item>
            <el-descriptions-item label="实际维修费用(元)">{{formData.n_actual_fee}}</el-descriptions-item> -->
          </el-descriptions>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">事故教育</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="教育时间">{{formData.date}}</el-descriptions-item>
            <el-descriptions-item label="教育地点">{{formData.address}}</el-descriptions-item>
            <el-descriptions-item label="教育人">{{formData.host_name}}</el-descriptions-item>
            <el-descriptions-item label="记录人">{{formData.record_name}}</el-descriptions-item>
            <el-descriptions-item label="教育主要内容记录">{{formData.main_content}}</el-descriptions-item>
          </el-descriptions>
          <div class="list-data-list show-flex-box-r" style="margin-bottom:10px;">
            <span style="font-size: 14px;color: #606266; margin-right: 10px;white-space: nowrap;">教育图片:</span>
            <div v-if="formData.img_list && formData.img_list.length > 0">
              <ul class="list-data" v-for="(item,index) in formData.img_list" :key="index">
                <li class="item" v-if="item">
                  <image-box :src="item" :id="index+1"></image-box>
                </li>
              </ul>
            </div>
            <span v-else style="font-size: 12px; color:#909399">暂无教育图片</span>

          </div>
        </div>
      </div>
      <div style="margin-bottom: 20px;" v-if="formData.flow_id && !loading">
        <approve-schedule :isFlow="false" :flow_id="formData.flow_id" @out-data="getStepData"></approve-schedule>
      </div>
    </el-card>

    <el-dialog
      width="500px"
      title="审核意见"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="opinionShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFormData">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import imageBox from './component/image-box'
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
import tableHeader from './component/table-header'
import multipleFilesUpload from "@/components/multiple-files-upload";
import { getUser } from "@/utils/auth";
export default {
  name: "accident-detail-audit",
  components: {
    imageBox,
    approveSchedule,
    multipleFilesUpload
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      data: [],
      loading: false,
      TableHeight: 200,
      drawerdialogVisible: false,
      formData:{
        flow_id:''
      },
      tableHeaderKey:[],
      tableHeaderData:{},
      tableHeaderKeyName:{
        'peopleHurt':'人伤',
        'carDamage': '车损',
        'claimSettlement': '理赔'
      },
      dataMap:{
        'peopleHurt':[],
        'carDamage': [],
        'claimSettlement': []
      },
      imagesList:[],
      fileLists:[],

      userId:'',
      subForm:{
        flow_id:'', //流程记录id
        step_id:'', //节点id
        state:'', //状态(0待处理1通过2拒绝3退回4转交)
        object_id:'', //对象id(退回节点id/转交用户id)
        remark:'', //备注
      },
      returnUsers:[],
      opinionShow: false, //是否同意拒绝弹窗
      returnShow: false, // 是否转交，退回弹窗
    };
  },
  mounted() {
    this.loadData();
    this.reqAccidentData(1);
    this.reqAccidentData(2);
    this.tableHeaderData = tableHeader
    this.tableHeaderKey = Object.keys(tableHeader)
    console.log(this.tableHeaderData)
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {

    loadData() {
      if (!this.id) {
        return false;
      }
      this.userId = JSON.parse(getUser()).user_id;
      this.loading = true;
      this.$client.DetailAccidentManage({ id: this.id}).then((res) => {
        console.log(res)
        eventOn.$emit('update-upcoming-matter')
        if(res.head.result == '200') {
           this.formData = res.context
           this.dataMap['peopleHurt'] = this.formData.casualties? this.formData.casualties:[]
           this.dataMap['carDamage'] = this.formData.damages?this.formData.damages:[]
           this.dataMap['claimSettlement'] = this.formData.accident_costs? this.formData.accident_costs:[]
           this.subForm.flow_id = res.context.flow_id
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
    // 获取事故资料
    reqAccidentData(type) {
      let parmas = {
        id : this.id,
        type: type
      }
      this.$client.queryAccidentData(parmas)
        .then(res => {
          if (res.head.result == "200") {
            if(type == 1) {
              this.imagesList = this.bulidPicturePathList(res.context)
            }else{
              this.fileLists = this.bulidDataList(res.context);
            }
          } else {
            if(type == 1) {
              this.accidentData = [];
            }else{
              this.fileLists = [];
            }
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    bulidPicturePathList(list) {
      let pathList = []
      list.forEach((item,index) => {
        pathList.push(item.c_path)
      });

      return pathList
    },
    bulidDataList(list,type) {
      let newList = []
      list.forEach((item,index) => {
        let obj = {
          id: item.i_id,
          name: item.c_name,
          url: item.c_path
        }
        newList.push(obj)
      });

      return newList
    },
    // 获取节点数据
    getStepData(data){
      console.log(data)
      let isFirst = true;
      if(data && !!data.length) {
        data.forEach((item,index) => {
          if(isFirst && item.state === 1) {
            this.subForm.step_id = item.id
            isFirst = false
          }
        });
      }
      // 获取转交节点数据
      this.reqReturnStepData();
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
    },
    // // 构建转交节点
    // buildReturnStep(data) {
    //   this.returnUsers = [];
    //   if(data && !!data.length) {
    //     data.forEach((item,index) => {
    //       if(item.state === 3 && item.oper_type === 1) {
    //         let obj = {
    //           seq: item.id,
    //           title: item.users && item.users[0].name
    //         }
    //         this.returnUsers.push(obj)
    //       }
    //     });
    //   }
    // },
     // 打开填写理由弹窗
    openOpinionDialog(type) {
      this.opinionShow = true
      this.subForm.state = type
      // this.subForm.state = 1
      // this.form.flow_id = this.formSubObj.id
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
    // 确定提交
    suerSubmitInfo() {
      let info = this.$outFormData(this.subForm)
      this.$client.checkFlowRecord({ context: info }).then((req) => {
        if (req.head.result === "200") {
          this.loadData();
          if(this.subForm.state == 1 || this.subForm.state == 2) {
            this.opinionShow = false
          }else{
            this.returnShow = false
          }
          eventOn.$emit('update-upcoming-matter')
          this.$message({
            message: req.head.describle,
            type: "success",
          });
        } else {
          this.$message.error(req.head.describle);
        }
      });
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        // let maxh = this.$el.offsetHeight;
        // let th = this.$refs.head.$el.offsetHeight;
        // this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
  watch: {
    id() {
      if (this.id) {
        this.loadData();
        this.reqAccidentData(1);
        this.reqAccidentData(2);
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
        this.$refs.personalTree.onClear();
        this.subForm.remark = '';
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-detail-dispose {
  width: 100%;
  height: 100%;
}

.list-data-list
  div {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF
</style>
