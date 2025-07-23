<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="950px"
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="卡信息" name="first">
          <el-form :model="form" ref="form" label-width="100px" size="mini">
            <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
              <div class="show-flex-box-r">
                <el-form-item label="序列号:" prop="serial_number">
                  <el-input v-model="form.serial_number" placeholder="序列号" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="卡号:" prop="card_number">
                  <el-input v-model="form.card_number" placeholder="卡号" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="售卡时间:" prop="sale_time">
                  <el-input v-model="form.sale_time" placeholder="售卡时间" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="退卡时间:" prop="return_time">
                  <el-input v-model="form.return_time" placeholder="退卡时间" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="顾客姓名:" prop="customer_name">
                  <el-input v-model="form.customer_name" placeholder="顾客姓名" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="form.phone" placeholder="联系电话" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="工作单位:" prop="work_unit">
                  <el-input v-model="form.work_unit" placeholder="工作单位" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="身份证号:" prop="id_card">
                  <el-input v-model="form.id_card" placeholder="身份证号" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="通讯地址:" prop="address">
                  <el-input v-model="form.address" placeholder="通讯地址" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="卡类型:" prop="CARD_TYPE">
                  <el-input v-model="cardTypeMap[form.card_type]" placeholder="卡类型" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="卡余额状态:" prop="balance_status">
                  <el-input v-model="form.balance_status" placeholder="卡余额状态" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="卡状态:" prop="card_status">
                  <el-input v-model="form.card_status" placeholder="卡状态" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="充值总额:" prop="recharge_total">
                  <el-input v-model="form.recharge_total" placeholder="充值总额" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="交易总额:" prop="transaction_total">
                  <el-input v-model="form.transaction_total" placeholder="交易总额" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="卡片余额:" prop="card_balance">
                  <el-input v-model="form.card_balance" placeholder="卡片余额" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
            </el-card>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  data() {
    return {
      activeName: 'first',
      form: {
        serial_number: '',
        card_number: '',
        sale_time: '',
        return_time: '',
        customer_name: '',
        phone: '',
        work_unit: '',
        id_card: '',
        address: '',
        card_type: '',
        balance_status: '',
        card_status: '',
        recharge_total: '',
        transaction_total: '',
        card_balance: '',
      },
      cardTypeMap: {
        1: '市民卡',
        2: '团体卡',
        3: '本地卡',
        4: '临时卡',
        5: '公交卡',
      },
    };
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.form));
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
.el-dialog-div{
  height: 500px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 150px;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 175px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 175px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 175px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 725px;
}
</style>
