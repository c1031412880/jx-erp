
<template>
  <div class="monthly-report-assessment-indicators-audit" v-loading="loading">
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
          <p>创建人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>申请日期</p>
          <em>{{formData.request_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>考核年份</p>
          <em>{{formData.check_year}}</em>
        </el-col>
        <el-col :span="12">
          <p>说明</p>
          <em>{{formData.remark}}</em>
        </el-col>
        <el-col :span="24">
          <div class="header">
            <span style="margin-right: 5px;">重点任务指标</span>
            <el-button size="mini" type="primary" @click="showAll(1)">查看更多</el-button>
            <el-button size="mini" type="primary" @click="onExport(1)">导出</el-button>
          </div>
          <tr-table
            :data="formData.key_point_tasks"
            :tableHeaderList="tableHeaderList"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="check_content">
              <span class="text" v-html="scope.data.check_content"></span>
            </template>
            <template slot-scope="scope" slot="check_detail">
              <span class="text" v-html="scope.data.check_detail"></span>
            </template>
            <template slot-scope="scope" slot="january">
              <span class="text" v-html="scope.data.january"></span>
            </template>
            <template slot-scope="scope" slot="february">
              <span class="text" v-html="scope.data.february"></span>
            </template>
            <template slot-scope="scope" slot="march">
              <span class="text" v-html="scope.data.march"></span>
            </template>
            <template slot-scope="scope" slot="april">
              <span class="text" v-html="scope.data.april"></span>
            </template>
            <template slot-scope="scope" slot="may">
              <span class="text" v-html="scope.data.may"></span>
            </template>
            <template slot-scope="scope" slot="june">
              <span class="text" v-html="scope.data.june"></span>
            </template>
            <template slot-scope="scope" slot="july">
              <span class="text" v-html="scope.data.july"></span>
            </template>
            <template slot-scope="scope" slot="august">
              <span class="text" v-html="scope.data.august"></span>
            </template>
            <template slot-scope="scope" slot="september">
              <span class="text" v-html="scope.data.september"></span>
            </template>
            <template slot-scope="scope" slot="october">
              <span class="text" v-html="scope.data.october"></span>
            </template>
            <template slot-scope="scope" slot="november">
              <span class="text" v-html="scope.data.november"></span>
            </template>
            <template slot-scope="scope" slot="december">
              <span class="text" v-html="scope.data.december"></span>
            </template>
          </tr-table>
        </el-col>
        <el-col :span="24">
          <div class="header">
            <span style="margin-right: 5px;">经济效益指标</span>
            <el-button size="mini" type="primary" @click="showAll(2)">查看更多</el-button>
            <el-button size="mini" type="primary" @click="onExport(2)">导出</el-button>
          </div>
          <tr-table
            :data="formData.economic_efficiencies"
            :tableHeaderList="tableHeaderList2"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="economic_indicators">
              <span class="text" v-html="scope.data.economic_indicators"></span>
            </template>
            <template slot-scope="scope" slot="target_report_value">
              <span class="text" v-html="scope.data.target_report_value"></span>
            </template>
            <template slot-scope="scope" slot="target_report_remark">
              <span class="text" v-html="scope.data.target_report_remark"></span>
            </template>
            <template slot-scope="scope" slot="total_target_value">
              <span class="text" v-html="scope.data.total_target_value"></span>
            </template>
            <template slot-scope="scope" slot="total_target_remark">
              <span class="text" v-html="scope.data.total_target_remark"></span>
            </template>
            <template slot-scope="scope" slot="first_quarter_value">
              <span class="text" v-html="scope.data.first_quarter_value"></span>
            </template>
            <template slot-scope="scope" slot="second_quarter_value">
              <span class="text" v-html="scope.data.second_quarter_value"></span>
            </template>
            <template slot-scope="scope" slot="third_quarter_value">
              <span class="text" v-html="scope.data.third_quarter_value"></span>
            </template>
            <template slot-scope="scope" slot="fourth_quarter_value">
              <span class="text" v-html="scope.data.fourth_quarter_value"></span>
            </template>
            <template slot-scope="scope" slot="january">
              <span class="text" v-html="scope.data.january"></span>
            </template>
            <template slot-scope="scope" slot="february">
              <span class="text" v-html="scope.data.february"></span>
            </template>
            <template slot-scope="scope" slot="march">
              <span class="text" v-html="scope.data.march"></span>
            </template>
            <template slot-scope="scope" slot="april">
              <span class="text" v-html="scope.data.april"></span>
            </template>
            <template slot-scope="scope" slot="may">
              <span class="text" v-html="scope.data.may"></span>
            </template>
            <template slot-scope="scope" slot="june">
              <span class="text" v-html="scope.data.june"></span>
            </template>
            <template slot-scope="scope" slot="july">
              <span class="text" v-html="scope.data.july"></span>
            </template>
            <template slot-scope="scope" slot="august">
              <span class="text" v-html="scope.data.august"></span>
            </template>
            <template slot-scope="scope" slot="september">
              <span class="text" v-html="scope.data.september"></span>
            </template>
            <template slot-scope="scope" slot="october">
              <span class="text" v-html="scope.data.october"></span>
            </template>
            <template slot-scope="scope" slot="november">
              <span class="text" v-html="scope.data.november"></span>
            </template>
            <template slot-scope="scope" slot="december">
              <span class="text" v-html="scope.data.december"></span>
            </template>
            <template slot-scope="scope" slot="schedule">
              <span class="text" v-html="scope.data.schedule"></span>
            </template>
            <template slot-scope="scope" slot="remark">
              <span class="text" v-html="scope.data.remark"></span>
            </template>
          </tr-table>
        </el-col>
        <el-col :span="24">
          <div class="header">
            <span style="margin-right: 5px;">党建工作指标</span>
            <el-button size="mini" type="primary" @click="showAll(3)">查看更多</el-button>
            <el-button size="mini" type="primary" @click="onExport(3)">导出</el-button>
          </div>
          <tr-table
            :data="formData.party_buildings"
            :tableHeaderList="tableHeaderList"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="check_content">
              <span class="text" v-html="scope.data.check_content"></span>
            </template>
            <template slot-scope="scope" slot="check_detail">
              <span class="text" v-html="scope.data.check_detail"></span>
            </template>
            <template slot-scope="scope" slot="january">
              <span class="text" v-html="scope.data.january"></span>
            </template>
            <template slot-scope="scope" slot="february">
              <span class="text" v-html="scope.data.february"></span>
            </template>
            <template slot-scope="scope" slot="march">
              <span class="text" v-html="scope.data.march"></span>
            </template>
            <template slot-scope="scope" slot="april">
              <span class="text" v-html="scope.data.april"></span>
            </template>
            <template slot-scope="scope" slot="may">
              <span class="text" v-html="scope.data.may"></span>
            </template>
            <template slot-scope="scope" slot="june">
              <span class="text" v-html="scope.data.june"></span>
            </template>
            <template slot-scope="scope" slot="july">
              <span class="text" v-html="scope.data.july"></span>
            </template>
            <template slot-scope="scope" slot="august">
              <span class="text" v-html="scope.data.august"></span>
            </template>
            <template slot-scope="scope" slot="september">
              <span class="text" v-html="scope.data.september"></span>
            </template>
            <template slot-scope="scope" slot="october">
              <span class="text" v-html="scope.data.october"></span>
            </template>
            <template slot-scope="scope" slot="november">
              <span class="text" v-html="scope.data.november"></span>
            </template>
            <template slot-scope="scope" slot="december">
              <span class="text" v-html="scope.data.december"></span>
            </template>
          </tr-table>
        </el-col>
        <el-col :span="24">
          <div class="header">
            <span style="margin-right: 5px;">综合管理指标</span>
            <el-button size="mini" type="primary" @click="showAll(4)">查看更多</el-button>
            <el-button size="mini" type="primary" @click="onExport(4)">导出</el-button>
          </div>
          <tr-table
            :data="formData.comprehensive_managements"
            :tableHeaderList="tableHeaderList"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="check_content">
              <span class="text" v-html="scope.data.check_content"></span>
            </template>
            <template slot-scope="scope" slot="check_detail">
              <span class="text" v-html="scope.data.check_detail"></span>
            </template>
            <template slot-scope="scope" slot="january">
              <span class="text" v-html="scope.data.january"></span>
            </template>
            <template slot-scope="scope" slot="february">
              <span class="text" v-html="scope.data.february"></span>
            </template>
            <template slot-scope="scope" slot="march">
              <span class="text" v-html="scope.data.march"></span>
            </template>
            <template slot-scope="scope" slot="april">
              <span class="text" v-html="scope.data.april"></span>
            </template>
            <template slot-scope="scope" slot="may">
              <span class="text" v-html="scope.data.may"></span>
            </template>
            <template slot-scope="scope" slot="june">
              <span class="text" v-html="scope.data.june"></span>
            </template>
            <template slot-scope="scope" slot="july">
              <span class="text" v-html="scope.data.july"></span>
            </template>
            <template slot-scope="scope" slot="august">
              <span class="text" v-html="scope.data.august"></span>
            </template>
            <template slot-scope="scope" slot="september">
              <span class="text" v-html="scope.data.september"></span>
            </template>
            <template slot-scope="scope" slot="october">
              <span class="text" v-html="scope.data.october"></span>
            </template>
            <template slot-scope="scope" slot="november">
              <span class="text" v-html="scope.data.november"></span>
            </template>
            <template slot-scope="scope" slot="december">
              <span class="text" v-html="scope.data.december"></span>
            </template>
          </tr-table>
        </el-col>
        <el-col :span="24">
          <p>特别加分项</p>
          <el-input v-model="formData.extra_point" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="24">
          <p>特别扣分项</p>
          <el-input v-model="formData.deduction_point" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>

    <el-dialog
      custom-class="showAllBox"
      :title="title"
      fullscreen
      :visible.sync="dialogVisible"
      append-to-body>
      <tr-table
        :data="data"
        :tableHeaderList="tableHeaderList2"
        :TableHeight="'100%'"
        :isShowBottomOptions="false"
        :frontFixedNum="1"
        :backFixedNum="0"
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
  name: "monthly-report-assessment-indicators-audit",
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
        id: 0,
        flow_id:0,
        key_point_tasks: [],
        economic_efficiencies: [],
        party_buildings: [],
        comprehensive_managements: [],
        thumbnail_imgs: [],
        files_list: []
      },
      TableHeight: 300,
      tableHeaderList: [
      {
          id: 1,
          label: "考核内容",
          prop: "check_content",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核细则",
          prop: "check_detail",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "填写人",
          prop: "write_person_name",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "1月",
          prop: "january",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "2月",
          prop: "february",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "3月",
          prop: "march",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "4月",
          prop: "april",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "5月",
          prop: "may",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "6月",
          prop: "june",
          width: "160",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "7月",
          prop: "july",
          width: "160",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "8月",
          prop: "august",
          width: "160",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "9月",
          prop: "september",
          width: "160",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "10月",
          prop: "october",
          width: "160",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "11月",
          prop: "november",
          width: "160",
          align: "center",
          signIndex: 13,
        },
        {
          id: 15,
          label: "12月",
          prop: "december",
          width: "160",
          align: "center",
          signIndex: 14,
        },
      ],
      tableHeaderList2: [
        {
          id: 1,
          label: "经济指标",
          prop: "economic_indicators",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "目标上报值",
          prop: "target_report_value",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "填写人",
          prop: "write_person_name",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "目标上报说明",
          prop: "target_report_remark",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "年度目标值(集团下达)",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 4,
          nestedTablesHeader:[
            {
              id: 101,
              label: "总下达",
              prop: "total_target_value",
              width: "180",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "目标下达值说明",
              prop: "total_target_remark",
              width: "180",
              align: "center",
              signIndex: 101,
            },
            {
              id: 103,
              label: "第一季度",
              prop: "first_quarter_value",
              width: "180",
              align: "center",
              signIndex: 102,
            },
            {
              id: 104,
              label: "第二季度",
              prop: "second_quarter_value",
              width: "180",
              align: "center",
              signIndex: 103,
            },
            {
              id: 105,
              label: "第三季度",
              prop: "third_quarter_value",
              width: "180",
              align: "center",
              signIndex: 104,
            },
            {
              id: 106,
              label: "第四季度",
              prop: "fourth_quarter_value",
              width: "180",
              align: "center",
              signIndex: 105,
            },
          ]
        },
        {
          id: 6,
          label: "年度目标值(集团下达)",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 5,
          nestedTablesHeader:[
            {
              id: 107,
              label: "1月",
              prop: "january",
              width: "160",
              align: "center",
              signIndex: 106,
            },
            {
              id: 108,
              label: "2月",
              prop: "february",
              width: "160",
              align: "center",
              signIndex: 107,
            },
            {
              id: 109,
              label: "3月",
              prop: "march",
              width: "160",
              align: "center",
              signIndex: 108,
            },
            {
              id: 110,
              label: "4月",
              prop: "april",
              width: "160",
              align: "center",
              signIndex: 109,
            },
            {
              id: 111,
              label: "5月",
              prop: "may",
              width: "160",
              align: "center",
              signIndex: 110,
            },
            {
              id: 112,
              label: "6月",
              prop: "june",
              width: "160",
              align: "center",
              signIndex: 111,
            },
            {
              id: 113,
              label: "7月",
              prop: "july",
              width: "160",
              align: "center",
              signIndex: 112,
            },
            {
              id: 114,
              label: "8月",
              prop: "august",
              width: "160",
              align: "center",
              signIndex: 113,
            },
            {
              id: 115,
              label: "9月",
              prop: "september",
              width: "160",
              align: "center",
              signIndex: 114,
            },
            {
              id: 116,
              label: "10月",
              prop: "october",
              width: "160",
              align: "center",
              signIndex: 115,
            },
            {
              id: 117,
              label: "11月",
              prop: "november",
              width: "160",
              align: "center",
              signIndex: 116,
            },
            {
              id: 118,
              label: "12月",
              prop: "december",
              width: "160",
              align: "center",
              signIndex: 117,
            },
          ]
        },
        {
          id: 7,
          label: "完成比例%",
          prop: "schedule",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "160",
          align: "center",
          signIndex: 7,
        },
      ],
      fileDataInfo: {
        1: {
          exportApi: 'ExportDataKeyPointTask'
        },
        2: {
          exportApi: 'ExportDataEconomicEfficiency'
        },
        3: {
          exportApi: 'ExportDataPartyBuilding'
        },
        4: {
          exportApi: 'ExportDataComprehensiveManagement'
        },
      },
      data: [],
      allTableHeaderList: [],
      dialogVisible: false,
      title: ''
    }
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
    showAll(type) {
      switch (type) {
        case 1:
          this.title = '重点任务指标'
          this.data = this.formData.key_point_tasks
          this.allTableHeaderList = this.tableHeaderList
          break;
        case 2:
          this.title = '经济效益指标'
          this.data = this.formData.economic_efficiencies
          this.allTableHeaderList = this.tableHeaderList2
          break;
        case 3:
          this.title = '党建工作指标'
          this.data = this.formData.party_buildings
          this.allTableHeaderList = this.tableHeaderList
          break;
        case 4:
          this.title = '综合管理指标'
          this.data = this.formData.comprehensive_managements
          this.allTableHeaderList = this.tableHeaderList
          break;
        default:
          break;
      }
      this.$nextTick(() => {
        this.dialogVisible = true
      })
    },
    onExport(type) {
      let params = {
        id: this.formData.id,
        isAdmin: 1
      }
      this.$client[this.fileDataInfo[type].exportApi](params).then((res) => {
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
.monthly-report-assessment-indicators-audit {
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

  .header {
    display: flex;
    aling-items: flex-end;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .text {
    white-space: pre;
  }
}

</style>
<style lang="stylus" rel="stylesheet/stylus">
.showAllBox {
  .el-dialog__body { 
    height: calc(100% - 50px);
  } 
  .tr-table {
    height: 100%;
  }
}
</style>
