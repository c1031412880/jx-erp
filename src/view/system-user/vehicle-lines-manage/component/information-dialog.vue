<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="basiscInfo">
          <el-form
            size="mini"
            :model="form"
            :rules="basicRules"
            ref="form"
            label-width="120px"
          >
            <div class="el-form-row">
              <el-form-item label="线路名称:" prop="name">
                <el-input
                  placeholder="请输入线路名称"
                  v-model="form.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="线路编号:" prop="area">
                <el-input
                  placeholder="请输入线路编号"
                  v-model="form.area"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="所属组织:" prop="orgs">
                <get-department-select
                  ref="baseTree"
                  :funcType="funcType"
                  :isContainEmp="isContainEmp"
                  :isShowCheckbox="false"
                  v-model="department_id"
                  :isExportMultiple="false"
                  @on-change="onSelectChange"
                ></get-department-select>
              </el-form-item>
              <el-form-item label="线路归属:" prop="type">
                <el-select v-model="form.type" placeholder="请选择线路归属">
                  <el-option
                    v-for="item in linesClassifyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="上行时长:" prop="time_up">
                <el-input
                  placeholder="请输入上行时长、单位分钟"
                  v-model="form.time_up"
                ></el-input>
              </el-form-item>
              <el-form-item label="下行时长:" prop="time_down">
                <el-input
                  placeholder="请输入下行时长、单位分钟"
                  v-model="form.time_down"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="上行里程:" prop="onmiles">
                <el-input
                  placeholder="请输入上行里程、单位公里"
                  v-model="form.onmiles"
                ></el-input>
              </el-form-item>
              <el-form-item label="下行里程:" prop="downmiles">
                <el-input
                  placeholder="请输入下行里程、单位公里"
                  v-model="form.downmiles"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="上行首班时间:" prop="first_time_up">
                 <el-time-picker
                  v-model="form.first_time_up"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="下行首班时间:" prop="first_time_down">
                <el-time-picker
                  v-model="form.first_time_down"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间">
                </el-time-picker>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="上行末班时间:" prop="end_time_up">
                <el-time-picker
                  v-model="form.end_time_up"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="下行末班时间:" prop="end_time_down">
                <el-time-picker
                  v-model="form.end_time_down"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间">
                </el-time-picker>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="票价:" prop="price">
               <el-input-number v-model="form.price" controls-position="right"  placeholder="输入金额"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="线路类型:">
                <el-select v-model="form.standard" placeholder="请选择线路类型">
                  <el-option
                    v-for="item in linesTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
            </div>
            <div class="el-form-row">
              <el-form-item label="早发标准:" prop="early_start">
                <el-input
                  placeholder="请输入早发标准"
                  v-model="form.early_start"
                ></el-input>
              </el-form-item>
              <el-form-item label="晚发标准:" prop="late_start">
                <el-input
                  placeholder="请输入晚发标准"
                  v-model="form.late_start"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <!-- <el-form-item label="备注:">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入备注"
                  v-model="form.remark">
                </el-input>
              </el-form-item> -->
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="线路站点关联" name="linesSite" v-if="curSelecedType != 'add'">
          <div style="height: 40px;">
            <el-switch
              style="display: block"
              v-model="isShowUpstream"
              inactive-text="上 行"
              active-text="下 行"
              active-color="#13ce66"
              inactive-color="#409EFF">
            </el-switch>
          </div>
          <div class="table-content">
            <tr-table
              ref="table"
              :loading="loading"
              :selectionShow="false"
              :data="siteDataList"
              :tableHeaderList="customSettingList"
              :TableHeight="350"
              :frontFixedNum="1"
              :backFixedNum="0"
              @double-click-row="doubleClickRow"
            >
            </tr-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="线路车辆关联" name="linesVeh" v-if="curSelecedType != 'add'">
          <el-row class="show-flex-box-r">
            <el-col :span="8" style="height: 390px">
              <!-- <role-tree
                :is_show="0"
                ref="userGroupTree"
                @on-check-change="getTreeNodes"
                :placeholder="'搜索'"
                :showCheckbox="true"></role-tree> -->
                <vehicle-tree
                  ref="vehicleTree"
                  :placeholder="'请输入关键词'"
                  :isShowCheckbox="true"
                  v-model="keys"
                  @on-check="getTreeNodes"
                >
                </vehicle-tree>
            </el-col>
            <el-col :span="5" class="show-flex-box-r show-flex-center">
                 <el-button type="primary" @click="deleteAllSelect">清空关联</el-button>
            </el-col>
            <el-col :span="11" style="margin-left: 5px">
              <el-table height="390" border :data="data">
                <el-table-column prop="c_name" label="已关联车辆"></el-table-column>
                <el-table-column prop="c_name" label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="removeData(scope.$index)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
    <!-- 站点详情 -->
    <site-detail-pop 
      ref="siteDetailPop"
      :dialogBool.sync="siteDetailPopShow"
      :curSelecedType="'detail'"
      :title="'站点详情'"
    ></site-detail-pop>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import vehicleTree from "@/components/base/formModel/tree/vehicle-tree";
import siteDetailPop from "../../site-information-management/component/information-dialog.vue"
export default {
  components: {getDepartmentSelect, vehicleTree, siteDetailPop},
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
      isContainEmp: false, //是否显示部门下的人员
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      linesClassifyOptions: [ //线路归属
        {
          value: "1",
          label: "城市线路",
        },
        {
          value: "2",
          label: "城乡线路",
        }
      ],
      linesTypeOptions: [
        {
          value: "上下行线路",
          label: "上下行线路",
        },
        {
          value: "环线",
          label: "环线",
        }
      ],
      form: {
        id: "",
        name: "",
        area:"",
        orgs:[],
        type: "",
        onmiles: "",
        downmiles: "",
        time_up: "",
        time_down: "",
        first_time_up: "",
        end_time_up: "",
        first_time_down: "",
        end_time_down: "",
        price: "",
        early_start: "",
        late_start: "",
      },
      basicRules: {
        name: [
          { required: true, message: "请输入线路名称", trigger: "change" },
        ],
        orgs: [
          { required: true, message: "请选择所属组织", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择线路归属", trigger: "change" },
        ],
        onmiles: [
          { required: true, message: "请输入上行里程", trigger: "change" },
        ],
        downmiles: [
          { required: true, message: "请输入下行里程", trigger: "change" },
        ],
        time_up: [
          { required: true, message: "请输入上行时长", trigger: "change" },
        ],
        time_down: [
          { required: true, message: "请输入下行时长", trigger: "change" },
        ],
        first_time_up: [
          { required: true, message: "请输入上行首班时间", trigger: "change" },
        ],
        end_time_up: [
          { required: true, message: "请输入上行末班时间", trigger: "change" },
        ],
        first_time_down: [
          { required: true, message: "请输入下行首班时间", trigger: "change" },
        ],
        end_time_down: [
          { required: true, message: "请输入下行末班时间", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入票价", trigger: "change" },
        ],
        early_start: [
          { required: true, message: "请输入早发标准", trigger: "change" },
        ],
        late_start: [
          { required: true, message: "请输入晚发标准", trigger: "change" },
        ],
      },
      activeName: "basiscInfo",
      department_id: '', //组织部门ID
      isShowUpstream: false,
      customSettingList:[
        {
          id: 1,
          label: "站点简称",
          prop: "simple_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "站点全称",
          prop: "station_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "维度",
          prop: "lat",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "经度",
          prop: "lng",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "方位角",
          prop: "azimuth",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:false
        }
      ],
      loading: false,
      siteDataList:[],
      siteDetailPopShow: false,
      data:[], //已选择的关联车辆
      keys:[],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm();
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
        this.vehiclesEcho(this.data)
      }
    },
    department_id(newVal) {

    },
    activeName() {
      // if(this.activeName == 'linesVeh') {
      //   this.vehiclesEcho(this.data)
      // }
    },
    isShowUpstream() {
      this.reqLineStations(this.form.id)
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    //部门选择
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        nodes.forEach((item, index) => {
          delete item.children;
        });
        this.form.orgs =  nodes;
      } else {
        this.form.orgs = [];
      }
    },
    // 回显示选中车辆数的节点
    vehiclesEcho(node) {
      this.keys = [];
      // return
      node.forEach(item => {
        this.keys.push(item.i_id)
      });
    },
    // 树选中事件
    getTreeNodes(keys, nodes) {
      this.data = []
      console.log(nodes, keys)
      nodes.forEach(item => {
        if(item.type == 3) {
          this.data.push({
            c_name: item.c_name,
            i_id: item.i_id
          })
        }

      })
      this.keys = keys
    },
    // 移除选中
    removeData(index) {
      this.data.splice(index, 1)
      this.keys.splice(index, 1)
      // this.$refs.vehicleTree.setCheckedkeys(this.keys)
    },
    // 清空关联
    deleteAllSelect() {
      this.data = [];
      this.keys = [];
      // this.$refs.vehicleTree.resetChecked()
    },
    // 获取线路站点信息
    reqLineStations(line_id) {
      this.loading = true;
      let parmas = {
        line_id: line_id,
        i_type: this.isShowUpstream? "2": "1"
      }
      this.$client.GetLineStationsLineManage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.siteDataList = res.context
            this.loading = false;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            this.loading = false;
          }
        })
        .catch((err) => {});
    },
    // 查看站点详情
    doubleClickRow(info) {
      // console.log(info)
      this.siteDetailPopShow  = true;
      let params = {
        id: info.id
      }
      this.$client.GetStationsStationManage(params).then((res) => {
        if (res.head.result == "200") {
          let siteInfo = res.context.list && res.context.list[0]
          setTimeout(() => {
            for (const key in this.$refs.siteDetailPop.form) {
              if (Object.hasOwnProperty.call(siteInfo, key)) {
                this.$refs.siteDetailPop.form[key] = siteInfo[key];
              }
            }
          }, 200);
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },

    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {};
          for (let i in this.form) {
            if (this.form[i]) {
              info[i] = this.form[i];
            }
          };
          info.vehicles = this.data
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.$refs["form"].resetFields();
      this.$refs.baseTree.onClear();
      this.department_id = '';
      this.activeName = "basiscInfo";
      this.deleteAllSelect();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog__wrapper {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// }

.el-dialog-div {
  height: 450px;
  // overflow-y: scroll;
}

.el-form-row-first {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-row-first-left {
    width: 45%;
    height: 145px;
    display: flex;
    flex-direction: column;
  }

  .el-form-row-first-right {
    width: 35%;
    height: 120px;
    // background red
    margin-left: 15%;
    margin-bottom: 30px;
    display: flex;

    .avatar-uploader {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      background: url('../../../../../src/assets/veh_svg/uploader-icon.svg') no-repeat center;
      background-size: 100% 100%;
      overflow: hidden;
      object-fit: cover !important;
        .avatar {
          display: block;
          width: 100%;
          height: 100%;
        }

      // .el-upload {
      //   width: 100% !important;
      //   height: 100% !important;
      //   overflow: hidden !important;
      //   object-fit: cover !important;

      // }
    }

    .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-item {
    width: 45%;
    margin-right: 5%;

    .el-form-item__label {
      white-space: nowrap;
    }
  }
}

.el-form-row /deep/ .el-input-number--mini {
  width: 195px;
}

.el-form-row /deep/ .el-select {
  width: 195px;
}
.el-form-row /deep/ .el-date-editor {
  width: 195px;
}
</style>

<style scoped>
.el-form-row-first-right /deep/ .have-avatar-active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
/* .div{
  background: url("../../../../../src/assets/veh_svg/uploader-icon.svg") no-repeat center;
  object-fit: cover;
} */
</style>
