<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" prop="date" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <!-- sope.row相当于是在data里面依次获取数据 -->
          <el-image style="width: 100px;" :src="scope.row.midImg" fit="fill"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px;" :src="scope.row.bigImg" fit="fill"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editBannerHandle(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑首页标语 -->
    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 中图 -->
              <Upload v-model="form.midImg"/> 
              <!-- 这里v-model就相当于传了一个value参数 -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <!-- 大图 -->
              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>

</template>

<script>

import { getBanner, setBanner } from "@/api/banner.js";
import { server_URL } from '@/urlConfig.js';
// 引入封装好的上传图片组件
import  Upload  from "@/components/Upload.vue";
export default {
  data() {
    return {
      data: [],
      dialogFormVisible: false, // 编辑对话框是否显示
      form: {
        id: "",
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
      },
    }
  },
  components:{
    Upload
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getBanner().then((res) => {
        this.data = res.data;
        // for (var item of this.data) { // 图片要带上服务器路径才能显示，所以这里要调整一下
        //   item.midImg2 = server_URL + item.midImg;
        //   item.bigImg2 = server_URL + item.bigImg
        // }
      })
    },
    editBannerHandle(bannerInfo){
      this.form = {...bannerInfo}; // 相当于表单回填
      this.dialogFormVisible = true;

    },
    editBannerConfirm(){
       // 从表单里面拿到用户修改的数据，发送给服务器
      // 因为 api 文档要求三个首页标语都要发送过去，哪怕只改了其中一个
      let arr = [...this.data];
      for(var i = 0; i < arr.length; i++){
        if(arr[i].id === this.form.id){
          arr[i] = this.form
        }
      };
      setBanner(arr).then((res=>{
        this.dialogFormVisible = false;
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.fetchData() // 重新获取一下数据
      }))
    }
  }
}

</script>