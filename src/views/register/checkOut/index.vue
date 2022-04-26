<template>
  <div class="app-container">
    <div class="header"></div>
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      border
      v-loading="loading"
    >
      <el-table-column prop="room_number" label="房号" width="180">
      </el-table-column>
      <el-table-column prop="statusText" label="入住状态" width="180">
      </el-table-column>
      <el-table-column prop="floor" label="所在楼层"> </el-table-column>
      <el-table-column prop="room_type_text" label="房间类型">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="checkOutRow(scope.row)">
            登记退房
          </el-button>
          <!-- <el-button
            type="text"
            style="color: #f56c6c"
            size="small"
            @click="delRow(scope.row)"
          >
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog title="新增房间" :visible.sync="addDialogVisible" width="30%">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-position="top"
        label-width="100px"
      >
        <el-form-item label="房间号" prop="room_number">
          <el-input
            v-model.number="addForm.room_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="入住状态">
          <el-input value="未入住" disabled> </el-input>
        </el-form-item>
        <el-form-item label="所在楼层" prop="floor">
          <el-input v-model.number="addForm.floor" type="number"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="room_type_id">
          <el-select v-model="addForm.room_type_id" placeholder="请选择">
            <el-option
              v-for="item in roomType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <el-button type="primary" @click="addFormSubmit">确 定</el-button>
            <el-button @click="addDialogVisible = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="编辑房间" :visible.sync="editDialogVisible" width="30%">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editRules"
        label-position="top"
        label-width="100px"
      >
        <el-form-item label="房间号" prop="room_number">
          <el-input
            v-model.number="editForm.room_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="入住状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="未入住" :value="0"> </el-option>
            <el-option label="入住中" :value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在楼层" prop="floor">
          <el-input v-model.number="editForm.floor" type="number"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="room_type_id">
          <el-select v-model="editForm.room_type_id" placeholder="请选择">
            <el-option
              v-for="item in roomType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <el-button type="primary" @click="editFormSubmit">确 定</el-button>
            <el-button @click="editDialogVisible = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="登记入住"
      :visible.sync="checkInDialogVisible"
      width="30%"
    >
      <el-form
        ref="checkInForm"
        :model="checkInForm"
        :rules="checkInRules"
        label-position="top"
        label-width="100px"
      >
        <el-form-item label="房间号" prop="room_number">
          <el-input
            disabled
            v-model.number="checkInForm.room_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="room_type_text">
          <el-input disabled v-model="checkInForm.room_type_text"></el-input>
        </el-form-item>
        <el-form-item label="房间价格" prop="room_price">
          <el-input disabled v-model="checkInForm.room_price"></el-input>
        </el-form-item>
        <el-form-item label="入住时间" prop="check_in_time">
          <el-date-picker
            v-model="checkInForm.check_in_time"
            type="date"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离店时间" prop="check_out_time">
          <el-date-picker
            v-model="checkInForm.check_out_time"
            type="date"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="总价格" prop="total_price">
          <el-input disabled v-model="checkInForm.total_price"></el-input>
        </el-form-item>
        <el-form-item label="请选择入住人" prop="customer_id_list">
          <el-select
            v-model="checkInForm.customer_id_list"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.fullname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <el-button type="primary" @click="checkInFormSubmit"
              >确 定</el-button
            >
            <el-button @click="checkInDialogVisible = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {
  getRoomList,
  delRoom,
  getRoomType,
  addRoom,
  editRoom,
} from "@/api/room/list";
import { getCustomerList } from "@/api/customer";
import { addOrder } from "@/api/order";
export default {
  name: "CheckOut",
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
      addForm: {
        status: 0,
      },
      addRules: {
        room_number: [
          { required: true, message: "请输入房间号", trigger: "blur" },
        ],
        floor: [{ required: true, message: "请输入所在楼层", trigger: "blur" }],
        room_type_id: [
          { required: true, message: "请输入房间类型", trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editRules: {
        room_number: [
          { required: true, message: "请输入房间号", trigger: "blur" },
        ],
        floor: [{ required: true, message: "请输入所在楼层", trigger: "blur" }],
        room_type_id: [
          { required: true, message: "请输入房间类型", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请输入入住状态", trigger: "blur" },
        ],
      },
      roomType: [],
      checkInDialogVisible: false,
      checkInForm: {},
      checkInRules: {
        room_number: [{ required: true, message: "请输入", trigger: "blur" }],
        room_type_text: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        room_price: [{ required: true, message: "请输入", trigger: "blur" }],
        check_out_time: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        check_in_time: [{ required: true, message: "请输入", trigger: "blur" }],
        total_price: [{ required: true, message: "请输入", trigger: "blur" }],
        customer_id_list: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
      },
      customerList: [],
    };
  },
  watch: {
    "checkInForm.check_in_time": {
      handler(val) {
        const dayNum = dayjs(this.checkInForm.check_out_time).diff(val, "day");
        this.checkInForm.total_price = this.checkInForm.room_price * dayNum;
      },
    },
    "checkInForm.check_out_time": {
      handler(val) {
        const dayNum = dayjs(val).diff(this.checkInForm.check_in_time, "day");
        this.checkInForm.total_price = this.checkInForm.room_price * dayNum;
      },
    },
  },

  created() {
    this.getList();
    this.getRoomType();
    getCustomerList().then((res) => {
      this.customerList = res.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      getRoomList(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.data.filter((item) => item.status === 1);
        this.loading = false;
      });
    },
    getRoomType() {
      getRoomType().then((res) => {
        this.roomType = res.data;
      });
    },
    editRow(row) {
      this.editDialogVisible = true;
      this.editForm = {
        floor: row.floor,
        id: row.id,
        room_number: row.room_number,
        room_type_id: row.room_type_id,
        status: row.status,
      };
    },
    delRow(row) {
      delRoom({ id: row.id }).then(() => {
        this.$notify({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
    },
    addRoom() {
      this.addDialogVisible = true;
    },
    addFormSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          addRoom(this.addForm).then((res) => {
            this.addForm = {
              status: 0,
            };
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
          editRoom(this.editForm).then((res) => {
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
    checkInRow(row) {
      this.checkInDialogVisible = true;
      this.checkInForm = {
        room_id: row.id,
        room_number: row.room_number,
        room_type_text: row.room_type_text,
        room_price: row.room_price,
      };
      this.editForm = {
        floor: row.floor,
        id: row.id,
        room_number: row.room_number,
        room_type_id: row.room_type_id,
        status: 1,
      };
    },
    checkInFormSubmit() {
      this.$refs.checkInForm.validate((valid) => {
        if (valid) {
          addOrder({
            room_id: this.checkInForm.room_id,
            customer_id_list: this.checkInForm.customer_id_list,
            check_in_time: this.checkInForm.check_in_time,
            check_out_time: this.checkInForm.check_out_time,
            total_price: this.checkInForm.total_price,
          }).then((res) => {
            this.getList();
            this.checkInDialogVisible = false;
            this.$notify({
              message: "入住成功",
              type: "success",
            });
            editRoom(this.editForm).then((res) => {
              this.getList();
              this.editDialogVisible = false;
            });
          });
        } else {
          return false;
        }
      });
    },
    checkOutRow(row) {
      this.$confirm("确定退房吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.editForm = {
            floor: row.floor,
            id: row.id,
            room_number: row.room_number,
            room_type_id: row.room_type_id,
            status: 0,
          };
          editRoom(this.editForm).then((res) => {
            this.getList();
            this.editDialogVisible = false;
            this.$notify({
              message: "退房成功",
              type: "success",
            });
          });
        })
        .catch(() => {});
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
  justify-content: center;
}
.el-select,
.el-input_inner {
  width: 100%;
}
</style>
