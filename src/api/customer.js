import request from "@/utils/request";

export function getCustomerList(query) {
  return request({
    url: "/customer/list",
    method: "get",
    params: query,
  });
}

export function delCustomer(data) {
  return request({
    url: "/customer/del",
    method: "post",
    data,
  });
}

export function addCustomer(data) {
  return request({
    url: "/customer/add",
    method: "post",
    data,
  });
}

export function editCustomer(data) {
  return request({
    url: "/customer/edit",
    method: "post",
    data,
  });
}
