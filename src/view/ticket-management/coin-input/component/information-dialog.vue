<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <div class="el-dialog-div-content">
        <el-form
          :model="form"
          :rules="basicRules"
          ref="form"
          label-width="120px"
          size="mini"
        >
        <el-form-item label="日期:" prop="date">
            <el-date-picker
              v-model="form.date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="线路:" prop="line_id">
            <div class="show-flex-box-c">
              <get-line-select-tree
                ref="lineTree"
                :placeholder="'选择线路'"
                :isShowCheckbox="false"
                v-model="form.line_id"
                @on-change="onLineSelectChange"
                :isExportMultiple="false"
                :width="'380'"
                :disabled="curSelecedType == 'detail'"
              >
              </get-line-select-tree>
              <span style="font-size: 12px; color: #909399">先选择线路才能带出该线路下的相关车辆</span>
            </div>
            
          </el-form-item>
          <el-form-item label="车牌号:" prop="vehicle_id" class="vehicle-select">
            <div class="show-flex-box-r">

              <el-select v-model="form.vehicle_id" placeholder="请选择" v-if="!isShowAllVehicle" :disabled="curSelecedType == 'detail'">
                <el-option
                  v-for="item in vehicleOptions"
                  :key="item.vehicle_id_erp"
                  :label="item.lp_num"
                  :value="item.vehicle_id_erp">
                </el-option>
              </el-select>

              <get-vehicle-select-tree
                v-else
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="form.vehicle_id"
                :isExportMultiple="false"
                :width="'260'"
                :disabled="curSelecedType == 'detail'"
              >
              </get-vehicle-select-tree>
              <el-checkbox v-model="isShowAllVehicle" style="margin-left:5px;" v-if="curSelecedType != 'detail'">载入全部车辆</el-checkbox>
            </div>
          </el-form-item>
          
          <el-form-item label="驾驶员:" prop="driver_id">
            <get-driver-select-tree
              ref="driverTree"
              v-model="form.driver_id"
              :width="'380'"
              :isShowCheckbox="false"
              :placeholder="'请选择驾驶员'"
              :isExportMultiple="false"
              @on-change="onSelectDriverChange"
              :disabled="curSelecedType == 'detail'"
            ></get-driver-select-tree>
          </el-form-item>
          <el-form-item label="1元硬币:" prop="one_coins">
            <el-input
              v-model="form.one_coins"
              placeholder="请输入1元硬币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.one_coins = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="0.5元硬币:" prop="half_coins">
            <el-input
              v-model="form.half_coins"
              placeholder="请输入0.5元硬币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.half_coins = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="0.1元硬币:" prop="half_coins">
            <el-input
              v-model="form.half_coins"
              placeholder="请输入0.1元硬币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.half_coins = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="0.1元纸币:" prop="half_coins">
            <el-input
              v-model="form.half_coins"
              placeholder="请输入0.1元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.half_coins = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="0.5元纸币:" prop="half_notes">
            <el-input
              v-model="form.half_notes"
              placeholder="请输入0.5元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.half_notes = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="1元纸币:" prop="one_notes">
            <el-input
              v-model="form.one_notes"
              placeholder="请输入1元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.one_notes = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="5元纸币:" prop="five">
            <el-input
              v-model="form.five"
              placeholder="请输入5元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.five = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="10元纸币:" prop="ten">
            <el-input
              v-model="form.ten"
              placeholder="请输入10元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.ten = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="20元纸币:" prop="twenty">
            <el-input
              v-model="form.twenty"
              placeholder="请输入20元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.twenty = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="50元纸币:" prop="fifty">
            <el-input
              v-model="form.fifty"
              placeholder="请输入50元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.fifty = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="100元纸币:" prop="hundred">
            <el-input
              v-model="form.hundred"
              placeholder="请输入100元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.hundred = $event.target.value"
              @input="calculationAmount"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="总金额:" prop="tyre_number">
            <span style="color: #D9001B">{{allMoneynumber}}</span>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              maxlength="200"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
              @blur="blurEvent"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form','save')"
        >保 存（Enter键）</el-button
      >
      <el-button type="primary" @click="updatePlaybill('form','saveAdd')" v-if="curSelecedType == 'add'"
        >保存并继续添加（Ctrl键）</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {getVehicleSelectTree, getLineSelectTree, getDriverSelectTree },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: {
      type: String,
      default: 'add'
    },
    curCanSelectVehicleOptions:[Array]
  },
  mounted() {

  },
  data() {
    return {
      date: [],
      vehicleOptions:[],
      form: {
        id: "",
        line_id: "",
        vehicle_id: "",
        date: "",
        driver_id: "",
        five: "",
        ten: "",
        twenty: "",
        fifty: "",
        hundred: "",
        one_coins: "",
        one_notes: "",
        half_coins: "",
        half_notes: "",
        fraction: "",
        remark: "",
      },
      basicRules: {
        line_id: [
          {
            required: true,
            message: "请选择线路",
            trigger: "change",
          },
        ],
        vehicle_id: [
          {
            required: true,
            message: "请选择车牌号",
            trigger: "change",
          },
        ],
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        driver_id: [
          {
            required: true,
            message: "请选择驾驶员",
            trigger: "change",
          },
        ]
        
      },
      isShowAllVehicle: false,
      allMoneynumber:0,
      vehicle_lp_num:'', //当前编辑车辆名称
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.lineTree.onClear();
        this.$refs.driverTree.onClear();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.setDate()
        this.reqInputDom();
        this.$nextTick(() => {
          // this.$refs.lineTree.onClear();
          // this.$refs.driverTree.onClear();
          // if(this.isShowAllVehicle) {
          //   this.$refs.vehicleTree.onClear();
          // }
          this.$refs.form.clearValidate();
          this.ListeningKeyboardEvent();
        })
        
      }
    },
    curCanSelectVehicleOptions: {
      handler(newValue, oldValue) {
        if(this.curSelecedType == 'add') {
          this.vehicleOptions = [...this.curCanSelectVehicleOptions];
        }
      }
    },
    vehicle_lp_num() {
      setTimeout(() => {
        if(this.vehicle_lp_num) {
          let isHaveId = false;
          this.vehicleOptions.forEach(item => {
            if(item.vehicle_id_erp == this.form.vehicle_id) {
              isHaveId = true
              // let obj = {
              //   lp_num: `${this.vehicle_lp_num}(非此线路下车辆)`,
              //   vehicle_id_erp: this.form.vehicle_id
              // }
              // this.curCanSelectVehicleOptions.push(obj)
            }
          });
  
          if(!isHaveId) {
            let obj = {
              lp_num: `${this.vehicle_lp_num}(非此线路下车辆)`,
              vehicle_id_erp: this.form.vehicle_id
            }
            this.vehicleOptions.push(obj)
          }
          this.$forceUpdate();
        }

      },300)
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为前一天
    setDate() {
      let date = new Date();
      date.setTime(new Date().getTime()-24*60*60*1000);
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.date = Y + '-' + M + '-' + D
    },
    // 重置部分from
    reastFrom(type) {
      // Object.assign(this.$data, this.$options.data());
      if(type == 1) {
        this.$refs.lineTree.onClear();
      }
      this.form.vehicle_id = '';
      this.form.driver_id = '';
      this.form.five = '';
      this.form.ten = '';
      this.form.twenty = '';
      this.form.fifty = '';
      this.form.hundred = '';
      this.form.one_coins = '';
      this.form.one_notes = '';
      this.form.half_coins = '';
      this.form.half_notes = '';
      this.form.remark = '';
      this.form.fraction = '';
      this.allMoneynumber = 0;
      this.$refs.driverTree.onClear();
      if(this.isShowAllVehicle) {
        this.$refs.vehicleTree.onClear();
      }
      this.isShowAllVehicle = false;
    }, 
    // 获取inputDom
    reqInputDom() {
      this.allInputDom = $('.el-dialog-div-content .el-form-item__content').find("input")
      // console.log(this.allInputDom)
    },
    // 所选线路
    onLineSelectChange(lines, nodes) {
      console.log(lines,nodes)
      if(lines && lines.length > 0) {
        this.reqLineVehicles(lines[0])
        this.allInputDom.eq(2).focus();
      }
    },
    // 获取线路下面的车辆
    reqLineVehicles(line_id) {
      let params = {
        line_id:line_id
      };
      this.$client.getVehiclesRecKon(params).then(res => {
        console.log(res)
        if(res.head.result == "200") {
          this.vehicleOptions = res.context
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 选择驾驶员
    onSelectDriverChange(Drivers, nodes) {
      // let rowDom = $('.el-dialog-div-content .el-form-item__content').find("input")
      // console.log(rowDom)
      if(!this.isShowAllVehicle) {
        this.allInputDom.eq(7).focus();
      }else{
        this.allInputDom.eq(8).focus();
      }
    },
    // 监听键盘事件
    ListeningKeyboardEvent() {
      let that = this;
      document.onkeydown = function(e) {
        let key = window.event.keyCode || window.event.which;
        // tab键 9 enter 13 ctrl 17
        // if(key == 9){
          
        // }
        if(key == 13){
          if(that.curSelecedType != 'detail') {
            that.updatePlaybill('form','save')
          }
        }

        if(key == 17){
          if(that.curSelecedType == 'add') {
            that.updatePlaybill('form','saveAdd')
          }
        }
      }
    },
    blurEvent(event) {
      // console.log(event)
      this.allInputDom.eq(1).focus();
    },
    // 计算总金额
    calculationAmount() {
      // let info = Object.assign({},this.form)
      let info = {...this.form}
      // console.log(info)
      this.allMoneynumber  = 0;
      for (const key in info) {
        if (Object.hasOwnProperty.call(info, key)) {
          switch (key) {
            case 'five':
            case 'one_coins':
            case 'one_notes':
            case 'half_coins':
            case 'half_notes':
            case 'fraction':
               this.allMoneynumber = this.allMoneynumber + Number(info[key])
              break;
          }
        }
      }
    },
    // 确定保存
    updatePlaybill(formName,type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.$emit("save-add-edit", this.form, type);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div-content {
  height: 400px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 400px;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 400px;
}

.el-dialog-div /deep/.el-select, .el-select--mini {
  width: 400px;
}

.el-dialog-div /deep/ .el-input, .el-input--mini {
  width: 400px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 400px;
}

.vehicle-select /deep/ .el-input{
  width: 280px;
}
.vehicle-select /deep/ .el-select, .el-select--mini {
  width: 280px;
}
</style>

