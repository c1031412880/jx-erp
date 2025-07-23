<template>
  <el-dialog
    :visible="dialogBool"
    title="驾驶员安全档案"
    :before-close="dialogClose"
    width="950px"
    :close-on-click-modal="false"
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName">
        <el-tab-pane label="驾驶档案" name="first">
          <driving-records ref="drivingRecords" :curSelecedType="curSelecedType"></driving-records>
        </el-tab-pane>
        <el-tab-pane label="事故信息" name="second" v-if="curSelecedType == 'detail'">
          <accident-info ref="accidentInfo" :curSelecedType="curSelecedType"></accident-info>
        </el-tab-pane>
        <el-tab-pane label="违法信息" name="third" v-if="curSelecedType == 'detail'">
          <violation-information  ref="violationInformation" :curSelecedType="curSelecedType"></violation-information>
        </el-tab-pane>
        <el-tab-pane label="违规信息" name="fourth" v-if="curSelecedType == 'detail'">
          <illegal-info ref="illegalInfo" :curSelecedType="curSelecedType"></illegal-info>
        </el-tab-pane>
        <el-tab-pane label="好人好事" name="five" v-if="curSelecedType == 'detail'">
          <good-deed ref="goodDeed" :curSelecedType="curSelecedType"></good-deed>
        </el-tab-pane>
        <el-tab-pane label="安全培训" name="six" v-if="curSelecedType == 'detail'">
          <safety-training ref="safetyTraining" :curSelecedType="curSelecedType"></safety-training>
        </el-tab-pane>
        <el-tab-pane label="安全里程" name="seven" v-if="curSelecedType == 'detail'">
          <safety-distance ref="safetyDistance" :curSelecedType="curSelecedType"></safety-distance>
        </el-tab-pane>
        <el-tab-pane label="调动记录" name="eight" v-if="curSelecedType == 'detail'">
          <transfer-record ref="transferRecord" :curSelecedType="curSelecedType"></transfer-record>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="submitFormData()" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import drivingRecords from '././main-info/driving-records';
import accidentInfo from '././main-info/accident-info';
import violationInformation  from '././main-info/violation-information';
import illegalInfo  from '././main-info/illegal-info';
import goodDeed  from '././main-info/good-deed';
import safetyTraining  from '././main-info/safety-training';
import safetyDistance  from '././main-info/safety-distance';
import transferRecord  from '././main-info/transfer-record';
export default {
  components: {
    drivingRecords,
    accidentInfo,
    violationInformation,
    illegalInfo,
    goodDeed,
    safetyTraining,
    safetyDistance,
    transferRecord
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    classifyOptions:[Array],//所属类别
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },

    resetData(){
      setTimeout(() => {
        this.$refs['drivingRecords'].resetData()  // 信息清除
        if(this.curSelecedType == 'detail') {
          this.$refs['accidentInfo'].resetData()  // 信息清除
          this.$refs['violationInformation'].resetData()  // 信息清除
          this.$refs['illegalInfo'].resetData()  //信息清除
          // this.$refs['goodDeed'].resetData()  // 信息清除
          // this.$refs['safetyTraining'].resetData()  // 信息清除
          // this.$refs['safetyDistance'].resetData()  // 信息清除
          this.$refs['transferRecord'].resetData()  //信息清除
        }
      },60)
      
    },

    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.i_id
      setTimeout(() => {
        this.$refs['drivingRecords'].setData(val);
        if(this.curSelecedType == 'detail') {
          this.$refs['accidentInfo'].setData(val);
          this.$refs['violationInformation'].setData(val)
          this.$refs['illegalInfo'].setData(val)
          // this.$refs['goodDeed'].setData(val)
          // this.$refs['safetyTraining'].setData(val)
          // this.$refs['safetyDistance'].setData(val)
          this.$refs['transferRecord'].setData(val)
        }
      }, 60);
    },
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const drivingRecords = getFormData('drivingRecords')

      Promise.all([drivingRecords])
      .then(res => {
        const staffInfoSum = {
          drivingRecords: res[0].formData,
        }
        // 合并信息
        let params = Object.assign({},staffInfoSum.drivingRecords)
        this.$emit('sure-save-info', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}
.el-dialog-div {
  height: 520px;
}
</style>


