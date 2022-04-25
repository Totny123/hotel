<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus" @click="addType">
        新增类型
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      border
      v-loading="loading"
    >
      <el-table-column prop="name" label="房间类型" width="180">
      </el-table-column>
      <el-table-column prop="bed_number" label="房间床位数" width="180">
      </el-table-column>
      <el-table-column prop="price" label="房间价格"> </el-table-column>
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
    <el-dialog title="新增类型" :visible.sync="addDialogVisible" width="30%">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-position="top"
        label-width="100px"
      >
        <el-form-item label="房间类型" prop="name">
          <el-input v-model.number="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房间床位数" prop="bed_number">
          <el-input v-model.number="addForm.bed_number" type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="房间价格" prop="price">
          <el-input v-model.number="addForm.price" type="number"></el-input>
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
        <el-form-item label="房间类型" prop="name">
          <el-input v-model.number="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房间床位数" prop="bed_number">
          <el-input v-model.number="editForm.bed_number" type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="房间价格" prop="price">
          <el-input v-model.number="editForm.price" type="number"></el-input>
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
import { getRoomType, addType, delType, editType } from "@/api/room/list";
export default {
  name: "RoomType",
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
        name: [{ required: true, message: "请输入房间类型", trigger: "blur" }],
        bed_number: [
          { required: true, message: "请输入房间床位数", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入房间价格", trigger: "blur" }],
      },
      editDialogVisible: false,
      editForm: {},
      editRules: {
        name: [{ required: true, message: "请输入房间类型", trigger: "blur" }],
        bed_number: [
          { required: true, message: "请输入房间床位数", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入房间价格", trigger: "blur" }],
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
      getRoomType(this.queryParams).then((res) => {
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
        id: row.id,
        name: row.name,
        bed_number: row.bed_number,
        price: row.price,
      };
    },
    delRow(row) {
      delType({ id: row.id }).then(() => {
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
          addType(this.addForm).then((res) => {
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
          editType(this.editForm).then((res) => {
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
