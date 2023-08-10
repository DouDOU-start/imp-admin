import { DOWNLOAD } from ".";
import { POST } from "..";

export async function uploadDicomApi(file: FormData) {
    return await POST('/file/dicom', file);
}

export async function downLoadDicomApi(seriesId: number) {
    await DOWNLOAD(`/file/series/${seriesId}`);
}