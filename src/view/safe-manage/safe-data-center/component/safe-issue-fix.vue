<template>
  <div class="safe-issue-fix">
    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
      <el-radio-group v-model="issueType" size="mini" :disabled="loading" @change="loadData">
        <el-radio-button :label="1">安全隐患</el-radio-button>
        <el-radio-button :label="2">安全培训</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="dateType" size="mini" :disabled="loading" @change="loadData">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
    </div>
    <ul class="safe-issue-fix-header">
      <li class="safe-issue-fix-header-item" v-for="(item, index) in headerData" :key="index">
        {{ item }}
      </li>
    </ul>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    <div v-else-if="!tableData || tableData.length === 0" class="empty-container">
      <img :src="emptyPlaceholder" alt="" class="empty-image" />
      <div class="empty-text">暂无数据</div>
    </div>
    <ul v-else class="safe-issue-fix-content">
      <li class="safe-issue-fix-content-item" v-for="(item, index) in tableData" :key="index">
        <div class="safe-issue-fix-content-item-box">{{ item.contents_main || item.name }}</div>
        <div class="safe-issue-fix-content-item-box">{{ item.check_dept_names || formatTime(item.start_time) }}</div>
        <div class="safe-issue-fix-content-item-box">{{ formatTime(item.request_date) || item.type_name }}</div>
        <div class="safe-issue-fix-content-item-box" :style="getResultStyle(item.data_state_name || item.should_arrive)">
          {{ item.data_state_name || item.should_arrive }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDate, formatTime } from '@/utils/index'
import placeholderImage from '@/assets/home-image/placeholder-1.png'

export default {
  name: 'safe-issue-fix',
  props: {
    dept_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      issueType: 1, // 1:安全隐患 2:安全培训
      dateType: 1, // 1:月 2:年
      headerData: ['安全隐患', '整改部门', '整改提出时间', '整改结果'],
      tableData: [],
      loading: false, // 加载状态
      emptyPlaceholder: placeholderImage // 空占位图片
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    /**
     * 格式化时间
     */
    formatTime(time) {
      if (!time) return ''
      return formatTime(new Date(time), 'yyyy-MM-dd')
    },
    /**
     * 获取结果样式
     */
    getResultStyle(result) {
      if (this.issueType === 1 && result === '整改已完成') {
        return { color: '#00DDFF' }
      } else if (this.issueType === 1 && result !== '整改已完成') {
        return { color: '#FF5454' }
      }
      return {}
    },
    /**
     * 加载数据
     */
    loadData() {
      // 显示加载动画
      this.loading = true
      
      // 根据选择类型设置表头
      if (this.issueType === 1) {
        this.headerData = ['安全隐患', '整改部门', '整改提出时间', '整改结果']
      } else {
        this.headerData = ['安全培训主题', '培训时间', '培训方式', '培训人数']
      }

      // 使用全局方法获取时间范围
      let timeRange
      if (this.dateType === 1) {
        // 月：获取本月时间范围
        timeRange = getDate('thisMonth')
      } else {
        // 年：获取本年时间范围
        timeRange = getDate('thisYear')
      }

      let params = {
        dept_id: this.dept_id,
        begin: timeRange.startTime + ' 00:00:00',
        end: timeRange.endTime + ' 23:59:59',
        date_type: this.dateType
      }

      // 根据类型调用不同接口
      let apiMethod = this.issueType === 1 ? 'GetHiddenDangerFixInfo' : 'GetSafeTrainInfo'
      
      // Mock数据验证功能（模拟网络延迟）
    //   setTimeout(() => {
    //     if (this.issueType === 1) {
    //       // 安全隐患Mock数据
    //       this.tableData = [
    //         {
    //           contents_main: '车辆制动系统存在安全隐患',
    //           check_dept_names: '一分公司',
    //           request_date: '2024-01-15T08:30:00.000Z',
    //           data_state_name: '整改已完成'
    //         },
    //       {
    //         contents_main: '驾驶员疲劳驾驶问题',
    //         check_dept_names: '二分公司',
    //         request_date: '2024-01-20T09:15:00.000Z',
    //         data_state_name: '整改中'
    //       },
    //       {
    //         contents_main: '车辆轮胎磨损严重',
    //         check_dept_names: '三分公司',
    //         request_date: '2024-01-25T10:20:00.000Z',
    //         data_state_name: '整改已完成'
    //       },
    //       {
    //         contents_main: '安全设备配置不完善',
    //         check_dept_names: '四分公司',
    //         request_date: '2024-01-30T11:45:00.000Z',
    //         data_state_name: '待整改'
    //       },
    //       {
    //         contents_main: '车辆灯光系统故障',
    //         check_dept_names: '五分公司',
    //         request_date: '2024-02-05T14:30:00.000Z',
    //         data_state_name: '整改已完成'
    //       },
    //       {
    //         contents_main: '驾驶员安全意识培训不足',
    //         check_dept_names: '一分公司',
    //         request_date: '2024-02-10T15:20:00.000Z',
    //         data_state_name: '整改中'
    //       },
    //       {
    //         contents_main: '车辆灭火器过期',
    //         check_dept_names: '二分公司',
    //         request_date: '2024-02-15T16:10:00.000Z',
    //         data_state_name: '整改已完成'
    //       },
    //       {
    //         contents_main: '行车记录仪故障',
    //         check_dept_names: '三分公司',
    //         request_date: '2024-02-20T17:30:00.000Z',
    //         data_state_name: '待整改'
    //       },
    //       {
    //         contents_main: '车辆GPS定位系统异常',
    //         check_dept_names: '四分公司',
    //         request_date: '2024-02-25T18:45:00.000Z',
    //         data_state_name: '整改已完成'
    //       },
    //       {
    //         contents_main: '驾驶员证件过期',
    //         check_dept_names: '五分公司',
    //         request_date: '2024-03-01T19:20:00.000Z',
    //         data_state_name: '整改中'
    //       }
    //     ]
    //   } else {
    //     // 安全培训Mock数据
    //     this.tableData = [
    //       {
    //         name: '道路交通安全法规培训',
    //         start_time: '2024-01-10T09:00:00.000Z',
    //         end_time: '2024-01-10T17:00:00.000Z',
    //         type: 1,
    //         type_name: '线下培训',
    //         should_arrive: 45
    //       },
    //       {
    //         name: '车辆安全检查操作培训',
    //         start_time: '2024-01-15T08:30:00.000Z',
    //         end_time: '2024-01-15T16:30:00.000Z',
    //         type: 1,
    //         type_name: '线下培训',
    //         should_arrive: 38
    //       },
    //       {
    //         name: '应急处置技能培训',
    //         start_time: '2024-01-20T10:00:00.000Z',
    //         end_time: '2024-01-20T18:00:00.000Z',
    //         type: 2,
    //         type_name: '线上培训',
    //         should_arrive: 52
    //       },
    //       {
    //         name: '驾驶员心理健康培训',
    //         start_time: '2024-01-25T09:30:00.000Z',
    //         end_time: '2024-01-25T17:30:00.000Z',
    //         type: 1,
    //         type_name: '线下培训',
    //         should_arrive: 42
    //       },
    //       {
    //         name: '车辆维护保养知识培训',
    //         start_time: '2024-02-01T08:00:00.000Z',
    //         end_time: '2024-02-01T16:00:00.000Z',
    //         type: 2,
    //         type_name: '线上培训',
    //         should_arrive: 35
    //       },
    //       {
    //         name: '安全驾驶技巧培训',
    //         start_time: '2024-02-05T09:15:00.000Z',
    //         end_time: '2024-02-05T17:15:00.000Z',
    //         type: 1,
    //         type_name: '线下培训',
    //         should_arrive: 48
    //       },
    //       {
    //         name: '恶劣天气驾驶培训',
    //         start_time: '2024-02-10T10:30:00.000Z',
    //         end_time: '2024-02-10T18:30:00.000Z',
    //         type: 2,
    //         type_name: '线上培训',
    //         should_arrive: 41
    //       },
    //       {
    //         name: '车辆故障排除培训',
    //         start_time: '2024-02-15T08:45:00.000Z',
    //         end_time: '2024-02-15T16:45:00.000Z',
    //         type: 1,
    //         type_name: '线下培训',
    //         should_arrive: 39
    //       },
    //       {
    //         name: '安全管理制度培训',
    //         start_time: '2024-02-20T09:00:00.000Z',
    //         end_time: '2024-02-20T17:00:00.000Z',
    //         type: 2,
    //         type_name: '线上培训',
    //         should_arrive: 55
    //       },
    //       {
    //         name: '驾驶员体能训练',
    //         start_time: '2024-02-25T08:30:00.000Z',
    //         end_time: '2024-02-25T16:30:00.000Z',
    //         type: 1,
    //         type_name: '线下培训',
    //         should_arrive: 33
    //       }
    //     ]
    //   }
      
    //   // 隐藏加载动画
    //   this.loading = false
    // }, 1000) // 模拟网络延迟

      // 真实API调用（注释掉用于测试）
      this.$client[apiMethod](params).then(res => {
        if (res.head.result == '200') {
          this.tableData = res.context || []
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).finally(() => {
        // 隐藏加载动画
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.safe-issue-fix {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 单选按钮容器样式
  .el-radio-group {
    margin-bottom: 8px * $NumWidth;
    
    &:first-child {
      margin-right: 15px * $NumWidth;
    }
  }
  
  .safe-issue-fix-header {
    display: flex;
    background: #EBECF0;
    line-height: 18px * $NumWidth;
    .safe-issue-fix-header-item {
      padding: 8px * $NumWidth 0;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 14px * $NumWidth;
      color: #333333;
      flex-shrink: 0;
      text-align: center;
      border-right: 1px solid #DBDEE2;
    }
    .safe-issue-fix-header-item:nth-child(1) {
      width: 30%;
    }
    .safe-issue-fix-header-item:nth-child(2) {
      width: 25%;
    }
    .safe-issue-fix-header-item:nth-child(3) {
      width: 25%;
    }
    .safe-issue-fix-header-item:nth-child(4) {
      width: 20%;
      border-right: none;
    }
  }
  
  .safe-issue-fix-content {
    min-height: 200px * $NumWidth;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    flex: 1;
    .safe-issue-fix-content-item {
      display: flex;
      line-height: 18px * $NumWidth;
      .safe-issue-fix-content-item-box {
        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: 400;
        font-size: 14px * $NumWidth;
        color: #333333;
        flex-shrink: 0;
        text-align: center;
        padding: 8px * $NumWidth 0;
        display: flex;
        justify-content: center;
        align-items: center;
        word-break: break-all;
      }
      .safe-issue-fix-content-item-box:nth-child(1) {
        width: 30%;
      }
      .safe-issue-fix-content-item-box:nth-child(2) {
        width: 25%;
      }
      .safe-issue-fix-content-item-box:nth-child(3) {
        width: 25%;
      }
      .safe-issue-fix-content-item-box:nth-child(4) {
        width: 20%;
        font-family: DIN, DIN;
        font-weight: bold;
      }
    }
    /* 斑马线效果 */
    .safe-issue-fix-content-item:nth-child(odd) {
      background-color: #ffffff;
    }
    .safe-issue-fix-content-item:nth-child(even) {
      background-color: #F7F7F9;
    }
  }
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  
  /* 加载动画样式 */
  .loading-container {
    min-height: 200px * $NumWidth;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    flex: 1;
    
    .loading-spinner {
      width: 40px * $NumWidth;
      height: 40px * $NumWidth;
      border: 3px * $NumWidth solid #f3f3f3;
      border-top: 3px * $NumWidth solid #409EFF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      margin-top: 15px * $NumWidth;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-size: 14px * $NumWidth;
      color: #666666;
    }
  }
  
  /* 空状态样式 */
  .empty-container {
    min-height: 200px * $NumWidth;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    flex: 1;
    
    .empty-image {
      width: 60px * $NumWidth;
      height: 60px * $NumWidth;
      margin-bottom: 10px * $NumWidth;
    }
    
    .empty-text {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-size: 14px * $NumWidth;
      color: #999999;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 单选按钮样式优化
/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #FFF1F2;
  border: 1px solid #C61D29;
  color: #C61D29;
  -webkit-box-shadow: -1px 0 0 0 #C61D29;
  box-shadow: -1px 0 0 0 #C61D29;
}

/deep/ .el-radio-button__inner:hover {
  color: #ee6069;
}

/deep/ .el-radio-button__inner {
  font-size: 12px * $NumWidth;
  padding: 6px * $NumWidth 10px * $NumWidth;
  border-radius: 3px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 3px * $NumWidth 0 0 3px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 3px * $NumWidth 3px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style> 