import axios from "axios";

export async function DOWNLOAD(url: string, params: any) {

    const downloadAxiosInstance= axios.create({
        baseURL: '/api',
        timeout: 90000,
    });

    const response = await downloadAxiosInstance({
        method: 'GET',
        url,
        responseType: 'blob',
        params: params
    })

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data]));
    link.setAttribute('download', decodeURIComponent(response.headers['content-disposition'].split('filename=')[1],));
    document.body.appendChild(link);
    link.click();
    link.remove()

}