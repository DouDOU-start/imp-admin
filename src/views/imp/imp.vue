<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select multiple :clearable="true" v-model="query.institutionIds" placeholder="机构" class="mr10">
                    <el-option v-for="item in institution" :key="item.id" :label="item.institutionName" :value="item.id" />
                </el-select>
                <el-select multiple :clearable="true" v-model="query.modality" placeholder="模态" class="mr10 handle-select">
                    <el-option v-for="item in modality" :key="item" :label="item" :value="item" />
                </el-select>
                <el-select multiple :clearable="true" v-model="query.bodyPartIds" placeholder="身体部位"
                    class="mr10 handle-select">
                    <el-option v-for="item in bodyPart" :key="item.id" :label="item.bodyName" :value="item.id" />
                </el-select>
                <el-select :clearable="true" v-model="query.patientSex" placeholder="性别" class="mr10 handle-select">
                    <el-option v-for="item in patientSex" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select multiple :clearable="true" v-model="query.scanTypeIds" placeholder="扫描类型"
                    class="mr10 handle-select">
                    <el-option v-for="item in scanType" :key="item.id" :label="item.scanTypeName" :value="item.id" />
                </el-select>
                <el-select multiple :clearable="true" v-model="query.organIds" placeholder="器官" class="mr10 handle-select">
                    <el-option v-for="item in organ" :key="item.id" :label="item.organName" :value="item.id" />
                </el-select>
                <el-input v-model="query.sliceRange" placeholder="切片厚度：0.625（精确过滤），0.625,3（范围过滤）" clearable
                    class="mr10 handle-input" />
            </div>
            <el-row style="width: 350px;">
                <el-col :span="8"><el-button type="primary" :icon="Search" @click="handleSearch"
                        class="btn">搜索</el-button></el-col>
                <el-col :span="8"><el-upload ref="upload" action="string" :before-upload="onBeforeUploadDicom"
                        :http-request="uploadDicom" :on-change="fileChange" multiple>
                        <el-button type="primary" class="btn">上传影像</el-button></el-upload></el-col>
                <el-col :span="8"><el-button type="primary" :icon="Download" @click="handleSearch"
                        class="btn">批量下载</el-button></el-col>
            </el-row>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="seriesId" label="系列 ID" width="100" align="center"></el-table-column>
                <el-table-column prop="institutionName" label="机构" width="130" align="center"></el-table-column>
                <el-table-column prop="patientNumber" label="患者 ID" align="center"></el-table-column>
                <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
                <el-table-column prop="patientSex" label="性别" align="center"></el-table-column>
                <el-table-column prop="patientAge" label="年龄" align="center"></el-table-column>
                <el-table-column prop="modality" label="模态" align="center"></el-table-column>
                <el-table-column prop="sliceThickness" label="切片厚度（mm）" align="center"></el-table-column>
                <el-table-column prop="bodyPart" label="身体部位" align="center"></el-table-column>
                <el-table-column prop="scanType" label="扫描类型" align="center"></el-table-column>
                <el-table-column prop="createdAt" width="200" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button text :icon="Edit" @click="router.push(`/imp/${scope.row.seriesId}`)" v-permiss="15">
                            详情
                        </el-button>
                        <el-button text :icon="Download" @click="handleDownload(scope.row.seriesId)" v-permiss="16">
                            下载
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.currentPage"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { Delete, Edit, Search, Plus, List, Download } from '@element-plus/icons-vue';
import { SimpleSeriesItem, fetchSimpleSeries } from '../../api/imp/imp';
import { fetchInstitution, institutionItem } from '../../api/dimension/institution';
import { BodyPartItem, fetchBodyPart } from '../../api/dimension/bodypart';
import { ScanTypeItem, fetchScanType } from '../../api/dimension/scantype';
import { OrganItem, fetchOrgan } from '../../api/dimension/organ';
import { fetchModality } from '../../api/dimension/modality';
import { downLoadDicomApi, uploadDicomApi } from '../../api/file/dicom';
import { useRouter } from 'vue-router';

const query = reactive({
    currentPage: 1,
    pageSize: 10,
    institutionIds: [],
    modality: [],
    sliceRange: '',
    bodyPartIds: [],
    patientSex: '',
    scanTypeIds: [],
    organIds: [],
});
const tableData = ref<SimpleSeriesItem[]>([]);
const pageTotal = ref(0);

const institution = ref<Array<institutionItem>>()
const modality = ref<Array<string>>()
const bodyPart = ref<Array<BodyPartItem>>()
const scanType = ref<Array<ScanTypeItem>>()
const organ = ref<Array<OrganItem>>()
const patientSex = [
    {
        "id": "M",
        "name": "男"
    }, {
        "id": "F",
        "name": "女"
    }
]

const router = useRouter();

// 获取机构数据
async function loadInstitution() {
    let { data } = await fetchInstitution();
    institution.value = data.records
}

// 获取模态数据
async function loadModality() {
    let { data } = await fetchModality();
    modality.value = data
}

// 获取身体部位数据
async function loadBodyPart() {
    let { data } = await fetchBodyPart(null, -1, -1);
    bodyPart.value = data.records
}

// 加载扫描类型列表
async function loadScanType() {
    let { data } = await fetchScanType(null, -1, -1);
    scanType.value = data.records
}

// 加载器官列表
async function loadOrgan() {
    let { data } = await fetchOrgan(null, -1, -1);
    organ.value = data.records
}

// 获取表格数据
const getData = () => {
    fetchSimpleSeries({
        currentPage: query.currentPage,
        pageSize: query.pageSize,
        institutionIds: query.institutionIds.length == 0 ? null : query.institutionIds.join(","),
        modality: query.modality.length == 0 ? null : query.modality.join(","),
        sliceRange: query.sliceRange == '' ? null : query.sliceRange,
        bodyPartIds: query.bodyPartIds.length == 0 ? null : query.bodyPartIds.join(","),
        patientSex: query.patientSex == '' ? null : query.patientSex,
        scanTypeIds: query.scanTypeIds.length == 0 ? null : query.scanTypeIds.join(","),
        organIds: query.organIds.length == 0 ? null : query.organIds.join(","),
    }).then(res => {
        console.log(res);
        tableData.value = res.data.records;
        tableData.value.forEach((item: any) => {
            item.createdAt = new Date(item.createdAt).toLocaleString('zh-CN').replace(',', '');
            item.bodyPart = item.bodyPart == null ? "/" : item.bodyPart;
            item.scanType = item.scanType == null ? "/" : item.scanType;
        })
        pageTotal.value = res.data.total || 0;
    });
};

onMounted(() => {
    init()
});

const init = () => {
    loadInstitution();
    loadModality();
    loadBodyPart();
    loadScanType();
    loadOrgan();
    getData();
};

// 查询操作
const handleSearch = () => {
    query.currentPage = 1;
    getData();
};

// 分页导航
const handlePageChange = (val: number) => {
    query.currentPage = val;
    getData();
};

function onBeforeUploadDicom(file: FileList) {
    console.log(`上传Dicom文件前置，${file}`)
}

const upload = ref<any>()

// 上传DICOM文件
function uploadDicom(param: any) {
    const formData = new FormData()
    formData.append('file', param.file)

    uploadDicomApi(formData).then(res => {
        ElNotification({
            message: `${param.file.name} 上传成功！`,
            type: 'success',
        })
        init();
    }).catch(res => {
        ElNotification({
            message: `${param.file.name} 上传失败，${res.response.data.msg}`,
            type: 'error',
        })
    });
}

// 文件发生改变
function fileChange() {
    upload.value.clearFiles() //清除文件对象
}

// 下载影像
const handleDownload = (seriesId: number) => {
    ElMessage.success("正在请求下载影像包")
    downLoadDicomApi(seriesId).then(() => {
        ElMessage.success("下载影像包成功")
    }).catch(err => {
        ElMessage.error("下载影像包失败，请重试")
    })
    console.log(seriesId)
};

</script>

<style scoped>
.handle-box {
    margin-bottom: 10px;
}

.btn {
    float: left;
    width: 100px;
    margin-right: 10px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 350px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #F56C6C;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
