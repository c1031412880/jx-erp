<template>
  <div class="accident-cost" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="140px"
    >
      <div v-if="curChangeType != 'add'">
        <div class="show-flex-box-r" style="align-items: center;">
          <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
          <p style="width:100px;margin-left:15px;color:#409EFF;font-size:16px;font-weight:bold">费用详情</p>
          <el-button size="mini" type="text" style="margin:0 20px;" @click="outCount">系统自动计算<i class="el-icon-refresh el-icon--right"></i></el-button>
          <span style="font-size:12px; color:#909399">说明：事故净损失=医疗费+误工费+护理费+伙食费+交通费+实际维修费用+其他费用-保险赔付金额-个人赔付金额</span>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="预估费用(元):" prop="n_fee">
            <el-input
              placeholder="请输入预估费用"
              v-model="formData.n_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_fee = $event.target.value"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="医疗费用(元):" prop="n_medical_fee">
            <el-input
              placeholder="请输入医疗费用"
              v-model="formData.n_medical_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_medical_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="误工费用(元):" prop="n_missed_fee">
            <el-input
              placeholder="请输入误工费用"
              v-model="formData.n_missed_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_missed_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="护理费用(元):" prop="n_nursing_fee">
            <el-input
              placeholder="请输入护理费用"
              v-model="formData.n_nursing_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_nursing_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="伙食费用(元):" prop="n_food_fee">
            <el-input
              placeholder="请输入伙食费用"
              v-model="formData.n_food_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_food_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="交通费用(元):" prop="n_traffic_fee">
            <el-input
              placeholder="请输入交通费用"
              v-model="formData.n_traffic_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_traffic_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="车辆损失费(元):" prop="n_actual_fee">
            <el-input
              placeholder="请输入车辆损失费"
              v-model="formData.n_actual_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_actual_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="保险提交金额(元):" prop="n_insurance_post_fee">
            <el-input
              placeholder="请输入保险提交金额"
              v-model="formData.n_insurance_post_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_insurance_post_fee = $event.target.value"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="保险赔付金额(元):" prop="n_insurance_pay_fee">
            <el-input
              placeholder="请输入保险赔付金额"
              v-model="formData.n_insurance_pay_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_insurance_pay_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="他人赔付金额(元):" prop="n_personal_fee">
            <el-input
              placeholder="请输入他人赔付金额"
              v-model="formData.n_personal_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_personal_fee = $event.target.value"
              @input="calculationAmount"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-tooltip class="item" effect="dark" content="额外费用，如有需要请在备注里说明" placement="top">
             <el-form-item label="其他费用(元):" prop="n_other_fee">
              <el-input
                placeholder="请输入其他费用"
                v-model="formData.n_other_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_other_fee = $event.target.value"
                @input="calculationAmount"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-tooltip>
          <el-form-item label="事故净损失(元):" prop="n_loss_fee">
            <el-input
              placeholder="净损失(元)"
              v-model="formData.n_loss_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_loss_fee = $event.target.value"
              disabled
            ></el-input>
          </el-form-item>
            
        </div>
        <div class="show-flex-box-r">
         <el-form-item label="费用备注:" prop="c_fee_remark">
          <el-input
            type="textarea"
            v-model="formData.c_fee_remark"
            :disabled="curChangeType=='detail'"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入费用备注"
          ></el-input>
        </el-form-item>
      </div>
      </div>
      
    </el-form>
  </div>
</template>
<script>
import {getSession, getUser} from '@/utils/auth'
export default {
  components: {},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {
        n_fee: "",
        n_medical_fee: "",
        n_missed_fee: "",
        n_nursing_fee: "",
        n_food_fee: "",
        n_traffic_fee: "",
        n_actual_fee: "",
        n_insurance_post_fee: "",
        n_insurance_pay_fee: "",
        n_personal_fee: "",
        n_loss_fee: 0,
        c_fee_remark: "",
        n_other_fee: ""
      },
      rules: {},
      curInfo: {}, //当前编辑的事故信息
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
      
    },
    // 数据回显
    setData(val) {
      this.curInfo = val;
      console.log(val,'sj')
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
    },
    // 系统自动计算出费用
    outCount() {
      let parmas = {
        id: this.curInfo.i_id,
      }
      this.$client.GetAccidentFeeAccidentManage(parmas)
        .then(res => {
          if (res.head.result == "200") {
            let feeInfo = res.context;
            for (const key in this.formData) {
              if (Object.hasOwnProperty.call(feeInfo, key)) {
                // const element = this.formData[key];
                this.formData[key] = feeInfo[key]
              }
            }
            this.calculationAmount();
            // this.casualtiesRecordList = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    // 计算事故净损失
    calculationAmount() {
      // let info = Object.assign({},this.form)
      let info = {...this.formData}
      // console.log(info)
      this.formData.n_loss_fee  = 0;
      for (const key in info) {
        if (Object.hasOwnProperty.call(info, key)) {
          switch (key) {
            case 'n_medical_fee':
            case 'n_missed_fee':
            case 'n_nursing_fee':
            case 'n_food_fee':
            case 'n_traffic_fee':
            case 'n_actual_fee':
            case 'n_other_fee':
               this.formData.n_loss_fee = Number(this.formData.n_loss_fee) + Number(info[key])
              break;
            case 'n_insurance_pay_fee':
            case 'n_personal_fee':
               this.formData.n_loss_fee = Number(this.formData.n_loss_fee) - Number(info[key])
              break;
          }
        }
      }
      this.formData.n_loss_fee = this.formData.n_loss_fee.toFixed(2)
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-cost /deep/ .el-date-editor {
  width: 112px;
}
.accident-cost /deep/.el-select,.el-select--mini {
  width: 112px;
}
.accident-cost /deep/ .el-input,.el-input--mini{
  width: 112px;
}

.accident-cost /deep/ .el-textarea {
  width: 620px;
}


</style>
