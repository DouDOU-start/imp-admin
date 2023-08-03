<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.keyword" placeholder="扫描类型" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd()">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="scanTypeName" label="扫描类型"></el-table-column>
				<el-table-column prop="createdAt" label="创建时间"></el-table-column>
				<el-table-column prop="updatedAt" label="更新时间"></el-table-column>
				<el-table-column prop="creator" label="创建用户"></el-table-column>
				<el-table-column prop="updater" label="修改用户"></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index, scope.row.id)"
							v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 新增、编辑弹出框 -->
		<el-dialog :title='isAdd ? "新增" : "编辑"' v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item v-if="!isAdd" label="ID">
					<el-input disabled v-model="form.id"></el-input>
				</el-form-item>
				<el-form-item label="扫描类型">
					<el-input v-model="form.scanTypeName"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="save">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { ScanTypeItem, fetchScanType, addScanType, editScanType, delScanType } from '../../api/dimension/scantype';

const query = reactive({
	keyword: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<ScanTypeItem[]>([]);
const pageTotal = ref(0);
const isAdd = ref(new Boolean)

// 获取表格数据
const getData = () => {
	fetchScanType(query.keyword, query.pageIndex, query.pageSize).then(res => {
		tableData.value = res.data.records;
		pageTotal.value = res.data.total;
	});
};
getData();

// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number, id: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(async () => {

		const { code, data, msg } = await delScanType(id);
		if (data == 1) {
			ElMessage.success('删除成功');
		} else {
			ElMessage.error(`删除失败`);
		}

		getData();
	})
		.catch(() => { });
};

// 表格新增、编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	id: 0,
	scanTypeName: ''
});
let idx: number = -1;
const handleAdd = () => {
	form.scanTypeName = '';
	isAdd.value = true
	editVisible.value = true;
};
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.id = row.id;
	form.scanTypeName = row.scanTypeName;
	isAdd.value = false
	editVisible.value = true;
};

// 保存数据
const save = async () => {

	editVisible.value = false;

	if (isAdd.value) {
		const { code, data, msg } = await addScanType(form.scanTypeName);
		if (data == 1) {
			ElMessage.success(`新增身体部位成功`);
		} else {
			ElMessage.error(`新增身体部位失败`);
		}
	} else {
		const { code, data, msg } = await editScanType(form.id, form.scanTypeName);
		if (data == 1) {
			ElMessage.success(`修改身体部位成功`);
		} else {
			ElMessage.error(`修改身体部位失败`);
		}
	}

	getData();

};
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
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