<template>
  <div class="tyre-used-info">
    <el-form v-model="form" :inline="true" size="mini">
      <el-form-item label="安装位置:">
        <get-select-dictionaries
          v-model="form.install_positions"
          :classKey="'轮胎安装位置'"
          :width="'100%'"
          :placeholder="'请选择安装位置'"
          :isMultiple="true"
          :collapseTags="true"
        ></get-select-dictionaries>
      </el-form-item>
      <el-form-item  label="轮胎编号:">
        <get-tyre-code
          v-model="form.tyre_code"
        ></get-tyre-code>
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.date_type"  placeholder="日期状态" style="width:100px">
          <el-option
            v-for="(item,index) in dateOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="请选择日期范围"
          end-placeholder="请选择日期范围"
          @change="selectedTime"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item  label="供应商:">
        <el-select v-model="form.supplier_id" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in gongysOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="轮胎品牌:">
        <el-input v-model="form.brand" placeholder="轮胎品牌" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button 
          @click="loadData"
          type="primary" 
          icon="el-icon-search" 
          >查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="resetForm()"
          type="" 
          icon="el-icon-refresh-right"
          >重置</el-button>
      </el-form-item>
    </el-form>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :isShowSummary="true"
      :omitColumnIndex="[1,2,3,4,6,7,8,9,11,12,13]"
      :tableHeaderList="canRendererTableHeader"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot="position_name" slot-scope="scope">
        <span>{{ scope.data.tyre_info.position_name ? scope.data.tyre_info.position_name : ''}}</span>
      </template>
      <template slot="total_miles" slot-scope="scope">
        <span>{{ scope.data.tyre_info.total_miles ? scope.data.tyre_info.total_miles : ''}}</span>
      </template>
      <template slot="code" slot-scope="scope">
        <span>{{ scope.data.tyre_info.code ? scope.data.tyre_info.code : ''}}</span>
      </template>
      <template slot="tire_code" slot-scope="scope">
        <span>{{ scope.data.tyre_info.tire_code ? scope.data.tyre_info.tire_code: ''}}</span>
      </template>
      <template slot="tire_name" slot-scope="scope">
        <span>{{ scope.data.tyre_info.tire_name ? scope.data.tyre_info.tire_name: ''}}</span>
      </template>
      <template slot="specification" slot-scope="scope">
        <span>{{ scope.data.tyre_info.specification ? scope.data.tyre_info.specification: ''}}</span>
      </template>
      <template slot="price" slot-scope="scope">
        <span>{{ scope.data.tyre_info.price ? scope.data.tyre_info.price: ''}}</span>
      </template>
      <template slot="provider_name" slot-scope="scope">
        <span>{{ scope.data.tyre_info.provider_name ? scope.data.tyre_info.provider_name: ''}}</span>
      </template>
      <template slot="repair_code" slot-scope="scope">
        <span>{{ scope.data.tyre_info.repair_code ? scope.data.tyre_info.repair_code: ''}}</span>
      </template>
      <template slot="remark" slot-scope="scope">
        <span>{{ scope.data.tyre_info.remark ? scope.data.tyre_info.remark: ''}}</span>
      </template>
    </tr-table>
  </div>
</template>

<script>
import { getDate } from "@/utils/index";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code"
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
export default {
  components: {
    getTyreCode, 
    getSelectDictionaries
  },
  data() {
    return {
      dateOptions: [
        {value: 1, label: '安装日期',},
        {value: 2, label: '拆卸日期',},
      ],
      gongysOptions: [],
      date: [],
      form: {
        vehicle_id: '',
        install_positions: [],
        tyre_code: '',
        brand: '',
        date_type: 1,
        start_date: '',
        end_date: '',
        // supplier_id: '',
      },
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1,
      backFixedNum: 1,
      canRendererTableHeader: [
        {
          id: 1,
          label: "安装日期",
          prop: "install_date",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "安装位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "拆卸日期",
          prop: "uninstall_date",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "拆卸原因",
          prop: "uninstall_reason",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "随车里程(km)",
          prop: "total_miles",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "轮胎编号",
          prop: "code",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "物料编号",
          prop: "tire_code",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "物料名称",
          prop: "tire_name",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "规格型号",
          prop: "specification",
          width: "160",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "单价(元)",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "供应商",
          prop: "provider_name",
          width: "160",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "关联维修单号",
          prop: "repair_code",
          width: "160",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "160",
          align: "center",
          signIndex: 12,
        }
      ],
    };
  },
  mounted() {
    
  },
  methods: {
    onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
    },
    //供应商
    getGinsang(){
        this.$client.GetProviderPage().then(req => {
            if (req.head.result === '200') {
           this.gongysOptions = req.context.list
          }
          else{
            this.$message({type: 'error', message: '获取失败'})
          }
        })  
    },
    // 关闭清空数据
    resetData() {
      Object.assign(this.$data.form, this.$options.data().form);
      this.data = []
    },
    // 回显
    setData(info) {
      this.form.vehicle_id = info.vehicle_id;
      this.onSetTime()
      this.getGinsang()
    },
    // 查询
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.GetListTyreUseRecord(params)
        .then((res) => {
          this.loading = false;
          if (res.head.result == "200") {
            this.data = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 重置
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.date = []
      this.loadData()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.tyre-used-info {
}
</style>