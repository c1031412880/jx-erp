<template>
  <div class="attendance-statistics-summary">
    <sub-req ref="head" @on-ok="onSubmit" @on-export="onExport"></sub-req>
    <tr-table
      ref="trTable"
      v-if="canRendererTableHeader"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedList"
    >
      <template v-for="(Zitem, Zindex) in titlesKeysListMapArray" slot-scope="scope" :slot="Zitem">
        <span
          :style="`${
            data[scope.index][titlesKeysListMapArray[Zindex]] != '正常'
              ? 'color: #F59A23;cursor: pointer;'
              : ''
          }`"
          @click="
            data[scope.index][titlesKeysListMapArray[Zindex]] != '正常' &&
              openDetail(scope.data, titlesKeysListMapArray[Zindex])
          "
        >
          {{ data[scope.index][titlesKeysListMapArray[Zindex]] }}
        </span>
      </template>
    </tr-table>

    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :userName="staffName"
      :deptName="deptName"
      :title="informationDialogTitle"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "attendance-statistics-summary",
  components: {
    subReq,
    informationDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      curSelecedType: "",
      informationDialogTitle: "详情",
      informationDialogShow: false,
      customSettingList: [
        {
          id: 1,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "考勤结果",
          prop: "holiday",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
          nestedTablesHeader:[]
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      staffName:'',
      deptName:'',
      titlesKeysListMapArray:[],
      titlesValuesListMapArray:[]
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 导出
    onExport() {
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      // if(ids.length) {
      //   params.ids = ids.toString()
      // }
      if(this.selectedIds.length) {
        params.user_ids = this.selectedIds
      }
      this.$client.ExportDetailAttendanceStatistics(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.AttendanceDetailAttendanceStatistics(params)
        .then(res => {
          if (res.head.result == "200") {
            this.data = res.context.datas
            this.pageInfo.pageCount = res.context.total
            this.bulidTableTitle(res.context.titles)
            setTimeout(() => {
              this.loading = false;
            },600)
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 构建表头头部数据显示
    bulidTableTitle(titles) {
      // console.log(titles)
      let titlesValuesList = Object.values(titles).slice(0,Object.values(titles).length -3)
      let titlesKeysList = Object.keys(titles).slice(0,Object.keys(titles).length -3)
      this.titlesKeysListMapArray = [...titlesKeysList]
      this.titlesValuesListMapArray = [...titlesValuesList]
      let nestedTablesHeader = []
      titlesValuesList.forEach((item,index) => {
      let obj = {
            label: item,
            prop: titlesKeysList[index],
            width: "130",
            align: "center",
            signIndex: index +3,
            sortable: false,
          }
        nestedTablesHeader.push(obj)
      });
      if(nestedTablesHeader.length) {
        this.customSettingList.forEach(item => {
          if(item.id == 3) {
            item.nestedTablesHeader = nestedTablesHeader
          }
        })
        this.setHead()
        this.$nextTick(() => {
          this.$refs.trTable.configTableHeaderList()
        })
      }
    },

    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 日期插入字符
    insertStr(soure,start,newStr) {
      return soure.slice(0,start) + newStr + soure.slice(start)
    },
    openDetail(row,date) {
      let startTime = this.insertStr(this.insertStr(String(date),4,'-'), 7,'-')
      let endsTime = startTime + ' 23:59:59'
      // console.log(startTime)
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.deptName =  row.dept_name || ''

      this.$refs.informationDialog.form.date = [startTime,endsTime]
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.setDataInfo()
    },
    selectedList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.user_id)
      });
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.attendance-statistics-summary {
  width: 100%;
  height: 100%;
}
</style>
