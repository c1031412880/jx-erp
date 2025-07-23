<template>
  <el-dialog
    :visible="dialogBool"
    title="风险标准设置"
    :before-close="dialogClose"
    width="780px"
    :close-on-click-modal="false"
  >
    <div class="el-dialog-div">
      <el-form ref="form" size="mini">
        <span>说明：风险颜色按照红、橙、黄、绿四个等级划分，危险程度最高为红色、最低为绿色。
        划分标准如下：</span>

        <template v-for="(item,index) in data">
          <p style="font-size: 24px;font-weight: bold;padding: 10px 0;">{{typeInfo[item.date_type]}}</p>
          <el-form-item label="" prop="c_name">
            <div
              class="show-flex-box-r show-flex-center"
              style="justify-content: start"
            >
              <div class="symbol-box">
                {{`百万公里${typeInfo[item.date_type]}`}}&lt;&nbsp;&nbsp;
              </div>
              <el-input
                placeholder="请输入"
                v-model="item.first_level_num"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="item.first_level_num = $event.target.value"
                size="mini"
                clearable
              ></el-input>
              &nbsp;&nbsp;次/百万公里，风险等级为
              <span style="color:#70B603">绿色</span>
            </div>
          </el-form-item>
          <el-form-item label="" prop="c_name">
            <div
              class="show-flex-box-r show-flex-center"
              style="justify-content: start"
            > 
              <el-input
                placeholder="请输入"
                v-model="item.min_second_level_num"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="item.min_second_level_num = $event.target.value"
                size="mini"
                clearable
              ></el-input>
              <div class="symbol-box">
                &nbsp;&nbsp;&lt;{{`百万公里${typeInfo[item.date_type]}`}}&lt;=&nbsp;&nbsp;
              </div>
              <el-input
                placeholder="请输入"
                v-model="item.max_second_level_num"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="item.max_second_level_num = $event.target.value"
                size="mini"
                clearable
              ></el-input>
              &nbsp;&nbsp;次/百万公里，风险等级为
              <span style="color:#E1E600">黄色</span>
            </div>
          </el-form-item>
          <el-form-item label="" prop="c_name">
            <div
              class="show-flex-box-r show-flex-center"
              style="justify-content: start"
            > 
              <el-input
                placeholder="请输入"
                v-model="item.min_third_level_num"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="item.min_third_level_num = $event.target.value"
                size="mini"
                clearable
              ></el-input>
              <div class="symbol-box">
                &nbsp;&nbsp;&lt;{{`百万公里${typeInfo[item.date_type]}`}}&lt;=&nbsp;&nbsp;
              </div>
              <el-input
                placeholder="请输入"
                v-model="item.max_third_level_num"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="item.max_third_level_num = $event.target.value"
                size="mini"
                clearable
              ></el-input>
              &nbsp;&nbsp;次/百万公里，风险等级为
              <span style="color:#F59A23">橙色</span>
            </div>
          </el-form-item>
          <el-form-item label="" prop="c_name">
            <div
              class="show-flex-box-r show-flex-center"
              style="justify-content: start"
            > 
              <div class="symbol-box">
                {{`百万公里${typeInfo[item.date_type]}`}}&gt;&nbsp;&nbsp;
              </div>
              <el-input
                placeholder="请输入"
                v-model="item.last_level_num"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="item.last_level_num = $event.target.value"
                size="mini"
                clearable
              ></el-input>
              &nbsp;&nbsp;次/百万公里，风险等级为
              <span style="color:#D9001B">红色</span>
            </div>
          </el-form-item>
        </template>
        

        <!-- <p style="font-size: 24px;font-weight: bold;padding: 10px 0;">违章率</p>
        <el-form-item label="" prop="c_name">
          <div
            class="show-flex-box-r show-flex-center"
            style="justify-content: start"
          >
            <div class="symbol-box">
              百万公里违章率&lt;&nbsp;&nbsp;
            </div>
            <el-input
              placeholder="请输入"
              v-model="form.join_day"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.join_day = $event.target.value"
              size="mini"
              clearable
            ></el-input>
            &nbsp;&nbsp;次/百万公里，风险等级为
            <span style="color:#70B603">绿色</span>
          </div>
        </el-form-item>
        <el-form-item label="" prop="c_name">
          <div
            class="show-flex-box-r show-flex-center"
            style="justify-content: start"
          > 
            <el-input
              placeholder="请输入"
              v-model="form.join_day"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.join_day = $event.target.value"
              size="mini"
              clearable
            ></el-input>
            <div class="symbol-box">
              &nbsp;&nbsp;&lt;百万公里违章率&lt;=&nbsp;&nbsp;
            </div>
            <el-input
              placeholder="请输入"
              v-model="form.join_day"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.join_day = $event.target.value"
              size="mini"
              clearable
            ></el-input>
            &nbsp;&nbsp;次/百万公里，风险等级为
            <span style="color:#E1E600">黄色</span>
          </div>
        </el-form-item>
        <el-form-item label="" prop="c_name">
          <div
            class="show-flex-box-r show-flex-center"
            style="justify-content: start"
          > 
            <el-input
              placeholder="请输入"
              v-model="form.join_day"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.join_day = $event.target.value"
              size="mini"
              clearable
            ></el-input>
            <div class="symbol-box">
              &nbsp;&nbsp;&lt;百万公里违章率&lt;=&nbsp;&nbsp;
            </div>
            <el-input
              placeholder="请输入"
              v-model="form.join_day"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.join_day = $event.target.value"
              size="mini"
              clearable
            ></el-input>
            &nbsp;&nbsp;次/百万公里，风险等级为
            <span style="color:#F59A23">橙色</span>
          </div>
        </el-form-item>
        <el-form-item label="" prop="c_name">
          <div
            class="show-flex-box-r show-flex-center"
            style="justify-content: start"
          > 
            <div class="symbol-box">
              百万公里违章率&gt;&nbsp;&nbsp;
            </div>
            <el-input
              placeholder="请输入"
              v-model="form.join_day"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.join_day = $event.target.value"
              size="mini"
              clearable
            ></el-input>
            &nbsp;&nbsp;次/百万公里，风险等级为
            <span style="color:#D9001B">红色</span>
          </div>
        </el-form-item> -->
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
  },
  mounted() {
  },
  data() {
    return {
      data: [
        {
          id: 0,
          date_type: 1,
          first_level_num: '',
          min_second_level_num: '',
          max_second_level_num: '',
          min_third_level_num: '',
          max_third_level_num: '',
          last_level_num: '',
        },
        {
          id: 0,
          date_type: 2,
          first_level_num: '',
          min_second_level_num: '',
          max_second_level_num: '',
          min_third_level_num: '',
          max_third_level_num: '',
          last_level_num: '',
        },
      ],
      
      typeInfo: {
        1: '行车事故率',
        2: '违章率',
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    initData(list) {
      if (list.length > 0) {
        this.data = list
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill() {
      this.$emit("save-add-edit", this.data);
    },
  },
};
</script>
  
<style lang="scss" scoped>
  .symbol-box {
    line-height: 0px;
  }
  .el-dialog-div{
    /deep/ .el-input, .el-input--mini {
      width: 90px;
    }
    /deep/ input {
      width: 90px;
    }
    /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
  } 
</style>

