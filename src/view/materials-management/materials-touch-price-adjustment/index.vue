<template>
  <div class="materials-touch-price-adjustment">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-btn-export="exportFile"
      @open-setting-page="openSettingPageEvent"
    ></sub-req>
    <tr-vxe-table
      ref="trVxeTable"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
    </tr-vxe-table>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'materials-touch-price-adjustment',
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_code",
          width: "150",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "material_specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "来源供应商",
          prop: "provier_name",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "原价格",
          prop: "old_price",
          width: "",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "新价格",
          prop: "new_price",
          width: "",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "操作时间",
          prop: "create_time",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "操作人",
          prop: "create_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "备注",
          prop: "work_code",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },

      ],
    }
  },
  mounted() {

  },
  methods: {
    onSubmit(form) {
      this.form = Object.assign({}, form);
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.GetRepairHourDetailsMaintRepairOrder({context: params})
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      this.$client.ExportRepairDetailMaintRepairOrder({context: params}).then((res) => {
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
    //关闭弹窗
    handleClose() {
      this.warehouseLeaveShow=false
    },
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        console.log('title', res)
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
      }).catch(err => {})
    },
    // 打开表头设置
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
        // console.log(maxh);
      }, 60);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.materials-touch-price-adjustment{
  width: 100%;
  height: 100%;
}
</style>
