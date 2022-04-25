import request from "@/utils/request";

export function getRoomList(query) {
  return request({
    url: "/room/list",
    method: "get",
    params: query,
  });
}

export function delRoom(data) {
  return request({
    url: "/room/del",
    method: "post",
    data,
  });
}

export function getRoomType() {
  return request({
    url: "/room/type",
    method: "get",
  });
}

export function addRoom(data) {
  return request({
    url: "/room/add",
    method: "post",
    data,
  });
}

export function editRoom(data) {
  return request({
    url: "/room/edit",
    method: "post",
    data,
  });
}

export function addType(data) {
  return request({
    url: "/room/addType",
    method: "post",
    data,
  });
}

export function delType(data) {
  return request({
    url: "/room/delType",
    method: "post",
    data,
  });
}

export function editType(data) {
  return request({
    url: "/room/editType",
    method: "post",
    data,
  });
}
