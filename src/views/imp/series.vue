<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-form :model="form" label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="机构：">
                                {{ form.institutionName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="患者 ID：">
                                {{ form.patientNumber }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="患者姓名：">
                                {{ form.patientName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别：">
                                {{ form.patientSex }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="年龄：">
                                {{ form.patientAge }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="形状信息：">
                                {{ form.shapeInfo }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="切片信息：">
                                {{ form.sliceInfo }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="模态：">
                                {{ form.modality }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="身体部位：">
                                <el-select v-model="form.bodyPart" placeholder="暂无数据" :disabled="isEdit">
                                    <el-option v-for="item in bodyPart" :key="item.id" :label="item.bodyName"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="扫描类型：">
                                <el-select v-model="form.scanType" placeholder="暂无数据" :disabled="isEdit">
                                    <el-option v-for="item in scanType" :key="item.id" :label="item.scanTypeName"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item>
                        <el-button v-if="isEdit == true" type="primary" @click="onSubmit">编辑</el-button>
                        <el-button v-else type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>

        <el-dialog v-model="dialogVisible" title="保存" width="30%">
            <span>确定要保存数据吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateDimension">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="basetable">
import { Ref, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SeriesItem, fetchSeries, updateImpBodyPartApi, updateImpScanTypeApi } from '../../api/imp/imp'
import { BodyPartItem, fetchBodyPart } from '../../api/dimension/bodypart'
import { el, fa } from 'element-plus/es/locale'
import { ElMessage } from 'element-plus'
import { ScanTypeItem, fetchScanType } from '../../api/dimension/scantype'

const seriesDetailLabel = {
    "seriesDescription": "系列描述",
    "patientNumber": "患者 ID",
    "patientName": "患者姓名",
    "patientSex": "性别",
    "patientAge": "年龄",
    "institutionName": "机构",
    "modality": "模态",
    "shapeInfo": "形状信息",
    "sliceInfo": "切片信息",
    "bodyPart": "身体检查部位"
}

const form: Ref<SeriesItem> = ref({
    seriesNumber: '',
    seriesUid: '',
    seriesDescription: '',
    modality: '',
    pixelSpacing: '',
    sliceThickness: 0,
    row: 0,
    columns: 0,
    instanceNum: 0,
    patientAge: '',
    seriesAt: '',
    institutionName: '',
    patientNumber: '',
    patientName: '',
    patientSex: '',
    shapeInfo: '',
    sliceInfo: '',
    // bodyPart: [],
    // scanType: []
    bodyPart: 0,
    scanType: 0
})

// const oldBodyPart: Ref<number[]> = ref([]);
// const oldScanType: Ref<number[]> = ref([]);
const oldBodyPart: Ref<any> = ref()
const oldScanType: Ref<any> = ref();

const bodyPart = ref<Array<BodyPartItem>>();
const scanType = ref<Array<ScanTypeItem>>();

const isEdit = ref<Boolean>(true);
const dialogVisible = ref<Boolean>(false);

const onSubmit = () => {

    if (isEdit.value == false) {
        dialogVisible.value = true;
    } else {
        isEdit.value = !isEdit.value;
    }
}

const updateDimension = () => {
    dialogVisible.value = false;

    updateBodyPart();
    updateScanType();

    isEdit.value = !isEdit.value;
}

const updateBodyPart = () => {

    // const bodyPartOperates: any = [];

    // form.value.bodyPart.filter(item => !oldBodyPart.value.includes(item)).filter(item => {
    //     bodyPartOperates.push({
    //         "op": "ADD",
    //         "bodyPartId": item
    //     })
    // })

    // oldBodyPart.value.filter(item => !form.value.bodyPart.includes(item)).filter(item => {
    //     bodyPartOperates.push({
    //         "op": "DEL",
    //         "bodyPartId": item
    //     })
    // })

    // if (0 != bodyPartOperates.length) {
    //     updateImpBodyPartApi({
    //         "seriesId": $router.currentRoute.value.params.seriesId as string,
    //         "operates": bodyPartOperates
    //     }).then(res => {
    //         if (200 == res.code) {
    //             ElMessage.success(`更新身体部位数据成功！`);
    //             loadSeriesDetail();
    //         }
    //     })
    // }

    if (oldBodyPart.value != form.value.bodyPart) {
        updateImpBodyPartApi({
            "seriesId": $router.currentRoute.value.params.seriesId as string,
            "operates": [
                {
                    "op": "ADD",
                    "bodyPartId": form.value.bodyPart
                }, {
                    "op": "DEL",
                    "bodyPartId": oldBodyPart.value
                }
            ]
        }).then(res => {
            if (200 == res.code) {
                ElMessage.success(`更新身体部位数据成功！`);
                loadSeriesDetail();
            }
        })
    }

}

const updateScanType = () => {

    // const scanTypeOperates: any = [];

    // form.value.scanType.filter(item => !oldScanType.value.includes(item)).filter(item => {
    //     scanTypeOperates.push({
    //         "op": "ADD",
    //         "scanTypeId": item
    //     })
    // })

    // oldScanType.value.filter(item => !form.value.scanType.includes(item)).filter(item => {
    //     scanTypeOperates.push({
    //         "op": "DEL",
    //         "bodyPartId": item
    //     })
    // })

    // if (0 != scanTypeOperates.length) {
    //     updateImpScanTypeApi({
    //         "seriesId": $router.currentRoute.value.params.seriesId as string,
    //         "operates": scanTypeOperates
    //     }).then(res => {
    //         if (200 == res.code) {
    //             ElMessage.success(`更新扫描类型数据成功！`);
    //             loadSeriesDetail();
    //         }
    //     })
    // }

    if (oldScanType.value != form.value.scanType) {
        updateImpScanTypeApi({
            "seriesId": $router.currentRoute.value.params.seriesId as string,
            "operates": [
                {
                    "op": "ADD",
                    "scanTypeId": form.value.scanType
                }, {
                    "op": "DEL",
                    "scanTypeId": oldScanType.value
                }
            ]
        }).then(res => {
            if (200 == res.code) {
                ElMessage.success(`更新身体部位数据成功！`);
                loadSeriesDetail();
            }
        })
    }

}

// const seriesLabel: Ref<GetSeriesLabel[]> = ref([{
//   id: 0,
//   fileName: '',
//   fileLocation: '',
//   createdAt: ''
// }])

// const seriesInstance: Ref<GetSeriesInstance[]> = ref([{
//   id: 0,
//   instanceNumber: 0,
//   instanceUid: '',
//   sliceLocation: 0,
//   imageUrl: ''
// }])

function init() {
    loadBodyPart()
    loadScanType()
    loadSeriesDetail()
    //   loadSeriesLabel()
    //   loadSeriesInstance()
}

const $router = useRouter();

async function loadSeriesDetail() {
    const { data } = await fetchSeries($router.currentRoute.value.params.seriesId as string)
    form.value = data
    switch (form.value.patientSex) {
        case 'M':
            form.value.patientSex = '男'
            break;
        case 'F':
            form.value.patientSex = '女'
            break;
        default:
            break;
    }
    form.value.shapeInfo = form.value.row + ' * ' + form.value.columns + ' * ' + form.value.instanceNum
    form.value.sliceInfo = form.value.pixelSpacing + ' * ' + form.value.sliceThickness
    oldBodyPart.value = form.value.bodyPart
    oldScanType.value = form.value.scanType
}

// 获取身体部位数据
async function loadBodyPart() {
    let { data } = await fetchBodyPart(null, -1, -1);
    bodyPart.value = data.records;
}

async function loadScanType() {
    let { data } = await fetchScanType(null, -1, -1);
    scanType.value = data.records;
}

// async function loadSeriesLabel() {
//   const { data } = await getSeriesLabel($router.currentRoute.value.params.seriesId as string)
//   seriesLabel.value = data
// }

// async function loadSeriesInstance() {
//   const { data } = await getSeriesInstance($router.currentRoute.value.params.seriesId as string)
//   seriesInstance.value = data
//   seriesInstance.value.forEach(instance => {
//     instance.imageUrl = '/api/file/jpg/' + instance.id
//   })
// }

// 删除标签
// function delLabel(fileName: string) {
//   delSeriesLabelApi($router.currentRoute.value.params.seriesId as string, fileName)
// }

// function downloadLabel(val: any) {
//   downLoadSeriesLabelApi(val)
// }

// const upload = ref<any>()

// 上传标签文件
// function uploadLabel(param: any) {

//   const formData = new FormData()
//   formData.append('file', param.file)

//   uploadLabelApi($router.currentRoute.value.params.seriesId as string, formData).then(res => {
//     console.log(`上传标签文件成功，${res}`)
//     ElNotification({
//       message: `${param.file.name} 上传成功！`,
//       type: 'success',
//     })

//   }).catch(res => {
//     console.error(`上传标签文件失败，${res}`)
//     ElNotification({
//       message: `${param.file.name} 上传失败，${res.response.data.msg}`,
//       type: 'error',
//     })
//   })

// }

// 文件发生改变
// function fileChange() {
//   upload.value.clearFiles() //清除文件对象
// }

onMounted(() => {
    init()
});
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}
</style>