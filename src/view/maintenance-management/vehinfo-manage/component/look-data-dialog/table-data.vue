<template>
  <div class="table-data">
    <div class="t-title" v-if="title">
      <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">{{title}}</p>
    </div>
    <el-alert
      v-if="label"
      :title="label"
      :closable="false"
      type="info">
    </el-alert>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="TableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="0"
      :backFixedNum="0">
      <span v-for="(item,i) in TableHeader" :key="i" :slot="item.prop" slot-scope="scope">
        <slot :name="item.prop" :data="scope.data">
          {{scope.data[item.prop]}}
        </slot>
      </span>
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "table-data",
  props: {
    title: [String],
    label: [String],
    TableHeight: {
      type: Number,
      default: 400
    },
    TableHeader: {
      type: Array,
      default: () => []
    },
    apiKey: [String],
    apiForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    loadData() {
      if (this.apiKey) {
        this.loading = true
        this.$client[this.apiKey](this.apiForm).then(req => {
          this.loading = false
          if (req.head.result === '200') {

            if (req.context.list) {
              this.data = req.context.list
            } else {
              this.data = req.context
            }

            if (this.apiKey === 'getAccidentRecordList') {
              this.data.forEach(item => {
                item.n_estimate_fee = item.n_loss_fee + item.n_insurance_pay_fee + item.n_personal_fee
              })
            }
          }else{
            this.data = [];
          }
        }).catch(err => {
          this.loading = false
          this.data = [];
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-data{
  width 100%
  margin-bottom 20px
  .t-title{
    width 100%
  }
}
</style>
