<template>
  <div class="tr-table">
    <el-table
      ref="table"
      :data="data"
      :height="TableHeight"
      border
      stripe
      :show-summary="isShowSummary"
      :span-method="ObjectSpanMethod"
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
      @row-click="selectedRowInfo">
      <el-table-column
      v-if="selectionShow"
      fixed="left"
      type="selection"
      width="40">
    </el-table-column>
    <el-table-column
      v-if="indexShow"
      fixed="left"
      type="index"
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
  created() {
    this.getSpanArr(this.data)
  },
    mounted() {
        this.configTableHeaderList();
    },
    methods: {
      // 初始化表头
      configTableHeaderList() {
        this.tableHeaderDataList = JSON.parse(JSON.stringify(this.tableHeaderList));
        setTimeout(() => {
            this.$refs.table.doLayout()
        }, 60)
      },
      getSpanArr (data) {
      this.spanArr = []
      this.spanCodeArr = []
      this.spanProxyArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1)
          this.spanCodeArr.push(1);
          this.spanProxyArr.push(1);
          this.pos = 0
          this.codePos = 0
          this.proxyPos = 0
        } else {
      
          /**
           * 例子：
           * name:1
           * name:1
           * name:2
           * name:2
           * 最终得到的数组spanArr = [2,0,2,0]
           */
           // 相同机构号
          if (data[i].proxy_id === data[i - 1].proxy_id) {
            // 如果proxy_id 相等就累加，并且push 0
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            // 不相等push 1,并且可修改下标指向
            this.spanArr.push(1)
            this.pos = i
          }
          // 相同机构名称
          if (data[i].proxy_name === data[i - 1].proxy_name) {
            // 如果proxy_name 相等就累加，并且push 0
            this.spanCodeArr[this.codePos] += 1
            this.spanCodeArr.push(0)
          } else {
            // 不相等push 1
            this.spanCodeArr.push(1)
            this.codePos = i
          }
          // 相同机构归属
          if (data[i].proxy === data[i - 1].proxy) {
            // 如果proxy 相等就累加，并且push 0
            this.spanProxyArr[this.proxyPos] += 1
            this.spanProxyArr.push(0)
          } else {
            // 不相等push 1
            this.spanProxyArr.push(1)
            this.proxyPos = i
          }

        }
      }
    },
    // ObjectSpanMethod({ row, column, rowIndex, columnIndex }){
    //   // 合并相同列数据的行
    // 
    //   if(columnIndex == 0 && rowIndex !== this.data.length - 1){
    //     const _row = this.spanArr[rowIndex]
    //     const _col = _row > 0 ? 1 : 0
    //     return {
    //       rowspan: _row,
    //       colspan: _col
    //     }
    //   }
    //   // 合并相同列数据的行
    //   if(columnIndex == 1 && rowIndex !== this.data.length - 1){
    //     const _row = this.spanCodeArr[rowIndex]
    //     const _col = _row > 0 ? 1 : 0
    //     return {
    //       rowspan: _row,
    //       colspan: _col
    //     }
    //   }
    //   // 合并相同列数据的行
    //   if(columnIndex == 2 && rowIndex !== this.data.length - 1){
    //     const _row = this.spanProxyArr[rowIndex]
    //     const _col = _row > 0 ? 1 : 0
    //     return {
    //       rowspan: _row,
    //       colspan: _col
    //     }
    //   }
    //   // 将最后一行进行合并列弄成总计
    //   if(rowIndex == this.data.length - 1 && columnIndex == 0){
    //     return [1, 4]
    //   }
    //   // 把第二列、第三列、第四列的列改为0（不占列）
    //   if(rowIndex == this.data.length - 1 && (columnIndex == 1 || columnIndex == 2 || columnIndex == 3)){
    //     return [0, 0]
    //   }
    // },
    ObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 2) {
        if(rowIndex ===0 || row.leave_num != this.data[rowIndex-1].leave_num){
          let rowspan = 0;
          this.data.forEach(element => {
            if(element.leave_num === row.leave_num){
              rowspan ++;
            }
          });
          return [rowspan, 1];
        }else {
          return [0, 0];
        }
      }
      if (columnIndex === 3) {
        if(rowIndex ===0 || row.leave_num != this.data[rowIndex-1].leave_num){
          let rowspan = 0;
          this.data.forEach(element => {
            if(element.leave_num === row.leave_num){
              rowspan ++;
            }
          });
          return [rowspan, 1];
        }else {
          return [0, 0];
        }
      }
      if (columnIndex === 4) {
        if(rowIndex ===0 || row.leave_num != this.data[rowIndex-1].leave_num){
          let rowspan = 0;
          this.data.forEach(element => {
            if(element.leave_num === row.leave_num){
              rowspan ++;
            }
          });
          return [rowspan, 1];
        }else {
          return [0, 0];
        }
      }
      if (columnIndex === 5) {
        if(rowIndex ===0 || row.leave_num != this.data[rowIndex-1].leave_num){
          let rowspan = 0;
          this.data.forEach(element => {
            if(element.leave_num === row.leave_num){
              rowspan ++;
            }
          });
          return [rowspan, 1];
        }else {
          return [0, 0];
        }
      }
      if (columnIndex === 6 ) {
        if(rowIndex ===0 || row.leave_num != this.data[rowIndex-1].leave_num){
          let rowspan = 0;
          this.data.forEach(element => {
            if(element.leave_num === row.leave_num){
              rowspan ++;
            }
          });
          return [rowspan, 1];
        }else {
          return [0, 0];
        }
      }
    
        if (columnIndex === 17) {
        if(rowIndex ===0 || row.leave_num != this.data[rowIndex-1].leave_num){
          let rowspan = 0;
          this.data.forEach(element => {
            if(element.leave_num === row.leave_num){
              rowspan ++;
            }
          });
          return [rowspan, 1];
        }else {
          return [0, 0];
        }
      }
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
              sums[index] = '总计';
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

<style lang="stylus" rel="stylesheet/stylus">
// .tr-table /deep/ .el-table td{
//   font-size: 13px !important;
//   padding: 4px 0 !important;
//   background: red;
// }

</style>
