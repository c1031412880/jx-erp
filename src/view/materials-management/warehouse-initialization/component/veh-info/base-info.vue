<template>
  <div
    class="base-info"
    :style="`height:${
      curChangeType == 'detail' ? '470' : '400'
    }px; overflow-x: hidden`"
  >
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
      <div class="show-flex-box-r">
        <el-form-item label="所属仓库:">
          <el-select
            v-model="formData.house_id"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in stoneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称:" prop="material_id">
          <el-select
            :autofocus="true"
            :loading="wzloading"
            v-model="formData.material_id"
            :remote-method="remoteMethod"
            remote
            filterable
            @change="changeShezhi"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in wuziOptions"
              :key="item.id"
              :label="item.groupgo"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="物料编码:">
          <el-input v-model="ruls.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input v-model="ruls.specification" disabled></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="计量单位:">
          <el-input v-model="ruls.measure_unit_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="品牌:">
          <el-input v-model="ruls.brand" disabled></el-input>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <!-- <el-form-item label="适用车型:">
          <el-input
            v-model="ruls.vehicle_kind_names"
            disabled
            clearable
          ></el-input>
        </el-form-item> -->
        <el-form-item label="数量:" prop="count">
          <el-input
            v-model="formData.count"
            @keyup.native="formData.count = oninput(formData.count)"
          ></el-input>
        </el-form-item>
        <el-form-item label="批次号:">
          <p>后台自动生成</p>
          <!-- <el-input v-model="formData.con_person"></el-input> -->
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="销售单价:" prop="price">
          <el-input
            v-model="formData.price"
            @keyup.native="formData.price = oninput(formData.price)"
          ></el-input>
        </el-form-item>
        <el-form-item label="成本单价:">
          <el-input
            v-model="formData.cost_price"
            @keyup.native="formData.cost_price = oninput(formData.cost_price)"
          ></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="仓位:">
          <el-input v-model="formData.position"></el-input>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-select
            v-model="formData.provider_id"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in gongysOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
      </div>
    </el-form>
  </div>
</template>
<script>
import { getSession, getUser } from "@/utils/auth";
import { formatDateTime } from "@/utils/index";
import getStoreSelect from "components/base/formModel/tree/get-store-select";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { trigger } from "../../../../../components/DynamicForm/components/generator/config";
export default {
  components: {
    getStoreSelect,
    getCarcodeSelectTree,
    getDepartmentSelect,
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
    getSelectDictionaries,
    getUserSelect,
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      wuzival:'',
      wzloading: false,
      wuziOptions: [],
      wuziOptionAllMap: {},
      wuziOptionMap: {},
      gongysOptions: [],
      stoneOptions: [],
      allList: [],
      imgs: [],
      ruls: [],
      Options: [
        //状态
        { value: 1, name: "普通报修" },
        { value: 2, name: "事故报修" },
        { value: 3, name: "外修" },
        // { value: "修理中", name: "修理中" },
      ],
      // isContainEmp: false, //是否显示部门下的人员
      safetyDistanceOptions: [
        //状态
        { value: 1, name: "不扣除" },
        { value: 2, name: "扣除指定安全里程" },
        { value: 3, name: "扣除当月安全里程" },
        { value: 4, name: "扣除当季度安全里程" },
        { value: 5, name: "扣除全部安全里程" },
        { value: 6, name: "扣除当前安全里程" },
      ],
      dataList: [],
      form: {
        cid: "",
        dept_id: "",
      },
      changeList: {
        d_accident_date: "",
        accident_duty: "",
        actual_fee: "",
      },
      fileLists: [],
      department_name: "", //部门名称
      dialogImageUrl: "",
      dialogVisible: false,
      formData: {
        cost_price: "",
        house_id: "",
        material_id: "",
        count: "",
        price: "",
        position: "",
        provider_id: "",
        id: "",
      },
      veh_typeOptions: [],

      rules: {
        count: [
          {
            required: true,
            message: "请填写数量",
            trigger: "change",
          },
        ],
        material_id: [
          {
            required: true,
            message: "请填物料名称",
            trigger: "change",
          },
        ],
        price: [
          {
            required: true,
            message: "请填写单价",
            trigger: "change",
          },
        ],
      },
      isFirstLoad: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getGinsang();
    this.getwuzi();
    this.getVehType();
    console.log(this.formData.repair_user_id, 233);
    // let userInfo = JSON.parse(getUser());
    // this.formData.repair_user_id = Number(userInfo.user_id)
    // console.log(this.formData.i_result_person)
  },
  methods: {
    oninput(num) {
      var str = num;
      var len1 = str.substr(0, 1);
      var len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        var str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/\.\d\d\d$/, ""); // 小数点后只能输两位
      return str;
    },
    changeShezhi(data) {
      if (data == null || data == "") {
        this.ruls = [];
      }
      this.wuziOptions.forEach((val) => {
        if (val.id == data) {
          this.ruls = val;
        }
      });
      console.log(this.ruls, "123");
      this.formData.price = this.ruls.price
      this.formData.cost_price = this.ruls.price
      this.formData.provider_id = this.ruls.provider_id === 0 ? "" : this.ruls.provider_id
      this.formData.position = this.ruls.provider_name
    },
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;

          this.$client.GetUserWHWarehouse().then(res => {
            console.log(res, '仓库所属')

            if (res.head.result === '200') {
              if (res.context.length === 1) {
                this.formData.house_id = req.context[0].id;
              }
            }
          })



        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        // let Options = []
        setTimeout(() => {
          this.loading = false;
          this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
            (item) => {
              return (
                item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          );
          this.wuziOptions = this.wuziOptions.slice(0, 99);
          // this.wuziOptions=this.wuziOptions.concat( Options)
          // this.wuziOptions= this.unique(this.wuziOptions);
        }, 200);
      } else {
        // this.wuziOptions = [];
        this.getwuzi();
      }
    },
    arrwuzi() {
      let ids = this.formData.material_id;
      console.log(this.wuziOptionAllMap, "12");
      console.log(this.wuziOptionAllMap[ids], "33");
      if (this.wuziOptionAllMap[ids] == "") {
      } else {
        this.wuziOptionMap[ids] = this.wuziOptionAllMap[ids];
      }
      this.wuziOptions = Object.values(this.wuziOptionMap);
    },
    getwuzi() {
      // debugger
      this.wzloading = true;
      if (this.allList.length != 0) {
        let selectItem = {};
        let ids = this.formData.material_id;
        let wuziOptionList = this.allList.map((item) => {
          if (item.specification == null) {
            item.groupgo = item.name + "(" + item.code + ")";
          } else {
            item.groupgo =
              item.name + item.specification + "(" + item.code + ")";
          }
          this.wuziOptionAllMap[item.id] = item;
          if (item.id == ids) {
            selectItem = item;
          }
          this.wuziOptionMap[item.id] = item;
          return item;
        });
        wuziOptionList = wuziOptionList.slice(0, 100);
        if (wuziOptionList.some((e) => e.id == ids)) {
          this.wuziOptions = wuziOptionList;
        } else {
            if(selectItem.id){
                   this.wuziOptions = [selectItem, ...wuziOptionList];
            }else{
                  this.wuziOptions = wuziOptionList;
            }
        }
        this.wzloading = false;
        console.log(this.wuziOptions);
        this.wuziOptions.forEach((val) => {
          if (val.id == ids) {
            this.ruls = val;
          }
        });
      } else {
        this.$client.getMaterialPage({ usable: 1 }).then((req) => {
          if (req.head.result === "200") {
            let ids = this.formData.material_id;
            this.wuziOptionMap = {};
            this.wuziOptionAllMap = {};
            // let length = req.context.list.length;
            this.allList = req.context.list;
            let selectItem = {};
            let wuziOptionList = this.allList.map((item) => {
              if (item.specification == null) {
                item.groupgo = item.name + "(" + item.code + ")";
              } else {
                item.groupgo =
                  item.name + item.specification + "(" + item.code + ")";
              }
              this.wuziOptionAllMap[item.id] = item;
              if (item.id == ids) {
                selectItem = item;
              }
              this.wuziOptionMap[item.id] = item;
              return item;
            });
            wuziOptionList = wuziOptionList.slice(0, 100);
              if (wuziOptionList.some((e) => e.id == ids)) {
                this.wuziOptions = wuziOptionList;
              } else {
                if(selectItem.id){
                   this.wuziOptions = [selectItem, ...wuziOptionList];
                }else{
                  this.wuziOptions = wuziOptionList;
                }
              }
            this.wzloading = false;
            console.log(this.wuziOptions);
            this.wuziOptions.forEach((val) => {
              if (val.id == ids) {
                this.ruls = val;
              }
            });
            this.setData(this.wuzival)
          } else {
            this.wzloading = false;
            this.$message({ type: "error", message: "获取失败" });
          }
        });
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传4张车辆照片`);
    },
    // 判断文件大小
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 20;
      if (isLt1M) {
        return true;
      }
      // this.$message({type: 'error', message: '请不要上传大小超过20M的文件', showClose: true})
      return false;
    },
    // 上传图片相关资料
    handlePreview(file) {
      // console.log(this.formData.imgs.length,'长度')
      // if(this.formData.imgs.length > 3) {
      //    this.$message({type: 'warning', message: '最多只能上传4个文件', showClose: true})
      //   return
      // }
      if (this.beforeUpload(file)) {
        this.uploadAccidentDataFiles(file);
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
      // if(this.formData.imgs.length > 4) {
      //      this.$message({type: 'warning', message: '最多只能上传4个文件', showClose: true})
      //     return
      //   }
      // console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddrepairspicUpload(params).then((res) => {
        if (res.head.result == "200") {
          this.formData.imgs.push(res.context);
          console.log(this.formData.imgs, 11111111);
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    //图片删除
    handleRemove(file, fileList) {
      //  this.formData.imgs = this.formData.imgs.filter(dataLists=>dataLists == file.url);
      console.log(this.formData.imgs, "123");
      let c = this.formData.imgs.findIndex(function (d) {
        // 测试条件为true时返回当前位置
        return d == file.url;
      });
      this.formData.imgs.splice(c, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取车辆型号列表
    getVehType() {
      this.$client.GetCarModelVehicleManager({}).then((req) => {
        this.veh_typeOptions = [];
        if (req.head.result === "200") {
          this.veh_typeOptions = req.context.list;
          console.log(this.veh_typeOptions);
        }
      });
    },
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.ruls = [];
      this.formData.id = "";
      // this.formData.house_id = ''
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          // this.stoneOptions = req.context
          this.formData.house_id = req.context[0].id;
        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
      this.formData.material_id = "";
      // this.$refs.driverTree.onClear()
      this.formData.count = "";
      this.formData.price = "";
      this.formData.position = "";
      this.formData.address = "";
      this.formData.provider_id = "";
      this.formData.cost_price = "";
    },
    // 车辆选择
    SelectChange(data, key) {
      this.changeList = this.dataList.filter(
        (dataLists) => dataLists.i_id == data
      );
      this.changeList = this.changeList[0];
      console.log(this.changeList, "111");
    },
    onSelectChange(vehs, nodes) {
      if (vehs != 0) {
        this.form.dept_id = "";
        this.form.cid = "";
        this.$client
          .getAccidentRecordList({
            page_index: 1,
            page_size: 9999,
            i_vehicle_id: vehs,
          })
          .then((res) => {
            if (res.head.result == "200") {
              this.dataList = res.context.list;
              this.loading = false;
            } else {
              this.loading = false;
              this.dataList = [];
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
            this.loading = false;
          });

        this.$client.getCarinfo({ id: Number(vehs) }).then((res) => {
          if (res.head.result == "200") {
            if (res.context.list) {
              let carInfo = res.context.list[0];
              this.form.dept_id = carInfo.group_name;
              this.form.cid = carInfo.name;
            } else {
              this.form.cid = "";
              this.form.dept_id = "";
            }
          } else {
            this.$message({
              type: "error",
              message: res.head.describle,
              showClose: true,
            });
          }
        });
      }
      // console.log(vehs, nodes)
      // 编辑和详情需要加一层锁
      if (this.curChangeType != "add") {
        if (!this.isFirstLoad && !!this.formData.i_vehicle_id) {
          // this.isFirstLoad = true
          return;
        }
        if (this.isFirstLoad && vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0]);
        }
      } else {
        if (vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0]);
        }
      }
    },
    // 所选线路
    onLineSelectChange(lines, nodes) {},
    // 选择驾驶员
    onSelectDriverChange(Drivers, nodes) {},
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id,
      };
      this.$client
        .getVehicleRelationInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            let relationInfo = res.context;
            this.department_name = relationInfo.department_name;
            if (!!relationInfo.line && relationInfo.line.length > 0) {
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              // this.formData.i_line_id = relationInfo.line[0].i_id
            } else {
              this.formData.i_line_id = "";
              setTimeout(() => {
                this.$refs.lineTree.onClear();
              }, 60);
            }
          } else {
            this.$message({
              type: "error",
              message: res.head.describle,
              showClose: true,
            });
          }
        })
        .catch((err) => {});
    },
    // 车辆型号修改  获取车辆型号的基础信息
    carTypeChange(val) {
      const filterObj = this.veh_typeOptions.filter((item) => {
        if (item.id == val) {
          return item;
        }
      });
      console.log(this.veh_typeOptions, filterObj, val);
      if (filterObj.length != 0) {
        this.formData.product_factory = filterObj[0].factory;
        this.formData.seat_count = filterObj[0].seats_num;
        this.formData.allow_number = filterObj[0].permit_num;
        this.formData.auto_emissions = filterObj[0].displacement;
        this.formData.emission_standards = filterObj[0].standard_name;
        this.formData.fuel_type = filterObj[0].fuel_name;
        this.formData.car_body_color = filterObj[0].color;
        this.formData.car_length = filterObj[0].length;
        this.formData.car_width = filterObj[0].width;
        this.formData.car_height = filterObj[0].height;
        this.formData.wheel_distance = filterObj[0].wheel_space;
        this.formData.wheelbase = filterObj[0].shaft_space;
        this.formData.vehicle_weight = filterObj[0].permit_quality;
        this.formData.all_weight = filterObj[0].total_quality;
        this.formData.coefficient = filterObj[0].index;
      }
    },
    // 数据回显
    setData(val) {
      this.wuzival = val
      this.formData.cost_price = val.cost_price;
      this.formData.id = val.id;
      this.formData.house_id = val.house_id;
      this.changeShezhi(val.material_id);
      this.formData.material_id = val.material_id;
      this.formData.count = val.count;
      this.formData.price = val.price;
      this.formData.position = val.position;
      this.formData.address = val.address;
      this.formData.provider_id = val.provider_id;
    },
    // 打开地图
    openMap() {},
    // 给父级页面提供得获取本页数据
    getData() {
      console.log(this.formData);
      return new Promise((resolve, reject) => {
        console.log(this.formData);
        this.$refs["formData"].validate((valid) => {
          console.log(this.formData);
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项",
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
.base-info /deep/ .el-date-editor {
  width: 200px;
}

.base-info /deep/.el-select, .el-select--mini {
  width: 200px;
}

.base-info /deep/ .el-input, .el-input--mini {
  width: 200px;
}

.base-info /deep/ .el-textarea {
  width: 520px;
}
</style>
