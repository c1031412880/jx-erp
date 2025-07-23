<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="850px"
  >
    <div class="el-dialog-div">
      <el-form :model="form" ref="form" :rules="basicRules" label-width="125px" size="mini">
        <p style="height: 24px; margin-bottom: 20px">
          <span
            style="
              float: left;
              width: 7px;
              height: 20px;
              background: #31a7ff;
              margin-right: 6px;">
          </span>
          <span
            style="
              line-height: 20px;
              font-weight: 700;
              color: #666666;
              font-size: 18px;
            ">
            物品详情
          </span>
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号(自编号):" prop="vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                width="200"
                :placeholder="'请选择自编号'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                :oilType="2"
                v-model="form.vehicle_id"
                clearable
                @on-change="onSelectChange"
                :disabled="curChangeType == 'detail'">
              </get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属公司:" prop="dept_id">
              <get-department-select
                ref="deptTree"
                :isShowCheckbox="false"
                :funcType="1"
                :placeholder="'请选择所属公司'"
                :isExportMultiple="false"
                v-model="form.dept_id"
                clearable
                :disabled="curChangeType == 'detail'">
              </get-department-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路:" prop="line_id">
              <get-line-select-tree
                ref="lineTree"
                placeholder="请选择线路"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="form.line_id"
                clearable
                :disabled="curChangeType == 'detail'">
              </get-line-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员:" prop="driver_id">
              <get-driver-select-tree
                ref="driverTree"
                v-model="form.driver_id"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择司机'"
                :isExportMultiple="false"
                clearable
                :disabled="curChangeType == 'detail'">
              </get-driver-select-tree>
            </el-form-item> 
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物品名称:" prop="good_name">
              <el-input v-model="form.good_name" placeholder="请输入物品名称" clearable :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品类别:" prop="lost_type">
              <el-select v-model="form.lost_type" clearable placeholder="请选择物品类别" @change="changeType" :disabled="curChangeType == 'detail'">
                <el-option v-for="(item,index) in tpyeData" :key="index" :label="item.type" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="拾取时间:" prop="lost_time">
              <el-date-picker
                v-model="form.lost_time"
                type="datetime"
                placeholder="请选择时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="countExpiryDate"
                :disabled="curChangeType == 'detail'"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上交人员:" prop="handle_user">
              <get-all-dept-user-tree
                v-if="dialogBool"
                ref="personTree"
                v-model="form.handle_user"
                :isShowCheckbox="false"
                :placeholder="'请选择上交人员'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                :disabled="curChangeType == 'detail'"
              ></get-all-dept-user-tree>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="签收人员:">
              <el-input v-model="form.receive_user" placeholder="请输入签收人员" clearable :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品有效期:">
              <el-input v-if="isNoDeadline" v-model="lifeSpan" :disabled="true"></el-input>
              <el-date-picker v-else
                :disabled="true"
                v-model="form.expiry_date"
                type="date"
                placeholder="请选择物品有效期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
          <el-form-item label="上传多张图片" prop="img_list">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in form.img_list" :key="index">
                <li class="item" v-if="item">
                  <image-box :src="item" :id="index+1" @on-delete="imageDelete(index)" :disabled="curChangeType == 'detail'"></image-box>
                </li>
              </ul>
              <div class="item unchecked" v-if="curChangeType !== 'detail'">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;" @click="uploadFile()"></i>
              </div>
            </div>
          </el-form-item>
        </el-col>
        </el-row>
        <div v-if="curChangeType =='detail' ">
          <p style="height: 24px; margin-bottom: 20px">
          <span
            style="
              float: left;
              width: 7px;
              height: 20px;
              background: #31a7ff;
              margin-right: 6px;">
          </span>
          <span
            style="
              line-height: 20px;
              font-weight: 700;
              color: #666666;
              font-size: 18px;
            ">
            领用情况
          </span>
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="take_name">
              <el-input v-model="form.take_name" placeholder="请输入姓名" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话:" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号:" prop="id_no">
              <el-input v-model="form.id_no" placeholder="请输入身份证号" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认领时间:" prop="take_time">
              <el-date-picker
                v-model="form.take_time"
                type="datetime"
                placeholder="请选择时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                disabled
              ></el-date-picker>
            </el-form-item> 
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经办人:" prop="operator_user">
              <get-department-select
                ref="personalTree"
                v-model="form.operator_user"
                :isShowCheckbox="false"
                :placeholder="'请选择经办人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                disabled
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办理时间:" prop="operator_time">
              <el-date-picker
                v-model="form.operator_time"
                type="datetime"
                placeholder="请选择时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curChangeType !== 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill(0)" v-if="curChangeType == 'add'">保存草稿</el-button>
      <el-button type="primary" @click="updatePlaybill(1)">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageBox from '@/components/image-box/index';
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
export default {
  components: {
    imageBox,
    getDepartmentSelect,
    getLineSelectTree,
    getVehicleSelectTree,
    getDriverSelectTree, 
    getAllDeptUserTree
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: "add" //add添加  edit编辑  detail详情
    },
  },
  mounted() {},
  data() {
    return {
      title: "添加物品",
      date: [],
      tpyeData: [],//物品类别下拉框
      isNoDeadline: false,
      lifeSpan: "无限制",//有效期
      form: {
        id: 0,
        state: 1,
        vehicle_id: "",
        dept_id: "",
        line_id: "",
        driver_id: "",
        good_name: "",
        lost_type: "",
        lost_time: "",
        handle_user: "",
        receive_user: "",
        expiry_date: "",
        remark: "",
        img_list: [],
        //领用情况 仅查看详情时有
        take_name: "",
        phone: "",
        id_no: "",
        take_time: "",
        operator_user: "",
        operator_time: "",
      },
      basicRules: {
        vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所属公司",
            trigger: "change",
          },
        ],
        line_id: [
          {
            required: true,
            message: "请选择线路",
            trigger: "change",
          },
        ],
        driver_id: [
          {
            required: true,
            message: "请选择驾驶员",
            trigger: "change",
          },
        ],
        good_name: [
          {
            required: true,
            message: "请输入物品名称",
            trigger: "change",
          },
        ],
        lost_type: [
          {
            required: true,
            message: "请选择物品类别",
            trigger: "change",
          },
        ],
        lost_time: [
          {
            required: true,
            message: "请选择拾取时间",
            trigger: "change",
          },
        ],
        handle_user: [
          {
            required: true,
            message: "请输入上交人员",
            trigger: "change",
          },
        ],
        img_list: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm()
      }else{
        this.$nextTick(() => {
          this.loadTypeData()
          switch(this.curChangeType){
            case "add":
              this.title = "添加物品";
              break;
            case "edit":
              this.title = "编辑物品";
              break;
            case "detail":
              this.title = "物品详情";
              break;
          }
          this.$refs.form.clearValidate();
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    //加载物品类别信息
    loadTypeData(){
      let params = {
        context:{}
      };
      this.$client.getListLostType(params).then(res => {
        if (res.head.result == "200") {
          this.tpyeData = res.context.list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    // 删除照片
    imageDelete(index) {
      this.form.img_list.splice(index,1)
    },
    // 自定义上传文件方法
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture_lost(params).then((req) => {
          if (req.head.result === "200") {
            // let obj = {
            //   name: file.name,
            //   url: req.context
            // }
            this.form.img_list.push(req.context)
          }
        });
      };
      input.click();
    },
    //修改物品类别
    changeType(val){
      this.tpyeData.forEach(item=>{
        if(item.id == val){
          if(item.vaild_day == -1){
            this.isNoDeadline = true
            this.form.expiry_date = ""
            this.lifeSpan = "无期限"
          }else{
            this.isNoDeadline = false
            this.lifeSpan = item.vaild_day
          }
        }
      })
      this.countExpiryDate()
    },
    //计算物品有效期
    countExpiryDate() {
      if (this.form.lost_time !== "" && this.form.lost_type !== "" && this.lifeSpan !== "无期限") {
        // 获取 lost_time 的时间戳
        let timestamp = new Date(this.form.lost_time).getTime();
        // 计算过期时间的时间戳（加上有效期的毫秒数）
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        timestamp += this.lifeSpan * oneDayInMilliseconds;
        // 从时间戳创建新的 Date 对象
        const expiryDate = new Date(timestamp);
        // 格式化过期日期为 YYYY-MM-DD
        const year = expiryDate.getFullYear();
        const month = String(expiryDate.getMonth() + 1).padStart(2, '0');
        const day = String(expiryDate.getDate()).padStart(2, '0');
        // 设置表单的有效日期
        this.form.expiry_date = `${year}-${month}-${day}`;
      }else{
        this.form.expiry_date = ""
      }
    },
    //选择车辆 绑定所属公司和线路
    onSelectChange(vhe,node) {
      // if(this.curChangeType == "add"){
        this.$client.GetVehicleInfoById({ id: vhe }).then((res) => {
          if (res.head.result == "200") {
            this.form.dept_id = res.context.dept_id
            this.form.line_id = res.context.line_id
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
      // }
    },
    //编辑 查看 数据回显
    setData(val){
      if(val.expiry_date == "无限制"){
        this.isNoDeadline = true
      }else{
        this.isNoDeadline = false
      }
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key]; 
        }
      }
    },
    resetForm(){
      this.$refs.driverTree.onClear();
      this.$refs.lineTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs.deptTree.onClear();
      this.$refs.personTree.onClear();
      this.form.img_list = []
    },
    //提交数据
    updatePlaybill(type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let info = this.form;
          //0为草稿 1为待认领
          info.state = type
          delete info.take_name
          delete info.phone
          delete info.id_no
          delete info.take_time
          delete info.operator_user
          delete info.operator_time
          if(this.form.expiry_date == "无限制"){
            info.expiry_date = ""
          }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 450px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 250px;
}
.el-dialog-div /deep/ .el-textarea {
  width: 647px;
}
.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF
</style>

