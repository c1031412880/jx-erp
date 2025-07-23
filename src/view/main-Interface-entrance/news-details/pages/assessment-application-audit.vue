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
          {{formData.state === 0  ? '发起审批' : formData.user_names}}
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
          <em>{{formData.user_dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>考核名称</p>
          <em>{{formData.exam_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>考核类型</p>
          <em>{{formData.exam_type_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>考核日期</p>
          <em>{{formData.date}}</em>
        </el-col>
        <el-col :span="12">
          <p>考核开始时间</p>
          <em>{{formData.start_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>考核结束时间</p>
          <em>{{formData.end_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>被考核对象</p>
          <em>{{formData.exam_obj_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>被考核部门</p>
          <em>{{formData.exam_dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>被考核人员</p>
          <em>{{formData.exam_user_names}}</em>
        </el-col>
        <el-col :span="12">
          <p>审核人</p>
          <em>{{formData.exam_check_names}}</em>
        </el-col>
        <el-col :span="24">
          <p>考核说明</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.remark"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <div style="margin-bottom:10px">
          <el-button type="primary" size="small" @click="preview()">预览</el-button>
          <el-button type="primary" size="small" @click="onExport()">导出</el-button>
        </div>
        <el-col :span="24" class="only-show">
          <tr-table
            ref="table"
            :data="tableList"
            :tableHeaderList="tableHeaderList"
            :isShowSummary="true"
            :omitColumnIndex='[1,2,3,5,6,7,8]'
            :rowspanObj="rowspanObj"
            :mergekeys="mergekeys"
            :spanMethodType="['column']"
            :TableHeight="TableHeight"
            >
          </tr-table>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.imgs"
          :files="formData.files"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>

    <el-dialog
      ref="previewDialog"
      title="预览"
      :visible.sync="previewDialogVisible"
      :append-to-body="true"
      fullscreen>
      <tr-table
        ref="table"
        :data="tableList"
        :tableHeaderList="tableHeaderList"
        :isShowSummary="true"
        :omitColumnIndex='[1,2,3,5,6,7,8]'
        :rowspanObj="rowspanObj"
        :mergekeys="mergekeys"
        :spanMethodType="['column']"
        :TableHeight="previewHeight"
        >
      </tr-table>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
export default {
  name: "assessment-application-audit",
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
        imgs: [],
        files: []
      },
      tableList: [],
      tableHeaderList: [
        {
          id: 1,
          label: "指标分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核内容",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "指标值及要求",
          prop: "demand",
          width: "200",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "分值",
          prop: "score",
          width: "100",
          align: "center",
          signIndex: 3,
          nestedTablesHeader: [
            {
              id: 101,
              label: "明细",
              prop: "score",
              width: "100",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "合计",
              prop: "total_score",
              width: "100",
              align: "center",
              signIndex: 101,
            },
          ]
        },
        {
          id: 5,
          label: "考核标准",
          prop: "standard",
          width: "200",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 5,
        },
      ],
      rowspanObj: {},
      mergekeys: ['group_id','group_name','total_score'],
      TableHeight:300,

      previewDialogVisible: false,
      previewHeight: 500,
      temp_id: ''
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

    initData(info) {
      if (info.temp_id) {
        this.temp_id = info.temp_id
        this.saveTemplate(info.temp_id)
      }
    },
    // 获取考核模板
    saveTemplate(temp_id){
      let params = {
        temp_id: temp_id,
        page_index: 1,
        page_size: 999
      }
      this.$client.GetAssessModelContentByPage(params)
      .then(res => {
        if (res.head.result == "200") {
            this.tableList = res.context.list;
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.tableList,'group_id',true)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
      })
    },
    // 预览
    preview() {
      this.previewDialogVisible = true
      this.$nextTick(() => {
        this.previewHeight = this.$refs.previewDialog.$el.offsetHeight - 70
      })
    },
    // 导出
    onExport() {
      let params = {
        temp_id: this.temp_id
      }
      this.$client.ExportAssessModel(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
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
