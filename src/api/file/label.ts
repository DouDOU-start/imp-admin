import { DOWNLOAD } from ".";
import { DEL, POST } from "..";

export async function uploadLabelApi(seriesId: string, file: FormData) {
    return await POST(`/file/label/${seriesId}`, file);
}

export async function delSeriesLabelApi(seriesId: string, fileName: string) {
    await DEL(`/file/label/${seriesId}/${fileName}`, null);
}

export async function downLoadSeriesLabelApi(fileLocation: string) {
    await DOWNLOAD(`/file/label/${fileLocation}`, null);
}