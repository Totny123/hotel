<template>
  <div class="app-container">
    <div v-if="role === 'admin'">
      <h3>管理员，{{ name }}！</h3>
      <h3>今天日期是{{ today }}！</h3>
      <h3>以下是您的个人信息，点击编辑按钮可修改信息。</h3>
      <h4>用户名：{{ adminInfo.username }}</h4>
      <h4>密码：********</h4>
      <h4>昵称：{{ adminInfo.nickname }}</h4>
      <el-button type="primary" @click="adminBtnClick">编辑信息</el-button>
      <el-dialog
        title="编辑信息"
        :visible.sync="adminDialogVisible"
        width="30%"
      >
        <el-form
          ref="adminForm"
          :model="adminForm"
          :rules="adminRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adminForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adminForm.password"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="adminForm.nickname"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="form-footer">
              <el-button type="primary" @click="adminFormSubmit"
                >确 定</el-button
              >
              <el-button @click="adminDialogVisible = false">取 消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div v-else-if="role === 'employee'">
      <h3>Hi，{{ info.fullname }}！</h3>
      <h3>今天日期是{{ today }}，距离入职时间已经过了{{ passDay }}天！</h3>
      <h3>以下是您的个人信息，点击编辑按钮可修改信息。</h3>
      <h4>用户名：{{ info.username }}</h4>
      <h4>密码：********</h4>
      <h4>姓名：{{ info.fullname }}</h4>
      <h4>性别：{{ info.sex === 1 ? "男" : "女" }}</h4>
      <h4>年龄：{{ info.age }}</h4>
      <h4>身份证号码：{{ info.card_id }}</h4>
      <h4>手机号码：{{ info.phone_number }}</h4>
      <h4>入职时间：{{ dayjs(info.entry_time).format("YYYY-MM-DD") }}</h4>
      <el-button type="primary" @click="editBtnClick">编辑信息</el-button>
      <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="30%">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="addRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="fullname">
            <el-input v-model="editForm.fullname"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="editForm.sex" placeholder="请选择">
              <el-option label="男" :value="1"> </el-option>
              <el-option label="女" :value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="editForm.age" type="number"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="card_id">
            <el-input v-model="editForm.card_id"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone_number">
            <el-input v-model="editForm.phone_number"></el-input>
          </el-form-item>
          <el-form-item v-show="false" label="入职时间" prop="entry_time">
            <el-date-picker
              v-model="editForm.entry_time"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="form-footer">
              <el-button type="primary" @click="editFormSubmit"
                >确 定</el-button
              >
              <el-button @click="editDialogVisible = false">取 消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import store from "@/store";
import { getInfo, editEmployee } from "@/api/employee";
import { getInfo as getAdminInfo, edit } from "@/api/admin";

export default {
  name: "My",
  data() {
    return {
      role: "",
      name: "",
      info: {},
      today: "",
      passDay: "",
      dayjs: "",
      addRules: {
        username: [{ required: true, message: "请输入", trigger: "blur" }],
        password: [{ required: true, message: "请输入", trigger: "blur" }],
        fullname: [{ required: true, message: "请输入", trigger: "blur" }],
        sex: [{ required: true, message: "请输入", trigger: "blur" }],
        age: [{ required: true, message: "请输入", trigger: "blur" }],
        phone_number: [{ required: true, message: "请输入", trigger: "blur" }],
        card_id: [{ required: true, message: "请输入", trigger: "blur" }],
        entry_time: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      editDialogVisible: false,
      editForm: {},
      adminInfo: {},
      adminDialogVisible: false,
      adminForm: {},
      adminRules: {
        username: [{ required: true, message: "请输入", trigger: "blur" }],
        password: [{ required: true, message: "请输入", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  created() {
    this.role = store.getters.roles[0];
    this.name = store.getters.name;
    if (this.role === "employee") {
      this.getInfo();
    } else {
      this.getAdminInfo();
    }
    this.today = dayjs().format("YYYY年MM月DD日");
    this.dayjs = dayjs;
  },
  methods: {
    getInfo() {
      getInfo({ username: this.name }).then((res) => {
        this.info = res.data;
        this.passDay = dayjs(new Date()).diff(this.info.entry_time, "day");
      });
    },
    editBtnClick() {
      this.editDialogVisible = true;
      this.editForm = this.info;
    },
    editFormSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editEmployee(this.editForm).then((res) => {
            this.editDialogVisible = false;
            this.$notify({
              message: "编辑成功",
              type: "success",
            });
            this.$notify({
              message: "请重新登录",
              type: "success",
            });
            this.$store.dispatch("LogOut").then(() => {
              location.href = "/index";
            });
          });
        } else {
          return false;
        }
      });
    },
    getAdminInfo() {
      getAdminInfo({ username: this.name }).then((res) => {
        this.adminInfo = res.data;
      });
    },
    adminBtnClick() {
      this.adminDialogVisible = true;
      this.adminForm = {
        id: this.adminInfo.id,
        username: this.adminInfo.username,
        password: "",
        nickname: this.adminInfo.nickname,
      };
    },
    adminFormSubmit() {
      this.$refs.adminForm.validate((valid) => {
        if (valid) {
          edit(this.adminForm).then((res) => {
            this.adminDialogVisible = false;
            this.$notify({
              message: "编辑成功",
              type: "success",
            });
            this.$notify({
              message: "请重新登录",
              type: "success",
            });
            this.$store.dispatch("LogOut").then(() => {
              location.href = "/index";
            });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

