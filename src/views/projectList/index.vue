<template>
  <div class="app-contenner">
    <template>
      <el-table :data="data" 
      border 
      style="width: 100%"
      element-loading-text="加载数据中"
      fit
      highlight-current-row>
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="项目名称" width="150">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
          </template>
        </el-table-column>

        <el-table-column label="项目描述">
          <template slot-scope="scope">
            {{ scope.row.description.toString() }}
            <!-- description的数据为数组类型，所以要转为字符串显示 -->
          </template>
        </el-table-column>

        <el-table-column label="预览图" width="150">
          <template slot-scope="scope">
            <el-image :src="scope.row.thumb" style="width:120px" :preview-src-list="srcList">
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="github" placement="top" :hide-after="2000">
              <el-button type="info" icon="iconfont icon-github" circle size="mini"
                @click="openGitHubHandle(scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"
                @click="editProjectHandle(scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
              <el-button type="danger" icon="el-icon-delete" circle size="mini"
                @click="deleteProjectHandle(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="请编辑该项目信息" :fullscreen="true" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="项目名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="项目描述(每一项描述请用英文逗号分隔)">
            <el-input v-model="form.description"></el-input>
          </el-form-item>

          <el-form-item label="项目链接">
            <el-input v-model="form.url"></el-input>
          </el-form-item>

          <el-form-item label="github地址">
            <el-input v-model="form.github"></el-input>
          </el-form-item>

          <Upload uploadTitle="预览图" v-model="form.thumb"></Upload>

          <el-form-item label="排序等级">
            <el-select v-model="form.order" placeholder="请选择项目等级">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditProjectHandle">确 定</el-button>
        </div>
      </el-dialog>
    </template>

  </div>
</template>

<script>
import { getProject } from '@/api/project'
import { server_URL } from '@/urlConfig'
import Upload from '@/components/Upload.vue'
import { setProject, delProject } from '@/api/project'
export default {
  data() {
    return {
      data: [],
      srcList: [], // 数组存放预览图地址
      listLoading: false,
      dialogFormVisible: false,
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1,
      },
    }
  },
  components: {
    Upload
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getProject().then(({ data }) => {
        this.data = data;
        this.listLoading = false;
        for (let i of this.data){
          // i.thumb2 = server_URL + i.thumb;
          this.srcList.push(i.thumb)
        }
      })
    },
    editProjectHandle(projectInfo) {
      this.dialogFormVisible = true;
      this.form = {
        ...projectInfo,
        description: projectInfo.description.toString() // description的数据类型为数组，而input要求传入字符串，
      }                                                 // 不然会报错, 所以需要将其转为字符串


    },
    confirmEditProjectHandle() {
      let obj = { ...this.form };
      obj.description = obj.description.split(','); // 传给服务器的description数据要求为数组，所以需要转换一下
      obj.order = parseInt(obj.order) // 字符串类型转为数据类型

      setProject(obj.id, obj).then(() => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message.success('修改成功')
      })
    },
    openGitHubHandle(projectInfo) { // 打开github地址
      window.open(`${projectInfo.github}`)
    },
    deleteProjectHandle(projectInfo) {
      this.$confirm(
        "确定要删除此项目吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ) // 点击确定进then，点击取消进catch
        .then(() => {
          delProject(projectInfo.id).then(() => {
            // 重新获取数据
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  }
}
</script>

<style>

</style>
