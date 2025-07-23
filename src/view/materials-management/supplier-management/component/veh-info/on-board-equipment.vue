<template>
  <div style="height:510px;overflow-x:hidden">
    <el-row :gutter="20">
      <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="140px">
        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">车载设备</p>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车载终端类型:" prop="terminal_code">
            <tr-select-dictionaries
              placeholder="选择车载终端类型"
              class-key="车载终端类型"
              v-model="formData.car_ter"></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="视频监控设备:" prop="monitoring_type">
            <tr-select-dictionaries
              placeholder="选择视频监控设备"
              class-key="视屏监控设备类型"
              v-model="formData.video_mon">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客流分析仪:" prop="passenger_flow_analyzer">
            <tr-select-dictionaries
              placeholder="选择客流分析仪"
              class-key="客流分析仪"
              v-model="formData.passenger_ana">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全预警设备:" prop="warning_equipment">
            <tr-select-dictionaries
              placeholder="选择安全预警设备"
              class-key="主动安全预警设备"
              v-model="formData.safty_warn">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行车记录仪:" prop="dashcam">
            <tr-select-dictionaries
              placeholder="选择行车记录仪"
              class-key="行车记录仪型号"
              v-model="formData.dashcam">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="360环视型号:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择360环视型号"
              class-key="360环视型号"
              v-model="formData.round_type">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">其他</p>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变速箱:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择变速箱"
              class-key="变速箱"
              v-model="formData.trans">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地板结构:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择地板结构"
              class-key="地板结构"
              v-model="formData.floor_str">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="残疾人无障碍挡板:" prop="look_around_type">
            <el-radio-group v-model="formData.baffle">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驾驶区域安全防护:" prop="look_around_type">
            <el-radio-group v-model="formData.protection">
              <el-radio :label="1">全包围</el-radio>
              <el-radio :label="2">铁杆防护隔离</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="空调品牌:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择空调品牌"
              class-key="空调品牌"
              v-model="formData.air_brand">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自动喷淋系统:" prop="look_around_type">
            <el-radio-group v-model="formData.auto_sprink">
              <el-radio :label="1">安装</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车窗结构:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择车窗结构"
              class-key="车窗结构"
              v-model="formData.windows_str">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="缓速器品牌:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择缓速器品牌"
              class-key="缓速器品牌"
              v-model="formData.slow_brand">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="底盘集中润滑:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择底盘集中润滑"
              class-key="底盘集中润滑"
              v-model="formData.lubrication">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冷却系统:" prop="look_around_type">
            <tr-select-dictionaries
              placeholder="选择冷却系统"
              class-key="冷却系统"
              v-model="formData.cool_sys">
            </tr-select-dictionaries>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        trans: '',
        floor_str: '',
        baffle: 0,
        protection: 1,
        air_brand: '',
        auto_sprink: 0,
        windows_str: '',
        slow_brand: '',
        lubrication: '',
        cool_sys: '',
        car_ter: '',
        video_mon:'',
        passenger_ana:'',
        safty_warn:'',
        dashcam:'',
        round_type:'',
      },
      rules: {
      },
    }
  },
  methods: {
    // 初始化数据
    resetData(){
      Object.assign(this.$data.formData, this.$options.data().formData);
    },
    // 数据回显
    setData(val){
      Object.keys(this.formData).forEach(key => {
        if (val.hasOwnProperty(key)) {
          if (val[key]) {
            this.formData[key] = val[key]
          }
        }
      })
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '请填写完整参数'
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
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    }
  }
}

</script>
<style>
</style>
