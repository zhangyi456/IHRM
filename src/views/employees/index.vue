<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import?type=user')"
          >Excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">Excel导出</el-button>
          <el-button size="small" type="primary" @click="dialogVisible = true">
            新增员工
          </el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }" style="width: 130px">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmpolyment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
            }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                :disabled="!checkPermission('POINT-USER-UPDATE')"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small" :disabled="!checkPermission('become-but')">转正</el-button>
              <el-button type="text" size="small" :disabled="!checkPermission('POINT-USER_DIAOGANG')">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" :disabled="!checkPermission('POINT-USER-ROLES')" @click="assignBtn(row.id)">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployees(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 这里要记得将弹出层的组件放在card外面，这样$parent找到父级才不是card这一项 -->
    <AddEmployess :dialog-visible.sync="dialogVisible" />
    <!-- 图片生成二维码的弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 角色分配弹层 -->
    <assign-role
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployeesInfo, deleteEmployees } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 导入枚举JS文件
import AddEmployess from './components/add-employess'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  name: 'Asd',
  components: {
    AddEmployess,
    AssignRole
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0 // 总数居条数
      },
      userId: null,
      dialogVisible: false,
      showCodeDialog: false, // 二维码弹层
      showRoleDialog: false // 角色的弹层
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getEmployeesInfo()
  },
  mounted() {},
  methods: {
    async getEmployeesInfo() {
      const { total, rows } = await getEmployeesInfo(this.page)
      this.list = rows
      this.page.total = total
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeesInfo()
    },
    formatEmpolyment(row, column, cellValue, index) {
      const object = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return object ? object.value : '未知'
    },
    deleteEmployees(id) {
      try {
        this.$confirm('确定要删除吗?').then(async() => {
          await deleteEmployees(id)
          this.getEmployeesInfo()
          this.$message.success('删除成功')
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel数据
    exportData() {
      //  做操作
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeesInfo({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows) //! 这里是获取的所有数据，用一页来显示
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
      })
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间，这里是用的是时间过滤器
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url === ' ' || url === null) {
        this.$message.warning('该用户还未上传头像')
      } else {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        console.log(url)
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // console.log(url)
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      }
    },
    async assignBtn(id) {
      this.userId = id
      console.log(id)
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style scoped lang="less"></style>
