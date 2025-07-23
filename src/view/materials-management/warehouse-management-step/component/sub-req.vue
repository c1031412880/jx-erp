<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="出库日期:">
          <el-date-picker
            size="mini"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库单号:">
          <el-input
            clearable
            @keyup.enter.native="onSubmit"
            v-model="form.leave_num"
            placeholder="请输入入库单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="出库方式:">
          <el-select placeholder="全部" v-model="form.leave_type" clearable>
            <el-option
              v-for="item in Modeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联单号:">
          <el-input
            @keyup.enter.native="onSubmit"
            v-model="form.relate_num"
            placeholder="请输入关联单号"
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item>
          <el-checkbox v-model="checked" @change="clearvehicle_ids">外部车辆</el-checkbox>
        </el-form-item>
        <el-form-item label="车辆" v-show="checked == true">
          <el-input v-model="form.lp_num"></el-input>
        </el-form-item>
        <!-- <el-form-item label="车辆：" v-else>
          <get-vehicle-select-tree
            :width="300"
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
        </el-form-item> -->
        <el-form-item  v-show="checked == false">
          <el-select v-model="form.car_type" style="width: 100px">
            <el-option
              v-for="(item, index) in carOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-show="checked == false">
          <get-vehicle-select-tree
            v-if="form.car_type == 1"
            ref="vehicleTree"
            width="360"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
          <get-carcode-select-tree
            v-else
            ref="vehicleTree1"
            width="360"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="物料编号:">
          <el-input
            @keyup.enter.native="onSubmit"
            clearable
            v-model="form.material_code"
            placeholder="请输入物料编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="物料名称:">
          <el-input
            @keyup.enter.native="onSubmit"
            clearable
            v-model="form.material_name"
            placeholder="请输入物料名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input
            @keyup.enter.native="onSubmit"
            clearable
            v-model="form.specification"
            placeholder="请输入规格型号"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select placeholder="全部" v-model="form.state" style="width:150px" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary"  @click="deleteSelect()">删除</el-button>
        </el-form-item> -->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onAdd()" v-if="$isPowerShow('add')" type="primary">添加</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-popconfirm @confirm="deleteSelect()" v-if="$isPowerShow('del')" title="确定删除此条记录吗？">
            <el-button slot="reference" type="primary" size="mini"
              >删除</el-button
            >
          </el-popconfirm>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button @click="isCheck('2')" type="primary">审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('3')" type="primary">反审核</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="$isPowerShow('export')"  @click="onBtn('export')" type="primary">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$isPowerShow('pickingSearch')"  @click="enterPickingSearch()" type="primary">领料单查询</el-button>
        </el-form-item>
        <!-- <el-dropdown>
          <el-button size="mini" class="btn">
            更多操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="text">打印入库单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <div style="float: right; height: 47px; display: flex">
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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
export default {
  components: {
    getVehicleSelectTree,
    getCarcodeSelectTree,
  },
  data() {
    return {
      wuziOptions: [],
      date: [],
      checked: false,
       carOptions: [
        { value: "1", label: "车牌号" },
        { value: "2", label: "自编号" },
      ],
      form: {
        car_type: "1",
        leave_num: "",
        enter_type: "",
        relate_num: "",
        material_code: "",
        material_name: "",
        specification: "",
        state: "",
        leave_date_start: "",
        leave_date_end: "",
        vehicle_ids:[],
      },
      tyreModelOptions: [],
      Modeoptions: [
        { value: "", label: "全部" },
        { value: "YBCK", label: "一般出库" },
        { value: "WXCK", label: "维修出库" },
        { value: "DBCK", label: "调拨出库" },
        { value: "PKCK", label: "盘亏出库" },
        { value: "HCCK", label: "红冲出库" },
      ],
      stateOptions: [
        { value: "0", label: "全部" },
        { value: "1", label: "未审核" },
        { value: "2", label: "已审核" },
        // { value: "3", label: "取消审核" },
        {value: '3',label: '已撤销'}, 
      ],
    };
  },
  activated() {
    if(this.$route.params.leave_num) {
      this.form.leave_num = this.$route.params.leave_num
    }
    if(this.$route.params) {
      this.form.leave_date_start = this.$route.params.leave_date_start
      this.form.leave_date_end = this.$route.params.leave_date_end
      this.date = []
      if (this.$route.params.leave_date_start) {
        this.date = [this.form.leave_date_start,this.form.leave_date_end.slice(0,10)]
      }
    }
    this.onSubmit()
  },
  mounted() {
    this.getwuzi();
    if(this.$route.params.leave_num) {
      this.form.leave_num = this.$route.params.leave_num
    }
    if(this.$route.params) {
      this.form.leave_date_start = this.$route.params.leave_date_start
      this.form.leave_date_end = this.$route.params.leave_date_end
      if (this.$route.params.leave_date_start) {
        this.date = [this.form.leave_date_start,this.form.leave_date_end.slice(0,10)]
      }
    }else{
      this.onSetTime()
    }
    this.onSubmit()
  },
  methods: {
    clearvehicle_ids(){``
      if(this.form.car_type==1){
        this.$refs.vehicleTree.onClear()
        }
      else{
        this.$refs.vehicleTree1.onClear()
      }
    },
    changeDate(date){
       if(date==null||date==[]){
      this.form.leave_date_start = ''
      this.form.leave_date_end = ''
       }else{
      this.form.leave_date_start = date[0]
      this.form.leave_date_end = `${date[1]} 23:59:59`
       }
    },
     onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate('lastOneWeek')
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.leave_date_start = this.date[0]
      this.form.leave_date_end = this.date[1]
      console.log(this.date)
    },
    getwuzi() {
      this.$client.getMaterialPage({usable:1}).then((req) => {
        if (req.head.result === "200") {
          this.wuziOptions = req.context.list;
          // req.context.list.forEach(element => {
          //   this.wuziOptions.forEach(val => {
          //     this.$set(val,"groupgo", val.name+val.specification+'('+val.code+')')
          //   });

          // });
        } else {
          // this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    // 查询
    onSubmit() {
      // if(this.date!=null){
      //   if (this.date.length > 1) {
      //     this.form.leave_date_start = this.date[0];
      //     this.form.leave_date_end = this.date[1];
      //   }
      // }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      
      this.onSetTime()
      // this.form.leave_date_start = ''
      // this.form.leave_date_end = ''
      this.form.vehicle_id = "";
      this.form.tyre_model_id = "";
      // this.form.start_date = "";
      // this.form.end_date = "";
      // this.date = [];
      this.form.leave_type = "";
      this.form.leave_num = "";
      this.form.enter_type = "";
      this.form.relate_num = "";
      this.form.material_code = "";
      this.form.material_name = "";
      this.form.specification = "";
      this.form.state = "";
        this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    onAdd() {
      this.$emit("on-add", "add");
    },
    deleteSelect() {
      this.$emit("delete-select");
    },
    isCheck(type) {
      this.$emit("is-check", type);
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    //查询领料单 
    enterPickingSearch() {
      this.$router.push({
        name:'material-query',
        params:{
          activeName:'1'
        }
      })
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.c_name = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
&.btn {
  color: #999;
}

.el-dropdown-menu {
  width: 100px;
  padding: 0 5px;

  .text {
    font-size: 10px;
    text-align: center;
    padding: 0;
  }
}
</style>
