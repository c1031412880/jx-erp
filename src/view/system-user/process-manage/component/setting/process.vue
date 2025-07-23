<template>
  <div class="process">
    <div class="process-name">{{"流程设置"}}</div>
    <div class="process-content" style="padding:20px 0;">
      <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
      <p style="margin-left:10px;color:#666;font-weight:600">允许加签</p>
    </div>
    <div class="process-content" style="justify-content: space-between;">
      <div>{{"开启后审批单可以新增临时审批人"}}</div>
      <el-switch v-model="formData.is_add_check"  :active-value="1" :inactive-value="0"></el-switch>
    </div>
    <div v-if="object_id != 30">
      <div class="process-content" style="padding:20px 0;">
        <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
        <p style="margin-left:10px;color:#666;font-weight:600">连续审批默认同意</p>
      </div>
      <div class="process-content" style="justify-content: space-between;">
        <div>{{"同一个审批人在连续审批时只需审批一次，此规则将在完成审批时生效"}}</div>
        <el-switch v-model="formData.is_same_pass" :active-value="1" :inactive-value="0"></el-switch>
      </div>
    </div>
    <div class="process-content" style="padding:20px 0;">
      <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
      <p style="margin-left:10px;color:#666;font-weight:600">手写签名</p>
    </div>
    <div class="process-content" style="justify-content: space-between;">
      <div>{{"审批人必须手写签名方可同意审批"}}</div>
      <el-switch v-model="formData.write_sign" @change="changeSign"></el-switch>
    </div>
    <div style="padding:10px 0 0 16px;">
        <div style="padding:10px 0"><el-radio :disabled="!formData.write_sign" v-model="formData.is_sign" :label="1">使用上次签名</el-radio></div>
        <div style="padding:10px 0"><el-radio :disabled="!formData.write_sign" v-model="formData.is_sign" :label="2">每次重新签名</el-radio></div>
    </div>
    <div class="process-content" style="padding:20px 0;">
      <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
      <p style="margin-left:10px;color:#666;font-weight:600">审批人退回</p>
    </div>
    <div class="process-content" style="justify-content: space-between;">
      <div>{{"允许审批人退回到发起人"}}</div>
      <el-switch v-model="formData.return_back" @change="changeBack"></el-switch>
    </div>
    <div style="padding:10px 0 0 16px;">
        <div style="padding:10px 0"><el-radio :disabled="!formData.return_back" v-model="formData.is_again" :label="1">重新提交后流程也重新开始</el-radio></div>
        <div style="padding:10px 0"><el-radio :disabled="!formData.return_back" v-model="formData.is_again" :label="2">重新提交后流程从退回节点开始</el-radio></div>
    </div>
    <div v-if="object_id != 1350">
      <div class="process-content" style="padding:20px 0;">
        <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
        <p style="margin-left:10px;color:#666;font-weight:600">允许代他人提交</p>
      </div>
      <div class="process-content" style="justify-content: space-between;">
        <div style="padding:0 0 10px 0;">{{"指定人员可代他人提交审批"}}</div>
        <el-switch v-model="formData.is_replace" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div style="padding:10px 0 0 16px;" v-if="!!formData.is_replace">
        <fc-org-select ref="copy-org" :tabList="['user']" v-model="formData.behalfs" buttonType="button" title="指定人员"/>
      </div>
    </div>
    <div class="process-content" style="padding:20px 0;">
      <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
      <p style="margin-left:10px;color:#666;font-weight:600">修改审批时间</p>
    </div>
    <div class="process-content" style="justify-content: space-between;">
      <div style="padding:0 0 10px 0;">{{"指定人员可修改审批时间"}}</div>
      <el-switch v-model="formData.is_update_form" :active-value="1" :inactive-value="0"></el-switch>
    </div>
    <div style="padding:10px 0 0 16px;" v-if="!!formData.is_update_form">
      <fc-org-select ref="copy-org" :tabList="['user']" v-model="formData.form_users" buttonType="button" title="指定人员"/>
    </div>

    <div class="process-content" style="padding:20px 0;justify-content: space-between;">
      <div>
        <div style="float: left; width: 6px; height: 18px; background: #31A7FF;"></div>
        <p style="margin-left:10px;color:#666;font-weight:600">审批通过后允许撤销审批单</p>
      </div>
      <el-switch v-model="formData.is_cancel" :active-value="1" :inactive-value="0"></el-switch>
    </div>
    <div>
      <div style="padding:0 0 10px 0;">
        <el-select v-model="formData.cancel_time" placeholder="请选择" size="mini" style="width: 80px">
          <el-option v-for="itm in 30" :key="itm" :label="itm" :value="itm"></el-option>
        </el-select>
        天内已通过的审批单
      </div>
      <div style="padding:0 0 10px 0;color: #818181">
        {{"撤销需要审批人重新审批通过"}}
        <el-switch v-model="formData.cancel_check" :active-value="1" :inactive-value="0"></el-switch>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["tabName","formData", "object_id"],
  data() {
    return {
      activeName: "process",
      // formData: {
      //   is_add_check: 0,
      //   write_sign: false,
      //   is_sign: 0
      // },
    };
  },
  created() {
  },
  methods: {
    changeBack(val) {
      if (val) return this.formData.is_again = 1
      if (!val) return this.formData.is_again = 0
    },
    changeReplace(val) {
      // if (val) return this.formData.is_replace = 1
      // if (!val) return this.formData.is_replace = 0
    },
    changeSign(val) {
      if (val) return this.formData.is_sign = 1
      if (!val) return this.formData.is_sign = 0
    },
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return { formData: this.formData, target: this.tabName }
    }
  }
};
</script>
<style lang="scss" scoped>
  .process {
    padding: 10px 5px 50px 20px;
    height: calc(100vh - 150px);
    overflow-y: scroll;
    &-name {
      font-size: 18px;
      font-weight: 600;
      text-indent: 1rem;
    }
    &-content {
      padding-left: 16px;
      display: flex;
      align-items:center;
    }
  }
  .process::-webkit-scrollbar {
    width: 6px;
    height: 1px;
  }
  .process::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #888888;
  }
</style>>

