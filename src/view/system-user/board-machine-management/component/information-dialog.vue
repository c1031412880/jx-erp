<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="800px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="120px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="终端号:" prop="terminal_code">
            <el-input v-model="form.terminal_code" placeholder="请输入终端号"  oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.terminal_code = $event.target.value"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="sim_code">
            <el-input v-model="form.sim_code" placeholder="请输入手机号" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.sim_code = $event.target.value"></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="终端类型:" prop="vehicle_term_name">
            <el-select v-model="form.vehicle_term_name" clearable placeholder="请选择终端类型">
              <el-option
                v-for="item in terminalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备安装日期:" prop="fixtime">
            <el-date-picker
              v-model="form.fixtime"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curSelecedType=='detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="自编号:" prop="v_num">
            <el-input v-model="form.v_num" placeholder="请输入自编号" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.v_num = $event.target.value"></el-input>
          </el-form-item>
          <el-form-item label="车牌号:" prop="vehicle_code">
            <el-input v-model="form.vehicle_code" placeholder="请输入车牌号"></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="批次:" prop="productionid">
            <el-input v-model="form.productionid" placeholder="请输入批次"></el-input>
          </el-form-item>
          <el-form-item label="视频类型:" prop="VideoTypeName">
            <el-select v-model="form.VideoTypeName" clearable placeholder="请选择视频类型">
              <el-option
                v-for="item in videoOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="视频终端号:" prop="VTerminalCode">
            <el-input v-model="form.VTerminalCode" placeholder="请输入视频终端号" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.VTerminalCode = $event.target.value"></el-input>
          </el-form-item>
          <el-form-item label="视频IP:" prop="video_ip">
            <el-input v-model="form.video_ip" placeholder="请输入视频IP" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.n_fee = $event.target.value"></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label=" 视频web端口:" prop="VideoPort">
            <el-input v-model="form.VideoPort" placeholder="请输入 视频web端口" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.VideoPort = $event.target.value"></el-input>
          </el-form-item>
          <el-form-item label="视频注册端口:" prop="VideoRegisterPort">
            <el-input v-model="form.VideoRegisterPort" placeholder="请输入视频注册端口" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.VideoRegisterPort = $event.target.value"></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="视频流端口:" prop="VideoMediaPort">
            <el-input v-model="form.VideoMediaPort" placeholder="请输入视频流端口" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.VideoMediaPort = $event.target.value"></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item label="描述:" prop="c_remark">
          <el-input
            v-model="form.c_remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入描述"></el-input>
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
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      terminalOptions:[
        {
          value: '图软对讲终端',
          label: '图软对讲终端'
        }, {
          value: '图软HK',
          label: '图软HK'
        }, {
          value: '部标终端',
          label: '部标终端'
        }
      ],
      videoOptions:[
        {
          value: '图软',
          label: '图软'
        }, {
          value: '大华',
          label: '大华'
        }, {
          value: '海康',
          label: '海康'
        }
      ],
      form: {
        terminal_code: "",
        sim_code: "",
        vehicle_term_name: "",
        fixtime: "",
        v_num: "",
        vehicle_code: "",
        productionid: "",
        VideoTypeName: "",
        VTerminalCode: "",
        // 少一个视频IP
        video_ip: "",
        VideoPort: "",
        VideoRegisterPort: "",
        VideoMediaPort: "",
      },
      basicRules: {
        terminal_code: [
          { required: true, message: "请输入终端号", trigger: "change" },
        ],
        sim_code: [
          { required: true, message: "请输入sim_code", trigger: "change" },
        ],
        vehicle_term_name: [
          { required: true, message: "请选择终端类型", trigger: "change" },
        ],
        fixtime: [
          { required: true, message: "请选择设备安装日期", trigger: "change" },
        ],
        v_num: [
          { required: true, message: "请输入车辆自编号", trigger: "change" },
        ],
        terminal_code: [
          { required: true, message: "请输入车牌号", trigger: "change" },
        ],
        vehicle_code: [
          { required: true, message: "请输入终端号", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div /deep/ .el-input {
//   width: 420px;
// }
.el-dialog-div {
  height: 400px;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 250px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 250px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 250px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 620px;
}
</style>

