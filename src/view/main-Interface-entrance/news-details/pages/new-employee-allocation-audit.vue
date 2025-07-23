<template>
  <div class="work-contact-audit" v-loading="loading">
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
          <p>经办人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{formData.department}}</em>
        </el-col>
        <el-col :span="12">
          <p>申请日期</p>
          <em>{{formData.req_date}}</em>
        </el-col>
        <el-col :span="24">
          <p>备注</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.remark"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="only-show">
          <tr-table
            :selectionShow="false"
            :data="formData.details? formData.details: []"
            :tableHeaderList="tableHeaderData"
            :isShowBottomOptions="false"
            :TableHeight="220"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false">
          </tr-table>
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
  name: "new-employee-allocation-audit",
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
        details: [],
        thumbnail_imgs: [],
        files_list: []
      },
      tableHeaderData: [
        {
          id: 1,
          label: "*姓名",
          prop: "name",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "年龄",
          prop: "age",
          width: "100",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "驾照",
          prop: "license",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "考试情况",
          prop: "test_name",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "体检情况",
          prop: "checkup_name",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "结果",
          prop: "result",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "家庭住址",
          prop: "address",
          width: "200",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "分配分公司",
          prop: "company_name",
          width: "150",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "职位",
          prop: "position",
          width: "150",
          align: "center",
          signIndex: 8,
        },
      ],
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
.work-contact-audit {
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
