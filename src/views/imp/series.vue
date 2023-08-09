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
                                <el-select v-model="form.bodyPart" placeholder="暂无数据" :disabled="isSeriesEdit">
                                    <el-option v-for="item in bodyPart" :key="item.id" :label="item.bodyName"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="扫描类型：">
                                <el-select v-model="form.scanType" placeholder="暂无数据" :disabled="isSeriesEdit">
                                    <el-option v-for="item in scanType" :key="item.id" :label="item.scanTypeName"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item>
                        <el-button v-if="isSeriesEdit == true" type="primary" @click="onSeriesSubmit">编辑</el-button>
                        <el-button v-else type="primary" @click="onSeriesSubmit">保存</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
        <!--        上传标注文件-->
        <el-upload class="upload-dicom" ref="upload" action="string" :http-request="uploadLabel" :on-change="fileChange"
            multiple>
            <el-button size="small" type="primary">上传标注文件</el-button>
        </el-upload>
        <!-- 标注文件表单 -->
        <el-table :data="seriesLabel" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="fileName" label="标注文件" align="center"></el-table-column>
            <el-table-column prop="createdAt" label="上传时间" align="center"></el-table-column>
            <el-table-column label="器官" align="center">
                <template #default="scope">
                    <el-select v-model="scope.row.organId" placeholder="暂无数据" :disabled="scope.row.isLabelEdit" multiple>
                        <el-option v-for="item in organ" :key="item.id" :label="item.organName" :value="item.id" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.isLabelEdit" text :icon="Edit" @click="onLabelSubmit(scope.$index)" v-permiss="16">
                        编辑
                    </el-button>
                    <el-button v-else text :icon="Finished" @click="onLabelSubmit(scope.$index)" v-permiss="16">
                        保存
                    </el-button>
                    <el-button text :icon="Delete" class="red" @click="delLabel(scope.$index)" v-permiss="16">
                        删除
                    </el-button>
                    <el-button text :icon="Download" class="blue" @click="downloadLabel(scope.row.fileLocation, scope.row.fileName)"
                        v-permiss="15">
                        下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="seriesDialogVisible" title="保存" width="30%">
            <span>确定要保存数据吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="seriesDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateDimension">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="labelDialogVisible" title="保存" width="30%">
            <span>确定要保存数据吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="labelDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateLabelOrgan">
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
import { SeriesItem, SeriesLabelItem, fetchSeries, getSeriesLabelApi, updateImpBodyPartApi, updateImpScanTypeApi, updateLabelOrganApi } from '../../api/imp/imp'
import { BodyPartItem, fetchBodyPart } from '../../api/dimension/bodypart'
import { ElMessage } from 'element-plus'
import { ScanTypeItem, fetchScanType } from '../../api/dimension/scantype'
import { Download, Delete, Edit, Finished } from '@element-plus/icons-vue'
import { delSeriesLabelApi, downLoadSeriesLabelApi, uploadLabelApi } from '../../api/file/label'
import { OrganItem, fetchOrgan } from '../../api/dimension/organ'

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
const oldOrgan: Ref<number[][]> = ref([]);

const bodyPart = ref<Array<BodyPartItem>>();
const scanType = ref<Array<ScanTypeItem>>();
const organ = ref<Array<OrganItem>>();

const isSeriesEdit = ref<Boolean>(true);
const editLabel = ref<number>(-1)
const seriesDialogVisible = ref<Boolean>(false);
const labelDialogVisible = ref<Boolean>(false);

const onLabelSubmit = (index: number) => {

    if (seriesLabel.value[index].isLabelEdit == false) {
        labelDialogVisible.value = true;
        editLabel.value = index;
    } else {
        seriesLabel.value[index].isLabelEdit = ! seriesLabel.value[index].isLabelEdit
    }
}

const onSeriesSubmit = () => {

    if (isSeriesEdit.value == false) {
        seriesDialogVisible.value = true;
    } else {
        isSeriesEdit.value = !isSeriesEdit.value;
    }
}

const updateDimension = () => {
    seriesDialogVisible.value = false;

    updateBodyPart();
    updateScanType();

    isSeriesEdit.value = !isSeriesEdit.value;
}

const updateLabelOrgan = () => {

    labelDialogVisible.value = false;

    console.log(`当前提交标注文件${editLabel.value}`)

    const labelOrganOperates: any = [];

    seriesLabel.value[editLabel.value].organId.filter(item => ! oldOrgan.value[editLabel.value].includes(item)).filter(item => {
        labelOrganOperates.push({
            "op": "ADD",
            "organId": item
        })
    })

    oldOrgan.value[editLabel.value].filter(item => ! seriesLabel.value[editLabel.value].organId.includes(item)).filter(item => {
        labelOrganOperates.push({
            "op": "DEL",
            "organId": item
        })
    })

    if (0 != labelOrganOperates.length) {
        updateLabelOrganApi({
            "labelId": seriesLabel.value[editLabel.value].id,
            "operates": labelOrganOperates
        }).then(res => {
            if (200 == res.code) {
                ElMessage.success(`更新标注文件器官数据成功！`);
                loadSeriesLabel();
            }
        })
    }

    // if (oldOrgan.value[editLabel.value] != seriesLabel.value[editLabel.value].organId) {
    //     updateLabelOrganApi({
    //         "labelId": seriesLabel.value[editLabel.value].id,
    //         "operates": [
    //             {
    //                 "op": "ADD",
    //                 "organId": seriesLabel.value[editLabel.value].organId
    //             }, {
    //                 "op": "DEL",
    //                 "organId": oldOrgan.value[editLabel.value]
    //             }
    //         ]
    //     }).then(res => {
    //         if (200 == res.code) {
    //             ElMessage.success(`更新影像器官数据成功！`);
    //             loadSeriesLabel();
    //         }
    //     })
    // }

    seriesLabel.value[editLabel.value].isLabelEdit = ! seriesLabel.value[editLabel.value].isLabelEdit
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
                ElMessage.success(`更新扫描类型数据成功！`);
                loadSeriesDetail();
            }
        })
    }

}

const seriesLabel: Ref<SeriesLabelItem[]> = ref([{
    id: '',
    fileName: '',
    fileLocation: '',
    createdAt: '',
    organId: [],
    isLabelEdit: true
}])

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
    loadSeriesLabel()
    loadOrgan()
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

async function loadSeriesLabel() {
    const { data } = await getSeriesLabelApi($router.currentRoute.value.params.seriesId as string)
    seriesLabel.value = data
    seriesLabel.value.filter(item => {
        item.isLabelEdit = true;
    })
    // 初始化默认器官数据
    oldOrgan.value = []
    seriesLabel.value.filter(item => {
        oldOrgan.value.push(item.organId)
    })
}

async function loadOrgan() {
    let { data } = await fetchOrgan(null, -1, -1);
    organ.value = data.records;
}

// async function loadSeriesInstance() {
//   const { data } = await getSeriesInstance($router.currentRoute.value.params.seriesId as string)
//   seriesInstance.value = data
//   seriesInstance.value.forEach(instance => {
//     instance.imageUrl = '/api/file/jpg/' + instance.id
//   })
// }

// 删除标注文件
function delLabel(index: number) {
    editLabel.value = index
    delSeriesLabelApi($router.currentRoute.value.params.seriesId as string, seriesLabel.value[index].fileName).then(() => {
        loadSeriesLabel()
    })
}

// 下载标注文件
function downloadLabel(fileLocation: string, fileName: string) {
    ElMessage.success(`正在下载载标注文件：${fileName}`)
    downLoadSeriesLabelApi(fileLocation)
}

const upload = ref<any>()

// 上传标注文件
function uploadLabel(param: any) {

    const formData = new FormData()
    formData.append('file', param.file)

    uploadLabelApi($router.currentRoute.value.params.seriesId as string, formData).then(res => {
        console.log(`上传标注文件成功，${res}`)
        ElMessage.success(`${param.file.name} 上传成功！`)
        loadSeriesLabel()
    }).catch(res => {
        console.error(`上传标注文件失败，${res}`)
        ElMessage.error(`${param.file.name} 上传失败，${res.response.data.msg}`)
    })

}

// 文件发生改变
function fileChange() {
    upload.value.clearFiles() //清除文件对象
}

onMounted(() => {
    init()
});
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.red {
    color: rgb(233, 67, 67);
}

.blue {
    color: #669dfc;
}
</style>