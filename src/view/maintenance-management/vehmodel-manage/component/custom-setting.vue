<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="750px"
    
  >
    <div style="margin-bottom: 10px">
      <span
        >列项显示不得少于5项，最多支持自定义10个列项，灰色选中列不支持隐藏和排序</span
      >
    </div>
    <div class="draggable">
      <el-table
        row-key="id"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        :header-cell-class-name="cellClass"
        @selection-change="handleSelectionChange"
        height="400px"
        border
      >
        <el-table-column
          v-for="(item, index) in oldList"
          :key="`col_${index}`"
          :prop="item.prop"
          :label="item.label"
          :type="item.prop == 'name' ? 'selection' : ''"
          :align="item.align || 'center'"
          :width="item.width || ''"
          :selectable="isDisabled"
        >
          <template v-if="item.prop == 'sort'">
            <i class="el-icon-s-operation"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" style="float: left;" @click="restoreDefault">恢复默认</el-button>
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
import draggable from "vuedraggable";
import Sortable from "sortablejs";
export default {
  components: {
    draggable,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "自定义显示列项",
    },
    customSettingList: [Array],
    frontFixedNum:[Number],
    backFixedNum:[Number],
  },
  data() {
    return {
      disabled: false,
      oldList: [],
      newList: [],
      //定义要被拖拽对象的数组
      tableConfig: {
        tableItems: [
          {
            label: "显示",
            prop: "name",
            width: "130",
            align: "center",
          },
          {
            label: "列名",
            prop: "label",
            width: "420",
            align: "left",
          },
          {
            label: "拖动顺序调整",
            prop: "sort",
            width: "160",
            align: "center",
          },
        ],
      },
      configTableData:[],
      tableData: [
        // {
        //   id: 1,
        //   label: "车辆型号",
        //   sort: 30,
        // },
        // {
        //   id: 2,
        //   label: "车辆数量",
        //   sort: 18,
        // },
        // {
        //   id: 3,
        //   label: "车辆类型",
        //   sort: 50,
        // },
        // {
        //   id: 4,
        //   label: "生产厂家",
        //   sort: 50,
        // },
        // {
        //   id: 5,
        //   label: "车辆类型",
        //   sort: 50,
        // },
        // {
        //   id: 6,
        //   label: "生产厂家",
        //   sort: 50,
        // },
        // {
        //   id: 7,
        //   label: "车辆类型",
        //   sort: 50,
        // },
        // {
        //   id: 8,
        //   label: "生产厂家",
        //   sort: 50,
        // },
        // {
        //   id: 9,
        //   label: "车辆类型",
        //   sort: 50,
        // },
        // {
        //   id: 10,
        //   label: "生产厂家",
        //   sort: 50,
        // },
        // {
        //   id: 11,
        //   label: "不允许拖动选项",
        //   sort: 50,
        // },
        // {
        //   id: 12,
        //   label: "不允许拖动选项",
        //   sort: 50,
        // } 
        ],
      havedTableId:[], //已存在不可选的数据行ID
      configMultipleSelection:[],
      multipleSelection: [],
    };
  },
  mounted() {
    // this.configTableData = this.tableData;
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.oldList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));
        this.configTableTitle();
        //   this.newList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));
        if(this.tableData.length > 0) {
          setTimeout(() => {
            this.addRowByClassName();
            this.rowDrop();
            this.buildHavedSelection(this.tableData);
          }, 50);
        }

      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    
    // 初始化数据
    configTableTitle() {
      this.tableData = this.customSettingList
    },

    // 对全选框进行class绑定
    cellClass(row) {
      if (row.columnIndex === 0) {
        return "disabledCheck";
      }
    },

    // 绑定可拖拽的区域
    addRowByClassName() {
      let rowDom = $('.draggable .el-table__row')
      let len = rowDom.length;
      // 至少必须是前面固定加后面固定中间2项可以移动的
      if(len>(this.frontFixedNum + this.backFixedNum + 2)) {
        // let num = 2;
        // rowDom.splice(0,2);
        // let secondLen = len - num;
        // rowDom.splice(secondLen -(secondLen+2),2);
        rowDom.splice(0,this.frontFixedNum);
        let secondLen = len - this.frontFixedNum;
        // 从倒数第几项删除几个
        rowDom.splice(secondLen -(secondLen + this.backFixedNum),this.backFixedNum);

      }
      rowDom.addClass("can-draggable-active-options")
    },

    setMultipleSelection() {
      let havedMultipleSelection = [this.tableData[0], this.tableData[1], this.tableData[this.tableData.length-2], this.tableData[this.tableData.length-1]];

      this.configMultipleSelection.push(...havedMultipleSelection)
      console.log(this.configMultipleSelection)
    },

    // 禁止选中
    isDisabled(row,index) {

      if(this.havedTableId.indexOf(row.id) > -1 ) { 
        return false
      }else{
        return true
      }

    },

    handleSelectionChange(val) {

      this.multipleSelection = this.multipleSelectionSort(val)
      console.log(this.multipleSelection)

    },

    // 对选中的表头排序
    multipleSelectionSort(val) {
      let temporaryObj={};
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < val.length; j++) {
          if(val[i].signIndex < val[j].signIndex) {
            temporaryObj = val[j]
            val[j] = val[i]
            val[i] = temporaryObj
          }
        }
      }
      return val
    },

    buildHavedSelection(tableData) {
      if(tableData.length > 0) {
        let frontTabledata = [];
        let backTabledata = [];
        if(this.frontFixedNum > 0) {
          frontTabledata = tableData.slice(0,this.frontFixedNum);
        }
        if(this.backFixedNum > 0) {
          backTabledata = tableData.slice(-this.backFixedNum);
        }
        let havedTabledata = [...frontTabledata, ...backTabledata]

        havedTabledata.forEach((item) => {
          this.havedTableId.push(item.id)
        });

        this.toggleSelection(havedTabledata);
      }
    },

    toggleSelection(rows) {
      // console.log(rows)
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(
        ".draggable .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".draggable .can-draggable-active-options",
        animation: 500,
        delayOnTouchOnly: true,
        onEnd({ newIndex, oldIndex }) {
          console.log('这是新的Index' + newIndex)
          console.log('这是旧的Index' + oldIndex)
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          // _this.afreshSignIndex()
          // 标记位更新
          _this.tableData.forEach((item, index) => {
            item.signIndex = index
          });
          // 只要位置拖动调整就对选中的进行排序
          _this.multipleSelectionSort(_this.multipleSelection)
          console.log(_this.tableData)
        },
      });
    },
    // 列拖拽
    // columnDrop() {
      //   const wrapperTr = document.querySelector(
        //     ".draggable .el-table__header-wrapper tr"
    //   );
    //   console.log('lie'+JSON.stringify(wrapperTr))
    //   this.sortable = Sortable.create(wrapperTr, {
      //     animation: 180,
    //     delay: 0,
    //     onEnd: (evt) => {
      //       const oldItem = this.newList[evt.oldIndex];
    //       this.newList.splice(evt.oldIndex, 1);
    //       this.newList.splice(evt.newIndex, 0, oldItem);
    //     },
    //   });
    // },
    restoreDefault() {

    },
    updatePlaybill() {
      if(this.multipleSelection.length < 5) {
        this.$message({
          title:'提示',
          message: '列项显示不得少于5项',
          type: 'warning'
        });
        return
      }

      if(this.multipleSelection.length - (this.frontFixedNum + this.backFixedNum) > 10) {
        this.$message({
          title:'提示',
          message: '最多支持自定义10个列项',
          type: 'warning'
        });
        return
      }
      let exportMultipleSelection = []
      this.multipleSelection.forEach((item, index) => {
        let exportMultipleSelectionObj = {
          id: item.id,
          label: item.label,
          prop: item.prop,
          width: item.width,
          align: item.align,
          signIndex:index,
        } 
        exportMultipleSelection.push(exportMultipleSelectionObj)
      });
      this.$parent.updateTableHeader(exportMultipleSelection)
      this.dialogClose();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-table /deep/ .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}

.el-table /deep/ .disabledCheck .cell {
  display: block;
}

.el-table /deep/ .disabledCheck .cell:before {
  content: '显示' !important;
  position: absolute !important;
  right: 50px !important;
}

.el-table /deep/ .el-table__row{
  background-color: #f5f5f5;
}

.el-table /deep/ .can-draggable-active-options{
  cursor: pointer !important;
  background-color: #fff;
}
</style>
