import { DOWNLOAD } from ".";
import { POST } from "..";

export async function uploadDicomApi(file: FormData) {
    return await POST('/file/dicom', file);
}

export async function downLoadDicomApi(seriesId: string) {
    await DOWNLOAD(`/file/series`, {
        "seriesIds": seriesId
    });
}

export async function downLoadDicomBatchApi(seriesIds: string) {
    await DOWNLOAD(`/file/series`, {
        "seriesIds": seriesIds
    });
}