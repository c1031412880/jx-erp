<template>
  <div class="line-adjustment-audit" v-loading="loading">
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
          <p>申报人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>申报部门</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>申报日期</p>
          <em>{{formData.adjust_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>线路调整类型</p>
          <em>{{formData.type_name}}</em>
        </el-col>
        <el-col :span="24">
          <p>申报理由及下一步实施计划</p>
          <em>{{formData.reason}}</em>
        </el-col>
        <h2 style="font-weight: bold;font-size: 16px;margin: 0 0 10px 10px">优化调整后营运指标</h2>
        <el-col :span="12">
          <p>单趟营运时间（候客时间）</p>
          <em>{{formData.trip_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>单趟里程（公里）</p>
          <em>{{formData.trip_mile}}</em>
        </el-col>
        <el-col :span="12">
          <p>总班次（班次）</p>
          <em>{{formData.total_trip}}</em>
        </el-col>
        <el-col :span="12">
          <p>代号</p>
          <em>{{formData.code}}</em>
        </el-col>
        <el-col :span="12">
          <p>总里程公里（公里）天</p>
          <em>{{formData.day_mile}}</em>
        </el-col>
        <el-col :span="12">
          <p>单趟营运时间（分钟）</p>
          <em>{{`高峰：${formData.trip_time_high} 平峰：${formData.trip_time_low}`}}</em>
        </el-col>
        <el-col :span="12">
          <p>总平均代号营运时间与休息时间比值</p>
          <em>{{formData.trip_avg}}</em>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
export default {
  name: "line-adjustment-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
  },
  mounted() {},
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
        thumbnail_imgs: [],
        files_list: []
      },
    }
  },
  watch: {
  },
  methods: {
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break;
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.line-adjustment-audit {
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
