<template>
  <div class="purchase-order-audit" v-loading="loading">
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
          <p>提交人</p>
          <em>{{formData.created_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>提交时间</p>
          <em>{{formData.created_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>采购日期</p>
          <em>{{formData.purchase_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>采购人员</p>
          <em>{{formData.purchase_user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>采购组织</p>
          <em>{{formData.purchase_dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>供应商</p>
          <em>{{formData.supplier_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>采购方式</p>
          <em>{{formData.type_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>是否应急采购</p>
          <em>{{formData.is_emergency_name}}</em>
        </el-col>
        <el-col :span="24">
          <p>备注</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.remark"></el-input>
        </el-col>
        <el-col :span="24">
          <p>采购明细</p>
          <tr-table
            :selectionShow="false"
            :data="formData.details? formData.details: []"
            :tableHeaderList="tableHeaderData"
            :isShowBottomOptions="false"
            :TableHeight="250"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false">
          </tr-table>
        </el-col>
        <el-col :span="24">
          <multiple-files-upload :disabled="true" :filesList="formData.files? formData.files:[]" v-if="formData.files && formData.files.length > 0"></multiple-files-upload>
          <span v-else style="color: #909399">暂无附件</span>
        </el-col>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
import multipleFilesUpload from "@/components/multiple-files-upload";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";

export default {
  name: "purchase-order-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    multipleFilesUpload,
    getDepartmentSelect,
  },
  data() {
    return {
      formData: {
        flow_id:0
      },
      tableHeaderData: [
        {
          id: 1,
          label: "物资编码",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物资名称",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "计量单位",
          prop: "unit",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "含税单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "金额",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "折扣率（%）",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "实际含税单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "折扣额",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "税率（%）",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "税额",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "价税合计",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "原始物料编码",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "库存数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 4,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
    };
  },
  props: {
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
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
    UpdateContract() {
      this.$message.error('此功能正在开发中，敬请期待！')
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.purchase-order-audit {
  .head-image {
    position: absolute;
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .work-processing-sheet{
    width: 100%;
    overflow: hidden;
    .work-processing-sheet-item{
      display:inline-block;
      padding: 0;
      margin: 0 10px 10px 0;
      color: #00a0e9;
      cursor: pointer;
    }
    .work-processing-sheet-item:hover{
      color: #57c6ff;
    }
  }
  .head-content {
    position: relative;
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
