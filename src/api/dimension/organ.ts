import { ApiResult, DEL, GET, POST, PUT, Page } from "..";

export interface OrganItem {
    id: number;
    organName: string;
    createdAt: string;
    updatedAt: string;
    creator: string;
    updater: string;
}

export const fetchOrgan = async (keyword: any, currentPage: number, pageSize: number): Promise<ApiResult<Page<OrganItem>>> => {
    return await GET(`/dimension/humanOrgan?keyword=${keyword}&currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const addOrgan = async (organName: string): Promise<ApiResult<number>> => {
    return await POST('/dimension/humanOrgan', {
        "organName": organName
    });
};

export const editOrgan = async (id: number, organName: string): Promise<ApiResult<number>> => {
    return await PUT('/dimension/humanOrgan', {
        "id": id,
        "organName": organName
    });
};

export const delOrgan = async (id: number): Promise<ApiResult<number>> => {
    return await DEL(`/dimension/humanOrgan/${id}`);
};