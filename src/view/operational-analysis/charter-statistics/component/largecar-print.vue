<template>
  <div style="width: 100%">
    <div class="title">{{ title }}用车安排</div>
    <el-table
      ref="table"
      :data="data"
      border
      style="width: 100%"
      highlight-current-row
      :header-cell-style="{
        color: '#333333',
        fontSize: '16px',
        padding: '4px 0px',
        fontWeight: '700'
      }"
      :cell-style="{ fontSize: '13px', padding: '4px 0px' }"
      :span-method="spanMethodFun"
    >
      <el-table-column
        v-for="(item, index) in tableHeaderDataList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'center'"
        :fixed="item.fixed"
        :min-width="item.width"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    tableData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      title: '',
      data: [],
      tableHeaderDataList: [
        {
          label: '用车单位',
          prop: 'use_uint'
          // width: '80'
        },
        {
          label: '用车日期',
          prop: 'vehicle_use_time'
          // width: '120'
        },
        {
          label: '起点',
          prop: 'start_point'
          // width: '120'
        },
        {
          label: '用车时间',
          prop: 'usege_time'
          // width: '120'
        },
        {
          label: '终点',
          prop: 'end_point'
          // width: '120'
        },
        {
          label: '用车数量',
          prop: 'vehicles_num'
          // width: '120'
        },
        {
          label: '分公司',
          prop: 'dept_name'
          // width: '120'
        },
        {
          label: '车号',
          prop: 'vehicle_name'
          // width: '120'
        },
        {
          label: '驾驶员',
          prop: 'driver_name'
          // width: '120'
        },
        {
          label: '驾驶员电话',
          prop: 'phone'
          // width: '100'
        },
        {
          label: '备注',
          prop: 'remark'
          // width: '120'
        }
      ],
      spanArr: [],
      colFields: [
        'use_uint',
        'vehicle_use_time',
        'start_point',
        'usege_time',
        'end_point',
        'vehicles_num',
        'dept_name',
        'vehicle_name',
        'driver_name',
        'phone',
        'remark'
      ],
      mergekeys: [
        'use_uint',
        'vehicle_use_time',
        'start_point',
        'usege_time',
        'end_point',
        'vehicles_num',
        'dept_name'
      ]
    }
  },
  created() {
    this.setData()
  },
  mounted() {},
  methods: {
    setData() {
      this.title = `${this.form.use_uint}${this.tableData.title}`
      this.data = (this.tableData.data || []).map(item => ({
        use_uint: this.form.use_uint,
        vehicle_use_time: item.vehicle_use_time,
        start_point: item.start_point,
        usege_time: item.usege_time,
        end_point: item.end_point,
        vehicles_num: item.vehicles_num,
        dept_name: item.dept_name,
        vehicle_name: item.vehicle_name,
        driver_name: item.driver_name,
        phone: item.phone,
        remark: item.remark
      }))
      this.data.push({
        use_uint: '工单说明',
        vehicle_use_time: this.form.work_order_description,
        start_point: this.form.work_order_description,
        usege_time: this.form.work_order_description,
        end_point: this.form.work_order_description,
        vehicles_num: this.form.work_order_description,
        dept_name: this.form.work_order_description,
        vehicle_name: this.form.work_order_description,
        driver_name: this.form.work_order_description,
        phone: this.form.work_order_description,
        remark: this.form.work_order_description
      })
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    // 合并行或者列
    spanMethodFun({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.data.length - 1) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 10
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
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
      return this.spanArr[rowIndex * this.colFields.length + columnIndex]
    },
    getSpanArr() {
      // console.log('data',JSON.parse(JSON.stringify(this.data)));
      for (let i = 0; i < this.data.length; i++) {
        let row = i
        // let col = i % this.colCount;
        if (row === 0) {
          // i 表示行 j表示列
          for (let j = 0; j < this.colFields.length; j++) {
            this.spanArr[i * this.colFields.length + j] = {
              rowspan: 1,
              colspan: 1
            }
          }
        } else {
          for (let j = 0; j < this.colFields.length; j++) {
            // 当前和上一次的一样
            //  合并所有列的相同数据单元格
            if (this.mergekeys.includes(this.colFields[j])) {
              // 指定合并哪些列
              if (
                // this.data[row]["start_point"] !== this.data[row - 1]["start_point"] &&
                // this.data[row]["dept_name"] !== this.data[row - 1]["dept_name"]
                this.data[row]['mergekeys'] !== this.data[row - 1]['mergekeys']
              ) {
                // 哪些不合并:School不一样的,不合并
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1,
                  colspan: 1
                }
              } else if (
                this.data[row][this.colFields[j]] === this.data[row - 1][this.colFields[j]] &&
                this.data[row][this.colFields[j]]
              ) {
                let beforeItem = this.spanArr[(row - 1) * this.colFields.length + j]
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1 + beforeItem.rowspan, // 合并几列
                  colspan: 1 // 合并几行
                }

                beforeItem.rowspan = 0
                beforeItem.colspan = 1
              } else {
                // rowspan 和 colspan 都为1表格此单元格不合并
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1,
                  colspan: 1
                }
              }
            } else {
              this.spanArr[row * this.colFields.length + j] = {
                rowspan: 1,
                colspan: 1
              }
            }
          }
        }
      }

      // 二次处理    先合并后面项 再合并前面项
      if (this.mergeAgain) {
        for (let i = 0; i < this.data.length; i++) {
          let row = i
          if (row === 0) {
            for (let j = 0; j < this.colFields.length; j++) {
              if (this.topKeys.includes(this.colFields[j])) {
                this.spanArr[row * this.colFields.length + j] = {
                  rowspan: 1,
                  colspan: 1
                }
              }
            }
          }
          if (row > 0) {
            for (let j = 0; j < this.colFields.length; j++) {
              if (this.topKeys.includes(this.colFields[j])) {
                if (this.data[row]['start_point'] == this.data[row - 1]['start_point']) {
                  if (
                    this.data[row][this.colFields[j]] === this.data[row - 1][this.colFields[j]] &&
                    this.data[row][this.colFields[j]]
                  ) {
                    let beforeItem = this.spanArr[(row - 1) * this.colFields.length + j]
                    this.spanArr[row * this.colFields.length + j] = {
                      rowspan: 1 + beforeItem.rowspan, // 合并几列
                      colspan: 1 // 合并几行
                    }

                    beforeItem.rowspan = 0
                    beforeItem.colspan = 1
                  }
                } else {
                  this.spanArr[row * this.colFields.length + j] = {
                    rowspan: 1,
                    colspan: 1
                  }
                }
              }
            }
          }
        }
      }

      // console.log('=========',JSON.parse(JSON.stringify(this.spanArr)));
      // 对数据进行倒序
      let stack = []
      for (let i = 0; i < this.colFields.length; i++) {
        for (let j = 0; j < this.data.length; j++) {
          // console.log("i=" + i + " j=" + j + "colFields" + this.colFields.length + '----' + (j * this.colFields.length + i));
          // i 表示列 j表示行
          if (j === 0) {
            if (this.spanArr[j * this.colFields.length + i].rowspan === 0) {
              stack.push(this.spanArr[j * this.colFields.length + i])
            }
          } else {
            if (this.spanArr[j * this.colFields.length + i].rowspan === 0) {
              stack.push(this.spanArr[j * this.colFields.length + i])
            } else {
              stack.push(this.spanArr[j * this.colFields.length + i])
              while (stack.length > 0) {
                let pop = stack.pop()
                let len = stack.length
                this.spanArr[(j - len) * this.colFields.length + i] = pop
              }
            }
          }
        }
      }
      // console.log(this.spanArr);
    }
  },
  beforeDestroy() {}
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 1000px;
  padding: 10px;
}
/* 确保表格合并边框，避免重叠 */
.el-table {
  width: 100%;
  border-collapse: collapse;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}

/* 设置表头和表格主体单元格的边框 */
.el-table th,
.el-table td {
  border: 1px solid black; /* 设置每个单元格的边框为 1px */
  box-sizing: border-box; /* 确保边框不影响整体尺寸 */
}

/* 单独处理表头的底部边框，避免和主体单元格的边框重叠 */
.el-table__header-wrapper th {
  border-bottom: 1px solid black; /* 设置表头单元格的底部边框 */
}

.el-table__body-wrapper td {
  border-top: 1px solid black; /* 设置主体单元格的顶部边框 */
}

.title {
  font-size: 20px;
  color: #000;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
