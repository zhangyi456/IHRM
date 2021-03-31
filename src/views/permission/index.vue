<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识 " prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="deleteBtn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 权限按钮的弹层 -->
    <el-dialog :title="showText" :visible="showEditDialog" @close="btnCancel">
      <el-form
        ref="permissionForm"
        label-width="120px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限详情" prop="description">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启" prop="name">
          <!--  active-value="1" inactive-value="0" 这两个值是element-ui 中 switch的属性值，用来表示其中打开和关闭的值 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="btnOk">确定</el-button>
          <el-button @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermission,
  updatePermission,
  addPermission,
  getPermissionDetail
} from '@/api/permission'
import { tranListToTree } from '@/utils'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      showEditDialog: false,
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  watch: {},
  created() {
    this.getPermissionList()
  },
  mounted() {},
  methods: {
    // 获取组织架构的权限列表
    async getPermissionList() {
      this.list = tranListToTree(await getPermissionList(), '0')
    },
    deleteBtn(id) {
      try {
        this.$confirm('确定要删除吗？').then(async() => {
          await delPermission(id)
          this.getPermissionList()
          this.$message.success('操作成功')
        })
      } catch (error) {
        console.log(error)
      }
    },
    addPermission(type, pid) {
      this.formData.pid = pid
      this.formData.type = type
      this.showEditDialog = true
    },
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showEditDialog = true
    },
    btnOk() {
      this.$refs.permissionForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showEditDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permissionForm.resetFields()
      this.showEditDialog = false
    }
  }
}
</script>

<style scoped lang="less"></style>
