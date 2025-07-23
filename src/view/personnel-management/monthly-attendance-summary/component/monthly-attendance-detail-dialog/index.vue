<template>
  <el-dialog :visible="dialogBool" fullscreen :before-close="dialogClose" center>
    <!-- <el-page-header slot="title" @back="dialogClose" :content="showTitle" class="show-flex-box-r show-flex-center"></el-page-header> -->
    <tr-page-header
      ref="trPageHeader"
      slot="title"
      :content="showTitle"
      @back="dialogClose"
    ></tr-page-header>
    <div class="leave-staff-dialog">
      <div class="search-content" style="margin-bottom: 20px">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="exportFile()"
          v-if="$isPowerShow('export')"
          size="mini"
        >
          导出
        </el-button>
      </div>
      <div class="table-content">
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
          <template
            v-for="(Zitem, Zindex) in titlesKeysListMapArray"
            slot-scope="scope"
            :slot="Zitem"
          ></template>
          <span
            style="cursor: pointer"
            :style="`${
              data[scope.index][titlesKeysListMapArray[Zindex]] == '正常'
                ? data[scope.index][titlesKeysListMapArray[Zindex]] == '休息'
                  ? data[scope.index][titlesKeysListMapArray[Zindex]] == '不在考勤组，已打卡'
                    ? ''
                    : 'color: #F59A23'
                  : 'color: #F59A23'
                : 'color: #F59A23'
            }`"
            @click="openDetail(scope.data, titlesKeysListMapArray[Zindex])"
          >
            {{ data[scope.index][titlesKeysListMapArray[Zindex]] }}
          </span>
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
      </div>
    </div>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :userName="staffName"
      :deptName="deptName"
      :kqzTime="kqzTime"
      :title="informationDialogTitle"
    ></information-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import informationDialog from "./component/information-dialog";
export default {
  components: {
    informationDialog
  },
  props: {
    dialogBool: Boolean,
    selectedIds:[Array],
    start:[String],
    end:[String],
  },
  data() {
    return {
      showTitle: "月考勤明细",
      TableHeight: 500,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      frontFixedNum: 2,
      backFixedNum: 0,
      data: [],
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "班次",
          prop: "kqbc",
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
      titlesKeysListMapArray:[],
      titlesValuesListMapArray:[],
      staffName:'',
      deptName:'',
      kqzTime:'',
      informationDialogTitle:'',
      informationDialogShow: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        if(this.selectedIds.length) {
          this.loadData();
        }
        this.$nextTick(() => {
          this.setHead();
        });
      }
    },
  },
  mounted() {
    // this.loadData();
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 初始化信息
    configCircuitfInfo() {
      this.showTitle = `(${this.start} ~ ${this.end.slice(0,10)})月考勤明细(${this.pageInfo.pageCount }人)`;
    },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {
        user_ids : this.selectedIds,
        start: this.start,
        end: this.end
      };
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDetailMonthKqReport(params)
        .then(res => {
          if (res.head.result == "200") {
            console.log(res)
             this.data = res.context.datas
            this.pageInfo.pageCount = res.context.total
            this.bulidTableTitle(res.context.titles)
            this.configCircuitfInfo();
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
        })
    },
    // 构建表头头部数据显示
    bulidTableTitle(titles) {
      // console.log(titles)
      let titlesValuesList = Object.values(titles).slice(0,Object.values(titles).length -4)
      let titlesKeysList = Object.keys(titles).slice(0,Object.keys(titles).length -4)
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

    selectedList(list) {

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
    // 导出Excel 文件
    exportFile(){
     let params = {
        user_ids : this.selectedIds,
        start: this.start,
        end: this.end
      };

      this.$client.ExportDetailMonthKqReport(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 日期插入字符
    insertStr(soure,start,newStr) {
      return soure.slice(0,start) + newStr + soure.slice(start)
    },
    // 查看打卡明细
    openDetail(row,date) {
      let startTime = this.insertStr(this.insertStr(String(date),4,'-'), 7,'-')
      let endsTime = startTime + ' 23:59:59'
      // console.log(startTime)
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.deptName = row.kqz || ''
      this.kqzTime = row.kqbc || ''

      this.$refs.informationDialog.form.date = [startTime,endsTime]
      // 2000033
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.setDateInfo()
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        let trPageHeader = this.$refs.trPageHeader.$el.offsetHeight;
        this.TableHeight = maxh - paginationH - 150 - trPageHeader;
        // console.log(this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
