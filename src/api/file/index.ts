import axios from "axios";

import { set, close } from '../../utils/nporgress'

import { useDownloadStore } from '../../store/download'

export async function DOWNLOAD(url: string, params: any) {

    const downloadAxiosInstance= axios.create({
        baseURL: '/api',
        timeout: 90000,
    });

    const response = await downloadAxiosInstance({
        method: 'GET',
        url,
        responseType: 'blob',
        params: params,
        onDownloadProgress: (progressEvent) => {
            const loaded: number = progressEvent.loaded;
            const total: any = progressEvent.total;
            const progress: number = Math.round((loaded * 100) / total);
            set(progress);
        },
    })

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data]));
    link.setAttribute('download', decodeURIComponent(response.headers['content-disposition'].split('filename=')[1],));
    document.body.appendChild(link);
    link.click();
    link.remove();

    close();
    useDownloadStore().handleDownload();

}