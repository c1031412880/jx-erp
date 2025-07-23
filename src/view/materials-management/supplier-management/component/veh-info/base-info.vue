<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
      <div class="show-flex-box-r">
        <el-form-item label="供应商编号:" prop="code">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称:" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="供应商类型:" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="助记码:" >
          <el-input v-model="formData.mnemonic_code"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="区域分类:" >
          <get-select-dictionaries v-model="formData.area" :classKey="'区域分类'" :placeholder="'请选择'" ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="客户分类:" >
           <get-select-dictionaries v-model="formData.custom_type" :classKey="'客户分类'" :placeholder="'请选择'" ></get-select-dictionaries>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="信用等级:">
          <get-select-dictionaries v-model="formData.credit_level" :classKey="'信用等级'" :placeholder="'请选择'" ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="地址:" >
         <el-input v-model="formData.address"></el-input>
        </el-form-item>
        
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="联系人:" >
          <el-input v-model="formData.con_person"></el-input>
        </el-form-item>
        <el-form-item label="电话:">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        
      </div>
      <div class="show-flex-box-r" >
        <el-form-item label="税号:">
          <el-input v-model="formData.ein"></el-input>
        </el-form-item>
         <el-form-item label="备注:" >
          <el-input
            type="textarea"
            :disabled="curChangeType=='detail'||curChangeType=='checkout'"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入详细报修描述"
            v-model="formData.remark"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import {getSession, getUser} from '@/utils/auth'
import { formatDateTime } from "@/utils/index";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getUserSelect from 'components/base/formModel/tree/get-user-select'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { trigger } from '../../../../../components/DynamicForm/components/generator/config';
export default {
  components: {
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
      imgs:[],
       Options:[ //状态
        { value: 1, name: "普通报修" },
        { value: 2, name: "事故报修" },
        { value: 3, name: "外修" },
        // { value: "修理中", name: "修理中" },
      ],
      // isContainEmp: false, //是否显示部门下的人员
      safetyDistanceOptions:[ //状态
        { value: 1, name: "不扣除" },
        { value: 2, name: "扣除指定安全里程" },
        { value: 3, name: "扣除当月安全里程" },
        { value: 4, name: "扣除当季度安全里程" },
        { value: 5, name: "扣除全部安全里程" },
        { value: 6, name: "扣除当前安全里程" }
      ],
      typeOptions:[
        {
          value: 1,
          label: '配件'
        },
        {
          value: 2,
          label: '轮胎'
        },
      ],
      dataList:[],
      form:{
        cid:'',
        dept_id:'',
      },
      changeList:{
        d_accident_date:'',
        accident_duty:'',
        actual_fee:'',
      },
      fileLists:[],
      department_name:"", //部门名称
      dialogImageUrl: '',
      dialogVisible: false,
      formData: {
        code:'',
        name:'',
        mnemonic_code:'',
        area:'',
        custom_type:'',
        credit_level:'',
        address:'',
        con_person:'',
        phone:'',
        ein:'',
        remark:'',
        created_id:'',
        created_date:'',
        update_id:'',
        update_date:'',
        id:'',
        type: ''
      },
      veh_typeOptions: [],

      rules: {
        code: [
          {
            required: true,
            message: "请填写供应商编号",
            trigger: "change",
          },
        ],
         name: [
          {
            required: true,
            message: "请填写供应商名称",
            trigger: "change",
          },
        ],
         type: [
          {
            required: true,
            message: "请填写供应商类别",
            trigger: "change",
          },
        ],
      },
      isFirstLoad: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getVehType()
    console.log(this.formData.repair_user_id,233)
    // let userInfo = JSON.parse(getUser());
    // this.formData.repair_user_id = Number(userInfo.user_id)
    // console.log(this.formData.i_result_person)
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传4张车辆照片`);
    },
   // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 20
      if (isLt1M) {
        return true
      }
      // this.$message({type: 'error', message: '请不要上载大小超过20M的文件', showClose: true})
      return false
    },
    // 上传图片相关资料
    handlePreview(file) {
      // console.log(this.formData.imgs.length,'长度')
      // if(this.formData.imgs.length > 3) {
      //    this.$message({type: 'warning', message: '最多只能上传4个文件', showClose: true})
      //   return
      // }
      if (this.beforeUpload(file)) {
        this.uploadAccidentDataFiles(file)
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
      this.$client.AddrepairspicUpload(params).then(res => {
        if(res.head.result == "200") {
          this.formData.imgs.push(res.context)
          console.log(this.formData.imgs,11111111)
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    //图片删除
    handleRemove(file, fileList) {
    //  this.formData.imgs = this.formData.imgs.filter(dataLists=>dataLists == file.url);
     console.log(this.formData.imgs,'123')
      let c = this.formData.imgs.findIndex(function(d){// 测试条件为true时返回当前位置
            return d == file.url;
        })
      this.formData.imgs.splice(c,1)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  // 获取车辆型号列表
    getVehType(){
      this.$client.GetCarModelVehicleManager({}).then(req => {
        this.veh_typeOptions = []
        if (req.head.result === '200') {
          this.veh_typeOptions = req.context.list
          console.log(this.veh_typeOptions)
        }
      })
    },
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.formData.code = ''
      this.formData.name = ''
      this.formData.mnemonic_code =''
      this.formData.area = ''
      this.formData.custom_type = ''
      this.formData.credit_level =''
      this.formData.address = ''
      this.formData.con_person = ''
      this.formData.phone = ''
      this.formData.ein = ''
      this.formData.remark = ''
      this.formData.id = ''
      this.formData.type = ''
    
    },
    // 车辆选择
    SelectChange(data,key){
        this.changeList = this.dataList.filter(dataLists=>dataLists.i_id == data);
        this.changeList = this.changeList[0]
        console.log(this.changeList,'111')
    },
    onSelectChange(vehs, nodes) {
      if(vehs!=0){
        this.form.dept_id = ''
        this.form.cid = ''
         this.$client.getAccidentRecordList({
           page_index:1,
           page_size:9999,
           i_vehicle_id:vehs
         }).then((res) => {
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

        this.$client.getCarinfo({ id:Number(vehs)}).then(res => {
        if(res.head.result == '200') {
          if(res.context.list){
            let carInfo = res.context.list[0];
            this.form.dept_id = carInfo.group_name;
            this.form.cid = carInfo.name
          }else{
            this.form.cid = ''
            this.form.dept_id = ''
          }
          
        }else{
          this.$message({
            type: 'error',
            message: res.head.describle, 
            showClose: true
          })
        }
      })
      }
      // console.log(vehs, nodes)
      // 编辑和详情需要加一层锁
      if(this.curChangeType != 'add') {
        if(!this.isFirstLoad  && !!this.formData.i_vehicle_id) {
          
          // this.isFirstLoad = true
          return
          
        }
        if (this.isFirstLoad && vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0])  
        } 
      }else{
        if (vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0])  
        } 
      }
      

      
    },
    // 所选线路
    onLineSelectChange(lines, nodes) {

    },
    // 选择驾驶员
    onSelectDriverChange(Drivers, nodes) {

    },
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id
      };
      this.$client.getVehicleRelationInfo(params).then(res => {
        if(res.head.result == '200') {
            let relationInfo = res.context;
            this.department_name = relationInfo.department_name;
            if(!!relationInfo.line && relationInfo.line.length > 0) {
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              // this.formData.i_line_id = relationInfo.line[0].i_id
            }else{
              this.formData.i_line_id = "";
              setTimeout(() => {
                this.$refs.lineTree.onClear()
              }, 60);
            }
          

        }else{
          this.$message({
            type: 'error',
            message: res.head.describle, 
            showClose: true
          })
        }
      }).catch(err => {

      })
    },
    // 车辆型号修改  获取车辆型号的基础信息
    carTypeChange(val){

      const filterObj = this.veh_typeOptions.filter(item =>{
        if(item.id == val){
          return item;
        }
      })
      console.log(this.veh_typeOptions, filterObj, val)
      if(filterObj.length != 0){
        this.formData.product_factory = filterObj[0].factory
        this.formData.seat_count = filterObj[0].seats_num
        this.formData.allow_number = filterObj[0].permit_num
        this.formData.auto_emissions = filterObj[0].displacement
        this.formData.emission_standards = filterObj[0].standard_name
        this.formData.fuel_type = filterObj[0].fuel_name
        this.formData.car_body_color = filterObj[0].color
        this.formData.car_length = filterObj[0].length
        this.formData.car_width = filterObj[0].width
        this.formData.car_height = filterObj[0].height
        this.formData.wheel_distance = filterObj[0].wheel_space
        this.formData.wheelbase = filterObj[0].shaft_space
        this.formData.vehicle_weight = filterObj[0].permit_quality
        this.formData.all_weight = filterObj[0].total_quality
        this.formData.coefficient = filterObj[0].index
      }
    },
    // 数据回显
    setData(val) {
      this.formData.code = val.code
      this.formData.name = val.name
      this.formData.mnemonic_code =val.mnemonic_code
      this.formData.area = val.area
      this.formData.custom_type = val.custom_type
      this.formData.credit_level =val.credit_level
      this.formData.address = val.address
      this.formData.con_person = val.con_person
      this.formData.phone = val.phone
      this.formData.ein = val.ein
      this.formData.remark = val.remark
      this.formData.id =val.id
      this.formData.type =val.type
    },
    // 打开地图
    openMap() {

    },
    // 给父级页面提供得获取本页数据
    getData() {
      console.log(this.formData)
     return new Promise((resolve, reject) => {
       console.log(this.formData)
        this.$refs["formData"].validate((valid) => {
          console.log(this.formData)
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
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
.base-info /deep/.el-select,.el-select--mini {
  width: 200px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 200px;
}

.base-info /deep/ .el-textarea {
  width: 520px;
}


</style>
