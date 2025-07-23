<template>
  <div class="appraisal-standard-setting">
    <el-tabs :tab-position="'left'" style="height: 100%;">
      <el-tab-pane label="线路考核标准">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom: 20px;">
          <div style="width: 6px; height: 20px; background: #409eff"></div>
          <p
            style="
              margin: 0px 30px 0px 15px;
              color: #666666;
              font-size: 17px;
              font-weight: bold;
            "
          >
            线路考核标准
          </p>
          <span style="font-size: 14px; color: #606266;font-weight: 700;">线路：</span>
          <el-input
            placeholder="请输入内容"
            v-model="form.line_name"
            style="width: 180px; margin-right: 10px"
            size="mini"
            clearable>
          </el-input>
          <el-button type="primary" size="mini" @click="onSubmit()">查询</el-button>
          <el-button type="primary" size="mini" @click="addRuleSetting('add')" v-if="$isPowerShow('add')">添加</el-button>
        </div>
        <tr-table
          :selectionShow="false"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
          <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data)"
                title="确定删除此条记录吗？"
                v-if="$isPowerShow('del')">
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="车辆重复维修标准">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom: 20px;">
          <div style="width: 6px; height: 20px; background: #409eff"></div>
          <p
            style="
              margin: 0px 30px 0px 15px;
              color: #666666;
              font-size: 17px;
              font-weight: bold;
            "
          >
            车辆重复维修标准
          </p>
        </div>
        <tr-table
          :selectionShow="false"
          :indexShow="false"
          :data="secondData"
          :loading="loadRepeating"
          :tableHeaderList="tableHeader"
          :isShowBottomOptions="false"
          :TableHeight="127"
          :frontFixedNum="0"
          :backFixedNum="0"
        >
        <template slot-scope="scope" slot="day">
          <el-input v-model="scope.data.day" placeholder="请输入天数" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.day = $event.target.value"></el-input>
        </template>
        </tr-table>
        <div class="show-flex-box-r show-flex-center" style="margin-top: 60px;">
          <el-button type="primary" @click="saveVehicleRepeatStandards()">保 存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import informationDialog from "./component/information-dialog";
export default {
  name: "appraisal-standard-setting",
  components: {
    informationDialog,
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "标准名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "燃料标准值(L/100KM)",
          prop: "fuel_standard_value",
          width: "210",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "材料标准值(元/100KM)",
          prop: "material_standard_value",
          width: "210",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "轮胎标准值(元/100KM)",
          prop: "tyre_standard_value",
          width: "210",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "生效开始日期",
          prop: "start_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "生效结束日期",
          prop: "end_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      form:{
        line_name:""
      },
      tableHeader:[
        {
          id: 1,
          label: "维修种类",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "标准天数",
          prop: "day",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
      ],
      secondData:[
        // {
        //   id: 1,
        //   type:'一般维修',
        //   day: ''
        // },{
        //   id: 2,
        //   type:'外修',
        //   day: ''
        // }
      ],
      loadRepeating:false
    };
  },
  mounted() {
    this.loadData();
    this.reqVehicleRepeatStandards();
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    onSubmit() {
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.GetDataLineStandard(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    addRuleSetting(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加线路考核标准";
      this.informationDialogShow = true;
    },
    // 编辑
    editRowInfo(form) {
      this.curSelecedType = "edit";
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key]; 
          }
        }
        this.$refs.informationDialog.date = [form.start_date, form.end_date]
      },100)
      this.informationDialogTitle = "编辑线路考核标准";
      this.informationDialogShow = true;
    },
    // 编辑、添加标准
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .SetRecordLineStandard(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.DeletePlanLineStandard(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
      })
    },
    // 获取车辆重复维修标准
    reqVehicleRepeatStandards() {
      this.loadRepeating = true;
      this.$client.GetDataVehReaRepair().then((res) => {
        if(res.head.result == '200') {
          this.loadRepeating = false;
          this.secondData = res.context;
        }else{
          this.loadRepeating = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 保存车辆重复维修标准
    saveVehicleRepeatStandards() {
      let parmas = {
        context: this.secondData
      };
      this.$client.SetRecordVehReaRepair(parmas).then((res) => {
        if (res.head.result == "200") {
          this.reqVehicleRepeatStandards();
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },  
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh -70;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.appraisal-standard-setting {
  width: 100%;
  height: 100%;
}
.appraisal-standard-setting /deep/ .is-active {
  background: #ECF5FF;
}
</style>
