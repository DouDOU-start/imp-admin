import { defineStore } from 'pinia';

    export const useDownloadStore = defineStore('download', {
	state: () => {
		return {
			isDownloading: false
		};
	},
	getters: {},
	actions: {
		handleDownload() {
			this.isDownloading = !this.isDownloading;
		}
	}
});
