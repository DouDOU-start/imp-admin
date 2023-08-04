import { ApiResult, GET } from "..";

export interface SimpleSeriesParams {
    currentPage: number;
    pageSize: number;
    institutionIds: any;
    modality: any;
    sliceRange: any;
    bodyPartIds: any;
    patientSex: any;
    scanTypeIds: any;
    organIds: any;
}

export interface SimpleSeriesItem {
    records: [],
    total: number,
    size: number,
    current: number,
    pages: number
}

export async function fetchSimpleSeries(params: SimpleSeriesParams): Promise<ApiResult<SimpleSeriesItem>> {
    return await GET('/imp/series', params);
}