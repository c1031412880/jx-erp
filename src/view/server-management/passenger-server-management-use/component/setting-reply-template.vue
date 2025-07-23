<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="回复模板设置"
    width="800px"
    @close="handleClose"
  >
    <div style="margin-bottom: 10px;">
      <el-button type="primary" size="mini" @click="addTemplate">添加回复模板</el-button>
    </div>
    <tr-table
      :data="tableData"
      :tableHeaderList="tableHeaderList"
      :TableHeight="400"
    >
      <template slot-scope="scope" slot="is_default">
        <el-switch
          v-model="scope.data.is_default"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
          @change="setDefault(scope.data, scope.index)"
        >
        </el-switch>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editTemplate(scope.data, scope.index)">编辑</el-button>
        <el-button type="text" size="mini" style="color: red;" @click="deleteTemplate(scope.data, scope.index)">删除</el-button>
      </template>
    </tr-table>
    <el-dialog
      :visible.sync="editDialogVisible"
      :title="(editIndex === null ? '添加' : '编辑') + '回复模板'"
      width="500px"
      append-to-body
      @close="closeEditDialog"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="回复内容" required>
          <el-input
            type="textarea"
            v-model="editForm.content"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="saveTemplate">确 定</el-button>
      </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ReplyTemplateSettingDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      tableHeaderList: [
        { id: 1, label: '回复内容', prop: 'content', width: '', align: 'left', signIndex: 0 },
        { id: 2, label: '是否默认', prop: 'is_default', width: '100', align: 'center', signIndex: 1 },
        { id: 3, label: '操作', prop: 'operation', width: '120', align: 'center', signIndex: 2 }
      ],
      editDialogVisible: false,
      editForm: {
        id: null,
        content: ''
      },
      editIndex: null
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getList()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    handleSave() {
      const params = {
        context: this.tableData.map(item => ({
          id: item.id,
          content: item.content,
          is_default: item.is_default
        }))
      }
      this.$client.SaveReplyTemplate(params).then(res => {
        if (res.head && res.head.result === '200') {
          this.$message.success('保存成功')
          this.handleClose()
        } else {
          this.$message.error(res.head ? res.head.describle : '保存失败')
        }
      })
    },
    getList() {
      this.$client.GetReplyTemplateList({is_default: 0}).then(res => {
        if (res.head && res.head.result === '200') {
          this.tableData = (res.context || []).map((item, idx) => ({
            ...item,
            index: idx + 1
          }))
        } else {
          this.tableData = []
        }
      })
    },
    addTemplate() {
      this.editForm = { id: null, content: '' }
      this.editIndex = null
      this.editDialogVisible = true
    },
    editTemplate(row, index) {
      this.editForm = { id: row.id, content: row.content }
      this.editIndex = index
      this.editDialogVisible = true
    },
    closeEditDialog() {
      this.editDialogVisible = false
    },
    saveTemplate() {
      if (!this.editForm.content.trim()) {
        this.$message.warning('回复内容不能为空')
        return
      }
      
      if (this.editIndex === null) {
        // 新增
        this.tableData.push({
          id: null,
          content: this.editForm.content,
          is_default: 0,
          index: this.tableData.length + 1
        })
      } else {
        // 编辑
        this.tableData[this.editIndex].content = this.editForm.content
      }
      
      this.editDialogVisible = false
    },
    deleteTemplate(row, index) {
      this.$confirm('确定删除该模板吗？', '提示', { type: 'warning' }).then(() => {
        this.tableData.splice(index, 1)
        // 重新设置序号
        this.tableData.forEach((item, idx) => {
          item.index = idx + 1
        })
      })
    },
    setDefault(row, index) {
      if (row.is_default === 1) {
        // 如果当前设置为默认，则只需要将其他项设为0
        this.tableData.forEach(item => { 
          if (item !== row) {
            item.is_default = 0 
          }
        })
      } else {
        // 如果当前取消默认，允许没有默认项
        row.is_default = 0
      }
    }
  }
}
</script> 