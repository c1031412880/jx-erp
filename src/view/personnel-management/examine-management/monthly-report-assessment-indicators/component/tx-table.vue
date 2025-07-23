<template>
  <div class="tx-table">
    <div class="header">
      <span style="margin-right: 5px;">{{ title }}</span>
      <el-button size="mini" type="primary" v-if="curType == 'add' || curType == 'all'"  @click="add">新增</el-button>
      <el-button size="mini" type="primary" v-if="curType == 'add' || curType == 'all'"  @click="del">删除</el-button>
      <el-button size="mini" type="primary" @click="showAll">查看更多</el-button>
      <el-button size="mini" type="primary" v-if="curType == 'detail'"  @click="onExport">导出</el-button>
      <el-button size="mini" type="primary" v-if="curType == 'add' || curType == 'all'" @click="importFile">导入</el-button>
      <div style="margin-left: 15px;">
        <span>筛选月份</span>
        <el-select v-model="monthInfo[tableType]" style="width: 150px;" placeholder="请选择月份" multiple  @change="changeMonth" collapse-tags>
          <el-option
            v-for="item in monthList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
    </div>
    <tr-table
      :selectionShow="true"
      :data="searchPageChange"
      :tableHeaderList="tableHeaderList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :frontFixedNum="1"
      :backFixedNum="0"
      @on-select-change-row="handleSelectionChange"
    >
      <template slot-scope="scope" :slot="item.prop" v-for="item in slotList">
        <slot
          :name="item.prop"
          :data="scope.data"
          :index="scope.$index"
        >
          {{ 123 }}
        </slot>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageIndex"
      :page-sizes="[3,5,10]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageCount"
    >
    </el-pagination>

    <el-dialog
      custom-class="showAllBox"
      :title="title"
      fullscreen
      :visible.sync="dialogVisible"
      append-to-body>
      <tr-table
        :data="data"
        :tableHeaderList="tableHeaderList"
        :TableHeight="'100%'"
        :isShowBottomOptions="false"
        :frontFixedNum="1"
        :backFixedNum="0"
      >
      <template slot-scope="scope" slot="write_person_list">
        <span>{{ scope.data.write_person_name }}</span>
      </template>
      </tr-table>
    </el-dialog>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="typeMessage"
      @on-submit-excel="onSubmitExcel"
      :isShowImportState="false"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { uuid,deepCopy } from '@/utils/index';  
import fileDialog from "@/components/fileDialog/file-dialog";
export default {
  props:{
    title:  {
      type: String,
      default: ''
    },  
    data: {
      type: Array,
      default: []
    },
    tableHeaderList: {
      type: Array,
      default: []
    },
    tableType: {
      type: Number,
      default: 0      // 1 重点任务指标  2 经济效益指标 3 党建工作指标 4 综合管理指标
    },
    id:  {
      type: Number,
      default: 0
    }, 
    isAdmin: {
      type: Boolean,
      default: false
    },
    curType: {
      type: String,
      default: 'add'
    }
  },
  components: {
    fileDialog
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 3,
      pageCount: 0,
      TableHeight: 300,
      dialogVisible:false,
      ids: [],
      typeMessage: '',
      filedialogVisible: false,
      FileData: null,
      selectMonth: '',
      options: [{
          value: 'january',
          label: '1月'
        }, {
          value: 'february',
          label: '2月'
        }, {
          value: 'march',
          label: '3月'
        }, {
          value: 'april',
          label: '4月'
        }, {
          value: 'may',
          label: '5月'
        }, {
          value: 'june',
          label: '6月'
        }, {
          value: 'july',
          label: '7月'
        }, {
          value: 'august',
          label: '8月'
        }, {
          value: 'september',
          label: '9月'
        }, {
          value: 'october',
          label: '10月'
        }, {
          value: 'november',
          label: '11月'
        }, {
          value: 'december',
          label: '12月'
        }],
      fileDataInfo: {
        1: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/重点任务指标导入.xlsx`,
          importApi: 'ImportDataKeyPointTask',
          exportApi: 'ExportDataKeyPointTask'
        },
        2: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/经济效益指标导入.xlsx`,
          importApi: 'ImportDataEconomicEfficiency',
          exportApi: 'ExportDataEconomicEfficiency'
        },
        3: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/党建工作指标导入.xlsx`,
          importApi: 'ImportDataPartyBuilding',
          exportApi: 'ExportDataPartyBuilding'
        },
        4: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/综合管理指标导入.xlsx`,
          importApi: 'ImportDataComprehensiveManagement',
          exportApi: 'ExportDataComprehensiveManagement'
        },
      },
      keynoteInfo: {
        id: '',
        check_content: '',
        check_detail: '',
        write_person_list: [],
        january: '',
        february: '',
        march: '',
        april: '',
        may: '',
        june: '',
        july: '',
        august: '',
        september: '',
        october: '',
        november: '',
        december: '',
      },
      economyInfo: {
        id: '',
        economic_indicators: '',
        target_report_value: '',
        write_person_list: [],
        target_report_remark: '',
        total_target_value: '',
        total_target_remark: '',
        first_quarter_value: '',
        second_quarter_value: '',
        third_quarter_value: '',
        fourth_quarter_value: '',
        january: '',
        february: '',
        march: '',
        april: '',
        may: '',
        june: '',
        july: '',
        august: '',
        september: '',
        october: '',
        november: '',
        december: '',
        schedule: '',
        remark: '',
      },
      monthList:[1,2,3,4,5,6,7,8,9,10,11,12],
      monthInfo:{
        1: [],
        2: [],
        3: [],
        4: [],
      }
    };
  },
  computed: {
      // 计算属性对数据进行处理
    searchPageChange() {
      this.pageCount = this.data.length
      let start = (this.pageIndex - 1) * this.pageSize;
      if (start >= this.data.length) start = 0;
      let end = this.pageIndex * this.pageSize;
      if (end >= this.data.length) end = this.data.length;
      return this.data.slice(start, end);
    },
    slotList() {
      let list = []
      this.tableHeaderList.forEach(item => {
        if (item.nestedTablesHeader) {
          item.nestedTablesHeader.forEach(child => {
            list.push(child)
          })
        } else {
          list.push(item)
        }
      })
      return list
    },
  },
  mounted() {
  },
  methods: {
    add() {
      let info = {}
      switch (this.tableType) {
        case 1:
          info = deepCopy(this.keynoteInfo)
          break;
        case 2:
          info = deepCopy(this.economyInfo)
          break;
        case 3:
          info = deepCopy(this.keynoteInfo)
          break;
        case 4:
          info = deepCopy(this.keynoteInfo)
          break;
        default:
          break;
      }
      info.id = uuid()
      if (this.ids.length > 0) {
        let id = this.ids[this.ids.length - 1]
        let i = 0
        console.log(id);
        this.data.forEach((item,index) => {
          if (item.id == id) {
            i = index
          }
        });
        this.data.splice(i + 1,0,info)
      } else {
        this.data.push(info)
      }
      
      // 记录排序字段
      this.data.forEach((item,index) => {
        item.sort = index + 1
      });
      this.pageCount = this.data.length
    },
    del() {
      if (this.ids.length > 0) {
        this.data = this.data.filter(item => {
          return this.ids.indexOf(item.id) == -1
        })
          // 记录排序字段
        this.data.forEach((item,index) => {
          item.sort = index + 1
        });
        this.pageCount = this.data.length
      } else {
        this.$message({
          showClose: true,
          message: '请选择要删除的数据',
          type: "warning",
        });
      }
    },
    //筛选月份时触发
    refreshMonth(bool){
      if(bool == false)
      console.log(this.selectMonth)
    },
    showAll() {
      this.dialogVisible = true
    },
    onExport() {
      let params = {
        id: this.id,
        isAdmin: this.isAdmin ? 1 : 2
      }
      this.$client[this.fileDataInfo[this.tableType].exportApi](params).then((res) => {
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
    importFile() {
      this.FileData = this.fileDataInfo[this.tableType]
      switch (this.tableType) {
        case 1:
          this.typeMessage = '重点任务指标'
          break;
        case 2:
          this.typeMessage = '经济效益指标'
          break;
        case 3:
          this.typeMessage = '党建工作指标'
          break;
        case 4:
          this.typeMessage = '综合管理指标'
          break;
        default:
          break;
      }
      this.$nextTick(() => {
        this.filedialogVisible = true
      })
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client[this.fileDataInfo[this.tableType].importApi](params)
      .then(res => {
        if(res.head.result == "200") {
          let list = res.context.list
          list.forEach(item => {
            item.id = uuid()
          })

          // this.data = [...this.data,...list]
          // // 记录排序字段
          // this.data.forEach((item,index) => {
          //   item.sort = index + 1
          // });
          this.$emit('on-import',list,this.tableType)
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else if(res.head.result == "205") {
          this.filedialogVisible = false;
          let list = res.context
          if(!!list && list.length > 0) {
            let errorData = [];
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `录入提示(共${list.length}条)`,
              message: h('div',{ style: `height: 300px;${list.length > 12?'overflow-y: scroll':''}`}, errorData),
              confirmButtonText: '确定',
            })
          }
        } else{
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    handleSelectionChange(rows) {
      this.ids = rows.map(item =>{
        return item.id
      })
    },
    handleCurrentChange(idx) {
      this.pageIndex = idx
    },
    handleSizeChange(sizes) {
      this.pageIndex = 1;
      this.pageSize = sizes;
    },
    // 修改月份
    changeMonth() {
      this.$emit('change-month',this.monthInfo,this.tableType)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tx-table {
  .header {
    display: flex;
    aling-items: flex-end;
    font-size: 18px;
    margin-bottom: 10px;
  }
 
  .tr-table {
    height: 100%
  }
}

</style>
<style lang="stylus" rel="stylesheet/stylus">
.showAllBox {
  .el-dialog__body { 
    height: calc(100% - 50px);
  } 
  .tr-table {
    height: 100%;
  }
}
</style>
