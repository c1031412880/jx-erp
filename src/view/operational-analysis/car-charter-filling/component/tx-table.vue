<template>
  <div
    class="tr-table"
    :class="{ 'fixed-empty-placeholder-table': isFixedEmptyPlaceholder }"
  >
    <el-table
      ref="table"
      :data="data"
      :height="TableHeight"
      border
      :stripe="stripe"
      :span-method="spanMethodFun"
      v-loading="loading"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="{
        background: '#E0F3FF',
        color: '#333333',
        fontSize: '16px',
        padding: '2px 0px',
        fontWeight: '700',
        borderColor: '#C1CDCD',
      }"
      :cell-style="{ fontSize: '13px', padding: '2px 0px' }"
      :row-key="getRowKeys"
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @header-dragend="headerDragend"
    >
      <template slot="empty">
        <div
          style="height: 180px; align-items: center; justify-content: center"
          class="show-flex-box-c"
          v-if="Number(TableHeight) > 249"
        >
          <img
            :src="emptyPlaceholder"
            alt=""
            style="width: 180px; height: 152px; display: block"
          />
          <div style="height: 28px">暂无数据</div>
        </div>
      </template>
      <el-table-column
        v-for="(item, index) in tableHeaderDataList"
        :key="`col_${index}`"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'left'"
        :min-width="item.width || '80'"
        :fixed="
          item.signIndex < frontFixedNum
            ? 'left'
            : item.signIndex > tableHeaderList.length - backFixedNum - 1
            ? 'right'
            : false
        "
        :sortable="item.sortable"
        :show-overflow-tooltip="!item.notTooltip"
      >
        <template slot-scope="scopeGroup">
          <slot
            :name="item.prop"
            :data="scopeGroup.row"
            :index="scopeGroup.$index"
          >
            {{ scopeGroup.row[item.prop] }}
          </slot>
        </template>
        <el-table-column
          v-for="(one, o) in item.nestedTablesHeader"
          v-if="!!item.nestedTablesHeader"
          :key="`col_${index}_${o}`"
          :prop="one.prop"
          :label="one.label"
          :align="one.align || 'left'"
          :min-width="one.width || '80'"
          :sortable="one.sortable"
          :show-overflow-tooltip="!one.notTooltip"
        >
          <el-table-column
            v-for="(two, t) in one.nestedTablesHeader"
            v-if="!!one.nestedTablesHeader"
            :key="`col_${index}_${t}`"
            :prop="two.prop"
            :label="two.label"
            :align="two.align || 'left'"
            :min-width="two.width || '80'"
            :sortable="two.sortable"
            :show-overflow-tooltip="!two.notTooltip"
          >
            <el-table-column
              v-for="(three, n) in two.nestedTablesHeader"
              v-if="!!two.nestedTablesHeader"
              :key="`col_${index}_${n}`"
              :prop="three.prop"
              :label="three.label"
              :align="three.align || 'left'"
              :min-width="three.width || '80'"
              :sortable="three.sortable"
              :show-overflow-tooltip="!three.notTooltip"
            >
              <template slot-scope="scopeChard">
                <slot
                  :name="three.prop"
                  :data="scopeChard.row"
                  :index="scopeChard.$index"
                >
                  {{ scopeChard.row[three.prop] }}
                </slot>
              </template>
            </el-table-column>
            <template slot-scope="scopeChard">
              <slot
                :name="two.prop"
                :data="scopeChard.row"
                :index="scopeChard.$index"
              >
                {{ scopeChard.row[two.prop] }}
              </slot>
            </template>
          </el-table-column>
          <template slot-scope="scopeChard">
            <slot
              :name="one.prop"
              :data="scopeChard.row"
              :index="scopeChard.$index"
            >
              {{ scopeChard.row[one.prop] }}
            </slot>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRoleIds } from "@/utils/auth";
// import { handleObjectSpanMethod } from "./util"; // 添加全局表格合并
import placeholderImage from "@/assets/home-image/placeholder-1.png";
export default {
  data() {
    return {
      getRowKeys(row) {
        return row.uuid || row.id || row.i_id;
      },
      multipleSelection: [],
      tableHeaderDataList: [],
      curSelectedRowInfo: null,
      emptyPlaceholder: placeholderImage,
      spanArr: [],
    };
  },
  props: {
    data: {
      type: Array,
      default: null,
    },
    TableHeight: {
      type: [Number,String],
      default: 400,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    stripe: {
      //是否有斑马线
      type: Boolean,
      default: false,
    },
    tableHeaderList: [Array, Object],
    frontFixedNum: [Number],
    backFixedNum: [Number],
    rowspanObj: [Object], //单元格合并行标记位
    mergekeys: [Array], //需要合并的列单元格
    isFixedEmptyPlaceholder: {
      type: Boolean,
      default: true,
    },
    load: [Function],
    colFields: [Array],  //表头对应的key
    topKeys: [Array],   //二次合并项
    mergeAgain: false,
  },
  activated() {
    this.headerDragend();
  },
  mounted() {
    this.configTableHeaderList();
  },
  methods: {
    // 拖拽头部表格重新更新表格布局
    headerDragend(newWidth, oldWidth, column, event) {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 初始化表头
    configTableHeaderList() {
      this.tableHeaderDataList = JSON.parse(
        JSON.stringify(this.tableHeaderList)
      );
      setTimeout(() => {
        this.$refs.table.doLayout();
      }, 60);
    },
    // 合并行或者列
    spanMethodFun({ row, column, rowIndex, columnIndex }) {
      // if (this.spanMethodType && this.spanMethodType.includes("row")) {
      // }

      // if (this.spanMethodType && this.spanMethodType.includes("column")) {
      //   // console.log(handleObjectSpanMethod(tableObj,this.mergekeys, this.rowspanObj))
      //   return handleObjectSpanMethod(
      //     tableObj,
      //     this.mergekeys,
      //     this.rowspanObj 
      //   );
      // }
      this.getSpanArr()
      return this.spanArr[rowIndex * this.colFields.length + columnIndex];
    },
    //定位到底部
    gobutton() {
      this.$refs.table.bodyWrapper.scrollTop =
        this.$refs.table.bodyWrapper.scrollHeight;
    },
    getSpanArr() {
      // console.log('data',JSON.parse(JSON.stringify(this.data)));
      for (let i = 0; i < this.data.length; i++) {
        let row = i;
        // let col = i % this.colCount;
        if (row === 0) {
          // i 表示行 j表示列
          for (let j = 0; j < this.colFields.length; j++) {
            this.spanArr[i * this.colFields.length + j] = {
              rowspan: 1,
              colspan: 1,
            };
          }
        } else {
          for (let j = 0; j < this.colFields.length; j++) {
            // 当前和上一次的一样
            //  合并所有列的相同数据单元格
            if (
              this.mergekeys.includes(this.colFields[j])
            ) { // 指定合并哪些列
              if ( 
                // this.data[row]["start_point"] !== this.data[row - 1]["start_point"] &&
                // this.data[row]["dept_name"] !== this.data[row - 1]["dept_name"]
                this.data[row]["mergekeys"] !== this.data[row - 1]["mergekeys"]
              ) { // 哪些不合并:School不一样的,不合并
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1,
                  colspan: 1,
                };
              }else if (this.data[row][this.colFields[j]] === this.data[row - 1][this.colFields[j]] && this.data[row][this.colFields[j]]) {
                let beforeItem = this.spanArr[(row - 1) * this.colFields.length + j];
                  this.spanArr[row * this.colFields.length + j] = {
                    rowspan: 1 + beforeItem.rowspan,// 合并几列
                    colspan: 1,// 合并几行
                  };

                  beforeItem.rowspan = 0;
                  beforeItem.colspan = 1;
              } else {
                // rowspan 和 colspan 都为1表格此单元格不合并
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1,
                  colspan: 1,
                };
              }
            } else {
              this.spanArr[row * this.colFields.length + j] = {
                rowspan: 1,
                colspan: 1,
              };
            }
          }
        }
      }


      // 二次处理    先合并后面项 再合并前面项
      if (this.mergeAgain) {
        for (let i = 0; i < this.data.length; i++) {
          let row = i;
          if (row === 0) {
            for (let j = 0; j < this.colFields.length; j++) {
              if (this.topKeys.includes(this.colFields[j])) {
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1,
                  colspan: 1,
                };
              }
            }
          }
          if (row > 0){
            for (let j = 0; j < this.colFields.length; j++) {
              if (this.topKeys.includes(this.colFields[j])) {
                if (this.data[row]["start_point"] == this.data[row - 1]["start_point"]) {
                  if (this.data[row][this.colFields[j]] === this.data[row - 1][this.colFields[j]] && this.data[row][this.colFields[j]]) { 
                    let beforeItem = this.spanArr[(row - 1) * this.colFields.length + j];
                    this.spanArr[row * this.colFields.length + j] = {
                      rowspan: 1 + beforeItem.rowspan,// 合并几列
                      colspan: 1,// 合并几行
                    };

                    beforeItem.rowspan = 0;
                    beforeItem.colspan = 1;
                  }
                } else {
                  this.spanArr[row * this.colFields.length + j] = {
                    rowspan: 1,
                    colspan: 1,
                  };
                }
              }
            }
          }
        }
      }

      // console.log('=========',JSON.parse(JSON.stringify(this.spanArr)));
      // 对数据进行倒序
      let stack = [];
      for (let i = 0; i < this.colFields.length; i++) {
        for (let j = 0; j < this.data.length; j++) {
          // console.log("i=" + i + " j=" + j + "colFields" + this.colFields.length + '----' + (j * this.colFields.length + i));
          // i 表示列 j表示行
          if (j === 0) {
            if (this.spanArr[j * this.colFields.length + i].rowspan === 0) {
              stack.push(this.spanArr[j * this.colFields.length + i]);
            }
          } else {
            if (this.spanArr[j * this.colFields.length + i].rowspan === 0) {
              stack.push(this.spanArr[j * this.colFields.length + i]);
            } else {
              stack.push(this.spanArr[j * this.colFields.length + i]);
              while (stack.length > 0) {
                let pop = stack.pop();
                let len = stack.length;
                this.spanArr[(j - len) * this.colFields.length + i] = pop;
              }
            }
          }
        }
      }
      // console.log(this.spanArr);
    },
  },
  watch:{
    tableHeaderList() {
      this.configTableHeaderList();
    },
    data() {
      setTimeout(() => {
        this.$refs.table.doLayout()
      }, 60)
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tr-table /deep/ .el-table td, .el-table th {
  padding: 4px 0 !important;
}

.tr-table /deep/ .el-table th.el-table__cell > .cell {
  height: 34px;
  line-height: 34px;
}

.tr-table /deep/ .el-table__footer tr>td {
  font-size: 18px !important;
  font-weight: bold;
}

// 开放表格自定义合计显示
.tr-table /deep/ .el-table td.is-hidden>* {
  visibility: visible !important;
}

.tr-table /deep/ .el-table__empty-block {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}

.tr-table /deep/ .el-table__body-wrapper {
  position: relative;
}

.tr-table /deep/ .el-table__empty-text {
  // position: absolute;
  position: relative;
  width: 100%;
  height: 100%;
}

.show-flex-box-c {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.fixed-empty-placeholder-table /deep/ .el-table__empty-block {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}

.fixed-empty-placeholder-table /deep/ .el-table__body-wrapper {
  position: relative;
}

.fixed-empty-placeholder-table /deep/ .el-table__empty-text {
  // position: fixed;
}
.el-table /deep/ .sign-row {
  background: #8bc34a;
} 
</style>
