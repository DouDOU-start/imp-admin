import List from 'wangeditor/dist/menus/list';
import request from '../utils/request';

export interface ApiResult<T> {
    code: number;
    msg: string;
    data: T;
}

export interface Page<T> {
    records: T[];
    total: number;
}

export async function GET<T>(url: string, params?: any): Promise<ApiResult<T>> {
    const response = await request.get<ApiResult<T>>(url, { params });
    return response.data;
}

export async function POST<T>(url: string, data?: any): Promise<ApiResult<T>> {
    const response = await request.post<ApiResult<T>>(url, data);
    return response.data;
}

export async function PUT<T>(url: string, data?: any): Promise<ApiResult<T>> {
    const response = await request.put<ApiResult<T>>(url, data);
    return response.data;
}

export async function DEL<T>(url: string, params?: any): Promise<ApiResult<T>> {
    const response = await request.delete<ApiResult<T>>(url, { params });
    return response.data;
}

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};