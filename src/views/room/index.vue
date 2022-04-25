<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus" @click="addRoom">
        新增房间
      </el-button>
    </div>
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
          <el-button type="text" size="small" @click="editRow(scope.row)">
            编辑
          </el-button>
          <el-button
            type="text"
            style="color: #f56c6c"
            size="small"
            @click="delRow(scope.row)"
          >
            删除
          </el-button>
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
  </div>
</template>

<script>
import {
  getRoomList,
  delRoom,
  getRoomType,
  addRoom,
  editRoom,
} from "@/api/room/list";
export default {
  name: "RoomList",
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
    };
  },
  created() {
    this.getList();
    this.getRoomType();
  },
  methods: {
    getList() {
      this.loading = true;
      getRoomList(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.data;
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
