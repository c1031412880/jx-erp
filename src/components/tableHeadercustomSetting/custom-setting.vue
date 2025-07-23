<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" :append-to-body="appendToBody" width="750px">
    <div style="margin-bottom: 10px">
      <span>列项显示不得少于3项，灰色选中列不支持隐藏和排序</span>
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
        <template v-for="(item, index) in oldList">
          <el-table-column
            v-if="item.prop == 'name'"
            :key="`col_${index}`"
            type="selection"
            align="center"
            width="100"
            prop="selection"
            :selectable="isDisabled"
          ></el-table-column>
          <el-table-column
            v-else-if="item.prop == 'sort'"
            :key="`col_${index}`"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'center'"
            :width="item.width || ''"
          >
            <template>
              <i class="el-icon-s-operation"></i>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'width'"
            :key="`col_${index}`"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'center'"
            :width="item.width || ''"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row['width']"
                style="width: 100%"
                @pointerdown.stop.native
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="`col_${index}`"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'center'"
            :width="item.width || ''"
          ></el-table-column>
        </template>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" style="float: left" @click="restoreDefault">恢复默认</el-button>
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
import draggable from "vuedraggable";
import Sortable from "sortablejs";
import { handleFloor } from "./sort";
import { cssStyle } from '../DynamicForm/components/generator/html';
export default {
  components: {
    draggable,
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    dialogBool: Boolean,
    title: {
      type: String,
      default: "自定义显示列项",
    },
    customSettingList: [Array],
    canRendererTableHeader:[Array,Object],
    customSettingShowList:[Array,Object],
    frontFixedNum:[Number],
    backFixedNum:[Number],
    isParentUse:{ //是否是父组件使用  一般有el-card这种使用值传false
      type: Boolean,
      default: true
    }
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
            width: "120",
            align: "center",
          },
          {
            label: "列名",
            prop: "label",
            width: "260",
            align: "left",
          },
          {
            label: "宽度",
            prop: "width",
            width: "200",
            align: "center",
          },
          {
            label: "拖动顺序调整",
            prop: "sort",
            width: "120",
            align: "center",
          },
        ],
      },
      configTableData:[],
      tableData: [],
      havedTableId:[], //已存在不可选的数据行ID
      configMultipleSelection:[],
      multipleSelection: [],
      newCanRendererTableHeader:[], //可渲染的头部
    };
  },
  mounted() {
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.oldList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));

        this.configTableTitle();
        if(this.tableData.length > 0) {
          setTimeout(() => {
            this.addRowByClassName();
            this.rowDrop();
            this.buildHavedSelection(this.tableData, 'config');
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
      this.tableData = JSON.parse(JSON.stringify(this.customSettingShowList));
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
    // 禁止选中
    isDisabled(row,index) {
      if(this.havedTableId.indexOf(row.id) > -1 ) {
        return false
      }else{
        return true
      }
    },
    // 表格勾选
    handleSelectionChange(val) {
      this.multipleSelection = this.multipleSelectionSort(val)
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
    // 构建表格每行的状态
    buildHavedSelection(tableData,type) {
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

        // 数据回显选中
        let needEchoTableHeader = [];
        if(type == 'config') {
          this.newCanRendererTableHeader = JSON.parse(JSON.stringify(this.canRendererTableHeader))
        }
        if(this.newCanRendererTableHeader.length > 0) {
          this.newCanRendererTableHeader.forEach((item, index) => {
            this.tableData.forEach((row,Zindex) => {
              if(item.label == row.label) {
                needEchoTableHeader.push(row)
              }
            });
          });
          // console.log(needEchoTableHeader)
          this.toggleSelection(needEchoTableHeader);
        }
      }
    },
    // 表格勾选回显示
    toggleSelection(rows) {
      var _this = this;
      setTimeout(() => {
        _this.$nextTick(() => {
          if (_this.tableData.length > 0 &&  rows.length > 0) {
            rows.forEach((row, i) => {
              _this.tableData.forEach((_row, i) => {
                if (row.id == _row.id) {
                  _this.$refs.multipleTable.toggleRowSelection(_row, true);
                }
              });
            });
          }else{
            this.$refs.multipleTable.clearSelection();
          }
        });
      }, 50);
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
          // console.log('这是新的Index' + newIndex)
          // console.log('这是旧的Index' + oldIndex)
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          // _this.afreshSignIndex()
          // 标记位更新
          _this.tableData.forEach((item, index) => {
            item.signIndex = index
          });
          // 只要位置拖动调整就对选中的进行排序
          _this.multipleSelectionSort(_this.multipleSelection)
        },
      });
    },
    // 恢复默认
    restoreDefault() {
      this.tableData =  handleFloor(this.customSettingList)
      this.newCanRendererTableHeader = this.tableData
      this.buildHavedSelection(this.tableData, 'reset');
    },
    // 组合排列后端保存表头
    bulidData(item) {
      let obj = {"id":'',"label":"","prop":"","width":"","align":"","signIndex":"","sortable":"","isSelected":""}
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const element = this.multipleSelection[index];
        if(element.id === item.id) {
          obj.id = element.id
          obj.label = element.label
          obj.prop = element.prop
          obj.width = element.width
          obj.align = element.align
          obj.signIndex = element.signIndex
          obj.sortable = element.sortable
          obj.isSelected = true
        }
      }
      if(!obj.id) {
        obj.id = item.id
        obj.label = item.label
        obj.prop = item.prop
        obj.width = item.width
        obj.align = item.align
        obj.signIndex = item.signIndex
        obj.sortable = item.sortable
        obj.isSelected = false
      }
      return obj
    },
    updatePlaybill() {
      if(this.multipleSelection.length < 3) {
        this.$message({
          title:'提示',
          message: '列项显示不得少于3项',
          type: 'warning'
        });
        return
      }

      // if(this.multipleSelection.length - (this.frontFixedNum + this.backFixedNum) > 10) {
      //   this.$message({
      //     title:'提示',
      //     message: '最多支持自定义10个列项',
      //     type: 'warning'
      //   });
      //   return
      // }
      let exportMultipleSelection = JSON.parse(JSON.stringify(this.tableData))
      let newExportMultipleSelection = []
      let lastExportMultipleSelection = []
      exportMultipleSelection.forEach(item => {
        let exportMultipleSelectionObj =  this.bulidData(item)
        if(exportMultipleSelectionObj.isSelected) {
          newExportMultipleSelection.push(exportMultipleSelectionObj)
        }
        lastExportMultipleSelection.push(exportMultipleSelectionObj)
      })
      // console.log(exportMultipleSelection, newExportMultipleSelection,lastExportMultipleSelection,'5555555555555');
      if(this.isParentUse) {
        this.$parent.updateTableHeader(lastExportMultipleSelection)
      }else{
        this.$emit('update-table-header',lastExportMultipleSelection)
      }
      setTimeout(() =>{
        this.dialogClose();
      },300)
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
