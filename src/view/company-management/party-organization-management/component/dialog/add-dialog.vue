<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="1080px"  :append-to-body="appendToBody">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="党组织基本信息" name="first">
          <base-info ref="baseInfo" :curChangeType="curChangeType"></base-info>
        </el-tab-pane>
        <el-tab-pane label="成员班子" name="second" v-if="curChangeType != 'add'">
          <team-members ref="teamMembers" :curChangeType="curChangeType"></team-members>
        </el-tab-pane>
        <el-tab-pane label="党组织成员" name="third" v-if="curChangeType != 'add'">
          <period-members ref="periodMembers" :curChangeType="curChangeType"></period-members>
        </el-tab-pane>
        <el-tab-pane label="党组织工作信息" name="fourth" v-if="curChangeType != 'add'">
          <party-organization-work-info ref="partyOrganizationWorkInfo" :curChangeType="curChangeType"></party-organization-work-info>
        </el-tab-pane>
        <el-tab-pane label="荣誉信息" name="five" v-if="curChangeType != 'add'">
          <honor-information ref="honorInformation" :curChangeType="curChangeType"></honor-information>
        </el-tab-pane>
        <!-- <el-tab-pane label="结案" name="six" v-if="curChangeType != 'add'">
          <law-finish ref="lawFinish" :curChangeType="curChangeType"></law-finish>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail' && activeName ==  'first'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import baseInfo from '../main-info/base-info';
import teamMembers from '../main-info/team-members';
import periodMembers from '../main-info/period-members.vue';
import partyOrganizationWorkInfo from '../main-info/party-organization-work-info';
import honorInformation from '../main-info/honor-information.vue';
export default {
  components: {
    baseInfo,
    teamMembers,
    periodMembers,
    partyOrganizationWorkInfo,
    honorInformation},
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
    appendToBody:{
      type: Boolean,
      default: true
    },
    detailLoading:{
      type: Boolean,
      default : false
    },
  },
  data() {
    return {
      selectedId: '', //当前操作的记录ID
      activeName: 'first',
      showTitle:'添加',

    }; 
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.activeName = 'first';
        this.configAddStaffInfo();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configAddStaffInfo() {
      if(this.curChangeType == 'add') {
        this.showTitle = '添加';
      }else if(this.curChangeType == 'edit'){
        this.showTitle = '编辑'
      }else{
        this.showTitle = '详情'
      }
    },
    resetData(){
      setTimeout(() => {
        this.$refs['baseInfo'].resetData()  // 基础信息清除
        if(this.curChangeType != 'add') {
          this.$refs['teamMembers'].resetData()  // 成员班子信息清除
          this.$refs['periodMembers'].resetData()  // 党组织成员信息清除
          this.$refs['partyOrganizationWorkInfo'].resetData()  // 党组织工作信息清除
          this.$refs['honorInformation'].resetData()  // 荣誉信息清除
        }
      },60)
      
    },

    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
        this.$refs['teamMembers'].setData(val);
        this.$refs['periodMembers'].setData(val)
        this.$refs['partyOrganizationWorkInfo'].setData(val)
        this.$refs['honorInformation'].setData(val)
        // if(this.curChangeType == 'detail') {
        // }
        
      }, 60);
    },
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const baseInfo = getFormData('baseInfo')

      Promise.all([baseInfo])
      .then(res => {
        const partyOrganizationInfoSum = {
          baseInfo: res[0].formData,
        }
        // 合并信息
        let params = Object.assign({},partyOrganizationInfoSum.baseInfo)
        // console.log(params)
        // return

        if(this.curChangeType == 'edit') {
          params.id = this.selectedId;
        }

        this.$emit('sure-save-info', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
