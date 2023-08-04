import { ApiResult, GET } from "..";

export const fetchModality = async (): Promise<ApiResult<string[]>> => {
    return await GET(`/dimension/modality`);
};