<template>
  <div class="major-maintenance-audit" v-loading="loading">
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
    <item-box-new title="报修信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>车辆自编号</p>
          <em>{{formData.vehicle_number}}</em>
        </el-col>
        <el-col :span="12">
          <p>车牌号</p>
          <em>{{formData.plate_number}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>所属组织</p>
          <em>{{formData.vehicle_dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>车辆型号</p>
          <em>{{formData.vehicle_model_name}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>报修类别</p>
          <em>{{formData.repair_type_id === -1 ? '事故' : formData.repair_type_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>报修人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>报修时间</p>
          <em>{{formData.request_repair_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>报修地点</p>
          <em>{{formData.repair_position}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>驾驶员</p>
          <em>{{formData.driver_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.rescue_flow_id">
          <p>关联施救车派工单</p>
          <el-button type="text" @click="checkApply(formData.rescue_flow_id)">{{formData.rescue_flow_code}}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="formData.rescue_flow_code">
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>报修描述</p>
          <el-input v-model="formData.repair_discribe" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="24" v-show="formData.img_list && formData.img_list.length">
          <p>相关图片</p> 
          <div v-for="(item, index) in formData.img_list" :key="index">
            <el-image fit="fill" :src="item" :preview-src-list="formData.img_list" style="width: 100px; height: 100px"></el-image>
          </div>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="关联保养计划" v-show="formData.upkeep_code">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>关联保养计划</p>
          <em>{{formData.upkeep_code}}</em>
        </el-col>
        <el-col :span="12">
          <p>保养计划日期</p>
          <em>{{formData.plan_date}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>保养类型</p>
          <em>{{formData.upkeep_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>修理工</p>
          <em>{{formData.repair_person_names}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>最近保养日期</p>
          <em>{{formData.last_unkeep_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>保养周期里程</p>
          <em>{{formData.unkeep_cycle_kikometers}}</em>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="关联事故" v-show="formData.c_accident_code">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>关联事故编号</p>
          <em>{{formData.c_accident_code}}</em>
        </el-col>
        <el-col :span="12">
          <p>事故日期</p>
          <em>{{formData.d_accident_date}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>事故责任</p>
          <em>{{formData.accident_liability}}</em>
        </el-col>
        <el-col :span="12">
          <p>定损金额</p>
          <em>{{formData.n_loss_fee}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>车辆受损情况</p>
          <el-input v-model="formData.c_describe" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="12">
          <p>事故经办人</p>
          <em>{{formData.result_person}}</em>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="进厂检验信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>检验时间</p>
          <em>{{formData.request_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>优先级</p>
          <em>{{formData.precedence_show}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>检验人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>维修车间</p>
          <em>{{formData.repair_workshop}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>预估金额</p>
          <em>{{formData.estimate_amount}}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>检验描述</p>
          <el-input v-model="formData.verify_describe" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="24" v-show="formData.repair_faults && formData.repair_faults.length">
          <tr-table
            :selectionShow="false"
            :data="formData.repair_faults"
            :tableHeaderList="canRendererTableHeader"
            :TableHeight="300"
            :isFixedEmptyPlaceholder="false">
          </tr-table>
        </el-col>
      </el-row>
      <!-- <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.file_list"
          :isShowOriginal="true"
          :isCompress="true"
          :isEdit="formData.user_ids.indexOf(userId) === -1 ? false : true"
          :isShowBox="false"></image-file-upload>
      </el-row> -->
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
import imageFileUpload from "@/components/imageFileUpload/index-c";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";

export default {
  name: 'major-maintenance-audit',
  components: {
    titleBoxNew,
    itemBoxNew,
    imageFileUpload,
    getDepartmentSelect,
  },
  data() {
    return {
      formData: {
        flow_id:0,
        repair_faults: [],
        img_list: [],
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "故障分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "故障项目编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "故障项目",
          prop: "fault_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        }
      ],
      flowFields: {
        new_title: 1
      },
    }
  },
  props: {
    step_id: '',
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  watch: {
    // step_id(id) {
    //   if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
    //     this.getFlowFields(id)
    //   }else {
    //     Object.assign(this.flowFields, this.$options.data().flowFields)
    //   }
    // },
  },
  methods: {
    checkApply(id) {
      let detail_id = 1650, title = '施救车派工单'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
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
        case 4:
          return '#999999'
          break;
      }
    },
    // 修改input内容
    changeInputContent() {
      let params = {
        context: {
          form_data: {},
          step_data: null
        },
      }
      params.context.form_data = Object.assign({}, this.formData)
      // this.$client.CreateOrUpdateReqOaFormNews(params).then((req) => {})
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.major-maintenance-audit {
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
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-weight: 500;
      color: #333333;
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
