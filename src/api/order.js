import request from "@/utils/request";

export function getOrderList(query) {
  return request({
    url: "/order/list",
    method: "get",
    params: query,
  });
}

export function addOrder(data) {
  return request({
    url: "/order/add",
    method: "post",
    data,
  });
}
