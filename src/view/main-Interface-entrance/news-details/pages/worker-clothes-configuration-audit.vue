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
          <p>申请人</p>
          <em>{{ formData.user_name }}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{ formData.dept_name }}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p>配置期</p>
          <em>{{ formData.set_date_start }} 至 {{ formData.set_date_end }}</em>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>配置明细明细</p>
          <tr-table
            ref="table"
            :selectionShow="false"
            :indexShow="false"
            :data="tableData"
            :tableHeaderList="customSettingList"
            :TableHeight="TableHeight"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
            :highlightCurrentRow="false"
            :customSpanMethodFun="customSpanMethodFun"
            v-if="formData.details && formData.details.length"
          >
            <template slot-scope="scope" slot="type">
              <div class="gray">{{ scope.index < 2 ? '男' : '女' }}</div>
            </template>
            <template slot-scope="scope" slot="num_fee">
              <div class="gray">{{ scope.index % 2 ? '金额' : '数量' }}</div>
            </template>
            <template slot-scope="scope" slot="subtotal">
              <div class="gray">{{ scope.data.subtotal }}</div>
            </template>
            <template slot-scope="scope" slot="total_fee">
              <div class="gray">{{ scope.data.total_fee }}</div>
            </template>
          </tr-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>申请配置说明</p>
          <em>{{ formData.remark }}</em>
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

<script>
import imageFileUpload from '@/components/imageFileUpload/index'
import titleBoxNew from '../component/title-box-new'
import itemBoxNew from '../component/item-box-new'
export default {
  name: 'worker-clothes-configuration-audit',
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload
  },
  mounted() {},
  props: {
    step_id: '',
    userId: '',
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      clothesMap: {
        one: '短袖二件',
        two: '长袖二件',
        three: '夏裤二条',
        four: '西服一衣二裤',
        five: '冬衣一件'
      },
      customSettingList: [
        {
          id: 1,
          label: '类别',
          prop: 'type',
          width: '80',
          align: 'center',
          signIndex: 0,
          notTooltip: true
        },
        {
          id: 2,
          label: '人数',
          prop: 'count',
          width: '130',
          align: 'center',
          signIndex: 1,
          notTooltip: true
        },
        {
          id: 3,
          label: '',
          prop: 'num_fee',
          width: '80',
          align: 'center',
          signIndex: 2,
          notTooltip: true
        },
        {
          id: 4,
          label: '短袖二件',
          prop: 'one',
          width: '130',
          align: 'center',
          signIndex: 3,
          notTooltip: true
        },
        {
          id: 5,
          label: '长袖二件',
          prop: 'two',
          width: '130',
          align: 'center',
          signIndex: 4,
          notTooltip: true
        },
        {
          id: 6,
          label: '夏裤二条',
          prop: 'three',
          width: '130',
          align: 'center',
          signIndex: 5,
          notTooltip: true
        },
        {
          id: 7,
          label: '西服一衣二裤',
          prop: 'four',
          width: '130',
          align: 'center',
          signIndex: 6,
          notTooltip: true
        },
        {
          id: 8,
          label: '冬衣一件',
          prop: 'five',
          width: '130',
          align: 'center',
          signIndex: 7,
          notTooltip: true
        },
        {
          id: 9,
          label: '小计',
          prop: 'subtotal',
          width: '130',
          align: 'center',
          signIndex: 8,
          notTooltip: true
        },
        {
          id: 10,
          label: '总金额(元)',
          prop: 'total_fee',
          width: '130',
          align: 'center',
          signIndex: 9,
          notTooltip: true
        }
      ],
      tableData: [
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        },
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        },
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        },
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        }
      ],
      TableHeight: 300,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      formData: {
        flow_id: 0,
        details: [],
        thumbnail_imgs: [],
        files_list: []
      },
      flowFields: {
        repair_date: 1,
        real_cost: 1
      }
    }
  },
  watch: {
    step_id(id) {
      if (this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
        this.getFlowFields(id)
      } else {
        Object.assign(this.flowFields, this.$options.data().flowFields)
      }
    },
    formData(val) {
      this.getformData(val)
    }
  },
  methods: {
    getformData(info) {
      try {
        this.tableData = this.$options.data().tableData
        const invertedClothesMap = Object.keys(this.clothesMap).reduce((acc, key) => {
          acc[this.clothesMap[key]] = key
          return acc
        }, {})
        if (info.details && info.details.length) {
          let details = info.details
          this.tableData[0].count = this.tableData[1].count = details[0].count || undefined
          this.tableData[2].count = this.tableData[3].count = details[1].count || undefined
          details[0].details.forEach(item => {
            let key = invertedClothesMap[item.wear_name]
            this.tableData[0][key] = item.receive_count || undefined
            this.tableData[1][key] = item.receive_amount || undefined
          })
          details[1].details.forEach(item => {
            let key = invertedClothesMap[item.wear_name]
            this.tableData[2][key] = item.receive_count || undefined
            this.tableData[3][key] = item.receive_amount || undefined
          })
          this.calculatePrice()
        }
      } catch (error) {
        console.log(error)
      }
    },
    calculatePrice() {
      try {
        const keys = Object.keys(this.clothesMap)
        this.tableData.forEach(item => {
          item.subtotal = 0
          keys.forEach(key => {
            item.subtotal += Number(item[key] ? item[key] : 0)
          })
          item.subtotal = Number(item.subtotal.toFixed(2))
        })
        this.tableData[0].total_fee =
          this.tableData[1].total_fee =
          this.tableData[2].total_fee =
          this.tableData[3].total_fee =
            Number((this.tableData[1].subtotal + this.tableData[3].subtotal).toFixed(2))
      } catch (error) {
        console.log(error)
      }
    },
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break
        case 1:
          return '#F58A40'
          break
        case 2:
          return '#0CB780'
          break
        case 3:
          return '#F2260E'
          break
        case 4:
          return '#999999'
          break
      }
    },
    // 获取表单字段控制
    getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client
        .GetFlowFieid(params)
        .then(res => {
          if (res.head.result == '200') {
            let data = res.context
            let fields = Object.keys(this.flowFields)
            if (data && data.length) {
              data.forEach(item => {
                if (fields.indexOf(item.fieid_code) > -1) {
                  this.flowFields[item.fieid_code] = item.type
                }
              })
            }
          }
        })
        .catch(err => {})
    },
    // 修改input内容
    changeInputContent() {
      if (this.formData.state) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          }
        }
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.UpdateFuelAssess(params).then(req => {})
      }
    },
    customSpanMethodFun({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 9) {
        if (rowIndex === 0) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
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
.gray {
  width: 100%;
  height: 100%;
  background-color: #ebecf0;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
