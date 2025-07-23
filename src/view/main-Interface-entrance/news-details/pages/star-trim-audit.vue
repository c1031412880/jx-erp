<template>
  <div class="star-trim-audit" v-loading="loading">
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
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="24">
          <p>备注</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.remark"></el-input>
        </el-col>
        <el-col :span="24">
          <tr-table
            :data="formData.changes"
            :frontFixedNum="2"
            :loading="false"
            :selectionShow="false"
            :TableHeight="380"
            :isShowBottomOptions="false"
            :tableHeaderList="canRendererTableHeader"
            :backFixedNum="1">
            <template slot-scope="scope" slot="old_star">
              <div v-if="scope.data.old_star">
                <el-rate v-model="scope.data.old_star" :max="scope.data.old_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
              </div>
              <div class="show-flex-box-r show-flex-center" v-else>
                <span>无星级</span>
              </div>
            </template>
            <template slot-scope="scope" slot="new_star">
              <div v-if="scope.data.new_star">
                <el-rate v-model="scope.data.new_star" :max="scope.data.now_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
              </div>
              <div class="show-flex-box-r show-flex-center" v-else>
                <span>无星级</span>
              </div>
            </template>
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
  name: "star-trim-audit",
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
        changes: [],
        thumbnail_imgs: [],
        files_list: []
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "考核周期",
          prop: "examine_circle",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "评星日期",
          prop: "evaluate_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "调整前星级",
          prop: "old_star",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "调整后星级",
          prop: "new_star",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "申请理由",
          prop: "reason",
          width: "180",
          align: "center",
          signIndex: 6,
          sortable: false,
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
.star-trim-audit {
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
