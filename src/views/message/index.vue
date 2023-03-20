<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" 
    border
    fit
    highlight-current-row
    >
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + (currentPage - 1) * eachPage + 1 }}</template>
      </el-table-column>

      <el-table-column prop="date" label="头像" width="80" align="center">
        <template slot-scope="scope"><el-avatar size="small" shape="square" :src="scope.row.avatar"></el-avatar></template>
      </el-table-column>

      <el-table-column prop="date" label="昵称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>

      <el-table-column prop="date" label="内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <el-table-column prop="date" label="创建日期" width="230" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>

      <el-table-column prop="date" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="delHandle(scope.row.id)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
    <el-pagination @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    @prev-click="handlePreClick"
    @next-click="handleNextClick"
    background 
    :current-page.sync="pagerCurrentPage" 
    :page-sizes="[5, 10, 20, 30]"
    :page-size="eachPage" layout="prev, pager, next, total,->, sizes, jumper" 
    :total="count">
    </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { getMessages, delMessage } from "@/api/message"
import { server_URL } from "@/urlConfig"
import { formatDate } from "@/utils/tools"
export default {
  data() {
    return {
      listLoading: false,
      currentPage: 1, // 当前页码
      eachPage: 5, // 每页显示条数
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      data: [], // 数据详情
      pagerCurrentPage: 1, // 分页栏当前页码
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getMessages(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        for (let i of this.data) {
          // i.avatar = server_URL + i.avatar;
          i.createDate = formatDate(i.createDate)
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage)
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage
        }
      })
    },
    handleSizeChange(pageSize) {
        this.eachPage = pageSize;
        this.currentPage = 1;
        this.pagerCurrentPage = 1;
        this.fetchData()
      },
      handleCurrentChange(pageNum) {
        this.currentPage = pageNum;
        this.fetchData()
      },
      handlePreClick() {
        this.currentPage--
      },
      handleNextClick() {
        this.currentPage++
      },
      delHandle(id) {
        this.$confirm(
          "确定删除这条评论？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ) // 点击确定进then，点击取消进catch
          .then(() => {
            delMessage(id).then(() => {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
  }
}

</script>

<style>
.block{
  margin-top: 30px;
}
</style>
