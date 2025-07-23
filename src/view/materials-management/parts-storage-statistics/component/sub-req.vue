<template>
  <el-form :inline="true" size="mini">
    <el-form-item>
      <el-select style="width: 120px" v-model="type" @change="selectedTime" placeholder="请选择">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-if="type === 1"
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="selectedTime">
      </el-date-picker>    
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-if="type === 2"
        value-format="yyyy-MM-dd"
        v-model="month"
        type="month"
        placeholder="选择月"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-if="type === 3"
        v-model="year"
        type="year"
        value-format="yyyy-MM-dd"
        placeholder="选择年"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="仓库:" prop="house_id">
      <el-select
        v-model="form.house_id"
        filterable
        clearable
        placeholder="请选择">
        <el-option
          v-for="item in houseOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="配件:">
      <get-material-select
      v-model="form.material_id"
      ></get-material-select>
    </el-form-item>
    <el-form-item  label="供应商:">
      <el-select filterable clearable v-model="form.provider_id">
        <el-option
          v-for="(item, index) in supplier"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" v-if="$isPowerShow('search')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-download" @click="onBtn('export')" v-if="$isPowerShow('export')">导出</el-button>
      </el-form-item>
      <div style="float: right; height: 47px; display: flex;align-items: center;">
        <i
          class="el-icon-refresh"
          style="margin-right: 15px; cursor: pointer"
          @click="refreshTableList()"
        ></i>
        <i
          class="el-icon-s-tools"
          style="cursor: pointer"
          @click="openSettingPage()"
        ></i>
      </div>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getMaterialSelect from "./get-material-select";
import {getDate} from '@/utils/index'
export default {
  components: {
    getMaterialSelect
  },
  data() {
    return {
      type: 2,
      date: '',
      month: '',
      year: '',
      form: {
        start_date:'',
        end_date: '',
        house_id: '',
        material_id: '',
        provider_id: '',
      },
      supplier: [],
      houseOptions: [],
      typeOptions: [
        {value: 1, label: '按日查询'},
        {value: 2, label: '按月查询'},
        {value: 3, label: '按年查询'},
      ]
    }
  },
  mounted() {
    this.setDate()
    this.getWarehouse()
    this.getProviderList()
    this.$nextTick(() => {
      this.onSubmit()
    })
  },
  methods: {
    //获取仓库
    getWarehouse() {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.houseOptions = req.context;
          // if (req.context.length > 0) {
          //   this.form.house_id = req.context[0].id;
          // }
        }
      });
    },
    getProviderList() {
      this.$client.GetProviderPage({usable:1})
        .then(req => {
          if (req.head.result === '200') {
            this.supplier = req.context.list
          }else{
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
        }).catch(err => {})
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 初始化时间
    setDate() {
      let timeObj = getDate('thisMonth')
      // this.date = [timeObj.startTime, timeObj.endTime]
      this.date = Object.values(timeObj)
      this.month = timeObj.startTime
      this.year = timeObj.startTime.slice(0, 4) + '-01-01'
      this.form.start_date = timeObj.startTime
      this.form.end_date = timeObj.endTime + ' 23:59:59'
    },
    // 切换时间
    selectedTime(val) {
      switch (this.type) {
        case 1:
          if(!this.date) {
            this.form.start_date = ''
            this.form.end_date = ''
            break;
          }
          this.form.start_date = this.date[0]
          this.form.end_date = this.date[1] + ' 23:59:59'
          break;
        case 2:
          if(!this.month) {
            this.form.start_date = ''
            this.form.end_date = ''
            break;
          }
          this.form.start_date = this.month
          let arr = this.month.split('-')
          let maxDate = new Date(arr[0], arr[1], 0).getDate()
          this.form.end_date = this.month.slice(0, 8) + maxDate + ' 23:59:59'
          break;
        case 3:
          if(!this.year) {
            this.form.start_date = ''
            this.form.end_date = ''
            break;
          }
          this.form.start_date = this.year
          this.form.end_date = this.year.slice(0, 4) + '-12-31 23:59:59'
          break;   
        default:
          break;
      }
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit()
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data()); 
      this.setDate()
      this.getProviderList()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);

    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>