<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    append-to-body
    width="625px"
    :before-close="dialogClose">
    <div class="users-box">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in dataMap" :key="item.label" :label="item.label + ' ' + '(' + item.data.length +')'" :name="item.value">
          <ul class="content-box">
            <li class="content-item" v-for="(sing, index) in item.data" :key="index">
              <el-image :src="require('@/assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt=""></el-image>
              <p>
                <i v-show="activeName == '1' && sing.state == 1" style="color: green;" class="el-icon-success"></i>
                <i v-show="activeName == '1' && sing.state == 3" style="color: #ff9900;" class="el-icon-remove"></i>
                <i v-show="activeName == '1' && sing.state == 2" style="color: red;" class="el-icon-error"></i>
                <el-tooltip class="item" effect="dark" :content="sing.user_name" placement="top">
                  <span>{{ sing.user_name }}</span>
                </el-tooltip>
              </p>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
    
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "参会人员",
    },
    data: {
      type: Array,
      default:() => []
    }
  },
  data() {
    return {
      activeName: '1',
      dataMap: [
        {label: '全部', value: '1',data: []},
        {label: '接收', value: '2',data: []},
        {label: '暂定', value: '3',data: []},
        {label: '拒绝', value: '4',data: []},
        {label: '未读', value: '5',data: []},
        {label: '已读', value: '6',data: []},
      ]
    }
  },
  mounted() {},
  watch: {
    dialogBool(bool) {
      if(bool) {
        this.dataMap[0].data = this.data
        // 接收
        this.dataMap[1].data = this.data.filter(item => {return item.state == 1})
        // 暂定
        this.dataMap[2].data = this.data.filter(item => {return item.state == 3})
        // 拒绝
        this.dataMap[3].data = this.data.filter(item => {return item.state == 2})
        // // 未读
        this.dataMap[4].data = this.data.filter(item => {return item.is_read == 0})
        // // 已读
        this.dataMap[5].data = this.data.filter(item => {return item.is_read == 1})
        // console.log(this.data, this.dataMap);
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__body {
  background-color: #ffffff;
  padding: 0;
}
/deep/ .el-tab-pane {
  height: 435px;
  overflow-y: auto;
}
.content-box {
  display: flex;
  flex-wrap: wrap;
  .content-item {
    text-align: center;
    margin: 0 5px 10px;
    .el-image {
      width: 42px;
      height: 42px;
      border-radius: 3px;
      margin-bottom: 5px;
    }
    p {
      width: 62px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>