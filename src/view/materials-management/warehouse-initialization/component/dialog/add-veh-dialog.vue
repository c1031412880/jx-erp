<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="760px" >
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <base-info ref="baseInfo"></base-info>
        </el-tab-pane>
        <!-- <el-tab-pane label="车载设备" name="third">
          <on-board-equipment ref="onBoardEquipment"></on-board-equipment>
        </el-tab-pane>
        <el-tab-pane label="证件信息" name="fourth">
          <certificate-info ref="certificateInfo"></certificate-info>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" >
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import BaseInfo from '../veh-info/base-info';
import OnBoardEquipment from '../veh-info/on-board-equipment.vue';
import CertificateInfo from '../veh-info/certificate-info.vue';
export default {
  components: {BaseInfo, OnBoardEquipment,CertificateInfo},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: ''
    },
    // wuziOptions1: {
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      form: {
        id: 0
      },
      activeName: 'first',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData()
      }else{
        setTimeout(() => {
          // this.$refs.baseInfo.wuziOptions = this.wuziOptions1
          this.$refs['baseInfo'].getwuzi()
        }, 200);
      }
    },
    title(newVal) {
      this.title = newVal
    }
  },
  methods: {
    resetData(){
      setTimeout(() => {
        this.$refs['baseInfo'].resetData()  // 基础信息清除
        // this.$refs['onBoardEquipment'].resetData()  // 车载设备信息清除
        // this.$refs['certificateInfo'].resetData()  // 车载设备信息清除
      }, 100);
    },
    // 编辑时数据回显
    setData(val){
      this.form.id = val.id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
        // this.$refs['onBoardEquipment'].setData(val)
        // this.$refs['certificateInfo'].loadData(val.v_num)
      }, 200);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitFormData() {
      Promise.all([this.$refs.baseInfo.getData()])
      .then(res => {
        const param = {
          baseInfo: res[0].formData,
        }
        Object.assign(this.form, param.baseInfo);
        this.$emit('on-set-form',this.form)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    // 提交图片信息
    addImgData(veh_code){
      this.$refs.certificateInfo.submitImg(veh_code,'add')
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
