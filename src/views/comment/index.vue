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
        <template slot-scope="scope"><el-avatar shape="square" size="small" :src="scope.row.avatar"></el-avatar></template>
      </el-table-column>

      <el-table-column prop="date" label="昵称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>

      <el-table-column prop="date" label="评论文章" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.blog.title }}</template>
      </el-table-column>

      <el-table-column prop="date" label="评论内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <el-table-column prop="date" label="评论日期" width="230" align="center">
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
    <div style="margin-top:30px">
      <el-pagination 
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    @prev-click="handlePreClick"
    @next-click="handleNextClick"
    background 
    :current-page.sync="pagerCurrentPage" 
    :page-sizes="[5, 10, 20, 30]"
    :page-size="eachPage" 
    layout="prev, pager, next, total,->, sizes, jumper" 
    :total="count">
    </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { getComment, delComment } from "@/api/comment"
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
      getComment(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        // 处理头像地址和时间
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
    // 改变每页显示数据条数的尺寸
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
    // 上一页和下一页可以不用重新获取数据，因为当前页变化就会触发 handleCurrentChange事件
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
            delComment(id).then(() => {
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

</style>
