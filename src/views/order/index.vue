<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      border
      v-loading="loading"
    >
      <el-table-column
        prop="customer_id_list"
        label="入住人员"
        :formatter="formatCustomer"
      >
      </el-table-column>
      <el-table-column
        prop="check_in_time"
        label="入住时间"
        :formatter="formatTime"
      >
      </el-table-column>
      <el-table-column
        prop="check_out_time"
        label="离店时间"
        :formatter="formatTime"
      >
      </el-table-column>
      <el-table-column prop="room_id" label="房间号" width="180">
      </el-table-column>
      <el-table-column prop="total_price" label="总价格" width="180">
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog title="新增员工" :visible.sync="addDialogVisible" width="30%">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="addForm.fullname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" placeholder="请选择">
            <el-option label="男" :value="1"> </el-option>
            <el-option label="女" :value="0"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="addForm.age" type="number"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="card_id">
          <el-input v-model="addForm.card_id"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone_number">
          <el-input v-model="addForm.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entry_time">
          <el-date-picker
            v-model="addForm.entry_time"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <el-button type="primary" @click="addFormSubmit">确 定</el-button>
            <el-button @click="addDialogVisible = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="编辑员工" :visible.sync="editDialogVisible" width="30%">
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
        <el-form-item label="入职时间" prop="entry_time">
          <el-date-picker
            v-model="editForm.entry_time"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <el-button type="primary" @click="editFormSubmit">确 定</el-button>
            <el-button @click="editDialogVisible = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {
  getEmployeeList,
  delEmployee,
  addEmployee,
  editEmployee,
} from "@/api/employee";
import { getCustomerList } from "@/api/customer";
import { getOrderList } from "@/api/order";
export default {
  name: "Order",
  data() {
    return {
      loading: false,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 30,
      },
      total: 0,
      addDialogVisible: false,
      addForm: {},
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
      roomType: [],
      customerList: [],
    };
  },
  created() {
    this.getList();
    getCustomerList().then((res) => {
      this.customerList = res.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      getOrderList(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.data;
        this.loading = false;
      });
    },
    editRow(row) {
      this.editDialogVisible = true;
      this.editForm = {
        id: row.id,
        username: row.username,
        password: "",
        fullname: row.fullname,
        sex: row.sex,
        age: row.age,
        phone_number: row.phone_number,
        card_id: row.card_id,
        entry_time: row.entry_time,
      };
    },
    delRow(row) {
      delEmployee({ id: row.id }).then(() => {
        this.$notify({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
    },
    addType() {
      this.addDialogVisible = true;
    },
    addFormSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          addEmployee(this.addForm).then((res) => {
            this.addForm = {};
            this.getList();
            this.addDialogVisible = false;
            this.$notify({
              message: "添加成功",
              type: "success",
            });
          });
        } else {
          return false;
        }
      });
    },
    editFormSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editEmployee(this.editForm).then((res) => {
            this.getList();
            this.editDialogVisible = false;
            this.$notify({
              message: "编辑成功",
              type: "success",
            });
          });
        } else {
          return false;
        }
      });
    },
    formatTime(row) {
      return dayjs(row.entry_time).format("YYYY-MM-DD");
    },
    formatSex(row) {
      return row.sex === 1 ? "男" : "女";
    },
    formatCustomer(row) {
      const arr = row.customer_id_list.split(",").map((item) => {
        for (let i = 0; i < this.customerList.length; i++) {
          if (Number(item) === this.customerList[i].id) {
            return this.customerList[i].fullname;
          }
        }
      });
      return arr.join(",");
    },
  },
};
</script>

<style>
.header {
  margin-bottom: 20px;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
}
.el-select,
.el-input_inner {
  width: 100%;
}
</style>
