import request from "@/utils/request";

export function getInfo(query) {
  return request({
    url: "/admin/info",
    method: "get",
    params: query,
  });
}

export function edit(data) {
  return request({
    url: "/admin/edit",
    method: "post",
    data,
  });
}
