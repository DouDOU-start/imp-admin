import { ApiResult, GET, Page } from "..";

export interface institutionItem {
    id: number;
    institutionName: string;
}

export const fetchInstitution = async (): Promise<ApiResult<Page<institutionItem>>> => {
    return await GET(`/dimension/institution`);
};