import { ApiResult, DEL, GET, POST, PUT, Page } from "..";

export interface BodyPartItem {
    id: number;
    bodyName: string;
    createdAt: string;
    updatedAt: string;
    creator: string;
    updater: string;
}

export const fetchBodyPart = async (keyword: any, currentPage: number, pageSize: number): Promise<ApiResult<Page<BodyPartItem>>> => {
    return await GET('/dimension/bodyPart', {
        "keyword": keyword,
        "currentPage": currentPage, 
        "pageSize": pageSize
    });
};

export const addBodyPart = async (bodyName: string): Promise<ApiResult<number>> => {
    return await POST('/dimension/bodyPart', {
        "bodyName": bodyName
    });
};

export const editBodyPart = async (id: number, bodyName: string): Promise<ApiResult<number>> => {
    return await PUT('/dimension/bodyPart', {
        "id": id,
        "bodyName": bodyName
    });
};

export const delBodyPart = async (id: number): Promise<ApiResult<number>> => {
    return await DEL(`/dimension/bodyPart/${id}`);
};