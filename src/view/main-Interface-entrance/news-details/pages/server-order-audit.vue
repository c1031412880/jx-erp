<template>
  <div class="server-order-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="formData.title">
      <div class="head-content">
        <p style="color: #BBBBBB;">审批编号:{{formData.flow_code}}</p>
        <p :style="{'color': outColor(formData.state)}">
          {{formData.state === 0  ? '发起审批' : formData.state_name}}
        </p>
      </div>
    </title-box-new>
    <item-box-new title="基本信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>工单所属</p>
          <em>{{formData.order_affiliation_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>信息来源</p>
          <em>{{formData.message_sources_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>工单类型</p>
          <em>{{formData.order_type_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>事发时间</p>
          <em>{{formData.call_time}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>责任部门</p>
          <em>{{formData.duty_department_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>责任部门经办人</p>
          <em>{{formData.duty_person_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>反映人姓名</p>
          <em>{{formData.call_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>反映人电话</p>
          <em>{{formData.call_number}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2">
          <p>身份证号</p>
          <em>{{formData.id_card}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2">
          <p>性别</p>
          <em>{{formData.sex_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2">
          <p>卡号</p>
          <em>{{formData.card_no}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2">
          <p>自行车号</p>
          <em>{{formData.bicycle_number}}</em>
        </el-col>
        
        <el-col :span="12">
          <p>事发地点</p>
          <em>{{formData.address}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>信访编号</p>
          <em>{{formData.letter_code}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>初重件</p>
          <em>{{formData.weight_degree_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.weight_degree == 2">
          <p>关联工单</p>
          <em>{{formData.associ_order}}</em>
        </el-col>
        <el-col :span="24">
          <p>事件简述</p>
          <el-input v-model="formData.order_content" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="12">
          <p>受理人员</p>
          <em>{{formData.acceptance_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>受理时间</p>
          <em>{{formData.acceptance_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>是否需要回复</p>
          <em>{{formData.is_reply ? '否' : '是'}}</em>
        </el-col>
        <el-col :span="12">
          <p>超时级别</p>
          <em>{{formData.time_out_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>规定回复逾期时间</p>
          <em>{{formData.overdue_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>实际回复时间</p>
          <em>{{formData.actual_time}}</em>
        </el-col>
        <el-col :span="24">
          <image-file-upload
          :images="formData.pics"
          :files="formData.files"
          :isShowBox="false"></image-file-upload>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="处理情况" v-if="formData.order_affiliation == 1">
      <el-row :gutter="20">
        <el-col :span="12" v-if="!(flowFields.vehicle_id === 3) && formData.order_affiliation == 1">
          <p>车牌号</p>
          <em v-if="flowFields.vehicle_id === 1">{{formData.lincense_plate_number}}</em>
          <get-vehicle-select-tree
            v-if="flowFields.vehicle_id === 2"
            ref="vehicleTree"
            :placeholder="'选择车牌号'"
            :isShowCheckbox="false"
            v-model="formData.vehicle_id"
            :isExportMultiple="false"
            @on-change="onSelectChange"
          >
          </get-vehicle-select-tree>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.line_id === 3) && formData.order_affiliation == 1">
          <p>线路</p>
          <em v-if="flowFields.line_id === 1">{{formData.line_name}}</em>
          <get-line-select-tree
            v-if="flowFields.line_id === 2"
            ref="lineTree"
            :placeholder="'选择线路'"
            :isShowCheckbox="false"
            v-model="formData.line_id"
            :isExportMultiple="false">
          </get-line-select-tree>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.driver_id === 3) && formData.order_affiliation == 1">
          <p>驾驶员</p>
          <em v-if="flowFields.driver_id === 1">{{formData.driver_name}}</em>
          <get-driver-select-tree
            v-if="flowFields.driver_id === 2"
            ref="driverTree"
            v-model="formData.driver_id"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            @on-change="changeInputContent()"
          ></get-driver-select-tree>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.is_duty === 3)">
          <p>是否有责</p>
          <em v-if="flowFields.is_duty === 1">{{formData.is_duty_name}}</em>
          <get-select-dictionaries  
            v-if="flowFields.is_duty === 2"
            v-model="formData.is_duty" 
            :classKey="'乘客服务是否有责'" 
            :placeholder="'请选择是否有责'"
            @change="changeInputContent()"
            >
          </get-select-dictionaries>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.violation_accordings === 3)">
          <p>奖罚依据</p>
          <em v-if="flowFields.violation_accordings === 1">{{formData.violation_according}}</em>
          <el-input
            v-if="flowFields.violation_accordings === 2"
            style="width: 100%;"
            v-model="formData.violation_according"
            placeholder="请选择奖罚依据"
            @focus="openViolationInspectPop"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <p>违规类型</p>
          <em>{{formData.violation_type}}</em>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.score === 3)">
          <p>加/减分</p>
          <em v-if="flowFields.score === 1">{{formData.score}}</em>
          <el-input-number v-if="flowFields.score === 2" v-model="formData.score" :controls="false" :precision="2" style="width: 100%;" size="mini" @change="changeInputContent()"></el-input-number>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.handle_result === 3)">
          <p>调查及处理结果描述</p>
          <el-input v-if="flowFields.handle_result === 1" v-model="formData.handle_result" autosize type="textarea" class="richText" disabled ></el-input>
          <el-input v-if="flowFields.handle_result === 2" v-model="formData.handle_result" type="textarea" :autosize="{ minRows: 4, maxRows: 12 }" placeholder="请输入调查及处理结果描述" @change="changeInputContent()"></el-input>
        </el-col>
        <el-col :span="12">
          <p>处理人</p>
          <em>{{formData.handle_emp_name}}</em>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.handle_time === 3)">
          <p>处理时间</p>
          <em v-if="flowFields.handle_time === 1">{{formData.handle_time}}</em>
          <el-date-picker
            v-if="flowFields.handle_time === 2"
            v-model="formData.handle_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width: 180px"
            placeholder="请选择处理时间"
            @change="changeInputContent()">
          </el-date-picker>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="办理结果">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>回复人</p>
          <em>{{formData.apply_person_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>实际回复时间</p>
          <em>{{formData.actual_time}}</em>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.remark === 3) && formData.order_affiliation == 2">
          <p>备注</p>
          <el-input v-if="flowFields.remark === 1" v-model="formData.remark" autosize type="textarea" class="richText" disabled ></el-input>
          <el-input v-if="flowFields.remark === 2" v-model="formData.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 12 }" placeholder="请输入备注" @change="changeInputContent()"></el-input>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.order_reply === 3)">
          <p>工单回复(办理结果)</p>
          <el-input v-if="flowFields.order_reply === 1" v-model="formData.order_reply" autosize type="textarea" class="richText" disabled ></el-input>
          <el-input v-if="flowFields.order_reply === 2" v-model="formData.order_reply" type="textarea" :autosize="{ minRows: 4, maxRows: 12 }" placeholder="请输入调查及处理结果描述" @change="changeInputContent()"></el-input>
        </el-col>
      </el-row>
    </item-box-new>

    <violation-inspect-pop 
      ref="violationInspectPop"
      :dialogBool.sync="violationInspectPopShow" 
      :dutyType="formData.is_duty" 
      @save-add="saveAddViolationInspect"></violation-inspect-pop>
  </div>
</template>

<script type="text/ecmascript-6">
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";
import violationInspectPop from '@/view/server-management/passenger-server-management/component/violation-inspect-pop'
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";

export default {
  name: "server-order-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
    violationInspectPop,
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
    getSelectDictionaries
  },
  props: {
    step_id: '',
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      formData: {
        flow_id:0,
        user_ids: [],
        pics: [],
        files: [],
        relevances: [],
      },
      flowFields: {
        vehicle_id: 1,
        line_id: 1,
        driver_id: 1,
        is_duty: 1,
        violation_accordings: 1,
        violation_type: 1,
        score: 1,
        handle_time: 1,
        handle_result: 1,
        remark: 1,
        order_reply: 1
      },
      formApi: {
        'againAdd': 'addPassengerServiceNew',
        'againEdit': 'EditPassengerServicePassengerServiceNew',
      },
      violationInspectPopShow: false,
    }
  },
  watch: {
    step_id(id) {
      if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
        this.getFlowFields(id)
      }else {
        Object.assign(this.flowFields, this.$options.data().flowFields)
      }
    },
  },
  methods: {
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
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break;
        case 1:
          return '#F512A40'
          break;
        case 2:
          return '#0CB7120'
          break;
        case 3:
          return '#F2260E'
          break;
        case 4:
          return '#999999'
          break;
      }
    },
    // 打开违规项目稽查
    openViolationInspectPop() {
      this.violationInspectPopShow = true;
    },
    // 保存奖罚依据
    saveAddViolationInspect(selectedIds, list) {
      this.formData.score = '';
      this.formData.violation_according = '';
      let violation_type = []
      this.formData.violation_accordings = selectedIds;
      if(list.length) {
        list.forEach(element => {
          this.formData.violation_according = this.formData.violation_according + element.c_name + ','
          this.formData.score = Number(this.formData.score)  + Number(element.n_score);
          if (element.type_name) {
            violation_type.push(element.type_name)
          }
        });
        
      }
      this.formData.violation_type = violation_type.toString()
      this.violationInspectPopShow = false
      this.changeInputContent()
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])  
      } else{
        this.formData.line_id = ''
        this.changeInputContent()
      }
    },
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id
      };
      this.$client.getVehicleRelationInfo(params).then(res => {
        if(res.head.result == '200') {
            let relationInfo = res.context;
            if(!!relationInfo.line && relationInfo.line.length > 0) {
              this.formData.line_id = relationInfo.line[0].i_id
            }else{
              this.formData.line_id = "";
              setTimeout(() => {
                this.$refs.lineTree.onClear()
              }, 60);
            }
            this.changeInputContent()
        }else{
          this.$message({
            type: 'error',
            message: res.head.describle, 
            showClose: true
          })
        }
      }).catch(err => {

      })
    },
    // 修改input内容
    changeInputContent() {
      if(this.formData.state) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          }
        }
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.EditPassengerService(params).then((req) => {})
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.server-order-audit {
  em {
    display: block;
    height: 40px;
  }
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
  .el-col {
    margin-bottom: 22px;
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
    /deep/ .el-textarea__inner {
      min-height: 60px !important
    }
  }
  .image-box {
    margin-bottom: 0px;
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
</style>