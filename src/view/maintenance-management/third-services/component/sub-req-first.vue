<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-select
            v-model="form.date_type"
            placeholder="日期状态"
            style="width: 100px"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="维修内容">
          <el-input
            v-model="form.content"
             @keyup.enter.native="onSubmit"
            placeholder="请输入维修项目"
            clearable
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="form.car_type" style="width: 100px">
            <el-option
              v-for="(item, index) in carOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="车辆">
          <!-- <get-vehicle-select-tree
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
            ref="vehicleTree"
            width="360"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-carcode-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="三包厂家：">
          <get-select-dictionaries
            ref="vender_id"
            v-model="form.vender_id"
            :classKey="'三包厂家'"
            :placeholder="'请选择'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus"
            >添加</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item> -->
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="deleteSelect()" type="primary">批量删除</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="text" @click="onBtn('screen')">高级筛选</el-button>
        </el-form-item> -->
        <div style="float: right; height: 20px; display: flex">
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
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import { getDate } from "@/utils/index";
export default {
  components: {
    getDepartmentSelect,
    getPositionList,
    getVehicleSelectTree,
    getVehicleSelectDialog,
    getSelectDictionaries,
    getCarcodeSelectTree,
  },
  data() {
    return {
      carOptions: [
        { value: "1", label: "车牌号" },
        { value: "2", label: "自编号" },
      ],
      options: [
        { value: "1", label: "报修日期" },
        { value: "2", label: "出厂日期" },
      ],
      date: [],
      form: {
        maint_dept: "",
        vehicle_ids: "",
        priority: "",
        date_type: "1",
        car_type: "1",
        content: "",
        vender_id: "",
        state: "",
        state_child: "",
        date_start: "",
        date_end: "",
      },
    };
  },
  mounted() {
    this.onSetTime();
    let orderId = this.$route.query.orderId;
    if (orderId) {
      this.form.content = orderId;
    }
  },
  methods: {
    onSetTime(type = "lastOneWeek") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.date_start = this.date[0];
      this.form.date_end = this.date[1];
      console.log(this.date);
    },
    handleSelect(key, keyPath) {
      this.form.state_child = "";
      console.log(key, keyPath);
      if (keyPath[1] > 3) {
        this.form.state = 2;
        this.form.state_child = key;
      } else {
        this.form.state = key - 1;
      }
      // this.form.state_child = keyPath
      this.onSubmit();
    },
    deleteSelect() {
      this.$emit("delete-select");
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.date_start = this.date[0];
        this.form.date_end = `${this.date[1]} 23:59:59`;
      } else {
        this.form.date_start = "";
        this.form.date_end = "";
      }
      console.log(this.form.date_end);
    },
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
      }
    },

    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      // if(info.i_department_base.length == 0) {
      //   delete info.i_department_base
      // }
      // if(this.form.i_position_id === 0) {
      //   info.i_position_id = 0
      // }
      // console.log(info)
      // return
      this.$emit("on-ok", info);
    },
    refreshTableList() {
      this.Reset();
    },
    // 重置
    Reset() {
      (this.form.maint_dept = ""),
        (this.form.vehicle_ids = ""),
        (this.form.priority = ""),
        (this.form.date_type = "1"),
        (this.form.car_type = "1"),
        (this.form.content = ""),
        (this.form.vender_id = ""),
        // (this.form.date_start = ""),
        // (this.form.date_end = ""),
        this.onSetTime();
        (this.date = []),
        (this.form.hour_min = "");
        (this.form.hour_max = "");
      // 清空部门选中

      // this.$refs.vehicleTree.onClear();
      this.onSubmit();
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
