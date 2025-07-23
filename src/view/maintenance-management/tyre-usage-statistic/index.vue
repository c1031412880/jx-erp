<template>
  <div class="tyre-usage-statistic">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-out="outdate"
      @on-btn-export="exportFile"
    ></sub-req>

    <tr-table
      :data="data"
      :loading="loading"
      :indexShow="true"
      :isShowSummary="isShowSummary"
      :selectionShow="true"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
      :tableHeaderList="canRendererTableHeader"
      @on-select-change-row="selectedList"
    ></tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "tyre-usage-statistic",
  components: {
    subReq,
  },
  component: [
    subReq,
  ],
  data() {
    return {
      form: {
        tyreCountState: []
      },
      data: [],
      loading: false,
      TableHeight: 500,
      isShowSummary: true,
      customSettingMap: {
        '1': {
          id: 1,
          label: "报废数量",
          prop: "fail_count",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        '2':{
          id: 2,
          label: "修补数量",
          prop: "repair_count",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        '3':{
          id: 3,
          label: "翻新数量",
          prop: "retread_count",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        '4':{
          id: 4,
          label: "采购数量",
          prop: "buy_count",
          width: "130",
          align: "center",
          signIndex: 1,
        },
      },
      idxObj: {
          id: 5,
          label: "轮胎型号",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
      },
      customSettingList: [],
      selectedIds:[], //勾选的ID
      indexNum:'',
      sumTotal:{ //约定某一列汇总合计自定义数据
        indexNum: ''
      },
      canRendererTableHeader: [],
      sumColumnIndex: [ 4 ]
    }
  },

  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });

  },
  methods: {

    outdate(form) {
      this.form = form
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.setInitTable(this.form.tyreCountState);
      this.$client.getTyreCountTyreManage(params)
        .then(res => {
          if (res.head.result == "200") {
            let obj = {}
            obj.name = "合计"
            obj.fail_count = res.context.summary.totalFail
            obj.repair_count = res.context.summary.totalRepair
            obj.retread_count = res.context.summary.totalRetread
            obj.buy_count = res.context.summary.totalBuy
            this.loading = false;
            this.data = res.context.list;
            this.data.push(obj)
            if (this.sumColumnIndex.length) {
              let key = this.sumColumnIndex[0]
              this.sumTotal = {}
              this.sumTotal[key] = '总金额：' + res.context.summary.totalPrice
            }
            // console.log('合计',this.sumTotal,this.sumColumnIndex)
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }

        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    setInitTable(typeList = []) {
      this.customSettingList = []
      let list = []
      list.push(this.idxObj)
      if (typeList.length) {
        typeList = typeList.sort((a, b) => {
          return a - b
        })
        typeList.forEach(key => {
          list.push(this.customSettingMap[key])
        })
      } else {
        Object.keys(this.customSettingMap).forEach(key => {
          list.push(this.customSettingMap[key])
        })
      }
      for(let i = 0; i < list.length; i ++) {
        let item = list[i]
        item.id = i+1
        item.signIndex = i
        if (item.prop === 'buy_count') {
          this.sumColumnIndex = [i+1]
        }
      }

      this.customSettingList = list
      this.canRendererTableHeader = this.customSettingList
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.form.tyreCountState = this.form.tyreCountState ? this.form.tyreCountState : []
      if(this.form.tyreCountState.length > 0 && this.form.tyreCountState.indexOf('4') === -1) {
        this.isShowSummary = false
      }else {
        this.isShowSummary = true
      }
      this.loadData();
    },

    // 重置
    restTableList() {
      this.form = {};
      this.loadData();
    },

    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
    },

    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportCountTyreManage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tyre-usage-statistic {
  width: 100%;
  height: 100%;
}
</style>
