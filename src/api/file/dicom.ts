import { POST } from "..";

export async function uploadDicomApi(file: FormData) {
    return await POST('/file/dicom', file);
}