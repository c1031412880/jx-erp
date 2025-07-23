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
          <p>车牌号(自编号)</p>
          <em>{{formData.vehicle_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>线路</p>
          <em>{{formData.line_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.device_state != 2">
          <p>所属组织</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>当班驾驶员</p>
          <em>{{formData.driver_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>经办人</p>
          <em>{{formData.handle_user_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>稽查方式</p>
          <em>{{formData.check_type_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>检查站点</p>
          <em>{{formData.check_station}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2">
          <p>设备状态</p>
          <em>{{formData.device_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2 && formData.device_state != 2">
          <p>监控开始时间</p>
          <em>{{formData.start_time}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2 && formData.device_state != 2">
          <p>监控结束时间</p>
          <em>{{formData.end_time}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 2 && formData.device_state != 2">
          <p>监控通道</p>
          <em>{{formData.device_thorough_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.device_state != 2">
          <p>检查员</p>
          <em>{{formData.check_user_name}}</em>
        </el-col>
        <el-col :span="12" v-if="formData.order_affiliation == 1">
          <p>检查时间</p>
          <em>{{formData.check_time}}</em>
        </el-col>
        <el-col :span="24" v-if="formData.device_state != 2">
          <p>本次检查主要内容</p>
          <el-input v-model="formData.check_content" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="24">
          <p>备注</p>
          <el-input v-model="formData.remark" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="24" v-if="formData.device_state != 2">
          <image-file-upload
          :images="formData.img_list"
          :files="formData.files_list"
          :isShowBox="false"></image-file-upload>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="处理情况" v-if="formData.device_state != 2">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>奖罚依据</p>
          <em>{{formData.violation_according}}</em>
        </el-col>
        <el-col :span="12">
          <p>违规类型</p>
          <em>{{formData.violation_type}}</em>
        </el-col>
        <el-col :span="12">
          <p>加/减分</p>
          <em>{{formData.score}}</em>
        </el-col>
        <el-col :span="24">
          <p>驾驶员处理情况</p>
          <el-input v-model="formData.handle_result" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
      </el-row>
    </item-box-new>
    <item-box-new title="监控修复情况" v-if="formData.device_state == 2">
      <el-row :gutter="20">
        <el-col :span="24">
          <p>修复情况</p>
          <el-input v-model="formData.repair_state" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";
export default {
  name: "server-order-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
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
        img_list: [],
        files_list: [],
      },
    }
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
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
        case 1:
          return '#F512A4'
        case 2:
          return '#0CB712'
        case 3:
          return '#F2260E'
        case 4:
          return '#999999'
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.server-order-audit {
  em {
    display: block;
    height: 25px;
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