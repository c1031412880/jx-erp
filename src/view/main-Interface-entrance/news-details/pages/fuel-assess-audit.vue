<template>
  <div class="bus-decoration-maintenance-audit" v-loading="loading">
    <div class="head-image">
      <img
        :src="require('../../launch-affair/component/tableData/img/zhang1.png')"
        v-if="formData.state === 2"
        alt=""
      />
      <img
        :src="require('../../launch-affair/component/tableData/img/zhang2.png')"
        v-if="formData.state === 4"
        alt=""
      />
      <img
        :src="require('../../launch-affair/component/tableData/img/zhang3.png')"
        v-if="formData.state === 3"
        alt=""
      />
    </div>
    <title-box-new :title="formData.title">
      <div class="head-content">
        <p style="color: #bbbbbb">审批编号:{{ formData.flow_code }}</p>
        <p :style="{ color: outColor(formData.state) }">
          {{ formData.state === 0 ? '发起审批' : formData.state_name }}
        </p>
      </div>
    </title-box-new>
    <item-box-new title="基本信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>经办人</p>
          <em>{{ formData.user_name }}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{ formData.dept_name }}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>考核月份</p>
          <em>{{ formData.request_date }}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>燃料明细</p>
          <tr-table
            ref="table"
            :selectionShow="false"
            :indexShow="false"
            :data="formData.details"
            :tableHeaderList="customSettingList"
            :TableHeight="TableHeight"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
            v-if="formData.details && formData.details.length"
          ></tr-table>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isShowBox="false"
        ></image-file-upload>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
export default {
  name: "bus-decoration-maintenance-audit",
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
      customSettingList: [
        {
          id: 1,
          label: '燃料名称',
          prop: 'fuel_name',
          width: '130',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '行驶里程(公里)',
          prop: 'kilometers',
          width: '130',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '燃料消耗(升/公斤)',
          prop: 'fuel_consume',
          width: '130',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '升/百公里 公斤/百公里',
          prop: 'avg_consume',
          width: '160',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '实际净油(升/公斤)',
          prop: 'real_consume',
          width: '130',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '奖励金额',
          prop: 'award_amount',
          width: '130',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '备注',
          prop: 'remark',
          width: '160',
          align: 'center',
          signIndex: 6
        }
      ],
      TableHeight: 300,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      formData: {
        flow_id:0,
        thumbnail_imgs: [],
        files_list: []
      },
      flowFields: {
        repair_date: 1,
        real_cost: 1,
      },
    }
  },
  watch: {
    step_id(id) {
      if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
        this.getFlowFields(id)
      }else {
        Object.assign(this.flowFields, this.$options.data().flowFields)
      }
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
    // 修改input内容
    changeInputContent() {
      if(this.formData.state) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          }
        }
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.UpdateFuelAssess(params).then((req) => {})
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bus-decoration-maintenance-audit {
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
