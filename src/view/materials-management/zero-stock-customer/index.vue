<template>
  <div class="zero-stock-customer">
    <!-- 查询条件组件 -->
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
    ></sub-req>
    
    <!-- 表格组件 -->
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
  name: "zero-stock-customer",
  components: {
    subReq,
  },
  data() {
    return {
      form: {}, // 查询条件
      tableData: [], // 表格数据（不包含合计行）
      summaryText: '合计', // 合计行第一列文本
      sumTotal: {}, // 合计数据
      sumColumnIndex: [], // 需要显示合计的列索引
      loading: false,
      TableHeight: 500,
      resizeTimer: null, // 窗口大小变化防抖定时器
      customSettingList: [], // 动态生成的列配置
      frontFixedNum: 1, // 前几行固定
      backFixedNum: 0, // 后几行固定
      canRendererTableHeader: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      // 初始化默认列配置
      this.buildDefaultColumns();
      // 生成模拟数据
      this.loadMockData();
    });
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    /**
     * 查询数据
     * @param {Object} form - 查询条件
     */
    onSubmit(form) {
      this.form = form;
      this.loadData();
    },
    
    /**
     * 数据加载 - 调用零库存客户表接口
     */
    loadData() {
      this.loading = true;
      
      try {
        // 构建接口请求参数
        const params = {
          context: {
            start_time: this.formatDateToISO(this.form.start_date, '00:00:00'),
            end_time: this.formatDateToISO(this.form.end_date, '23:59:59'),
            provider_ids: this.form.provider_ids && this.form.provider_ids.length > 0 ? this.form.provider_ids : []
          }
        };

        // 调用零库存客户表接口
        this.$client.GetProviderInventoryReport(params)
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
            console.error('零库存客户表接口调用失败:', error);
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
    
    /**
     * 加载模拟数据（用于演示）
     */
    loadMockData() {
      // 模拟表格数据
      this.tableData = [
        {
          provider_name: '北京供应商A',
          no_tax_price: 10,
          tax_price: 11.3
        },
        {
          provider_name: '上海供应商B',
          no_tax_price: 50,
          tax_price: 56.5
        },
        {
          provider_name: '广州供应商C',
          no_tax_price: 12,
          tax_price: 13.56
        },
        {
          provider_name: '深圳供应商D',
          no_tax_price: 0,
          tax_price: 0
        },
        {
          provider_name: '天津供应商E',
          no_tax_price: 0,
          tax_price: 0
        },
        {
          provider_name: '杭州供应商F',
          no_tax_price: 0,
          tax_price: 0
        },
        {
          provider_name: '南京供应商G',
          no_tax_price: 0,
          tax_price: 0
        },
        {
          provider_name: '苏州供应商H',
          no_tax_price: 0,
          tax_price: 0
        }
      ];
      
      // 计算合计
      this.calculateSumTotal();
      
      // 更新子组件的数据状态
      if (this.$refs.head && this.$refs.head.updateDataStatus) {
        this.$refs.head.updateDataStatus(this.tableData.length > 0);
      }
      
      this.$message({
        showClose: true,
        message: '数据加载成功',
        type: "success",
      });
    },
    
    /**
     * 处理成功响应数据
     * @param {Object} response - 接口响应数据
     */
    handleSuccessResponse(response) {
      try {
        if (response.context && Array.isArray(response.context) && response.context.length > 0) {
          // 处理数据，分离表格数据和合计数据
          this.processTableData(response.context);
          
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
    
    /**
     * 处理错误响应
     * @param {Object} response - 错误响应数据
     */
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
    

    
    /**
     * 构建默认列配置
     */
    buildDefaultColumns() {
      this.customSettingList = [
        {
          id: 1,
          label: "供应商",
          prop: "provider_name",
          width: "200",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "不含税",
          prop: "no_tax_price",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "含税",
          prop: "tax_price",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ];
      
      // 数值列的索引，用于计算合计
      this.sumColumnIndex = [2, 3];
    },
    
    /**
     * 处理表格数据
     * @param {Array} datas - 原始数据
     */
    processTableData(datas) {
      try {
        // 分离表格数据和合计数据
        const tableData = [];
        let sumData = null;
        
        datas.forEach(item => {
          if (item.provider_name === '合计：') {
            // 这是合计行
            sumData = item;
          } else {
            // 这是普通数据行
            tableData.push(item);
          }
        });
        
        // 设置表格数据
        this.tableData = tableData;
        
        // 设置合计数据
        if (sumData) {
          this.sumTotal = {
            2: sumData.no_tax_price || 0,
            3: sumData.tax_price || 0
          };
        } else {
          this.sumTotal = {};
        }
        
        console.log('处理后的表格数据:', this.tableData);
        console.log('合计数据:', this.sumTotal);
      } catch (error) {
        console.error('处理表格数据失败:', error);
        this.tableData = [];
        this.sumTotal = {};
      }
    },
    
    /**
     * 计算合计数据
     */
    calculateSumTotal() {
      try {
        this.sumTotal = {};
        
        if (!this.tableData || this.tableData.length === 0) {
          return;
        }
        
        // 计算合计
        let totalWithoutTax = 0;
        let totalWithTax = 0;
        
        this.tableData.forEach(row => {
          totalWithoutTax += parseFloat(row.no_tax_price) || 0;
          totalWithTax += parseFloat(row.tax_price) || 0;
        });
        
        this.sumTotal[2] = totalWithoutTax;
        this.sumTotal[3] = totalWithTax;
        
        console.log('计算的合计数据:', this.sumTotal);
      } catch (error) {
        console.error('计算合计失败:', error);
        this.sumTotal = {};
      }
    },
    
    /**
     * 格式化日期为ISO格式
     * @param {String} date - 日期字符串
     * @param {String} time - 时间字符串
     * @returns {String} ISO格式的日期时间字符串
     */
    formatDateToISO(date, time) {
      if (!date) return '';
      try {
        return `${date} ${time}`;
      } catch (error) {
        console.error('日期格式化失败:', error);
        return date;
      }
    },
    
    /**
     * 窗口大小变化处理
     */
    handleResize() {
      // 防抖处理
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.setHead();
      }, 100);
    },
    
    /**
     * 设置表格高度
     */
    setHead() {
      this.$nextTick(() => {
        try {
          let maxh = this.$el.offsetHeight;
          let th = this.$refs.head ? this.$refs.head.$el.offsetHeight : 100;
          this.TableHeight = maxh - th - 20; // 减去头部高度和边距
          console.log('表格高度设置:', this.TableHeight);
        } catch (error) {
          console.error('设置表格高度失败:', error);
          this.TableHeight = 500; // 默认高度
        }
      });
    },
    
    /**
     * 导出数据
     */
    onExport() {
      try {
        if (!this.tableData || this.tableData.length === 0) {
          this.$message({
            showClose: true,
            message: '暂无数据可导出',
            type: "warning",
          });
          return;
        }
        
        // 构建导出参数
        const params = {
          context: {
            start_time: this.formatDateToISO(this.form.start_date, '00:00:00'),
            end_time: this.formatDateToISO(this.form.end_date, '23:59:59'),
            provider_ids: this.form.provider_ids && this.form.provider_ids.length > 0 ? this.form.provider_ids : []
          }
        };
        

        // 调用导出接口
        this.$client.GetProviderExportInventoryReport(params)
          .then((response) => {
            if (response.head && response.head.result === "200") {
              this.$message({
                showClose: true,
                message: '导出成功',
                type: "success",
              });
              
              // 如果有下载链接，执行下载
              if (response.context && response.context.download_url) {
                window.open(response.context.download_url);
              }
            } else {
              const errorMessage = response.head && response.head.describle 
                ? response.head.describle 
                : '导出失败';
              this.$message({
                showClose: true,
                message: errorMessage,
                type: "error",
              });
            }
          })
          .catch((error) => {
            console.error('导出失败:', error);
            this.$message({
              showClose: true,
              message: '导出失败，请重试',
              type: "error",
            });
          });
      } catch (error) {
        console.error('导出处理失败:', error);
        this.$message({
          showClose: true,
          message: '导出处理失败，请重试',
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.zero-stock-customer
  // 参考分公司材料领用报表的样式做法
  width: 100%
  height: 100%
</style>