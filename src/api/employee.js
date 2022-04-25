import request from "@/utils/request";

export function getEmployeeList(query) {
  return request({
    url: "/employee/list",
    method: "get",
    params: query,
  });
}

export function delEmployee(data) {
  return request({
    url: "/employee/del",
    method: "post",
    data,
  });
}

export function addEmployee(data) {
  return request({
    url: "/employee/add",
    method: "post",
    data,
  });
}

export function editEmployee(data) {
  return request({
    url: "/employee/edit",
    method: "post",
    data,
  });
}

export function getInfo(query) {
  return request({
    url: "/employee/info",
    method: "get",
    params: query,
  });
}
