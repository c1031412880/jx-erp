<template>
  <div class="table-box">
    <table cellpadding="0" v-loading="loading">
      <template v-for="(t,i) in tableList">
        <div :key="i" style="width:100%;display:table;margin-bottom:30px">
          <tr v-if="t.title">
            <th :colspan="5" class="title">{{t.title}}</th>
          </tr>
          <tr>
            <td v-for="(item,index) in headList1" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td>总：{{t.sell_card_total}}</td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.sell_card_a}}</div>
              <el-input v-else v-model="t.sell_card_a" @change="changeSellCard()" placeholder="请输入" style="width:80%"></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.sell_card_b}}</div>
              <el-input v-model="t.sell_card_b" @change="changeSellCard()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.sell_card_c}}</div>
              <el-input v-model="t.sell_card_c" @change="changeSellCard()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox">{{t.sell_card_fee}}</div>
              <!-- <el-input v-model="t.sell_card_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList2" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td></td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.recharge_count}}</div>
              <el-input v-model="t.recharge_count" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td></td>
            <td></td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.recharge_fee}}</div>
              <el-input v-model="t.recharge_fee" @change="getPayableRechargeFee()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList3" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td>总：{{t.register_count}}</td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.register_city_count}}</div>
              <el-input v-model="t.register_city_count" @change="changeRegisterCount()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.register_bus_count}}</div>
              <el-input v-model="t.register_bus_count" @change="changeRegisterCount()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td></td>
            <td>
              <div class="showBox">{{t.register_fee}}</div>
              <!-- <el-input v-model="t.register_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList4" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td>总：{{t.refund_card_total}}</td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.refund_card_a}}</div>
              <el-input v-model="t.refund_card_a" @change="changeRefundCard()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.refund_card_b}}</div>
              <el-input v-model="t.refund_card_b" @change="changeRefundCard()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.refund_card_c}}</div>
              <el-input v-model="t.refund_card_c" @change="changeRefundCard()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox">{{t.refund_card_fee}}</div>
              <!-- <el-input v-model="t.refund_card_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList5" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td></td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.refund_fee_a}}</div>
              <el-input v-model="t.refund_fee_a" @change="changeRefoundFee()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.refund_fee_b}}</div>
              <el-input v-model="t.refund_fee_b" @change="changeRefoundFee()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.refund_fee_c}}</div>
              <el-input v-model="t.refund_fee_c" @change="changeRefoundFee()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox">{{t.refund_fee}}</div>
              <!-- <el-input v-model="t.refund_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList6" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td>总：{{t.logoff_count}}</td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.logoff_city_count}}</div>
              <el-input v-model="t.logoff_city_count" @change="changeLogoffCount()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.logoff_bus_count}}</div>
              <el-input v-model="t.logoff_bus_count" @change="changeLogoffCount()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td></td>
            <td>
              <div class="showBox">{{t.logoff_fee}}</div>
              <!-- <el-input v-model="t.logoff_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList7" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td>
              <div class="showBox">{{t.payable_sell_fee}}</div>
              <!-- <el-input v-model="t.payable_sell_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
            <td>
              <div class="showBox">{{t.payable_recharge_fee}}</div>
              <!-- <el-input v-model="t.payable_recharge_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.exchange_fee}}</div>
              <el-input v-model="t.exchange_fee" @change="getDifferenceFee()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox" v-if="tableBoxType == 'detail'">{{t.payable_fee}}</div>
              <el-input v-model="t.payable_fee" @change="getDifferenceFee()" placeholder="请输入" style="width:80%" v-else></el-input>
            </td>
            <td>
              <div class="showBox">{{t.difference_fee}}</div>
              <!-- <el-input v-model="t.difference_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
          </tr>
          <tr class="separate"></tr>

          <tr>
            <td v-for="(item,index) in headList8" :key="index" class="header">
              {{item}}
            </td>
          </tr>
          <tr class="content">
            <td>
              <div class="showBox">{{t.receipt_fee}}</div>
              <!-- <el-input v-model="t.receipt_fee" placeholder="请输入" style="width:80%" disabled></el-input> -->
            </td>
            <td>
              <span style="color:red">←请与你的收据总金额对上</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="separate"></tr>

          <tr v-if="t.title !== '汇总表'">
            <td :colspan="5" class="header">备注</td>
          </tr>
          <tr v-if="t.title !== '汇总表'">
            <td :colspan="5"  class="content">
              <el-input v-model="t.remark" type="textarea" placeholder="请输入"></el-input>
            </td>
          </tr>
        </div>
      </template>
    </table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tableBoxType: {
      type: String,
      default: 'detail'
    }
  },
  components: {
  },
  data() {
    return {
      headList1: ['IC卡售卡','A卡(200元/张)','B卡(100元/张)','C卡(300元/张)','合计金额(元)'],
      headList2: ['充值','数量(张)','','','合计金额(元)'],
      headList3: ['注册开通','市民卡(100元/张)','公交卡(300元/张)','','合计金额(元)'],
      headList4: ['IC卡退卡','A卡(张)','B卡(张)','C卡(张)','合计金额(元)'],
      headList5: ['退余额','A卡(元)','B卡(元)','C卡(元)','合计金额(元)'],
      headList6: ['注销','市民卡(张)','公交卡(张)','','合计金额(元)'],
      headList7: ['应缴售卡金额(元)','应缴充值(元)','换卡金额(元)','实缴金额(元)','差额(元)'],
      headList8: ['收据总金额(元)','','','',''],

      form: {
        id: 0,
        sell_card_total: '',
        sell_card_a: '',
        sell_card_b: '',
        sell_card_c: '',
        sell_card_fee: '',
        recharge_count: '',
        recharge_fee: '',
        register_count: '',
        register_city_count: '',
        register_bus_count: '',
        register_fee: '',
        refund_card_total: '',
        refund_card_a: '',
        refund_card_b: '',
        refund_card_c: '',
        refund_card_fee: '',
        refund_fee_a: '',
        refund_fee_b: '',
        refund_fee_c: '',
        refund_fee: '',
        logoff_city_count: '',
        logoff_bus_count: '',
        logoff_count: '',
        logoff_fee: '',
        payable_sell_fee: '',
        payable_recharge_fee: '',
        exchange_fee: '',
        payable_fee: '',
        difference_fee: '',
        receipt_fee: '',
        remark: '',
        title: ''
      },

      tableList: []
    };
  },
  created() {
    this.tableList = [this.form]
  },
  methods: {
    setData(list) {
      this.tableList = list
      // for (let index = 0; index < list.length; index++) {
      //   for (const key in this.form) {
      //     if (Object.hasOwnProperty.call(list[index], key)) {
      //       this.form[key] = list[index][key]
      //     }
      //   }
      //   this.tableList.push(this.form)
      // }
    },
    // 计算销售卡数量和合计金额
    changeSellCard() {
      this.tableList[0].sell_card_total = Number(this.tableList[0].sell_card_a) +
                                  Number(this.tableList[0].sell_card_b) +
                                  Number(this.tableList[0].sell_card_c)

      this.tableList[0].sell_card_fee = Number(this.tableList[0].sell_card_a) * 200 +
                                  Number(this.tableList[0].sell_card_b) * 100 +
                                  Number(this.tableList[0].sell_card_c) * 300         
                                  
      this.getPayableSellFee()

      this.getReceiptFee()
    },

    // 计算注册开通 数量和合计金额
    changeRegisterCount() {
      this.tableList[0].register_count = Number(this.tableList[0].register_city_count) +
                                  Number(this.tableList[0].register_bus_count)

      this.tableList[0].register_fee = Number(this.tableList[0].register_city_count) * 100 +
                                Number(this.tableList[0].register_bus_count) * 300
      this.getPayableSellFee()
      this.getReceiptFee()
    },

    // 计算退卡数量和合计金额
    changeRefundCard() {
      this.tableList[0].refund_card_total = Number(this.tableList[0].refund_card_a) +
                                  Number(this.tableList[0].refund_card_b) +
                                  Number(this.tableList[0].refund_card_c)

      this.tableList[0].refund_card_fee = -(Number(this.tableList[0].refund_card_a) * 200 +
                                  Number(this.tableList[0].refund_card_b) * 100 +
                                  Number(this.tableList[0].refund_card_c) * 300)                           
      this.getPayableSellFee()
    },

    // 计算余额合计金额
    changeRefoundFee() {
      this.tableList[0].refund_fee = -(Number(this.tableList[0].refund_fee_a) +
                              Number(this.tableList[0].refund_fee_b) +
                              Number(this.tableList[0].refund_fee_c))
      
      this.getPayableRechargeFee()
    },

    // 计算注销 数量和合计金额
    changeLogoffCount() {
      this.tableList[0].logoff_count = Number(this.tableList[0].logoff_city_count) +
                                  Number(this.tableList[0].logoff_bus_count)

      this.tableList[0].logoff_fee = -(Number(this.tableList[0].logoff_city_count) * 100 +
                                Number(this.tableList[0].logoff_bus_count) * 300)
      this.getPayableSellFee()
    },

    // 获取应缴售卡金额   =IC卡售卡金额+注册开通金额-IC卡退卡金额-注销金额
    getPayableSellFee() {
      this.tableList[0].payable_sell_fee = Number(this.tableList[0].sell_card_fee) +
                                    Number(this.tableList[0].register_fee) +
                                    Number(this.tableList[0].refund_card_fee) +
                                    Number(this.tableList[0].logoff_fee) 
        
      this.getDifferenceFee()
    },
    // 获取应缴充值   =充值金额-退余额
    getPayableRechargeFee() {
      this.tableList[0].payable_recharge_fee = Number(this.tableList[0].recharge_fee) + Number(this.tableList[0].refund_fee)
      this.getDifferenceFee()
    },
    // 获取差额 = IC卡售卡金额+充值金额+注册开通金额+换卡金额-IC卡退卡金额-退余额-注销金额-实缴金额
              //  = (IC卡售卡金额+注册开通金额-IC卡退卡金额-注销金额) + (充值金额-退余额) + 换卡金额 - 实缴金额
              //  =  应缴售卡金额 + 应缴充值 + 换卡金额 - 实缴金额
    getDifferenceFee() {
      this.tableList[0].difference_fee = Math.abs(
                                  Number(this.tableList[0].payable_sell_fee) +
                                  Number(this.tableList[0].payable_recharge_fee) +
                                  Number(this.tableList[0].exchange_fee) -
                                  Number(this.tableList[0].payable_fee)
                                )
    },
    // 获取应缴售卡金额  = IC卡售卡金额+注册开通金额
    getReceiptFee() {
      this.tableList[0].receipt_fee = Number(this.tableList[0].sell_card_fee) + Number(this.tableList[0].register_fee)
    },

      // 清空
    claerForm() {
      Object.assign(this.$data, this.$options.data());
      this.tableList = [this.form]
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-box {
  width: 100%;
  table,tr {
    width: 100%;
  }
  .title { 
    background-color: #caf982;
    border: 1px solid #333;
    min-height: 45px;
    line-height: 45px;
    text-align: center;
    font-weight: bold;
  }
  .header {
    background-color: #d0e7ff;
    border: 1px solid #333;
    width: 20%;
    min-height: 25px;
    line-height: 25px;
    text-align: center;
  }
  .content {
    td { 
      background-color: #fff;
      border: 1px solid #333;
      padding: 5px;
      min-height: 30px;
      line-height: 30px;
      text-align: center;
    }
  }

  .separate {
    height: 10px;
    border: 1px solid;
  }

  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .showBox {
    text-align: center;
    min-height: 18px
  }
}
</style>
