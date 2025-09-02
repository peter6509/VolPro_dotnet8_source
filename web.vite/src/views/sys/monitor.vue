<template>
	<div class="app-container">
		<el-button @click="getInfo">getInfo</el-button>
		<el-row>
			<el-col :span="12" class="card-box">
				<el-card>
					<template #header><span>CPU</span></template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<table cellspacing="0" style="width: 100%;">
							<thead>
								<tr>
									<th class="el-table__cell is-leaf">
										<div class="cell">屬性</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">值</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<!-- <tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">核心數</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.sys">{{ server.sys.cpuNum }}</div>
									</td>
								</tr> -->
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">邏輯數量</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu">{{ server.cpu.cpuNum || server.cpu.cpuTotal }}
										</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">系统使用率</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu">
											<span v-if="server.cpu.cpuRate">{{ server.cpu.cpuRate }}%</span>
											<span v-else>
												{{ Math.floor((server.cpu.used / server.cpu.total) * 100) }}%
											</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">當前空閒率</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu">
											{{ Math.floor((100 - server.cpu.cpuRate)) }}%
											<!-- {{ Math.floor((server.cpu.free/server.cpu.total)*100) }}% -->
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-card>
			</el-col>

			<el-col :span="12" class="card-box">
				<el-card>
					<template #header><span>内存</span></template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<table cellspacing="0" style="width: 100%;">
							<thead>
								<tr>
									<th class="el-table__cell is-leaf">
										<div class="cell">屬性</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">内存</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">總内存</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu">{{ server.cpu.totalRAM }}</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">已用内存</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu">{{ server.cpu.usedRam }}</div>
									</td>
								</tr>
								<!-- <tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">剩餘内存</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu">{{ server.cpu.freeRam }}</div>
									</td>
								</tr> -->
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">使用率</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.cpu"
											:class="{ 'text-danger': server.cpu.ramRate > 80 }">{{
												server.cpu.ramRate }}
										</div>
									</td>

								</tr>
							</tbody>
						</table>
					</div>
				</el-card>
			</el-col>

			<el-col :span="24" class="card-box">
				<el-card>
					<template #header><span>服務器信息</span></template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<table cellspacing="0" style="width: 100%;">
							<tbody>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">服務器名稱</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.sys">{{ server.sys.computerName }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">操作系统</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.sys">{{ server.sys.osName }}</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">服務器IP</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.sys">{{ server.sys.serverIP }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">系统架構</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.sys">{{ server.sys.osArch }}</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-card>
			</el-col>

			<el-col :span="24" class="card-box">
				<el-card>
					<template #header><span>應用信息</span></template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<table cellspacing="0" style="width: 100%;table-layout:fixed;">
							<tbody>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">應用環境</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.name }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">應用版本</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.version }}</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf">
										<div class="cell">啟動時間</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.startTime }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">運行時長</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.runTime }}</div>
									</td>
								</tr>
								<tr>
									<td colspan="1" class="el-table__cell is-leaf">
										<div class="cell">安装路徑</div>
									</td>
									<td colspan="3" class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.rootPath }}</div>
									</td>
								</tr>
								<tr>
									<td colspan="1" class="el-table__cell is-leaf">
										<div class="cell">項目路徑</div>
									</td>
									<td colspan="3" class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.webRootPath }}</div>
									</td>
								</tr>
								<tr>
									<td colspan="1" class="el-table__cell is-leaf">
										<div class="cell">運行參數</div>
									</td>
									<td colspan="3" class="el-table__cell is-leaf">
										<div class="cell" v-if="server.app">{{ server.app.name }}</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-card>
			</el-col>

			<el-col :span="24" class="card-box">
				<el-card>
					<template #header><span>磁碟狀態</span></template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<table cellspacing="0" style="width: 100%;">
							<thead>
								<tr>
									<th class="el-table__cell el-table__cell is-leaf">
										<div class="cell">磁碟路徑</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">磁碟類型</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">總大小</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">可用大小</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">已用大小</div>
									</th>
									<th class="el-table__cell is-leaf">
										<div class="cell">已用百分比</div>
									</th>
								</tr>
							</thead>
							<tbody v-if="server.disk">
								<tr v-for="(sysFile, index) in server.disk" :key="index">
									<td class="el-table__cell is-leaf">
										<div class="cell">{{ sysFile.diskName }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">{{ sysFile.typeName }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">{{ sysFile.totalSize }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">{{ sysFile.availableFreeSpace }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell">{{ sysFile.used }}</div>
									</td>
									<td class="el-table__cell is-leaf">
										<div class="cell" :class="{ 'text-danger': sysFile.availablePercent > 80 }">
											{{ sysFile.availablePercent }}%
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-card>
			</el-col>


		</el-row>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	reactive,
	getCurrentInstance
} from "vue";
//import http from "../../api/http.js";
import http from "@/../src/api/http.js";

const server = ref([]);
export default defineComponent({
	setup() {
		const url = '/api/sysMonitor/getInfo';
		const getInfo = () => {
			http.post(url, {}, true).then(result => {
				server.value = result;
			});
		}
		getInfo();
		return {
			server,
			getInfo
		};
	},
});
</script>

<style lang="less" scoped>
.card-box {
	padding: 6px;
}
</style>