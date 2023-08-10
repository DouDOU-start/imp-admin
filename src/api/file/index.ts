import axios from "axios";
import { ElMessage } from "element-plus";

export async function DOWNLOAD(url: string) {

    const downloadAxiosInstance= axios.create({
        baseURL: '/api',
        timeout: 30000,
    });

    const response = await downloadAxiosInstance({
        method: 'GET',
        url,
        responseType: 'blob',
    })

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data]));
    link.setAttribute('download', decodeURIComponent(response.headers['content-disposition'].split('filename=')[1],));
    document.body.appendChild(link);
    link.click();
    link.remove()

}