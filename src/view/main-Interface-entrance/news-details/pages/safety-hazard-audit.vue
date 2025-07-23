<template>
  <div class="safety-hazard-audit" v-loading="loading">
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
          <p>制表人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>检查日期</p>
          <em>{{formData.request_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>受检部门</p>
          <em>{{formData.check_dept_names}}</em>
        </el-col>
        <el-col :span="12">
          <p>受检部门经办人</p>
          <em>{{formData.be_examined_names}}</em>
        </el-col>
        <el-col :span="12">
          <p>受检地点</p>
          <em>{{formData.address}}</em>
        </el-col>
        <el-col :span="12">
          <p>受检车辆</p>
          <em>{{formData.check_vehicle_names}}</em>
        </el-col>
        <el-col :span="12">
          <p>是否需要整改</p>
          <em>{{formData.whether_change_name}}</em>
        </el-col>
        <el-col :span="24">
          <p>参加监督检查单位人员</p>
          <em>{{formData.check_person_names}}</em>
        </el-col>
        <el-col :span="24">
          <p>监督检查主要内容</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.contents_main"></el-input>
        </el-col>
        <el-col :span="24">
          <p>检查中出现的问题</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.contents_problem"></el-input>
        </el-col>
        <el-col :span="24">
          <p>检查组处理意见</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.contents_opinion"></el-input>
        </el-col>
        <el-col :span="24" v-if="!!formData.contents_result">
          <p>整改结果</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.contents_result"></el-input>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          ref="imageFileRef1"
          :showTitle="'安全检查照片记录'"
          :images="safe_imgs"
          :isShowBox="false"></image-file-upload>

        <image-file-upload
          ref="imageFileRef2"
          :showTitle="'安全检查照片记录'"
          :images="hidden_imgs"
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
  name: "safety-hazard-audit",
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
      },
      safe_imgs: [],
      hidden_imgs: [],
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
    initData(list) {
      this.safe_imgs = list.thumbnail_imgs.filter(item => item.data_type === 1)
      this.hidden_imgs = list.thumbnail_imgs.filter(item => item.data_type === 2)
      console.log(this.safe_imgs, this.hidden_imgs);
      
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.safety-hazard-audit {
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
