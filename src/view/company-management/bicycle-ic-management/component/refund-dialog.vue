<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="950px"
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="mini">
        <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
          <div class="card-header">卡信息</div>
          <div class="show-flex-box-r">
            <el-form-item label="卡号:" prop="card_number">
              <el-input v-model="form.card_number" placeholder="卡号" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="流水号:" prop="serial_number">
              <el-input v-model="form.serial_number" placeholder="流水号" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="卡类型:" prop="card_type">
              <el-input v-model="cardTypeMap[form.card_type]" placeholder="卡类型" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="售卡时间:" prop="sale_time">
              <el-input v-model="form.sale_time" placeholder="售卡时间" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="姓名:" prop="customer_name">
              <el-input v-model="form.customer_name" placeholder="姓名" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="证件号:" prop="id_card">
              <el-input v-model="form.id_card" placeholder="证件号" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="单位:" prop="work_unit">
              <el-input v-model="form.work_unit" placeholder="单位" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="电话:" prop="phone">
              <el-input v-model="form.phone" placeholder="电话" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="通讯地址:" prop="address">
              <el-input v-model="form.address" placeholder="通讯地址" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="卡内余额:" prop="card_balance">
              <el-input v-model="form.card_balance" placeholder="卡内余额" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
          <div class="card-header">退款明细</div>
          <div class="show-flex-box-r">
            <el-form-item label="退还保证金:" prop="deposit">
              <el-input v-model="form.deposit" placeholder="退还保证金" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="注销类型:" prop="cancellation_type">
              <el-select v-model="form.cancellation_type" placeholder="请选择" :disabled="curSelecedType == 'detail'">
                <el-option
                  v-for="item in cancellationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="卡片退还金额:" prop="return_card_money">
              <el-input v-model="form.return_card_money" placeholder="卡片退还金额" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="手续费:" prop="commission">
              <el-input v-model="form.commission" placeholder="" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="退款类型" prop="return_type">
              <el-select v-model="form.return_type" placeholder="全部" :disabled="curSelecedType == 'detail'">
                <el-option label="网银退款" :value="11"></el-option>
                <el-option label="现金退款" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实退金额:" prop="return_money">
              <el-input v-model="form.return_money" placeholder="实退金额" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="退卡时间:" prop="return_time" v-if="curSelecedType === 'detail'">
              <el-input v-model="form.return_time" placeholder="退卡时间" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-card>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-popconfirm
        @confirm="icRefund('form')"
        title="确认退卡?">
        <el-button type="primary" slot="reference" :disabled="curSelecedType == 'detail'">退卡</el-button>
      </el-popconfirm>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { context } from 'pizzicato';

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
      form: {
        card_number: '',
        serial_number:'',
        transaction_id: '',
        card_type: '',
        sale_time: '',
        return_time: '',
        customer_name: '',
        id_card: '',
        work_unit: '',
        phone: '',
        address: '',
        card_balance: '',
        is_refund: false,
        deposit: '',
        cancellation_type: '',
        return_card_money: '',
        commission: '',
        return_money: '',
        return_type: '',
      },
      cardTypeMap: {
        1: '市民卡',
        2: '团体卡',
        3: '本地卡',
        4: '临时卡',
        5: '公交卡',
      },
      cancellationOptions: [
        { value: 1, label: '无卡注销' }, // 确保 value 是整数
        { value: 2, label: '其他' },
        // 可以添加其他选项
      ],
      rules: {
        return_type: [
          { required: true, message: "请选择退款类型", trigger: "change" },
        ],
      }
    };
  },
  watch: {
    dialogBool(newVal) {
      if (newVal) {
        this.initializeRefundFields();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    icRefund(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // 发起退款
          this.sendRefundRequest();
        } else {
          return false;
        }
      });
    },
    sendRefundRequest() {
      // 构建请求体
      const requestBody = {
        context: {
          card_type: this.form.card_type,
          CARD_ID: this.form.card_number,
          cancle_type: this.form.cancellation_type,
          RETURN_CAUSE: this.form.return_type, // 根据实际情况设置
          is_return_deposit: this.form.deposit > 0,
          return_card_money: this.form.return_card_money,
          commission: this.form.commission,
          return_money: this.form.return_money,
          serial_number: this.form.serial_number,
        }
      };
      // 调用退卡接口
      this.$client.BicycleIcReturnBicycleManage(requestBody)
        .then((res) => {
          if (res.head.result == "200") {
            // 更新卡片状态
            // this.updateCardStatus(this.form.card_number, '退卡');
            this.$parent.loadData()
            // 关闭对话框
            this.dialogClose();
            // 提示用户操作成功
            this.$message({
              showClose: true,
              message: '退卡成功',
              type: 'success',
            });
          } else {
            // 提示用户操作失败
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error',
            });
          }
        })
        .catch((err) => {
          // 提示用户操作失败
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error',
          });
        });
    },
    updateCardStatus(cardNumber, status) {
      // 找到对应卡片并更新状态
      const cardIndex = this.$parent.data.findIndex(card => card.CardNumber === cardNumber);
      if (cardIndex !== -1) {
        this.$parent.data[cardIndex].CardStatus = status;
        this.$parent.$forceUpdate(); // 强制更新表格
      }
    },
    initializeRefundFields() {
      const cardBalance = parseFloat(this.form.card_balance);
      const deposit = parseFloat(this.form.deposit);
      this.form.return_card_money = cardBalance > 0 ? cardBalance.toFixed(2) : '0';
      this.form.return_money = (cardBalance + deposit).toFixed(2);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>.el-dialog-div{
  height: 600px;
  overflow-y: auto;
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

.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>

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

.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
