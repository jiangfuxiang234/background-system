<template>
  <div class="app-contenner">
    <div class="block">项目名称</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.name" placeholder="请输入项目名称">
      </el-input>
    </div>

    <div class="block">项目描述(每一项描述请用英文逗号分隔)</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.description" placeholder="项目描述(每一项描述请用英文逗号分隔)">
      </el-input>
    </div>

    <div class="block">项目链接</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.url" placeholder="请输入项目链接">
      </el-input>
    </div>

    <div class="block">github地址</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.github" placeholder="请输入github地址">
      </el-input>
    </div>

    <div style="margin-bottom: 15px">
      <Upload uploadTitle="项目预览图" v-model="form.thumb"/>
    </div>

    <div class="block">项目等级</div>
    <div style="margin-bottom: 15px">
      <el-select v-model="form.order" placeholder="请选择项目等级">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>
            </el-select>
    </div>
 
    <el-button type="primary" plain @click="addProjectHandle">发布项目</el-button>
  </div>
</template>

<script>
import {addProject} from '@/api/project'
import Upload from '@/components/Upload.vue';
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1,
      },
    };
  },
  components:{
    Upload
  },
  methods:{
    addProjectHandle(){
      let obj = { ...this.form };
      obj.description = obj.description.split(',');
      obj.order = parseInt(obj.order);
   addProject(obj).then(()=>{
      this.$message.success('成功发布项目');
      this.$router.push('/projectList')
   })
    }
  }
}
</script>

<style>
.block {
  margin: 15px 0;
  font-weight: 100;
}
.app-contenner{
  margin-left: 15px
}
</style>
