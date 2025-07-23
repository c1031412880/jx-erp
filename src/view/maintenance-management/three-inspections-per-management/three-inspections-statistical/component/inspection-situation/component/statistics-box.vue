<template>
  <div class="statistics-box">
    <div class="box-content">
      <div class="item-content" v-for="(item,index) in data" :key="index" @click="itemClick(item)">
        <div class="item-name"> {{ item.name }} </div>
        <div class="item-value"> {{ item.value }} </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "statistics-box",
  props: {
  },
  data() {
    return {
      data: [
        {
          name: '首班检查',
          value: '0'
        },
        {
          name: '检查未排班车辆',
          value: '0'
        },
        {
          name: '已检车辆',
          value: '0'
        },
        {
          name: '低风险车辆',
          value: '0'
        },
        {
          name: '中风险车辆',
          value: '0'
        },
        {
          name: '高风险车辆',
          value: '0'
        },
        {
          name: '检查异常车辆',
          value: '0'
        },
        {
          name: '检查异常结果',
          value: '0'
        },
      ]
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 数据加载
    loadData() {
      this.$client.GetDayCheckWebTitle({})
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200")  {
            let {check,err_vehicle,error_res,first,high,low,mid,no_check} = res.context

            this.data[0].value = first
            this.data[1].value = no_check
            this.data[2].value = check
            this.data[3].value = low
            this.data[4].value = mid
            this.data[5].value = high
            this.data[6].value = err_vehicle
            this.data[7].value = error_res
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 单项点击
    itemClick(item) {
      this.$emit('on-click', item)
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.statistics-box {
  width: 100%;
  margin-bottom: 15px;
  .box-content {
    display: flex;
    cursor: pointer;
    .item-content {
      flex: 1;
      margin: 5px;
      background-color: #0a213d;
      color: #fff;
      text-align: center;
      .item-name {
        font-size: 16px;
        font-weight: 400;
        padding-top: 16px
      }
      .item-value {
        padding: 10px 0;
        font-size: 28px;
        font-weight: bold;
      }
    }
  }
}
</style>