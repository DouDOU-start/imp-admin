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

export interface SeriesItem {
    seriesNumber: string,
    seriesUid: string,
    seriesDescription: string,
    modality: string,
    pixelSpacing: string,
    sliceThickness: number,
    row: number,
    columns: number,
    instanceNum: number,
    patientAge: string,
    seriesAt: string,
    institutionName: string,
    patientNumber: string,
    patientName: string,
    patientSex: string,
    shapeInfo: string,
    sliceInfo: string,
    bodyPart: string
}

export async function fetchSimpleSeries(params: SimpleSeriesParams): Promise<ApiResult<SimpleSeriesItem>> {
    return await GET('/imp/series', params);
}

export async function fetchSeries(seriesId: string): Promise<ApiResult<SeriesItem>> {
    return await GET(`/imp/series/${seriesId}`);
}