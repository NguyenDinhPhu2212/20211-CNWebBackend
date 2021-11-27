import axiosConfig from "./api.config"

export const callAPI = (endPoint, method, headers, params, data) => {
    return axiosConfig({
        url: endPoint,
        method,
        headers,
        params,
        data
    })
}