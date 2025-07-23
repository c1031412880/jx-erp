<template>
  <div class="year-overview">
    <div class="overview-list">
      <div class="overview-item" v-for="(item, index) in dataList" :key="index">
        <div class="item-content">
          <div class="item-left">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-value">
              <count-to 
                :start-val="0" 
                :end-val="item.value" 
                :duration="2600" 
                :decimals="item.decimals"
                :style="{ color: item.yoy !== 0 ? (item.yoy > 0 ? '#C61D29' : '#0F8CFF') : '' }"
              />
              <span class="item-unit">{{ item.unit }}</span>
            </div>
          </div>
          <div class="item-right">
            <div class="item-compare">
              <span class="compare-label">同比:</span>
              <count-to 
                :start-val="0" 
                :end-val="item.yoy" 
                :duration="2600" 
                :decimals="item.decimals"
                :style="{ color: item.yoy !== 0 ? (item.yoy > 0 ? '#C61D29' : '#0F8CFF') : '' }"
              />
              <span class="compare-unit" :style="{ color: item.yoy !== 0 ? (item.yoy > 0 ? '#C61D29' : '#0F8CFF') : '' }">%</span>
              <div class="item-icon">
                <el-image v-if="item.yoy < 0" :src="require('@/assets/home-image/down.png')"></el-image>
                <el-image v-else-if="item.yoy > 0" :src="require('@/assets/home-image/up.png')"></el-image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'year-overview',
  components: {
    countTo
  },
  props: {
    dept_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dataList: [
        {
          title: '本年累积安全里程',
          value: 0,
          unit: '公里',
          yoy: 0,
          decimals: 0,
          key: 'traffic_accident_rate'
        },
        {
          title: '本年行车事故率',
          value: 0,
          unit: '次/百万公里',
          yoy: 0,
          decimals: 1,
          key: 'accident_loss'
        },
        {
          title: '本年累计事故经损',
          value: 0,
          unit: '元',
          yoy: 0,
          decimals: 0,
          key: 'accident_duty_loss'
        },
        {
          title: '本年违章率',
          value: 0,
          unit: '次/百万公里',
          yoy: 0,
          decimals: 2,
          key: 'violations_rate'
        }
      ]
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    dept_id() {
      this.loadData()
    }
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      let params = {
        dept_id: this.dept_id
      }
      
      this.$client.GetSafeOverviewBasicInfo(params).then(res => {
        if (res.head.result == '200') {
          const data = res.context || {}
          
          // 更新数据 - 根据接口返回的数据结构映射
          this.dataList[0].value = data.traffic_accident_rate || 0
          this.dataList[0].yoy = data.traffic_accident_rate_yoy || 0
          
          this.dataList[1].value = data.accident_loss || 0
          this.dataList[1].yoy = data.accident_loss_yoy || 0
          
          this.dataList[2].value = data.accident_duty_loss || 0
          this.dataList[2].yoy = data.accident_duty_loss_yoy || 0
          
          this.dataList[3].value = data.violations_rate || 0
          this.dataList[3].yoy = data.violations_rate_yoy || 0
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).catch(err => {
        console.error('获取年度总览数据失败:', err)
        this.$message({
          showClose: true,
          message: '获取数据失败',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.year-overview {
  height: 100%;
  padding: 8px * $NumWidth;
  
  .overview-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .overview-item {
      background: #ffffff;
      border-radius: 4px * $NumWidth;
      padding: 12px * $NumWidth 16px * $NumWidth;
      display: flex;
      align-items: center;
      box-shadow: 0 1px * $NumWidth 3px * $NumWidth rgba(0, 0, 0, 0.06);
      border: 1px solid #f5f5f5;
      flex: 1;
      margin-bottom: 8px * $NumWidth;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .item-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        
        .item-left {
          display: flex;
          align-items: center;
          flex: 1;
          
          .item-title {
            font-size: 15px * $NumWidth;
            color: #333333;
            font-weight: 600;
            margin-right: 15px * $NumWidth;
            min-width: 120px * $NumWidth;
          }
          
          .item-value {
            display: flex;
            align-items: baseline;
            
            .count-to {
              font-size: 18px * $NumWidth;
              font-weight: bold;
              color: #333333;
              font-family: 'DIN-Bold', sans-serif;
            }
            
            .item-unit {
              font-size: 12px * $NumWidth;
              color: #666666;
              margin-left: 4px * $NumWidth;
            }
          }
        }
        
        .item-right {
          display: flex;
          align-items: center;
          
          .item-compare {
            display: flex;
            align-items: center;
            font-size: 12px * $NumWidth;
            
            .compare-label {
              color: #999999;
              margin-right: 4px * $NumWidth;
            }
            
            .count-to {
              font-weight: bold;
              margin-right: 2px * $NumWidth;
            }
            
            .compare-unit {
              font-weight: bold;
              margin-right: 6px * $NumWidth;
            }
            
            .item-icon {
              width: 12px * $NumWidth;
              height: 12px * $NumWidth;
              flex-shrink: 0;
              
              .el-image {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style> 