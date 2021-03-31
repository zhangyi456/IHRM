<template>
  <el-dialog
    title="添加"
    :visible="showRoleDialog"
    width="50%"
    @close="btnCancel"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="end">
      <el-col :span="6">
        <el-button size="mini" @click="btnCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="btnOk">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
      require: true
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleList: [], // 这里是所有的角色信息
      roleIds: [] // 这是当前用户拥有的角色信息
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleList()
    // this.getUserDetailById()
  },
  mounted() {},
  methods: {
    // 获取所有角色的方法
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.roleList = rows
    },
    // 获取用户角色的方法
    // !这里重要的一点就是不能直接用this.userId.因为这个是父组件传过来的值，所以我们需要在父组件中去调用该方法，实现获取用户的角色
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
