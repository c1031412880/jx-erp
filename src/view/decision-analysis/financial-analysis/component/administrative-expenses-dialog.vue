<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="750px" >
    <div class="administrative-expensesdialog" style="height:400px;overflow-x:hidden">
      <tr-table
        ref="table"
        :selectionShow="false"
        :indexShow="false"
        :data="data"
        :tableHeaderList="customSettingList"
        :TableHeight="400"
        :loading="loading"
        :frontFixedNum="1"
        :backFixedNum="0">
        <template slot-scope="scope" slot="cur_rate">
          <span v-if="!!scope.data.cur_rate">{{scope.data.cur_rate}}%</span>
          <span v-else>0</span>
        </template>
        <template slot-scope="scope" slot="year_on_year">
          <span v-if="!!scope.data.year_on_year">{{scope.data.year_on_year}}%</span>
          <span v-else>0</span>
        </template>
        <template slot-scope="scope" slot="last_year_on_year">
          <span v-if="!!scope.data.last_year_on_year">{{scope.data.last_year_on_year}}%</span>
          <span v-else>0</span>
        </template>
      </tr-table>

    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '管理费用明细'
    },
    org_id:[String,Number],
    month:[String],
  },
  data() {
    return {  
      loading: false,
      customSettingList:[
        {
          id: 1,
          label: "项目",
          prop: "project",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "本年指标数",
          prop: "index",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "本月数",
          prop: "cur_month",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "本月占比(%)",
          prop: "cur_rate",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "去年同期数",
          prop: "last_year",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "同比增减率",
          prop: "year_on_year",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "本年累计数",
          prop: "cur_year_total",
          width: "160",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "去年累计同期数",
          prop: "last_year_total",
          width: "150",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "同比增减率",
          prop: "last_year_on_year",
          width: "150",
          align: "center",
          signIndex:8,
          sortable:false
        }
      ],
      data:[],
      loading: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.loadData();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 加载数据
    loadData() {
      this.loading = true;
      let params = {
        org_id: this.org_id,
        month:this.month
      }
      this.$client.ManageFeeListFinanceAnalysis(params).then(req => {
          this.loading = false
          if (req.head.result === '200') {
            if(!!req.context){
              this.data = req.context
            }
          }else{
            this.data = [];
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false
          this.data = [];
          console.log(err)
        })
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.administrative-expensesdialog {
  height: 400px;
  // overflow-y: scroll;
}
</style>
