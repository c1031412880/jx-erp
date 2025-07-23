<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="1080px"  :append-to-body="appendToBody">
    <div v-loading="detailLoading">
      <el-tabs v-model="activeName">
        <el-tab-pane label="党员基本信息" name="first">
          <base-info ref="baseInfo" :curChangeType="curChangeType" @send-relevance="sendRelevance"></base-info>
        </el-tab-pane>
        <el-tab-pane label="党籍和组织关系" name="second" v-if="curChangeType != 'add'">
          <party-org-relations ref="partyOrgRelations" :curChangeType="curChangeType"></party-org-relations>
        </el-tab-pane>
        <el-tab-pane label="职务" name="third" v-if="curChangeType != 'add'">
          <team-members ref="teamMembers" :curChangeType="curChangeType"></team-members>
        </el-tab-pane>
        <el-tab-pane label="荣誉" name="fourth" v-if="curChangeType != 'add'">
          <honor-information ref="honorInformation" :curChangeType="curChangeType"></honor-information>
        </el-tab-pane>
        <el-tab-pane label="家庭成员" name="five" v-if="curChangeType != 'add'">
          <member-family ref="memberFamily" :curChangeType="curChangeType"></member-family>
        </el-tab-pane>
        <el-tab-pane label="入党信息" name="six" v-if="curChangeType != 'add'">
          <enter-party-info ref="enterPartyInfo" :curChangeType="curChangeType"></enter-party-info>
        </el-tab-pane>
        <el-tab-pane label="缴纳党费" name="seven" v-if="curChangeType != 'add'">
          <pay-dues ref="payDues" :curChangeType="curChangeType"></pay-dues>
        </el-tab-pane>
        <el-tab-pane label="培养发展" name="eight" v-if="curChangeType != 'add'">
          <develop-info ref="developInfo" :curChangeType="curChangeType"></develop-info>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail' && (activeName ==  'first' || activeName ==  'second' || activeName ==  'six' || activeName ==  'eight')">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import baseInfo from '../main-info/base-info';
import partyOrgRelations from '../main-info/party-org-relations';
import teamMembers from '../main-info/team-members';
import payDues from '../main-info/pay-dues';
import memberFamily from '../main-info/member-family';
import honorInformation from '../main-info/honor-information.vue';
import enterPartyInfo from '../main-info/enter-party-info.vue';
import developInfo from '../main-info/develop-info.vue';
export default {
  components: {
    baseInfo,
    partyOrgRelations,
    teamMembers,
    payDues,
    memberFamily,
    honorInformation,
    enterPartyInfo,
    developInfo
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
    appendToBody:{
      type: Boolean,
      default: false
    },
    detailLoading:{
      type: Boolean,
      default : false
    },
  },
  data() {
    return {
      selectedId: '', //当前操作的事故记录ID
      activeName: 'first',
      showTitle:'添加',

    }; 
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
      }else{
        this.activeName = 'first';
        this.configInfo();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configInfo() {
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
          this.$refs['partyOrgRelations'].resetData() // 党籍和组织关系清除
          this.$refs['teamMembers'].resetData()  // 职务清除
          this.$refs['payDues'].resetData()  // 党费缴纳清除
          this.$refs['memberFamily'].resetData()  // 家庭成员信息清除
          this.$refs['honorInformation'].resetData()  // 荣誉清除
          this.$refs['enterPartyInfo'].resetData()  // 入党信息清除
          this.$refs['developInfo'].resetData()  // 入党信息清除
        }
      },60)
    },
    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
        this.$refs['partyOrgRelations'].setData(val)
        this.$refs['teamMembers'].setData(val)
        this.$refs['payDues'].setData(val)
        this.$refs['memberFamily'].setData(val)
        this.$refs['honorInformation'].setData(val)
        this.$refs['enterPartyInfo'].setData(val)
        this.$refs['developInfo'].setData(val)
        // if(this.curChangeType == 'detail') {
        // }
        
      }, 60);
    },
    // table页信息关联
    sendRelevance(val) {
      if(this.curChangeType == 'edit') {
        this.$refs.partyOrgRelations.setFormData(val)
      }
    },
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      let promiseAllInfoList = [];
      const baseInfo = getFormData('baseInfo')
      promiseAllInfoList.push(baseInfo)
      if(this.curChangeType == 'edit') {
        const partyOrgRelations = getFormData('partyOrgRelations')
        const enterPartyInfo = getFormData('enterPartyInfo')
        const developInfo = getFormData('developInfo')
        promiseAllInfoList.push(partyOrgRelations)
        promiseAllInfoList.push(enterPartyInfo)
        promiseAllInfoList.push(developInfo)
        
      }

      Promise.all(promiseAllInfoList)
      .then(res => {
        let partyMembersArchivesInfo = {
          baseInfo: res[0].formData,
          partyOrgRelations: null,
          enterPartyInfo: null,
          partyMembersArchivesInfo: null
        }
        if(this.curChangeType == 'edit') {
          partyMembersArchivesInfo.partyOrgRelations = res[1].formData? res[1].formData: null
          partyMembersArchivesInfo.enterPartyInfo = res[2].formData? res[2].formData: null
          partyMembersArchivesInfo.developInfo =  res[3].formData? res[3].formData: null
        }


        // 合并信息
        let params = Object.assign({},partyMembersArchivesInfo.baseInfo,partyMembersArchivesInfo.partyOrgRelations,partyMembersArchivesInfo.enterPartyInfo,partyMembersArchivesInfo.developInfo)
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
