<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="750px">
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
                v-model="tableData[scope.$index]['width']"
                :controls="false"
                style="width: 100%"
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
import { deepCopy } from "@/utils/index";
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
    canRendererTableHeader:[Array,Object],
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
            width: "130",
            align: "center",
          },
          {
            label: "列名",
            prop: "label",
            width: "280",
            align: "left",
          },
          {
            label: "宽度",
            prop: "width",
            width: "120",
            align: "center",
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
      tableData: [],
      havedTableId:[], //已存在不可选的数据行ID
      configMultipleSelection:[],
      multipleSelection: [],
      newCanRendererTableHeader:[], //可渲染的头部
      oldTableData: null
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
            this.buildHavedSelection(this.tableData, 'config');
            // this.toggleSelection(this.canRendererTableHeader)
            this.oldTableData = deepCopy(this.tableData)
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
      this.tableData = [...this.customSettingList];
      // this.multipleSelection = this.canRendererTableHeader;
      // this.toggleSelection(this.canRendererTableHeader)
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
    // 表格勾选
    handleSelectionChange(val) {
      this.multipleSelection = this.multipleSelectionSort(val)
      // this.toggleSelection(this.multipleSelection)
      // console.log(this.multipleSelection)
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
              if(item.id == row.id) {
                needEchoTableHeader.push(row)
              }
            });
          });
          // console.log(needEchoTableHeader)
          this.toggleSelection(needEchoTableHeader);
        }

        // this.toggleSelection(havedTabledata);
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

    // 本体回显方式
    // toggleSelection(rows) {
    //   // console.log(rows)
    //   if (rows) {
    //     rows.forEach((row) => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
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
          // console.log(_this.tableData)
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

    // 恢复默认
    restoreDefault() {
      // this.tableData =  this.handleFloor(this.customSettingList)
      // this.newCanRendererTableHeader = this.tableData
      // this.buildHavedSelection(this.tableData, 'reset');
      let tableLiat = this.$parent.customSettingListTwo
      // console.log(tableLiat, this);
      this.tableData = deepCopy(tableLiat)
      this.newCanRendererTableHeader = this.tableData
      this.buildHavedSelection(this.tableData, 'config');
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
      exportMultipleSelection.forEach(item => {
       let exportMultipleSelectionObj =  this.bulidData(item)
       newExportMultipleSelection.push(exportMultipleSelectionObj)
      })


      // console.log(newExportMultipleSelection)
      // exportMultipleSelection = [{"id":1,"label":"车辆型号","prop":"name","width":"130","align":"center","signIndex":0,"sortable":false,"isSelected":true},{"id":2,"label":"车辆数量","prop":"car_num","width":"130","align":"center","signIndex":1,"sortable":true,"isSelected":true},{"id":3,"label":"车辆类型","prop":"kind_name","width":"130","align":"center","signIndex":2,"sortable":false,"isSelected":true},{"id":4,"label":"生产厂家","prop":"factory","width":"130","align":"center","signIndex":3,"sortable":false,"isSelected":true},{"id":5,"label":"座位数","prop":"seats_num","width":"130","align":"center","signIndex":4,"sortable":true,"isSelected":true},{"id":6,"label":"核载数","prop":"permit_num","width":"130","align":"center","signIndex":5,"sortable":true,"isSelected":true},{"id":7,"label":"排量（ML）","prop":"displacement","width":"140","align":"center","signIndex":6,"sortable":true,"isSelected":true},{"id":8,"label":"排放标准","prop":"standard_name","width":"130","align":"center","signIndex":7,"sortable":false,"isSelected":true},{"id":9,"label":"车辆长度（mm）","prop":"length","width":"170","align":"center","signIndex":8,"sortable":true,"isSelected":true},{"id":10,"label":"车身颜色","prop":"color","width":"130","align":"center","signIndex":9,"sortable":false,"isSelected":true},{"id":11,"label":"燃料类别","prop":"fuel_name","width":"130","align":"center","signIndex":10,"sortable":false,"isSelected":true},{"id":12,"label":"前/后轮距（mm）","prop":"wheel_space","width":"180","align":"center","signIndex":11,"sortable":true,"isSelected":true},{"id":13,"label":"操作","prop":"operation","width":"180","align":"center","signIndex":12,"sortable":false,"isSelected":true}]
      // return
      // this.$emit('on-ok', exportMultipleSelection)
      if(this.isParentUse) {
        this.$parent.updateTableHeader(newExportMultipleSelection)
      }else{
        this.$emit('update-table-header',newExportMultipleSelection)
      }
      setTimeout(() =>{
        this.dialogClose();
      },300)
    },
    /**
     * 根据数组的对象id对数组重新排序（id可大到小， 小到大）
     */
    handleFloor(arr){
      if (arr) {
        let result = [],
          arr1 = [];

        result = arr.filter(function(element, index, self) {
          return self.findIndex((el) => el.id == element.id) === index;
        });
        for (let i = 0; i < result.length; i++) {
          arr1.push(result[i].id);
        }

        // 排序 b-a 由大到小; a-b 由小到大
        var cur = arr1.sort((a, b) => {
          return a - b;
        });

        var push = [];
        for (let item in result) {
          if (in_array(result[item].id, cur)) {
            result[item]["sort"] = cur.indexOf(result[item].id);
            push.push(result[item]);
          }
        }
        push = push.sort(function(a, b) {
          if (a.sort < b.sort) {
            return -1;
          } else if (a.sort > b.sort) {
            return 1;
          }
          return 0;
        });

        function in_array(key, array) {
          for (var i in array) {
            if (array[i] == key) {
              return true;
            }
          }
          return false;
        }
        return push;
      }
    }
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
