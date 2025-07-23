<template>
  <div class="democratic-rating-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="`${formData.title + (formData.replace_name ? formData.replace_name : '')}`">
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
          <p>经办人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>所在组织</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>评分季度</p>
          <em>{{formData.season_name_full}}</em>
        </el-col>
        <el-col :span="12">
          <p>评分时间</p>
          <em>{{formData.score_date_range}}</em>
        </el-col>
        <el-col :span="12">
          <p>评分人</p>
          <em>{{formData.score_person_names}}</em>
        </el-col>
        <el-col :span="12">
          <p>被评分驾驶员</p>
          <em>{{formData.score_driver_names}}</em>
        </el-col>
        <el-col :span="24">
          <p>备注</p>
          <el-input v-model="formData.remark" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isEdit="formData.user_ids.indexOf(userId) === -1 ? false : true"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";

export default {
  name: "democratic-rating-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
  },
  data() {
    return {
      formData: {
        flow_id: 0,
        user_ids: [],
        thumbnail_imgs: [],
        files_list: []
      },
    };
  },
  props: {
    userId: '',
    step_id: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  watch: {
  },
  methods: {
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
        case 1:
          return '#F58A40'
        case 2:
          return '#0CB780'
        case 3:
          return '#F2260E'
        case 4:
          return '#999999'
      }
    },
  },
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.democratic-rating-audit {
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
