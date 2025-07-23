<template>
  <div class="tr-table">
    <el-table
      @row-dblclick="dbSelected"
      ref="table"
      :data="data"
      :height="TableHeight"
      border
      stripe
      :show-summary="isShowSummary"
      :summary-method="getSummaries"
      v-loading="loading"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
      :row-class-name="tableRowClassName"
      :cell-style="{fontSize: '13px', padding: '2px 0px'}"
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
      @row-click="selectedRowInfo"
      @header-dragend="headerDragend">
      <el-table-column
      v-if="selectionShow"
      fixed="left"
      type="selection"
      align="center"
      width="40">
    </el-table-column>
    <el-table-column
      v-if="indexShow"
      fixed="left"
      type="index"
      align="center"
      label="#"
      width="40">
    </el-table-column>
      <el-table-column
        v-for="(item, index) in tableHeaderDataList"
        :key="`col_${index}`"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'left'"
        :min-width="item.width || '80'"
        :fixed="item.signIndex < frontFixedNum? 'left': item.signIndex > (tableHeaderList.length - backFixedNum -1) ? 'right': false "
        :sortable="item.sortable"
        :show-overflow-tooltip="!item.notTooltip">
          <template slot-scope="scopeGroup">
            <slot :name="item.prop" :data="scopeGroup.row" :index="scopeGroup.$index">
              {{scopeGroup.row[item.prop]}}
            </slot>
          </template>
          <el-table-column
            v-for="(obj, j) in item.nestedTablesHeader"
            v-if="!!item.nestedTablesHeader"
            :key="`col_${index}_${j}`"
            :prop="obj.prop"
            :label="obj.label"
            :align="obj.align || 'left'"
            :min-width="obj.width || '80'"
            :sortable="obj.sortable"
            >
            <template slot-scope="scopeChard">
              <slot :name="obj.prop" :data="scopeChard.row" :index="scopeChard.$index">
                {{scopeChard.row[obj.prop]}}
              </slot>
            </template>
          </el-table-column>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;position:absolute;bottom: 0;z-index: 99;" v-if="isShowBottomOptions">
      <el-button size="mini" @click="changeAll">选择全部</el-button>
      <el-button size="mini" @click="ReverseChoice">反向选择</el-button>
      <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <div style="text-align:center">
          <el-button type="primary" size="mini"  style="margin-top:5px">删除全部</el-button>
          <el-button type="primary" size="mini" style="margin-top:5px">操作1</el-button>
          <el-button type="primary" size="mini"  style="margin-top:5px">操作2</el-button>
        </div>

        <el-button size="mini" icon="el-icon-top" slot="reference">更多操作</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRoleIds} from '@/utils/auth'
  export default {
    data () {
      return {
        visible: false,
        power: getRoleIds(),
        getRowKeys(row){
          return row.id || row.i_id
        },
        multipleSelection: [],
        tableHeaderDataList:[],
        curSelectedRowInfo:null,
      }
    },
    props: {
      selectionShow: {
        type: Boolean,
        default: false
      },
      indexShow: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      TableHeight: {
        type: Number,
        default: 400
      },
      loading: {
        type: Boolean,
        default: false
      },
      isShowBottomOptions: {
        type: Boolean,
        default: false
      },
      isShowSummary: {
        type: Boolean,
        default: false
      },
      tableHeaderList:[Array,Object],
      frontFixedNum:[Number],
      backFixedNum:[Number],
      expandRowKeys:[Array], // 需要展开的项ID
      needBoldRow:[String],
      sumTotal:[Object], //约定某一列汇总合计自定义数据
      sumColumnIndex: {  //约定某一列汇总合计自定义列的index
        type: Array,
        default:() => []
      },
      omitColumnIndex: {  //约定某一列为省略 --
        type: Array,
        default:() => []
      },
    },
    mounted() {
        this.configTableHeaderList();
    },
    methods: {
      //双击行事件
      dbSelected(row) {
        this.$parent.staffRowInfo(row)
          console.log(row)      
      },
      // 拖拽头部表格重新更新表格布局
      headerDragend(newWidth, oldWidth, column, event) {
        this.$nextTick(() => {
  　　　　this.$refs.table.doLayout()
    　　})
      },
      // 初始化表头
      configTableHeaderList() {
        this.tableHeaderDataList = JSON.parse(JSON.stringify(this.tableHeaderList));
        setTimeout(() => {
            this.$refs.table.doLayout()
        }, 60)
      },
      getSummaries(param) {
        // this.computerSpecialty()
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          // 自定义合计行
          if(this.sumColumnIndex && this.sumColumnIndex.length > 0) {
            if (index === 0) {
              sums[index] = '总计';
              column.colSpan = 2;
              return;
            }
            this.sumColumnIndex.forEach(item => {
              if(index === item) {
                sums[index] = this.sumTotal[index];
                return;
              }
            });
            return
          }
          // 自动计算当前列
          const values = data.map(item => Number(item[column.property]));
          // console.log(values)
          if (!values.every(value => isNaN(value)) && !values.includes(NaN)) {
            sums[index] = values.reduce((prev, curr) => {

              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // 去除第几行计算
            this.omitColumnIndex.forEach(columnindex => {
              sums[columnindex] = '--';
              return;
            });
            // sums[index] += ' 元';
          } else {
            if (index === 0) {
              sums[index] = '合';
              // column.colSpan = 2;
              return;
            }
            sums[index] = '--';
          }
        });

        return sums;
      },
      // 选中行
      selectedRowInfo(row) {
        console.log()
        this.$emit('on-select-row',row)
      },
      // 勾选时间
      handleSelectionChange(rows) {
        if(rows.length > 0) {
          this.$emit('on-select-change-row',rows)
        }else{
          this.$emit('on-select-change-row',[])
          this.$refs.table.clearSelection();
        }
      },
      //选中方法
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row,true);
          });
        } else {
          this.$refs.table.clearSelection();
        }
      },
      // 回显勾选
      eachTableSelect(newRows) {
        if(newRows.length > 0) {
          newRows.forEach(item => {
            this.multipleSelection.forEach(zItem => {
            if(item.id == zItem.id) {

            }
          });
          });
        }
      },
      tableRowClassName({row, rowIndex}) {
        // if (row === 1) {
        //   return 'warning-row';
        // } else if (rowIndex === 3) {
        //   return 'success-row';
        // }
        // return '';
      },
      // 选择全部
      changeAll(){

      },
      // 反向选择
      ReverseChoice(){

      }

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
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tr-table /deep/ .el-table td, .el-table th {
    padding: 4px 0 !important;
  }
</style>
