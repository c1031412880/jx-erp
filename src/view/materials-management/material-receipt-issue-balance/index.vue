<template>
  <div class="material-receipt-issue-balance">
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="false"
      :data="tableData"
      :isShowSummary="true"
      :summaryText="summaryText"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :omitColumnIndex='[]'
    >
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";

export default {
  name: "material-receipt-issue-balance",
  components: {
    subReq,
  },
  data() {
    return {
      form: {},
      tableData: [], // 表格数据（不包含合计行）
      summaryText: '合计', // 合计行第一列文本
      sumTotal: {}, // 合计数据
      sumColumnIndex: [], // 需要显示合计的列索引
      loading: false,
      TableHeight: 500,
      resizeTimer: null, // 窗口大小变化防抖定时器
      customSettingList: [], // 所有列都是动态生成的，没有固定列
      frontFixedNum: 1, //前几行固定（没有固定列）
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    });
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.loadData();
    },

    // 数据加载 - 调用物料收发结存表接口
    loadData() {
      this.loading = true;

      try {
        // 构建接口请求参数
        const params = {
          context: {
            start_time: this.formatDateToISO(this.form.start_date, '00:00:00'),
            end_time: this.formatDateToISO(this.form.end_date, '23:59:59'),
            dept_ids: this.form.dept_ids && this.form.dept_ids.length > 0 ? this.form.dept_ids : [],
            is_rax: this.form.is_rax // 是否含税价格，1含税，其他不含税
          }
        };

        // 调用物料收发结存表接口
        this.$client.GetDeptReceiveInventoryReport(params)
          .then((response) => {
            this.loading = false;

            if (response.head && response.head.result === "200") {
              // 处理成功响应
              this.handleSuccessResponse(response);
            } else {
              // 处理错误响应
              this.handleErrorResponse(response);
            }
          })
          .catch((error) => {
            this.loading = false;
            console.error('物料收发结存表接口调用失败:', error);
            this.$message({
              showClose: true,
              message: '获取数据失败，请检查网络连接后重试',
              type: "error",
            });
          });
      } catch (error) {
        this.loading = false;
        console.error('构建请求参数失败:', error);
        this.$message({
          showClose: true,
          message: '请求参数构建失败，请重试',
          type: "error",
        });
      }
    },

    // 处理成功响应
    handleSuccessResponse(response) {
      try {
        if (response.context && response.context.heads && response.context.datas) {
          // 动态构建表格列头
          this.buildDynamicColumns(response.context.heads);

          // 处理数据
          this.processTableData(response.context.datas, response.context.heads);

          // 更新子组件的数据状态
          if (this.$refs.head && this.$refs.head.updateDataStatus) {
            this.$refs.head.updateDataStatus(this.tableData.length > 0);
          }

          this.$message({
            showClose: true,
            message: '数据加载成功',
            type: "success",
          });
        } else {
          this.tableData = [];
          this.sumTotal = {};
          this.sumColumnIndex = [];
          // 更新子组件的数据状态
          if (this.$refs.head && this.$refs.head.updateDataStatus) {
            this.$refs.head.updateDataStatus(false);
          }
          this.$message({
            showClose: true,
            message: '暂无数据',
            type: "info",
          });
        }
      } catch (error) {
        console.error('处理响应数据失败:', error);
        this.tableData = [];
        this.sumTotal = {};
        this.sumColumnIndex = [];
        // 更新子组件的数据状态
        if (this.$refs.head && this.$refs.head.updateDataStatus) {
          this.$refs.head.updateDataStatus(false);
        }
        this.$message({
          showClose: true,
          message: '数据处理失败，请重试',
          type: "error",
        });
      }
    },

    // 处理错误响应
    handleErrorResponse(response) {
      const errorMessage = response.head && response.head.describle
        ? response.head.describle
        : '获取数据失败';

      this.$message({
        showClose: true,
        message: errorMessage,
        type: "error",
      });

      // 清空数据
      this.tableData = [];
      this.sumTotal = {};
      this.sumColumnIndex = [];

      // 更新子组件的数据状态
      if (this.$refs.head && this.$refs.head.updateDataStatus) {
        this.$refs.head.updateDataStatus(false);
      }
    },

    // 动态构建表格列头
    buildDynamicColumns(heads) {
      try {
        // 重置列配置，所有列都是动态生成的
        this.customSettingList = [];

        // 根据接口返回的heads动态添加所有列
        if (heads && Array.isArray(heads)) {
          heads.forEach((head, index) => {
            if (head.name && head.data_symbol) {
              this.customSettingList.push({
                id: index + 1,
                label: head.name,
                prop: head.data_symbol,
                width: "120",
                align: index === 0 ? "left" : "right", // 第一列左对齐，其他列右对齐
                signIndex: index,
                sortable: false,
              });
            }
          });
        }
      } catch (error) {
        console.error('构建动态列失败:', error);
        this.$message({
          showClose: true,
          message: '表格列配置失败',
          type: "error",
        });
      }
    },

    // 处理表格数据
    processTableData(datas, heads) {
      try {
        this.tableData = [];
        this.sumTotal = {};
        this.sumColumnIndex = [];

        if (datas && Array.isArray(datas) && datas.length > 0) {
          // 分离普通数据和合计数据
          const normalData = datas.slice(0, -1); // 除最后一行外的所有数据
          const summaryData = datas[datas.length - 1]; // 最后一行为合计数据

          // 处理普通数据行
          normalData.forEach((item, index) => {
            const rowData = {};

            // 根据heads配置处理所有动态数据
            if (heads && Array.isArray(heads)) {
              heads.forEach(head => {
                if (head.data_symbol && item.hasOwnProperty(head.data_symbol)) {
                  // 数值类型数据格式化（添加千分位分隔符）
                  const value = item[head.data_symbol];
                  if (typeof value === 'number') {
                    rowData[head.data_symbol] = value.toLocaleString();
                  } else {
                    rowData[head.data_symbol] = value || '';
                  }
                } else if (head.data_symbol) {
                  rowData[head.data_symbol] = '';
                }
              });
            }

            this.tableData.push(rowData);
          });

          // 处理合计数据 - 向后移一位
          if (summaryData && heads && Array.isArray(heads)) {
            heads.forEach((head, index) => {
              if (head.data_symbol && summaryData.hasOwnProperty(head.data_symbol)) {
                const value = summaryData[head.data_symbol];
                // 合计数据索引向后移一位
                const sumIndex = index + 1;
                if (typeof value === 'number') {
                  this.sumTotal[sumIndex] = value.toLocaleString();
                } else {
                  this.sumTotal[sumIndex] = value || '';
                }
                // 添加到需要显示合计的列索引中
                if (!this.sumColumnIndex.includes(sumIndex)) {
                  this.sumColumnIndex.push(sumIndex);
                }
              }
            });

            // 调试信息：检查合计数据对齐情况
            console.log('合计数据处理结果:', {
              sumTotal: this.sumTotal,
              sumColumnIndex: this.sumColumnIndex,
              headsCount: heads.length
            });
          }
        }
      } catch (error) {
        console.error('处理表格数据失败:', error);
        this.$message({
          showClose: true,
          message: '数据处理失败',
          type: "error",
        });
        this.tableData = [];
        this.sumTotal = {};
        this.sumColumnIndex = [];
      }
    },

    // 导出功能
    onExport() {
      try {
        // 构建导出参数
        const params = {
          context: {
            start_time: this.formatDateToISO(this.form.start_date, '00:00:00'),
            end_time: this.formatDateToISO(this.form.end_date, '23:59:59'),
            dept_ids: this.form.dept_ids && this.form.dept_ids.length > 0 ? this.form.dept_ids : [],
            is_include_tax: this.form.is_include_tax || false
          }
        };

        // 调用导出接口
        this.$client.DeptReceiveExportInventoryReport(params)
          .then((response) => {
            if (response.head && response.head.result === "200") {
              if (response.context) {
                // 如果返回文件下载链接
                const downloadUrl = response.context;
                window.open(downloadUrl, '_blank');
              }
              this.$message({
                type: "success",
                message: "导出成功"
              });
            } else {
              const errorMessage = response.head && response.head.describle
                ? response.head.describle
                : '导出失败';
              this.$message({
                type: "error",
                message: errorMessage
              });
            }
          })
          .catch((error) => {
            console.error('导出失败:', error);
            this.$message({
              type: "error",
              message: "导出失败，请重试"
            });
          });
      } catch (error) {
        console.error('构建导出参数失败:', error);
        this.$message({
          type: "error",
          message: "导出参数构建失败"
        });
      }
    },

    // 窗口大小变化处理
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.setHead();
      }, 300);
    },

    // 设置表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },

    // 安全地将日期转换为ISO格式
    formatDateToISO(dateStr, timeStr = '00:00:00') {
      try {
        if (!dateStr) {
          return null;
        }

        // 确保日期格式正确 (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          console.warn('日期格式不正确:', dateStr);
          return null;
        }

        // 构建完整的日期时间字符串
        const fullDateTimeStr = `${dateStr}T${timeStr}`;
        const date = new Date(fullDateTimeStr);

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          console.warn('无效的日期值:', fullDateTimeStr);
          return null;
        }

        // 转换为ISO格式
        return date.toISOString();

      } catch (error) {
        console.error('日期转换失败:', error, '原始日期:', dateStr);
        return null;
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.material-receipt-issue-balance
  width: 100%
  height: 100%
</style>
