<template>
  <div class="table-data">
    <div class="t-title" v-if="title">
      <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
      <p
        style="
          margin-left: 15px;
          margin-bottom: 15px;
          color: #409eff;
          font-size: 16px;
          font-weight: bold;
        "
      >
        {{ title }}
      </p>
    </div>
    <el-alert v-if="label" :title="label" :closable="false" type="info"></el-alert>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="TableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="0"
      :backFixedNum="0"
    >
      <template v-for="(item, i) in TableHeader" :slot="item.prop" slot-scope="scope">
        <slot :name="item.prop" :data="scope.data">
          {{ scope.data[item.prop] }}
        </slot>
      </template>
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
    this.loadData()
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
