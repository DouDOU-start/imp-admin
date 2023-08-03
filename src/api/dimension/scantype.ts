import { ApiResult, DEL, GET, POST, PUT, Page } from "..";

export interface ScanTypeItem {
    id: number;
    scanTypeName: string;
    createdAt: string;
    updatedAt: string;
    creator: string;
    updater: string;
}

export const fetchScanType = async (keyword: any, currentPage: number, pageSize: number): Promise<ApiResult<Page<ScanTypeItem>>> => {
    return await GET(`/dimension/scanType?keyword=${keyword}&currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const addScanType = async (scanTypeName: string): Promise<ApiResult<number>> => {
    return await POST('/dimension/scanType', {
        "scanTypeName": scanTypeName
    });
};

export const editScanType = async (id: number, scanTypeName: string): Promise<ApiResult<number>> => {
    return await PUT('/dimension/scanType', {
        "id": id,
        "scanTypeName": scanTypeName
    });
};

export const delScanType = async (id: number): Promise<ApiResult<number>> => {
    return await DEL(`/dimension/scanType/${id}`);
};