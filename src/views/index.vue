<template>
  <div class="app-container">
    <avue-data-box :option="option"></avue-data-box>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      option: {
        span: 6,
        data: [
          {
            click: function (item) {
              alert(JSON.stringify(item));
            },
            title: "客户数量",
            count: 132,
            icon: "el-icon-s-custom",
            color: "rgb(49, 180, 141)",
          },
          {
            click: function (item) {
              alert(JSON.stringify(item));
            },
            title: "订单数量",
            count: 239,
            icon: "el-icon-s-order",
            color: "rgb(56, 161, 242)",
          },
          {
            click: function (item) {
              alert(JSON.stringify(item));
            },
            title: "总营业额",
            count: 22203,
            icon: "el-icon-money",
            color: "rgb(117, 56, 199)",
          },
          {
            click: function (item) {
              alert(JSON.stringify(item));
            },
            title: "平均营业额",
            count: 2223,
            icon: "el-icon-money",
            color: "rgb(117, 56, 199)",
          },
        ],
      },
    };
  },
};
</script>

<style>
</style>
