<template>
  <div class="draggable">
    <el-table
      row-key="value"
      ref="multipleTable"
      :data="tableData"
      :height="TableHeight"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
      :cell-style="{fontSize: '13px', padding: '4px 0px'}"
      border
      @row-click="selectedRowInfo"
    >
      <el-table-column
        v-if="isShowIndex"
        label="序号"
        type="index"
        width="55"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in oldList"
        :key="`col_${index}`"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'center'"
        min-width="item.width || ''"
        :selectable="isDisabled"
      >
        <template v-if="item.prop == 'sort'">
          <i class="el-icon-s-operation"></i>
        </template>

        <!-- <template v-if="item.prop == 'operate'">
            <el-popconfirm
              title="确定删除此表单分组吗？"
              @confirm="confirmDelete()"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template> -->
      </el-table-column>
    </el-table>
  </div>
  <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">保存</el-button>
    </span>
  </el-dialog> -->
</template>

<script type="text/ecmascript-6">
import $ from "jquery";
import Sortable from "sortablejs";
export default {
  props: {
    isShowIndex:{
      type:[Boolean],
      default: false
    },
    sortType:{
      type: String,
      default: '',
    },
    TableHeight: {
      type: Number,
      default: 400
    },
    defaultSortProps:[Object],
    tableConfig: [Object],
    dataInfoList: [Array],
    frontFixedNum: {
      type: Number,
      default: 0
    },
    backFixedNum: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      disabled: false,
      oldList: [],
      newList: [],
      //定义要被拖拽对象的数组
      // tableConfig: {
      //   tableItems: [
      //     {
      //       label: "表单名称",
      //       prop: "label",
      //       width: "360",
      //       align: "left",
      //     },
      //     {
      //       label: "拖动顺序调整",
      //       prop: "sort",
      //       width: "190",
      //       align: "center",
      //     },
      //     // {
      //     //   label: "操作",
      //     //   prop: "operate",
      //     //   width: "160",
      //     //   align: "center",
      //     // },
      //   ],
      // },
      configTableData: [],
      tableData: [],
      groupId: "",
      curSelectedRowInfo: null,
    };
  },
  mounted() {
    // this.configTableData = this.tableData;
    this.configData();
  },
  watch: {
    
  },
  methods: {
    configData() {
      this.oldList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));
        // alert(JSON.stringify(this.dataInfoList))
        this.configTableTitle();
        //   this.newList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));
        // if(this.tableData.length > 0) {
        setTimeout(() => {
          this.addRowByClassName()
          this.rowDrop();
        }, 50);
    },
    // 初始化数据
    configTableTitle() {
      if(this.dataInfoList && this.dataInfoList.length > 0) {
        this.dataInfoList.forEach((item, index) => {
          let obj = {
            value: item[this.defaultSortProps['value']],
            label: item[this.defaultSortProps['label']],
            sort: item[this.defaultSortProps['sort']],
          };
          for (const key in this.defaultSortProps) {
            if (Object.hasOwnProperty.call(this.defaultSortProps, key)) {
              const value = this.defaultSortProps[key];
              // console.log(key)
              for (const keyObj in obj) {
                if(!Object.hasOwnProperty.call(obj, key)) {
                  obj[value] = item[value]
                }
              }
            }
          }
          // console.log(obj)
          this.tableData.push(obj);
        });
      }
    },
    // 禁止选中
    isDisabled(row, index) {
      if (this.havedTableId.indexOf(row.value) > -1) {
        return false;
      } else {
        return true;
      }
    },
    // 绑定可拖拽的区域
    addRowByClassName() {
      let rowDom = $('.draggable .el-table__row')
      let len = rowDom.length;
      // 至少必须是前面固定加后面固定中间2项可以移动的
      if(len >=(this.frontFixedNum + this.backFixedNum)) {
        rowDom.splice(0,this.frontFixedNum);
        let secondLen = len - this.frontFixedNum;
        // 从倒数第几项删除几个
        rowDom.splice(secondLen -(secondLen + this.backFixedNum),this.backFixedNum);

      }
      rowDom.addClass("can-draggable-active-options")
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
          // console.log("这是新的Index" + newIndex);
          // console.log("这是旧的Index" + oldIndex);
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          // console.log("这是tableData", _this.tableData);
          _this.updatePlaybill();
        },
      });
    },
    // 发射更新事件
    updatePlaybill() {
      this.tableData.forEach((item, index) => {
        item.sort = index;
      });
      // this.$emit('update-sore-info',this.tableData )
      this.$parent.$parent.updateSortInfo(this.tableData);
      // this.dialogClose();
    },
    // 选中某一行
    selectedRowInfo(row) {
      this.curSelectedRowInfo = row;
    },
    // 删除
    confirmDelete() {
      console.log(this.curSelectedRowInfo);
      let groupId = this.curSelectedRowInfo.value;
      this.tableData.forEach((item, index) => {
        if (item.value == groupId) {
          this.tableData.splice(index, 1);
        }
      });
    },
    
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.draggable /deep/ .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}

.draggable /deep/ .disabledCheck .cell {
  display: block;
}

// .draggable /deep/ .disabledCheck .cell:before {
// content: '显示' !important;
// position: absolute !important;
// right: 50px !important;
// }
.draggable /deep/ .el-table__row {
  background-color: #e9e5e5;
}

.draggable /deep/ .can-draggable-active-options {
  cursor: pointer !important;
  background-color: #fff;
}

.draggable /deep/ .el-table--border::after {
  width: 0px;
}

.draggable /deep/ .el-table::before {
  height: 0px;
}


</style>
