<template>
  <div style="height:510px;overflow-x:hidden">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="150px">
        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">基础信息</p>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自编号:" prop="v_num">
            <el-input v-model="formData.v_num" placeholder="请输入车辆自编号" :disabled="!isEdit" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号:" prop="lp_num">
            <el-input v-model="formData.lp_num" placeholder="请输入车牌号" :disabled="!isEdit" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织:" prop="group">
            <!-- <el-input v-model="formData.vhe_group" placeholder="请选择车辆组织架构" clearable :style="{width: '100%'}">
            </el-input> -->
            <get-department-select
              ref="baseTree"
              :placeholder="placeholder"
              :isShowCheckbox="false"
              :disabled="!isEdit"
              v-model="formData.group"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车架号码:" prop="car_frame_number">
            <el-input v-model="formData.fra_num" placeholder="请输入车架号码" :disabled="!isEdit" clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆出厂日期:" prop="out_factory_date">
            <el-date-picker v-model="formData.lea_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入车辆出厂日期" :disabled="!isEdit" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发动机号:" prop="engine_number">
            <el-input v-model="formData.engine_number" placeholder="请输入发动机号" :disabled="!isEdit" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌颜色:" prop="card_color">
            <tr-select-dictionaries
              style="width:100%"
              placeholder="选择车牌颜色"
              class-key="车牌颜色"
              :disabled="!isEdit"
              v-model="formData.card_color">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left: 15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">运营信息</p>
        </el-col>

        <el-col :span="12">
          <el-form-item label="登记证书号码:" prop="reg_num">
            <el-input v-model="formData.reg_num" placeholder="请输入登记证书号码" :disabled="!isEdit" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记证书日期:" prop="reg_date">
            <el-date-picker v-model="formData.reg_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入登记证书日期" :disabled="!isEdit" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最近二保日期:" prop="last_two_date">
            <el-date-picker v-model="formData.last_two_date" disabled format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入最近二保日期" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="距离上次二保公里数:" disabled prop="last_two_mile">
            <el-input v-model="formData.last_two_mile" clearable :style="{width: '100%'}" :disabled="!isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最近保险日期:" prop="insurance_date">
            <el-date-picker v-model="formData.ins_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入最近保险日期" :disabled="!isEdit" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="最近保养日期:" prop="maintenance_date">
            <el-date-picker v-model="formData.up_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入最近保养日期" clearable></el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="最近年检日期:" prop="year_check_date">
            <el-date-picker v-model="formData.check_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入最近年检日期" :disabled="!isEdit" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="许可证号:" prop="licence_code">
            <el-input v-model="formData.licence_code" clearable :style="{width: '100%'}" :disabled="!isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用性质:" prop="use_type">
            <tr-select-dictionaries
              style="width:100%"
              placeholder="选择使用性质"
              class-key="使用性质"
              :disabled="!isEdit"
              v-model="formData.use_type">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营范围:" prop="manage_scope">
            <tr-select-dictionaries
              style="width:100%"
              placeholder="选择经营范围"
              class-key="经营范围"
              :disabled="!isEdit"
              v-model="formData.manage_scope">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营类型:" prop="manage_type">
            <tr-select-dictionaries
              style="width:100%"
              placeholder="选择经营类型"
              class-key="经营类型"
              :disabled="!isEdit"
              v-model="formData.manage_type">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投入使用日期:" prop="use_date">
            <el-date-picker v-model="formData.use_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请输入投入使用日期" :disabled="!isEdit" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="停放场站:" prop="stop_station">
            <el-input v-model="formData.stop_station" clearable :style="{width: '100%'}" :disabled="!isEdit"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left: 15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">车型信息</p>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆型号:" prop="cid">
            <el-select v-model="formData.cid" placeholder="请输入车辆型号" :disabled="!isEdit" clearable :style="{width: '100%'}" @change="carTypeChange">
              <el-option v-for="(item, index) in veh_typeOptions" :key="index" :label="item.name"
                :value="Number(item.id)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产厂家:" prop="product_factory">
            <el-input v-model="formData.product_factory" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="座位数:" prop="seat_count">
            <el-input v-model="formData.seat_count"  clearable :style="{width: '100%'}" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核载数:" prop="allow_number">
            <el-input v-model="formData.allow_number" placeholder="请输入核载数" clearable :style="{width: '100%'}" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排量(ML):" prop="auto_emissions">
            <el-input v-model="formData.auto_emissions" placeholder="请输入排量" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排放标准:" prop="emission_standards">
            <el-select v-model="formData.emission_standards" placeholder="请输入排放标准" clearable
              :style="{width: '100%'}" disabled>
              <el-option v-for="(item, index) in emission_standardsOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="燃料类型:" prop="fuel_name">
            <el-input v-model="formData.fuel_type" placeholder="请输入燃料类型" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车身颜色:" prop="car_body_color">
            <el-input v-model="formData.car_body_color" placeholder="请输入车身颜色" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="长度(mm):" prop="car_length">
            <el-input v-model="formData.car_length" placeholder="请输入长度(mm)" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="宽度(mm):" prop="car_width">
            <el-input v-model="formData.car_width" placeholder="请输入宽度(mm)" clearable :style="{width: '100%'}" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高度(mm):" prop="car_height">
            <el-input v-model="formData.car_height" placeholder="请输入高度(mm)" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="前轮距(mm):" prop="wheel_distance">
            <el-input v-model="formData.wheel_distance" placeholder="请输入前后轮距(mm)" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后轮距(mm):" prop="rear_track">
            <el-input v-model="formData.rear_track" placeholder="请输入前后轮距(mm)" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="轴距(mm):" prop="wheelbase">
            <el-input v-model="formData.wheelbase" placeholder="请输入轴距(mm)" clearable :style="{width: '100%'}" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整车整备质量(kg):" prop="vehicle_weight">
            <el-input v-model="formData.vehicle_weight" placeholder="请输入整车整备质量（kg）" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总质量(kg):" prop="all_weight">
            <el-input v-model="formData.all_weight" placeholder="请输入总质量(kg)" clearable
              :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标台系数:" prop="coefficient">
            <el-input v-model="formData.coefficient" placeholder="请输入标台系数" clearable :style="{width: '100%'}" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-dept-emp-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      placeholder:'请选择所属组织',
      formData: {
        v_num	: '',
        lp_num: '',
        group: '',
        fra_num: '',
        reg_num: '',
        reg_date: '',
        lea_date: '',
        ins_date: '',
        check_date: '',
        up_date: '',
        cid: '',
        product_factory: '',
        seat_count: '',
        allow_number: '',
        auto_emissions: '',
        emission_standards: '',
        fuel_type: '',
        car_body_color: '',
        car_length: '',
        car_width: '',
        car_height: '',
        wheel_distance: '',
        rear_track: '',
        wheelbase: '',
        vehicle_weight: '',
        all_weight: '',
        coefficient: '',
        engine_number: '',
        card_color: '',
        last_two_date: '',
        last_two_mile: '',
        licence_code: '',
        use_type: '',
        manage_scope: '',
        manage_type: '',
        use_date: '',
        stop_station: '',
      },
      rules: {
        v_num: [{
          required: true,
          message: '请输入车辆自编号',
          trigger: 'blur'
        }],
        lp_num: [{
          required: true,
          message: '请输入车牌号',
          trigger: 'blur'
        }],
        group: [{
          required: true,
          message: '请选择车辆组织架构',
          trigger: 'change'
        }],
        reg_date: [{
          required: true,
          message: '请输入登记证书日期',
          trigger: 'blur'
        }],
        cid: [{
          required: true,
          message: '请选择车辆型号',
          trigger: 'change'
        }],
      },
      veh_typeOptions: [],
      emission_standardsOptions: [],
    }
  },
  mounted() {
    this.getVehType()
  },
  methods: {
    // 初始化数据
    resetData(){
      Object.assign(this.$data.formData, this.$options.data().formData);
      setTimeout(() => {
        // alert(111)
        this.$refs.baseTree.onClear()
      }, 30);
    },
    // 数据回显
    setData(val){
      console.log(val,555)
      Object.keys(this.formData).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.formData[key] = val[key]
        }
      })
      this.formData.product_factory = val.factory
      this.formData.seat_count = val.seats_num
      this.formData.allow_number= val.permit_num
      this.formData.auto_emissions = val.displacement
      this.formData.emission_standards = val.standard_name
      this.formData.fuel_type = val.fuel_name
      this.formData.car_body_color = val.color
      this.formData.car_length = val.length
      this.formData.car_width = val.width
      this.formData.car_height = val.height
      this.formData.wheel_distance = val.wheel_space
      this.formData.rear_track = val.rear_track 
      this.formData.wheelbase = val.shaft_space
      this.formData.vehicle_weight = val.permit_quality
      this.formData.all_weight = val.total_quality
      this.formData.coefficient = val.index
      this.formData.line_name = val.line_name
      this.formData.engine_number = val.engine_number

      this.formData.card_color = val.card_color
      this.formData.last_two_date = val.last_two_date
      this.formData.last_two_mile = val.last_two_mile
      this.formData.licence_code = val.licence_code
      this.formData.use_type = val.use_type
      this.formData.manage_scope = val.manage_scope
      this.formData.manage_type = val.manage_type
      this.formData.use_date = val.use_date
      this.formData.stop_station = val.stop_station
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '带*为必填项请填写完整'
            })
            return
          }
          resolve({
            formData: this.formData,
            result:200,
            msg: '获取成功'

          })
        })
      })
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
    // 车辆型号修改  获取车辆型号的基础信息
    carTypeChange(val){
      this.formData.product_factory = ''
      this.formData.seat_count = ''
      this.formData.allow_number = ''
      this.formData.auto_emissions = ''
      this.formData.emission_standards = ''
      this.formData.fuel_type = ''
      this.formData.car_body_color = ''
      this.formData.car_length = ''
      this.formData.car_width = ''
      this.formData.car_height = ''
      this.formData.wheel_distance = ''
      this.formData.rear_track = ''
      this.formData.wheelbase = ''
      this.formData.vehicle_weight = ''
      this.formData.all_weight = ''
      this.formData.coefficient = ''
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
        this.formData.rear_track = filterObj[0].rear_track
        this.formData.wheelbase = filterObj[0].shaft_space
        this.formData.vehicle_weight = filterObj[0].permit_quality
        this.formData.all_weight = filterObj[0].total_quality
        this.formData.coefficient = filterObj[0].index
      }
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
  }
}

</script>
<style>
</style>
