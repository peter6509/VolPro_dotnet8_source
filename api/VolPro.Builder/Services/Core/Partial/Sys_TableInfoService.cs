﻿using VolPro.Builder.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Text;
using System.Threading.Tasks;
using VolPro.Core.Const;
using VolPro.Core.DBManager;
using VolPro.Core.Enums;
using VolPro.Core.Extensions;
using VolPro.Core.ManageUser;
using VolPro.Core.Utilities;
using VolPro.Entity.DomainModels;
using VolPro.Entity.DomainModels.Sys;
using VolPro.Entity.SystemModels;
using VolPro.Core.EFDbContext;
using VolPro.Core.Configuration;

namespace VolPro.Builder.Services
{
    public partial class Sys_TableInfoService
    {
        private int totalWidth = 0;
        private int totalCol = 0;
        private string webProject = null;
        private string apiNameSpace = null;
        private string startName = "";
        private string StratName
        {
            get
            {
                if (startName == "")
                {
                    startName = WebProject.Substring(0, webProject.LastIndexOf('.'));
                }
                return startName;
            }
        }
        private string WebProject
        {
            get
            {
                if (webProject != null)
                    return webProject;
                webProject = ProjectPath.GetLastIndexOfDirectoryName(".WebApi") ?? ProjectPath.GetLastIndexOfDirectoryName("Api") ?? ProjectPath.GetLastIndexOfDirectoryName(".Web");
                if (webProject == null)
                {
                    throw new Exception("未获取到以.WebApi结尾的项目名称,无法创建页面");
                }
                return webProject;
            }
        }
        private string ApiNameSpace
        {
            get
            {
                if (apiNameSpace != null)
                    return apiNameSpace;
                apiNameSpace = ProjectPath.GetLastIndexOfDirectoryName(".WebApi");
                if (apiNameSpace == null)
                {
                    throw new Exception("未获取到以.WebApi,无法创建Api控制器");
                }
                return apiNameSpace;
            }
        }

        /// <summary>
        /// 获取生成配置的树开菜单
        /// </summary>
        /// <returns></returns>
        public async Task<(string, string)> GetTableTree()
        {
            var treeData = await repository.FindAsIQueryable(x => 1 == 1)
                .Select(c => new
                {
                    id = c.Table_Id,
                    pId = c.ParentId,
                    parentId = c.ParentId,
                    name = c.ColumnCNName,
                    orderNo = c.OrderNo
                }).OrderByDescending(c => c.orderNo).ToListAsync();
            var treeList = treeData.Select(a => new
            {
                a.id,
                a.pId,
                a.parentId,
                a.name,
                isParent = treeData.Select(x => x.pId).Contains(a.id)
            });
            string startsWith = WebProject.Substring(0, WebProject.IndexOf('.'));
            return (treeList.Count() == 0 ? "[]" : treeList.Serialize() ?? "", ProjectPath.GetProjectFileName(startsWith));
            ;

        }

        /// <summary>
        /// 2020.05.17增加mysql获取表结构时区分当前所在数据库
        /// </summary>
        /// <returns></returns>
        private string GetMysqlTableSchema(string connection)
        {
            try
            {
                connection = DBServerProvider.GetConnectionString(connection);
                string dbName = connection.Split("Database=")[1].Split(";")[0]?.Trim();
                //  DBServerProvider.GetConnectionString().Split("Database=")[1].Split(";")[0]?.Trim();
                if (!string.IsNullOrEmpty(dbName))
                {
                    dbName = $" and table_schema = '{dbName}' ";
                }
                return dbName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"获取mysql数据库名异常:{ex.Message}");
                return "";
            }
        }

        /// <summary>
        /// 获取Mysql表结构信息
        /// 2020.06.14增加对mysql数据类型double区分
        /// </summary>
        /// <returns></returns>
        private string GetMySqlModelInfo(string connection)
        {
            return $@"SELECT
DISTINCT
           CONCAT(NUMERIC_PRECISION,',',NUMERIC_SCALE) as Prec_Scale,
        CASE
                 WHEN data_type IN( 'BIT', 'BOOL','bit', 'bool') THEN
                'bool'
                 WHEN data_type in('smallint','SMALLINT') THEN 'short'
				WHEN data_type in('tinyint', 'TINYINT') THEN 'tinyint'
                WHEN data_type IN('MEDIUMINT','mediumint', 'int','INT','year', 'Year') THEN
                'int'
                WHEN data_type in ( 'BIGINT','bigint') THEN
                'bigint'
                WHEN data_type IN('FLOAT',  'DECIMAL','float', 'decimal') THEN
                'decimal'
							 WHEN data_type IN( 'DOUBLE', 'double') THEN
                'double'
                WHEN data_type IN('CHAR', 'VARCHAR', 'TINY TEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB', 'LONGBLOB', 'Time','char', 'varchar', 'tiny text', 'text', 'mediumtext', 'longtext', 'tinyblob', 'blob', 'mediumblob', 'longblob', 'time') THEN
                'nvarchar'
                WHEN data_type IN('Date', 'DateTime', 'TimeStamp','date', 'datetime', 'timestamp') THEN
                'datetime' ELSE 'nvarchar'
            END AS ColumnType, Column_Name AS ColumnName
            FROM
                information_schema.COLUMNS
            WHERE
                table_name = ?tableName {GetMysqlTableSchema(connection)};";
        }


        /// <summary>
        /// 获取SqlServer表结构信息
        /// </summary>
        /// <returns></returns>
        private string GetSqlServerModelInfo()
        {
            return $@"
	SELECT CASE WHEN t.ColumnType IN ('decimal','smallmoney','money') THEN 
                    CONVERT(VARCHAR(30),t.Prec)+','+CONVERT(VARCHAR(30),t.Scale)  ELSE ''
                     END 
                    AS Prec_Scale,t.ColumnType,t.ColumnName
                      FROM (
                    SELECT col.prec AS  'Prec',col.scale AS 'Scale',t.name AS ColumnType,col.name AS ColumnName FROM          dbo.syscolumns col
                                                LEFT  JOIN dbo.systypes t ON col.xtype = t.xusertype
                                                INNER JOIN dbo.sysobjects obj ON col.id = obj.id
                                                                                 AND obj.xtype IN ('U','V')
                                                                                 AND obj.status >= 0
                                                LEFT  JOIN dbo.syscomments comm ON col.cdefault = comm.id
                                                LEFT  JOIN sys.extended_properties ep ON col.id = ep.major_id
                                                                                  AND col.colid = ep.minor_id
                                                                                  AND ep.name = 'MS_Description'
                                                LEFT  JOIN sys.extended_properties epTwo ON obj.id = epTwo.major_id
                                                                                  AND epTwo.minor_id = 0
                                                                                  AND epTwo.name = 'MS_Description'
                                      WHERE     obj.name =@tableName) AS t";
        }
        /// <summary>
        /// 获取PgSQl表结构信息
        /// 2020.08.07完善PGSQL
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        /// </summary>
        /// <returns></returns>
        private string GetPgSqlModelInfo()
        {
            StringBuilder stringBuilder = new StringBuilder();

            stringBuilder.Append("			SELECT ");
            stringBuilder.Append("				col.COLUMN_NAME AS \"ColumnName\", ");
            stringBuilder.Append("			CASE ");
            stringBuilder.Append("					WHEN col.udt_name = 'uuid' THEN ");
            stringBuilder.Append("					'guid'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'int2') THEN ");
            stringBuilder.Append("					'short'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'int4' ) THEN ");
            stringBuilder.Append("					'int'  ");
            stringBuilder.Append("					WHEN col.udt_name = 'int8' THEN ");
            stringBuilder.Append("					'long'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'char', 'varchar', 'text', 'xml', 'bytea' ) THEN ");
            stringBuilder.Append("					'varchar'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'bool' ) THEN ");
            stringBuilder.Append("					'bool'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'date','timestamp' ) THEN ");
            stringBuilder.Append("					'DateTime'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'decimal', 'money','numeric' ) THEN ");
            stringBuilder.Append("					'decimal'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'float4', 'float8' ) THEN ");
            stringBuilder.Append("					'float' ELSE 'varchar '  ");
            stringBuilder.Append("				END  as ColumnType ");
            stringBuilder.Append("from 	information_schema.COLUMNS col  ");
            stringBuilder.Append("WHERE	\"lower\" ( TABLE_NAME ) = \"lower\" (@tableName )  ");
            return stringBuilder.ToString();
        }


        private string GetOracleStructure(string tableName)
        {
            return $@"SELECT
			c.TABLE_NAME TableName ,
			cc.COLUMN_NAME COLUMNNAME,
			cc.COMMENTS  as  ColumnCNName,
	      CASE WHEN  c.DATA_TYPE IN('smallint', 'INT') OR  (c.DATA_TYPE='NUMBER' AND (c.DATA_SCALE=0 or c.DATA_SCALE IS null)) THEN 'int'  
	         WHEN  c.DATA_TYPE='NUMBER' AND c.DATA_SCALE>0 THEN 'decimal'
              WHEN  c.DATA_TYPE IN('float', 'FLOAT')  THEN 'float'
			 WHEN c.DATA_TYPE IN('CHAR', 'VARCHAR', 'NVARCHAR','VARCHAR2', 'NVARCHAR2','text', 'image')
			 THEN 'string'
		     WHEN  c.DATA_TYPE IN('DATE') THEN 'DateTime'  
			ELSE 'string' 
			end    as ColumnType,
			c.DATA_LENGTH  as Maxlength,
			case WHEN 	c.NULLABLE='Y' THEN 1 ELSE 0 end   as ISNULL,
			1 IsColumnData,1 IsDisplay
			FROM
			user_tab_columns c
			LEFT JOIN   user_col_comments cc ON c.table_name = cc.table_name 
			AND c.column_name = cc.column_name
			LEFT JOIN   user_tab_comments t ON c.table_name = t.table_name 
	
                WHERE
                -- 	c.OWNER = 'NETCOREDEV' 
                -- 	AND
                c.table_name='{tableName.ToUpper()}'";
        }


        private string GetOracleModelInfo(string tableName)
        {
            return $@"SELECT
			c.TABLE_NAME TableName ,
			cc.COLUMN_NAME COLUMNNAME,
			cc.COMMENTS  as  ColumnCNName,
      CASE WHEN  c.DATA_TYPE IN('smallint', 'INT') OR  (c.DATA_TYPE='NUMBER' AND (c.DATA_SCALE=0 or c.DATA_SCALE IS null)) THEN 'int'  
	         WHEN  c.DATA_TYPE='NUMBER' AND c.DATA_SCALE>0 THEN 'decimal'
             WHEN  c.DATA_TYPE IN('float', 'FLOAT')  THEN 'float'
			WHEN c.DATA_TYPE IN('CHAR', 'VARCHAR', 'NVARCHAR','VARCHAR2', 'NVARCHAR2','text', 'image')
			THEN 'nvarchar'
		  WHEN  c.DATA_TYPE IN('DATE') THEN 'date'  
			ELSE 'nvarchar' 
			end    as ColumnType,
			c.DATA_LENGTH  as Maxlength,
			case WHEN 	c.NULLABLE='Y' THEN 1 ELSE 0 end   as ISNULL
			
          -- CONCAT(NUMERIC_PRECISION,',',NUMERIC_SCALE) as Prec_Scale
			FROM
			ALL_tab_columns c
			LEFT JOIN   ALL_col_comments cc ON c.table_name = cc.table_name 
			AND c.column_name = cc.column_name
			LEFT JOIN   ALL_tab_comments t ON c.table_name = t.table_name 
			WHERE 		   c.table_name='{tableName.ToUpper()}'";

        }

        private WebResponseContent ExistsTable(string tableName, string tableTrueName)
        {
            WebResponseContent webResponse = new WebResponseContent(true);
            //如果是第一次创建model，此处反射获取到的是已经缓存过的文件，必须重新运行项目否则新增的文件无法做判断文件是否创建，需要重新做反射实际文件，待修改...
            var compilationLibrary = DependencyContext
                .Default
                .CompileLibraries
                .Where(x => !x.Serviceable && x.Type == "project");
            foreach (var _compilation in compilationLibrary)
            {
                try
                {
                    foreach (var entity in AssemblyLoadContext.Default
                .LoadFromAssemblyName(new AssemblyName(_compilation.Name))
                .GetTypes().Where(x => x.GetTypeInfo().BaseType != null
                    && x.BaseType == typeof(SysEntity)))
                    {
                        if (entity.Name == tableTrueName && !string.IsNullOrEmpty(tableName) && tableName != tableTrueName)
                            return webResponse.Error($"实际表名【{tableTrueName}】已创建实体，不能创建别名【{tableName}】实体");

                        if (entity.Name != tableName)
                        {
                            var tableAttr = entity.GetCustomAttribute<TableAttribute>();
                            if (tableAttr != null && tableAttr.Name == tableTrueName)
                            {
                                return webResponse.Error($"实际表名【{tableTrueName}】已被【{entity.Name}】创建建实体,不能创建别名【{tableName}】实体,请将别名更换为【{entity.Name}】");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {

                    Console.WriteLine("查找文件异常：" + ex.Message);
                }
            }
            return webResponse;

        }

        /// <summary>
        /// 生成实体Model
        /// </summary>
        /// <param name="sysTableInfo"></param>
        /// <returns></returns>
        public string CreateEntityModel(Sys_TableInfo sysTableInfo)
        {
            if (sysTableInfo == null
                || sysTableInfo.TableColumns == null
                || sysTableInfo.TableColumns.Count == 0)
                return "提交的配置数据不完整";

            WebResponseContent webResponse = ValidColumnString(sysTableInfo);
            if (!webResponse.Status)
                return webResponse.Message;

            string tableName = sysTableInfo.TableName;
            webResponse = ExistsTable(tableName, sysTableInfo.TableTrueName);
            if (!webResponse.Status)
            {
                return webResponse.Message;
            }
            if (!string.IsNullOrEmpty(sysTableInfo.TableTrueName) && sysTableInfo.TableTrueName != tableName)
            {
                tableName = sysTableInfo.TableTrueName;
            }

            string sql;
            string connection = GetConnectionKey(sysTableInfo);
            string dbType = DbRelativeCache.GetDbType(sysTableInfo.DBServer) ?? DBType.Name;

            switch (dbType)
            {
                case "MySql":
                    sql = GetMySqlModelInfo(connection);
                    break;
                case "PgSql":
                    sql = GetPgSqlModelInfo();
                    break;
                case "MsSql":
                    sql = GetSqlServerModelInfo();
                    break;
                default:
                    sql = GetOracleModelInfo(tableName);
                    break;
            }

            List<TableColumnInfo> tableColumnInfoList = DBServerProvider.GetSqlDapperWidthDbService(sysTableInfo.DBServer).QueryList<TableColumnInfo>(sql, new { tableName });
            List<Sys_TableColumn> list = sysTableInfo.TableColumns;
            string msg = CreateEntityModel(list, sysTableInfo, tableColumnInfoList, 1);
            if (msg != "")
                return msg;
            //if (list.Any(c => c.ApiInPut > 0))
            //{
            //    CreateEntityModel(list.Where(c => c.ApiInPut > 0).ToList(), sysTableInfo, tableColumnInfoList, 2);
            //}
            //if (list.Any(c => c.ApiOutPut > 0))
            //{
            //    CreateEntityModel(list.Where(c => c.ApiOutPut > 0).ToList(), sysTableInfo, tableColumnInfoList, 3);
            //}
            return "Model创建成功!";
        }

        /// <summary>
        /// 保存配置信息
        /// </summary>
        /// <param name="sysTableInfo"></param>
        /// <returns></returns>
        public WebResponseContent SaveEidt(Sys_TableInfo sysTableInfo)
        {
            WebResponseContent webResponse = ValidColumnString(sysTableInfo);
            if (!webResponse.Status) return webResponse;
            //2020.05.07新增禁止选择上级角色为自己
            if (sysTableInfo.Table_Id == sysTableInfo.ParentId)
            {
                return WebResponseContent.Instance.Error($"父级id不能为自己");
            }

            if (repository.Exists(x => x.ParentId == sysTableInfo.Table_Id && x.Table_Id == sysTableInfo.ParentId))
            {
                return WebResponseContent.Instance.Error($"不能选择此父级");
            }

            //if (sysTableInfo.TableColumns != null && sysTableInfo.TableColumns.Any(x => !string.IsNullOrEmpty(x.DropNo) && x.ColumnName == sysTableInfo.ExpressField))
            //{
            //    return WebResponseContent.Instance.Error($"不能将字段【{sysTableInfo.ExpressField}】设置为快捷编辑,因为已经设置了数据源");
            //}
            if (sysTableInfo.TableColumns != null)
            {
                sysTableInfo.TableColumns.ForEach(x =>
                {
                    x.TableName = sysTableInfo.TableName;
                });
            }

            sysTableInfo.TableColumns?.ForEach(x =>
            {
                if (x.IsReadDataset == null)
                {
                    x.IsReadDataset = 0;
                }
                if (!string.IsNullOrEmpty(x.ColumnCnName))
                {
                    x.ColumnCnName = x.ColumnCnName.Trim().Replace("\r\n", "");
                }
                if (!string.IsNullOrEmpty(x.ColumnName))
                {
                    x.ColumnName = x.ColumnName.Trim().Replace("\r\n", "");
                }
            });
            return repository.UpdateRange<Sys_TableColumn>(sysTableInfo, true, true, null, null, true);
        }

        /// <summary>
        /// 2020.08.07完善PGSQL
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        private string GetCurrentSql(string tableName, string connection, string dbService)
        {
            string sql;
            string dbType = DbRelativeCache.GetDbType(dbService)?.ToLower();
            if (string.IsNullOrEmpty(dbType))
            {
                dbType = DBType.Name.ToLower();
            }
            if (dbType == DbCurrentType.MySql.ToString().ToLower())
            {
                sql = GetMySqlStructure(tableName, connection);
            }
            else if (dbType == DbCurrentType.PgSql.ToString().ToLower())
            {
                sql = GetPgSqlStructure(tableName);
            }
            else if (dbType == DbCurrentType.MsSql.ToString().ToLower())
            {
                sql = GetSqlServerStructure(tableName);
            }
            else
            {
                sql = GetOracleStructure(tableName);
            }
            return sql;
        }

        private string GetConnectionKey(Sys_TableInfo tableInfo)
        {
            string db = tableInfo.DBServer;
            if (tableInfo.DBServer == typeof(ServiceDbContext).Name && AppSetting.UseDynamicShareDB)
            {
                db = DBServerProvider.ServiceConnectingString;
            }
            return db;
        }

        /// <summary>
        /// 将表结构重新同步到代码生成配置
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public async Task<WebResponseContent> SyncTable(string tableName)
        {
            WebResponseContent webResponse = new WebResponseContent();
            if (string.IsNullOrEmpty(tableName)) return webResponse.OK("表名不能为空");

            Sys_TableInfo tableInfo = repository.FindAsIQueryable(x => x.TableName == tableName)
          .Include(o => o.TableColumns).ToList().FirstOrDefault();
            if (tableInfo == null)
                return webResponse.Error("未获取到【" + tableName + "】的配置信息，请使用新建功能");
            if (!string.IsNullOrEmpty(tableInfo.TableTrueName) && tableInfo.TableTrueName != tableName)
            {
                tableName = tableInfo.TableTrueName;
            }
            string connection = GetConnectionKey(tableInfo);
            string sql = GetCurrentSql(tableName, connection, tableInfo.DBServer);

            //获取表结构
            //List<Sys_TableColumn> columns = DBServerProvider.GetSqlDapper(connection) // repository.DapperContext.get
            //      .QueryList<Sys_TableColumn>(sql, new { tableName });
            //2024.06.20增加获取指定数据库与指定数据库类型
            List<Sys_TableColumn> columns = DBServerProvider.GetSqlDapperWidthDbService(tableInfo.DBServer)
                .QueryList<Sys_TableColumn>(GetCurrentSql(tableName, connection, tableInfo.DBServer), new { tableName });


            if (columns == null || columns.Count == 0)
                return webResponse.Error("未获取到【" + tableName + "】表结构信息，请确认表是否存在");


            //获取现在配置好的表结构
            List<Sys_TableColumn> detailList = tableInfo.TableColumns ?? new List<Sys_TableColumn>();
            List<Sys_TableColumn> addColumns = new List<Sys_TableColumn>();
            List<Sys_TableColumn> updateColumns = new List<Sys_TableColumn>();
            foreach (Sys_TableColumn item in columns)
            {
                Sys_TableColumn tableColumn = detailList.Where(x => x.ColumnName == item.ColumnName)
                    .FirstOrDefault();
                //新加的列
                if (tableColumn == null)
                {
                    item.TableName = tableInfo.TableName;
                    item.Table_Id = tableInfo.Table_Id;
                    item.EditRowNo = 0;
                    addColumns.Add(item);
                    continue;
                }
                //修改了数据类库或字段长度
                if (item.ColumnType != tableColumn.ColumnType || item.Maxlength != tableColumn.Maxlength || (item.IsNull ?? 0) != (tableColumn.IsNull ?? 0))
                {
                    tableColumn.ColumnType = item.ColumnType;
                    tableColumn.Maxlength = item.Maxlength;
                    tableColumn.IsNull = item.IsNull;
                    updateColumns.Add(tableColumn);
                }
            }
            //删除的列
            List<Sys_TableColumn> delColumns = detailList.Where(a => !columns.Select(c => c.ColumnName).Contains(a.ColumnName)).ToList();
            if (addColumns.Count + delColumns.Count + updateColumns.Count == 0)
            {
                return webResponse.Error("【" + tableName + "】表结构未发生变化");
            }
            repository.AddRange(addColumns);
            repository.DbContext.Set<Sys_TableColumn>().RemoveRange(delColumns);
            repository.UpdateRange(updateColumns, x => new { x.ColumnType, x.Maxlength, x.IsNull });
            await repository.DbContext.SaveChangesAsync();

            return webResponse.OK($"新加字段【{addColumns.Count}】个,删除字段【{delColumns.Count}】,修改字段【{updateColumns.Count}】");
        }

        /// <summary>
        /// 生成Services/Repository与对应的Partial类
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="nameSpace"></param>
        /// <param name="foldername"></param>
        /// <param name="webController"></param>
        /// <param name="apiController"></param>
        /// <returns></returns>
        public string CreateServices(string tableName, string nameSpace, string foldername, bool webController, bool apiController)
        {
            var tableColumn = repository.FindAsyncFirst<Sys_TableColumn>(x => x.TableName == tableName).Result;

            if (tableColumn == null)
            {
                return $"没有查到{tableName}表信息";
            }

            if (string.IsNullOrEmpty(nameSpace) || string.IsNullOrEmpty(foldername))
            {
                return $"命名空间、项目文件夹都不能为空";
            }
            //生成Repository类
            string dbServer = repository.Find(x => x.TableName == tableName).Select(s => s.DBServer).FirstOrDefault();

            string domainContent = "";

            string frameworkFolder = ProjectPath.GetProjectDirectoryInfo()?.FullName;
            string[] splitArr = nameSpace.Split('.');
            string projectName = splitArr.Length > 1 ? splitArr[splitArr.Length - 1] : splitArr[0];
            string baseOptions = "\"" + projectName + "\"," + "\"" + foldername + "\"," + "\"" + tableName + "\"";

            if (apiController)
            {
                string apiPath = null;
                //系统表生成到webapi下
                //if (dbServer == typeof(SysDbContext).Name)
                //{
                apiPath = ProjectPath.GetProjectDirectoryInfo().GetDirectories().Where(x => x.Name.ToLower().EndsWith(".webapi")).FirstOrDefault()?.FullName;
                //}
                //else
                //{
                //    //业务库生成当前类库下
                //    apiPath = frameworkFolder + "\\" + nameSpace;
                //}
                if (string.IsNullOrEmpty(apiPath))
                {
                    return "未找到webapi类库,请确认是存在weiapi类库命名以.webapi结尾";
                }
                apiPath += $"\\Controllers\\{projectName}\\";
                //生成Partial Api控制器
                if (!File.Exists($"{apiPath}Partial\\{tableName}Controller.cs"))
                {
                    string partialController = FileHelper.ReadFile(@"Template\\Controller\\ControllerApiPartial.html")
                       .Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);
                    FileHelper.WriteFile($"{apiPath}Partial\\", tableName + "Controller.cs", partialController);
                }
                //生成Api控制器
                domainContent = FileHelper.ReadFile(@"Template\\Controller\\ControllerApi.html")
                    .Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName).Replace("{BaseOptions}", baseOptions);
                FileHelper.WriteFile(apiPath, tableName + "Controller.cs", domainContent);
            }


            if (dbServer == "")
            {
                dbServer = null;
            }
            //生成Repository类
            domainContent = FileHelper.ReadFile("Template\\Repositorys\\BaseRepository.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);

            domainContent = domainContent.Replace("{DbContext}", dbServer ?? typeof(SysDbContext).Name);



            FileHelper.WriteFile(
           frameworkFolder + string.Format("\\{0}\\Repositories\\{1}\\", nameSpace, foldername)
                          , tableName + "Repository.cs", domainContent);
            //生成IRepository类
            domainContent = FileHelper.ReadFile("Template\\IRepositorys\\BaseIRepositorie.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);
            FileHelper.WriteFile(
            frameworkFolder + string.Format("\\{0}\\IRepositories\\{1}\\", nameSpace, foldername),
                   "I" + tableName + "Repository.cs", domainContent);


            string path = $"{frameworkFolder}\\{nameSpace}\\IServices\\{foldername}\\";

            string fileName = "I" + tableName + "Service.cs";

            //生成Partial  IService类
            if (!File.Exists((path + "Partial\\" + fileName).ReplacePath()))
            {
                domainContent = FileHelper.ReadFile("Template\\IServices\\IServiceBasePartial.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);
                FileHelper.WriteFile(path + "Partial\\", fileName, domainContent);
            }

            //生成IService类
            domainContent = FileHelper.ReadFile("Template\\IServices\\IServiceBase.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);
            FileHelper.WriteFile(path, fileName, domainContent);


            path = $"{frameworkFolder}\\{nameSpace}\\Services\\{foldername}\\";
            fileName = tableName + "Service.cs";
            //生成Partial Service类
            domainContent = FileHelper.ReadFile("Template\\Services\\ServiceBasePartial.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);
            if (!File.Exists((path + "Partial\\" + fileName).ReplacePath()))
            {
                domainContent = FileHelper.ReadFile("Template\\Services\\ServiceBasePartial.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{StartName}", StratName);
                FileHelper.WriteFile(path + "Partial\\", fileName, domainContent);
            }

            //生成Service类
            domainContent = FileHelper.ReadFile("Template\\Services\\ServiceBase.html")
                .Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName)
                .Replace("{StartName}", StratName);
            FileHelper.WriteFile(path, fileName, domainContent);


            if (webController)
            {
                path = $"{frameworkFolder}\\{nameSpace}\\Controllers\\{foldername}\\";
                fileName = tableName + "Controller.cs";
                //生成Partial web控制器
                if (!File.Exists((path + "Partial\\" + fileName).ReplacePath()))
                {
                    domainContent = FileHelper.ReadFile("Template\\Controller\\ControllerPartial.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{BaseOptions}", baseOptions).Replace("{StartName}", StratName);
                    FileHelper.WriteFile(path + "Partial\\", tableName + "Controller.cs", domainContent);
                }

                //生成web控制器
                domainContent = FileHelper.ReadFile("Template\\Controller\\Controller.html").Replace("{Namespace}", nameSpace).Replace("{TableName}", tableName).Replace("{BaseOptions}", baseOptions).Replace("{StartName}", StratName);
                FileHelper.WriteFile(path, tableName + "Controller.cs", domainContent);
            }
            return "业务类创建成功!";
        }

        /// <summary>
        /// 获取界面查询字段
        /// </summary>
        /// <param name="panelHtml"></param>
        /// <param name="sysColumnList"></param>
        /// <param name="vue"></param>
        /// <param name="edit"></param>
        /// <returns></returns>
        private List<object> GetSearchData(List<List<PanelHtml>> panelHtml, List<Sys_TableColumn> sysColumnList, bool vue = false, bool edit = false, bool app = false)
        {
            if (edit)
            {
                GetPanelData(sysColumnList, panelHtml, x => x.EditRowNo, c => c.EditRowNo != null && c.EditRowNo > 0, false, q => q.EditRowNo, vue, app: app);
            }
            else
            {
                GetPanelData(sysColumnList, panelHtml, x => x.SearchRowNo, c => c.SearchRowNo != null, true, q => q.SearchRowNo, vue, app: app);
            }

            List<object> list = new List<object>();

            int index = 0;
            bool group = panelHtml.Exists(x => x.Count > 1);
            panelHtml.ForEach(x =>
            {
                index++;
                List<Dictionary<string, object>> keyValuePairs = new List<Dictionary<string, object>>();
                //List<KeyValuePair<string, object>> keyValuePairs = new List<KeyValuePair<string, object>>();
                x.ForEach(s =>
                {
                    Dictionary<string, object> keyValues = new Dictionary<string, object>();
                    if (vue)
                    {
                        //  keyValues.Add("columnType", s.columnType);
                        if (!string.IsNullOrEmpty(s.dataSource) && s.dataSource != "''")
                        {
                            if (app)
                            {
                                keyValues.Add("key", s.dataSource);
                            }
                            else
                            {
                                keyValues.Add("dataKey", s.dataSource);
                            }
                            //2020.09.11增加vue页面数据源配置默认空数据源
                            keyValues.Add("data", new string[] { });
                        }
                        keyValues.Add("title", s.text);
                        if (s.require)
                        {
                            keyValues.Add("required", s.require);
                        }

                        keyValues.Add("field", s.id);
                        if (s.disabled)
                        {
                            keyValues.Add("disabled", true);
                        }
                        if (s.colSize > 0 && !app)
                        {
                            keyValues.Add("colSize", s.colSize);
                        }
                        if (!string.IsNullOrEmpty(s.displayType) && s.displayType != "''")
                        {
                            keyValues.Add("type", s.columnType == "img" ? s.columnType : s.displayType);
                        }
                    }
                    else
                    {
                        keyValues.Add("columnType", s.columnType);
                        if (!string.IsNullOrEmpty(s.dataSource))
                        {
                            keyValues.Add("dataSource", s.dataSource);
                        }
                        keyValues.Add("text", s.text);
                        if (s.require)
                        {
                            keyValues.Add("require", s.require);
                        }
                        keyValues.Add("id", s.id);
                    }
                    if (!app)
                    {
                        keyValuePairs.Add(keyValues);
                    }
                    else
                    {
                        list.Add(keyValues);
                    }
                });
                if (!app)
                {
                    list.Add(keyValuePairs);
                }
                else
                {
                    //app页面添加分组
                    if (index != panelHtml.Count() && group)
                    {
                        list.Add(new { type = "group" });
                    }
                }
            });
            return list;
        }

        /// <summary>
        /// 生成Vue页面
        /// </summary>
        /// <param name="sysTableInfo"></param>
        /// <param name="vuePath">为本地Vue项目Views所在的绝对路径:E:/web/myProject/Views</param>
        /// <returns></returns>
        public string CreateVuePage(Sys_TableInfo sysTableInfo, string vuePath)
        {
            //2024.03.16增加vite代码生成
            bool isVite = HttpContext.Current.Request.Query["vite"].GetInt() > 0;
            bool isApp = HttpContext.Current.Request.Query["app"].GetInt() > 0;
            if (string.IsNullOrEmpty(vuePath))
            {
                return isApp ? "请设置App路径" : "请设置Vue所在Views的绝对路径!";
            }

            if (!FileHelper.DirectoryExists(vuePath)) return $"未找项目路径{vuePath}!";

            if (sysTableInfo == null
              || sysTableInfo.TableColumns == null
              || sysTableInfo.TableColumns.Count == 0)
                return "提交的配置数据不完整";

            vuePath = vuePath.Trim().TrimEnd('/').TrimEnd('\\');

            List<Sys_TableColumn> sysColumnList = sysTableInfo.TableColumns;
            string[] eidtTye = new string[] { "select", "selectList", "drop", "dropList", "checkbox" };
            if (sysColumnList.Exists(x => eidtTye.Contains(x.EditType) && string.IsNullOrEmpty(x.DropNo)))
            {
                return $"编辑类型为[{string.Join(',', eidtTye)}]时必须选择数据源";
            }
            if (sysColumnList.Exists(x => eidtTye.Contains(x.SearchType) && string.IsNullOrEmpty(x.DropNo)))
            {
                return $"查询类型为[{string.Join(',', eidtTye)}]时必须选择数据源";
            }
            if (isApp && !sysColumnList.Exists(x => x.Enable > 0))
            {
                return $"请设置[app列]";
            }
            bool editLine = sysTableInfo.EditType == 2;
            StringBuilder sb = GetGridColumns(sysColumnList, sysTableInfo.ExpressField, detail: editLine, true, app: isApp);
            if (sb.Length == 0) return "未获取到数据!";
            string columns = sb.ToString().Trim();
            columns = columns.Substring(0, columns.Length - 1);
            string key = sysColumnList.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First() ?? "";

            //{ key: 1, value: "显示/查询/编辑" },
            //{ key: 2, value: "显示/编辑" },
            //{ key: 3, value: "显示/查询" },
            //{ key: 4, value: "显示" },
            //{ key: 5, value: "查询/编辑" },
            //{ key: 6, value: "查询" },
            //{ key: 7, value: "编辑" },
            Func<Sys_TableColumn, bool> editFunc = c => c.EditRowNo != null && c.EditRowNo > 0;
            if (isApp)
            {
                editFunc = x => new int[] { 1, 2, 5, 7 }.Any(c => c == x.Enable);
            }
            var formFileds = sysColumnList.Where(editFunc)
                .OrderBy(o => o.EditRowNo)
                .ThenByDescending(t => t.OrderNo)
                .Select(x => new KeyValuePair<string, object>(x.ColumnName, x.EditType == "checkbox" || x.EditType == "selectList" || x.EditType == "cascader" ? new string[0] : "" as object))
                .ToList().ToDictionary(x => x.Key, x => x.Value).Serialize();

            List<List<PanelHtml>> panelHtml = new List<List<PanelHtml>>();

            List<object> list = GetSearchData(panelHtml, sysColumnList, true, app: isApp);

            string pageContent = null;
            string editOptions = "";
            //2025.02ss
            string vueOptions = "";
            if (isApp)
            {
                pageContent = FileHelper.ReadFile("Template\\Page\\app\\options.html");
            }
            else if (HttpContext.Current.Request.Query.ContainsKey("v3"))   //2021.08.01增加vue3页面模板
            {
                pageContent = FileHelper.ReadFile("Template\\Page\\Vue3SearchPage.html");
                editOptions = FileHelper.ReadFile("Template\\Page\\EditOptions.html");
                //2025.02
                vueOptions = FileHelper.ReadFile("Template\\Page\\VueOptions.html");
            }
            else
            {
                pageContent = FileHelper.ReadFile("Template\\Page\\VueSearchPage.html");
            }


            if (string.IsNullOrEmpty(pageContent))
            {
                return "未找到Template模板文件";
            }

            //{ key: 1, value: "显示/查询/编辑" },
            //{ key: 2, value: "显示/编辑" },
            //{ key: 3, value: "显示/查询" },
            //{ key: 4, value: "显示" },
            //{ key: 5, value: "查询/编辑" },
            //{ key: 6, value: "查询" },
            //{ key: 7, value: "编辑" },
            Func<Sys_TableColumn, bool> func = c => c.SearchRowNo != null && c.SearchRowNo > 0;

            if (isApp)
            {
                func = x => new int[] { 1, 3, 5, 6 }.Any(c => c == x.Enable);
                vueOptions = pageContent;
            }
            var searchFormFileds = sysColumnList.Where(func)
                .Select(x => new KeyValuePair<string, object>(x.ColumnName, x.SearchType == "checkbox"
                || x.SearchType == "selectList" || x.EditType == "cascader" ? new string[0] : x.SearchType == "range" ? new string[] { null, null } : "" as object))
                .ToList().ToDictionary(x => x.Key, x => x.Value).Serialize();
            //2025.02
            vueOptions = vueOptions.Replace("#searchFormFileds", searchFormFileds)
                .Replace("#searchFormOptions", list.Serialize() ?? ""
                .Replace("},{", "},\r\n                               {")
                .Replace("],[", "],\r\n                              [")
                );
            panelHtml = new List<List<PanelHtml>>();
            //编辑
            string formOptions = GetSearchData(panelHtml, sysColumnList.Where(editFunc).ToList(), true, true, app: isApp).Serialize() ?? "";

            string[] arr = sysTableInfo.Namespace.Split(".");
            string spaceFolder = (arr.Length > 1 ? arr[arr.Length - 1] : arr[0]).ToLower();
            //2025.02
            if (editLine)
            {
                vueOptions = vueOptions.Replace("'#key'", "'#key',\r\n                editTable:true ");
            }
            //2025.02
            vueOptions = vueOptions.Replace("#columns", columns).
                            Replace("#SortName", string.IsNullOrEmpty(sysTableInfo.SortName) ? key : sysTableInfo.SortName).
                            Replace("#key", key).
                            Replace("#Foots", " ").
                             Replace("#TableName", sysTableInfo.TableName).//2025.02
                            Replace("#cnName", sysTableInfo.ColumnCNName).
                            Replace("#url", "/" + sysTableInfo.TableName + "/").
                            Replace("#folder", spaceFolder).
                            Replace("#editFormFileds", formFileds).
                            Replace("#editFormOptions", formOptions.
                            Replace("},{", "},\r\n                               {").
                            Replace("],[", "],\r\n                              ["));
            vuePath = vuePath.Replace("//", "\\").Trim('\\');
            //2025.02
            //vueOptions = vueOptions.
            //            //.Replace("#columns", columns).
            //            Replace("#SortName", string.IsNullOrEmpty(sysTableInfo.SortName) ? key : sysTableInfo.SortName).
            //            Replace("#key", key).
            //            Replace("#Foots", " ").
            //            Replace("#TableName", sysTableInfo.TableName).
            //            Replace("#cnName", sysTableInfo.ColumnCNName).
            //            Replace("#url", "/" + sysTableInfo.TableName + "/").
            //            Replace("#folder", spaceFolder).
            //            Replace("#editFormFileds", formFileds).
            //            Replace("#editFormOptions", formOptions.
            //            Replace("},{", "},\r\n                               {").
            //            Replace("],[", "],\r\n                              ["));

            bool hasSubDetail = false;
            List<string> detailItems = new List<string>();
            //如果有明细，加载明细的数据
            if (!string.IsNullOrEmpty(sysTableInfo.DetailName))//&& !isApp
            {
                var tables = sysTableInfo.DetailName.Replace("，", ",").Split(",");
                var detailTables = repository.FindAsIQueryable(x => tables.Contains(x.TableName))
                    .Include(x => x.TableColumns).ToList();

                if (detailTables.Count != tables.Length)
                {
                    return $"请将明细表生成代码!";
                }

                var obj = detailTables.Where(c => c.TableColumns == null || c.TableColumns.Count == 0).FirstOrDefault();
                if (obj != null)
                {
                    return $"明细表{obj.TableName}没有列的信息,请确认是否有列数据或列数据是否被删除!";
                }
                //2024.01.13优化明细表配置名称与显示顺序
                var tableCNNameArr = sysTableInfo.DetailCnName?.Replace("，", ",")?.Split(",");
                if (tableCNNameArr == null || tableCNNameArr.Length != tables.Count())
                {
                    return $"明细表中文名与明细表数量不一致，请以逗号隔开数量也一致!";
                }
                List<Sys_TableInfo> tables2 = new List<Sys_TableInfo>();
                foreach (var name in tables)
                {
                    tables2.Add(detailTables.Where(x => x.TableName == name).FirstOrDefault());
                }
                detailTables = tables2;



                //多个明细或者三级明细
                hasSubDetail = detailTables.Exists(c => !string.IsNullOrEmpty(c.DetailName)) || detailTables.Count > 1;
                int tableIndex = 0;

                foreach (var detailTable in detailTables)
                {
                    string tableCNName = tableCNNameArr[tableIndex];
                    tableIndex++;
                    var _name = detailTable.TableColumns.Where(x => x.IsImage < 4 && x.EditRowNo > 0).Select(s => s.ColumnName).FirstOrDefault();

                    string detailItem = null;
                    //  if (detailTables.Count > 0)
                    if (hasSubDetail)
                    {
                        detailItem = @"  { 
                    cnName: '#detailCnName',
                    table: '#detailTable',
                    columns: [#detailColumns],
                    sortName: '#detailSortName',
                    key: '#detailKey',
                    buttons:[],
                    delKeys:[],
                    detail:null
                                            }";
                    }
                    else
                    {
                        detailItem = @"  {
                    cnName: '#detailCnName',
                    table: '#detailTable',
                    columns: [#detailColumns],
                    sortName: '#detailSortName',
                    key: '#detailKey'
                                            }";
                    }
                    //明细列数据
                    List<Sys_TableColumn> detailList = detailTable.TableColumns;
                    //替换明细列数据
                    sb = GetGridColumns(detailList, detailTable.ExpressField, true, true);
                    key = detailList.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First();
                    columns = sb.ToString().Trim();
                    columns = columns.Substring(0, columns.Length - 1);
                    detailItem = detailItem.Replace("#detailColumns", columns).
                        Replace("#detailCnName", tableCNName).// detailTable.ColumnCNName).
                        Replace("#detailTable", detailTable.TableName).
                        Replace("#detailKey", detailTable.TableColumns.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First()).
                        Replace("#detailSortName", string.IsNullOrEmpty(detailTable.SortName) ? key : detailTable.SortName);


                    //三级明细表
                    if (!string.IsNullOrEmpty(detailTable.DetailName))
                    {
                        //三级子表只支持一个子表
                        string _tableName = detailTable.DetailName.Split(",")[0];
                        var subTable = repository.FindAsIQueryable(x => x.TableName == _tableName).Include(x => x.TableColumns).FirstOrDefault();
                        if (subTable == null || subTable.TableColumns == null || subTable.TableColumns.Count == 0)
                        {
                            return $"请先生成三级子表【{_tableName}】代码，只生成model即可!";
                        }

                        string subCols = GetGridColumns(subTable.TableColumns, subTable.ExpressField, true, true, subCols: true).ToString().Trim();



                        string subOps = $@"
                                    cnName: '{subTable.ColumnCNName}',
                                    table: '{subTable.TableName}',
                                    firstTable: '{sysTableInfo.TableName}',
                                    secondTable: '{detailTable.TableName}',
                                    secondKey: '{detailTable.TableColumns.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First()}',
                                    sortName: '{(string.IsNullOrEmpty(subTable.SortName) ? key : subTable.SortName)}',
                                    key: '{subTable.TableColumns.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First()}',
                                    buttons:[],
                                    delKeys:[],
                                    columns: [{subCols}]
                             ";

                        //detailItem = detailItem.Replace("children:{}", "children:{" + thirdOps + "}");

                        detailItem = detailItem.Replace("detail:null", "detail:{" + subOps + "}");
                    }


                    detailItems.Add(detailItem);

                    //新窗口编辑多个明细表
                    if (detailTables.Count == 1)
                    {
                        editOptions = editOptions.Replace("#detailColumns", columns).
                        Replace("#detailCnName", detailTable.ColumnCNName).
                        Replace("#detailTable", detailTable.TableName).
                        Replace("#detailKey", detailTable.TableColumns.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First()).
                        Replace("#detailSortName", string.IsNullOrEmpty(detailTable.SortName) ? key : detailTable.SortName);
                    }
                    //2025.02
                    if (detailTables.Count == 1)
                    {
                        editOptions = editOptions.Replace("#detailColumns", columns).
                        Replace("#detailCnName", detailTable.ColumnCNName).
                        Replace("#detailTable", detailTable.TableName).
                        Replace("#detailKey", detailTable.TableColumns.Where(c => c.IsKey == 1).Select(x => x.ColumnName).First()).
                        Replace("#detailSortName", string.IsNullOrEmpty(detailTable.SortName) ? key : detailTable.SortName);
                    }

                }
                //多表:多个明细或者三级明细
                // if (detailTables.Count > 1)
                //2025.02
                if (hasSubDetail)
                {
                    vueOptions = vueOptions.Replace("#tables2", $"[{string.Join(",\r                  ", detailItems)}]");
                    vueOptions = vueOptions.Replace("#tables1", "{columns:[]}");
                }
                else
                {
                    //2025.02
                    vueOptions = vueOptions.Replace("#tables1", $"{detailItems[0]}");
                    vueOptions = vueOptions.Replace("#tables2", "[]");
                }
            }
            else
            {
                //2025.02
                vueOptions = vueOptions.Replace("#tables1", "{columns:[]}");
                vueOptions = vueOptions.Replace("#tables2", "[]");
                //2025.02
                vueOptions = vueOptions.Replace("#detailColumns", "")
                    .Replace("#detailKey", "")
                    .Replace("#detailSortName", "");
                vueOptions = vueOptions.Replace("#detailColumns", "")
               .Replace("#detailCnName", "")
               .Replace("#detailTable", "")
               .Replace("#detailKey", "")
               .Replace("#detailSortName", "")
               .Replace("api/#TableName/getDetailPage", "");

                editOptions = editOptions.Replace("#detailColumns", "")
                 .Replace("#detailCnName", "")
                 .Replace("#detailTable", "")
                 .Replace("#detailKey", "")
                 .Replace("#detailSortName", "")
                 .Replace("api/#TableName/getDetailPage", "");
            }


            //生成扩展逻辑页面(只创建一次)
            //获取view的上一级目录
            string srcPath = new DirectoryInfo(vuePath.MapPath()).Parent.FullName;
            string extensionPath = isApp ? $"{srcPath}\\pages\\{spaceFolder}\\" : $"{srcPath}\\extension\\{spaceFolder}\\";
            //2024.03.16增加vite版本生成jsx文件
            string exFileName = sysTableInfo.TableName + ".js" + (isVite ? "x" : "");
            string tableName = sysTableInfo.TableName;

            if (!isApp)
            {
                if (!FileHelper.FileExists(extensionPath + exFileName)
                    || FileHelper.FileExists($"{extensionPath}+\\{sysTableInfo.FolderName.ToLower()}\\{exFileName}"))
                {
                    //2021.03.06增加前端生成文件到指定文件夹(以前生成过的文件不受影响)
                    extensionPath = $"{srcPath}\\extension\\{spaceFolder}\\{sysTableInfo.FolderName.ToLower()}\\";
                    spaceFolder = spaceFolder + "\\" + sysTableInfo.FolderName.ToLower();
                    //2025.02
                    //tableName = sysTableInfo.FolderName.ToLower() + "/" + tableName;
                    pageContent = pageContent.Replace("#folder", spaceFolder.Replace("\\", "/"));
                }
            }


            if (!isApp && !FileHelper.FileExists((extensionPath + exFileName).ReplacePath()))
            {

                string exContent = FileHelper.ReadFile("Template\\Page\\VueExtension.html");
                exContent = exContent.Replace("#TableName", sysTableInfo.TableName);
                FileHelper.WriteFile(extensionPath, exFileName, exContent);
            }

            pageContent = pageContent.Replace("#TableName", tableName);

            if (isApp)
            {
                pageContent = vueOptions;
                pageContent = pageContent.Replace("#TableName", tableName);
                //if (!FileHelper.FileExists($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\{sysTableInfo.TableName}Extend.js"))
                //{
                //    //生成扩展文件
                //    string pageContentEx = FileHelper.ReadFile("Template\\Page\\app\\extension.html");
                //    pageContentEx = pageContentEx.Replace("#TableName", sysTableInfo.TableName);
                //    FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", sysTableInfo.TableName + "Extend.js", pageContentEx);
                //}
                pageContent = pageContent.Replace("#titleField", sysTableInfo.ExpressField).Replace("{#table}", sysTableInfo.TableName);
                //生成app配置options.js文件
                FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", sysTableInfo.TableName + "Options.js", pageContent);

                string appEditPath = $"pages/{spaceFolder}/{sysTableInfo.TableName}/{sysTableInfo.TableName}Edit";
                if (!FileHelper.FileExists($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\{sysTableInfo.TableName}.vue"))
                {
                    //生成vue文件
                    pageContent = FileHelper.ReadFile("Template\\Page\\app\\page.html").Replace("#TableName", sysTableInfo.TableName).Replace("#path", appEditPath);
                    FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", sysTableInfo.TableName + ".vue", pageContent);
                }

                if (!FileHelper.FileExists($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\{sysTableInfo.TableName}Edit.vue"))
                {
                    //生成vue编辑edit文件
                    pageContent = FileHelper.ReadFile("Template\\Page\\app\\edit.html").Replace("#TableName", sysTableInfo.TableName);
                    FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", sysTableInfo.TableName + "Edit.vue", pageContent);
                }


                string name = FileHelper.ReadFile(@$"{srcPath}\pages.json");
                string appPath = $"pages/{spaceFolder}/{sysTableInfo.TableName}/{sysTableInfo.TableName}";
                if (!name.Contains(appPath + "\""))
                {
                    int index = name.IndexOf("]");
                    string fragment1 = name.Substring(0, index);
                    string fragment2 = name.Substring(index);

                    StringBuilder builder = new StringBuilder();
                    builder.AppendLine("		,{");
                    builder.AppendLine("			\"path\": \"" + appPath + "\",");
                    builder.AppendLine("			\"style\": {");
                    builder.AppendLine("				\"navigationBarTitleText\": \"" + sysTableInfo.ColumnCNName + "\"");
                    builder.AppendLine("			}");
                    builder.AppendLine("		}");

                    string fragment = fragment1 + builder.ToString() + "	" + fragment2;
                    FileHelper.WriteFile(srcPath, "\\pages.json", fragment);
                }
                if (!name.Contains(appEditPath))
                {
                    name = FileHelper.ReadFile(@$"{srcPath}\pages.json");
                    int index = name.IndexOf("]");
                    string fragment1 = name.Substring(0, index);
                    string fragment2 = name.Substring(index);

                    StringBuilder builder = new StringBuilder();
                    builder.AppendLine("		,{");
                    builder.AppendLine("			\"path\": \"" + appEditPath + "\",");
                    builder.AppendLine("			\"style\": {");
                    builder.AppendLine("				\"navigationBarTitleText\": \"" + sysTableInfo.ColumnCNName + "\"");
                    builder.AppendLine("			}");
                    builder.AppendLine("		}");

                    string fragment = fragment1 + builder.ToString() + "	" + fragment2;
                    FileHelper.WriteFile(srcPath, "\\pages.json", fragment);
                }
            }
            else
            {
                //   spaceFolder = spaceFolder; //+ "\\" + sysTableInfo.FolderName.ToLower();
                //生成vue页面
                pageContent = pageContent.Replace("{$false}", sysTableInfo.EditType == 1 ? "true" : "false");
                //2024.03.16增加vite版本生成jsx文件
                if (isVite && !pageContent.Contains(sysTableInfo.TableName + ".jsx"))
                {
                    pageContent = pageContent.Replace(sysTableInfo.TableName + ".js", sysTableInfo.TableName + ".jsx");
                }
                pageContent = pageContent.Replace(".jsxx", ".jsx");
                string valuePath = $"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}.vue";
                //生成vue页面2025.02
                if (!FileHelper.FileExists(valuePath.ReplacePath()) || FileHelper.ReadFile(valuePath.ReplacePath()).Contains("setup()"))
                {
                    pageContent = pageContent.Replace("#folder", spaceFolder.Replace("\\", "/"));
                    FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\", sysTableInfo.TableName + ".vue", pageContent);
                }
                //生成配置2025.02
                vueOptions = vueOptions.Replace("{$false}", sysTableInfo.EditType == 1 ? "true" : "false");
                if (hasSubDetail)
                {
                    vueOptions = vueOptions.Replace("#tables2", $"[{string.Join(",\r                  ", detailItems)}]");
                    vueOptions = vueOptions.Replace("#detailColumns", "[]");
                }
                else
                {
                    vueOptions = vueOptions.Replace("#detailColumns", $"detailItems[0]");
                    editOptions = vueOptions.Replace("#tables2", "[]");
                }
                //2025.02
                vueOptions = vueOptions.Replace("[[]]", "[]");
                //配置文件2025.02
                FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", "options.js", vueOptions);

                if (sysTableInfo.EditType == 1)
                {
                    //editOptions = editOptions.Replace("{$false}", sysTableInfo.EditType == 1 ? "true" : "false");

                    //if (hasSubDetail)
                    //{
                    //    editOptions = editOptions.Replace("#tables2", $"[{string.Join(",\r                  ", detailItems)}]");
                    //    editOptions = editOptions.Replace("#detailColumns", "[]");
                    //}
                    //else
                    //{
                    //    editOptions = editOptions.Replace("#detailColumns", $"detailItems[0]");
                    //    editOptions = editOptions.Replace("#tables2", "[]");
                    //}
                    //editOptions = editOptions.Replace("[[]]", "[]");

                    //FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", "options.js", editOptions);
                    string editVuePath = $"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\Edit.vue";
                    //编辑页面vue文件
                    if (!FileHelper.FileExists(editVuePath) && sysTableInfo.EditType == 1)
                    {
                        string editContent = FileHelper.ReadFile("Template\\Page\\Edit.html").Replace("#table_edit", $"#{sysTableInfo.TableName}_edit");
                        FileHelper.WriteFile($"{vuePath}\\{spaceFolder}\\{sysTableInfo.TableName}\\", "Edit.vue", editContent);
                    }
                }
                //生成路由
                string routerPath = $"{srcPath}\\router\\viewGird.js";
                string routerContent = FileHelper.ReadFile(routerPath);
                if (!routerContent.Contains($"path: '/{sysTableInfo.TableName}'"))
                {
                    string routerTemplate = FileHelper.ReadFile("Template\\Page\\router.html")
                     .Replace("#TableName", sysTableInfo.TableName)
                     .Replace("#folder", spaceFolder.Replace("\\", "/"));
                    routerContent = routerContent.Replace("]", routerTemplate);
                    FileHelper.WriteFile($"{srcPath}\\router\\", "viewGird.js", routerContent);
                }

                if (sysTableInfo.EditType == 1)
                {
                    //编辑页面路由
                    if (!routerContent.Contains($"path: '/{sysTableInfo.TableName}/edit'"))
                    {
                        string routerTemplate = FileHelper.ReadFile("Template\\Page\\router_edit.html")
                         .Replace("#TableName", sysTableInfo.TableName)
                          .Replace("#cnName", sysTableInfo.ColumnCNName)
                         .Replace("#folder", spaceFolder.Replace("\\", "/"));
                        routerContent = routerContent.Replace("]", routerTemplate);
                        FileHelper.WriteFile($"{srcPath}\\router\\", "viewGird.js", routerContent);
                    }
                }

            }
            return "页面创建成功!";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="tableInfo"></param>
        /// <returns></returns>
        public string CreateExtensionPage(Sys_TableInfo tableInfo)
        {
            return "开发中。。。";
        }

        /// <summary>
        /// 获取Mysql表结构信息
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        private string GetMySqlStructure(string tableName, string connection)
        {
            return $@"SELECT  DISTINCT
                    Column_Name AS ColumnName,
                     '{tableName}'  as tableName,
	                Column_Comment AS ColumnCnName,
                        CASE
                          WHEN data_type IN( 'BIT', 'BOOL', 'bit', 'bool') THEN
                'bool'
		             WHEN data_type in('smallint','SMALLINT') THEN 'short'
								WHEN data_type in('tinyint','TINYINT') THEN 'byte'
                        WHEN data_type IN('MEDIUMINT','mediumint', 'int','INT','year', 'Year') THEN
                    'int'
                    WHEN data_type in ( 'BIGINT','bigint') THEN
                    'bigint'
                    WHEN data_type IN('FLOAT', 'DOUBLE', 'DECIMAL','float', 'double', 'decimal') THEN
                    'decimal'
                    WHEN data_type IN('CHAR', 'VARCHAR', 'TINY TEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB', 'LONGBLOB', 'Time','char', 'varchar', 'tiny text', 'text', 'mediumtext', 'longtext', 'tinyblob', 'blob', 'mediumblob', 'longblob', 'time') THEN
                    'string'
                    WHEN data_type IN('Date', 'DateTime', 'TimeStamp','date', 'datetime', 'timestamp') THEN
                    'DateTime' ELSE 'string'
                END AS ColumnType,
	              case WHEN CHARACTER_MAXIMUM_LENGTH>8000 THEN 0 ELSE CHARACTER_MAXIMUM_LENGTH end  AS Maxlength,
            CASE
                    WHEN COLUMN_KEY <> '' THEN  
                    1 ELSE 0
                END AS IsKey,
            CASE
                    WHEN Column_Name IN( 'CreateID', 'ModifyID', '' ) 
		            OR COLUMN_KEY<> '' THEN
                        0 ELSE 1
                        END AS IsDisplay,
		            1 AS IsColumnData,
                    120 AS ColumnWidth,
                    0 AS OrderNo,
                CASE
                        WHEN IS_NULLABLE = 'NO' or IS_NULLABLE = 'N' THEN
                        0 ELSE 1
                    END AS IsNull,
	            CASE
                        WHEN COLUMN_KEY <> '' THEN
                        1 ELSE 0
                    END AS IsReadDataset,
                ordinal_position
                FROM
                    information_schema.COLUMNS
                WHERE
                    table_name = ?tableName {GetMysqlTableSchema(connection)}
               order by ordinal_position";
        }

        /// <summary>
        /// 获取SqlServer表结构信息，字段说明从系统数据库B23HZCMYSSYS取
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        private string GetSqlServerStructure(string tableName)
        {
            return $@"
                SELECT
                    t.TableName,
                    LTRIM( RTRIM( t.ColumnName ) ) AS ColumnName,
                    t.ColumnCNName,
                CASE
                        
                        WHEN t.ColumnType = 'uniqueidentifier' THEN
                        'guid' 
                        WHEN t.ColumnType IN ( 'smallint', 'int' ) THEN
                        'int' 
                        WHEN t.ColumnType = 'bigint' THEN
                        'long' 
                        WHEN t.ColumnType IN ( 'char', 'varchar', 'nvarchar', 'text', 'xml', 'varbinary', 'image' ) THEN
                        'string' 
                        WHEN t.ColumnType IN ( 'tinyint' ) THEN
                        'byte' 
                        WHEN t.ColumnType IN ( 'bit' ) THEN
                        'bool' 
                        WHEN t.ColumnType IN ( 'time', 'date', 'datetime', 'datetime2', 'smalldatetime' ) THEN
                        'DateTime' 
                        WHEN t.ColumnType IN ( 'smallmoney', 'decimal', 'numeric', 'money' ) THEN
                        'decimal' 
                        WHEN t.ColumnType = 'float' THEN
                        'float' ELSE 'string ' 
                    END ColumnType,
                CASE
                    
                    WHEN t.ColumnType IN ( 'nvarchar', 'nchar' ) THEN
                    t.[Maxlength]/2 ELSE t.[Maxlength] 
                    END [Maxlength],
                    t.IsKey,
                CASE
                    
                    WHEN t.ColumnName IN ( 'CreateID', 'ModifyID', '' ) 
                    OR t.IsKey = 1 THEN
                    0 ELSE 1 
                    END AS IsDisplay,
                    1 AS IsColumnData,
                CASE
                        
                        WHEN t.ColumnType IN ( 'time', 'date', 'datetime', 'smalldatetime' ) THEN
                        150 
                        WHEN t.ColumnName IN ( 'Modifier', 'Creator' ) THEN
                        100 
                        WHEN t.ColumnType IN ( 'int', 'bigint' ) 
                        OR t.ColumnName IN ( 'CreateID', 'ModifyID', '' ) THEN
                            80 
                            WHEN t.[Maxlength] < 110 
                            AND t.[Maxlength] > 60 THEN
                                120 
                                WHEN t.[Maxlength] < 200 
                                AND t.[Maxlength] >= 110 THEN
                                    180 
                                    WHEN t.[Maxlength] > 200 THEN
                                    220 ELSE 110 
                                END AS ColumnWidth,
                                0 AS OrderNo,
                                t.[IsNull],
                            CASE
                                    
                                    WHEN t.IsKey = 1 THEN
                                    1 ELSE 0 
                                END IsReadDataset,
                CASE
                    
                    WHEN t.IsKey!= 1 
                    AND t.[IsNull] = 0 THEN
                    0 ELSE NULL 
                    END AS EditColNo 
                FROM
                    (
                    SELECT
                        obj.name AS TableName,
                        col.name AS ColumnName,
                        CONVERT ( NVARCHAR ( 100 ), ISNULL( ep.[value], '' ) ) AS ColumnCNName,
                        LOWER ( typ.name ) AS ColumnType,
                    CASE
                            
                            WHEN col.length< 1 THEN
                            0 ELSE col.length 
                        END AS [Maxlength],
                    CASE
                            
                            WHEN EXISTS (
                            SELECT
                                1 
                            FROM
                                dbo.sysindexes si
                                INNER JOIN dbo.sysindexkeys sik ON si.id = sik.id 
                                AND si.indid = sik.indid
                                INNER JOIN dbo.syscolumns sc ON sc.id = sik.id 
                                AND sc.colid = sik.colid
                                INNER JOIN dbo.sysobjects so ON so.name = si.name 
                                AND so.xtype = 'PK' 
                            WHERE
                                sc.id = col.id 
                                AND sc.colid = col.colid 
                                ) THEN
                                1 ELSE 0 
                            END AS IsKey,
                        CASE
                                WHEN col.isnullable = 1 THEN
                                1 ELSE 0 
                            END AS [IsNull],
                            col.colorder,
                            ROW_NUMBER ( ) OVER ( PARTITION BY col.name ORDER BY col.colid ) AS rn 
                        FROM
                            dbo.syscolumns col
                            LEFT JOIN dbo.systypes typ ON col.xtype = typ.xusertype
                            INNER JOIN dbo.sysobjects obj ON col.id = obj.id 
                            AND obj.xtype IN ( 'U', 'V' )
                            LEFT JOIN dbo.syscomments comm ON col.cdefault = comm.id
                            LEFT JOIN sys.extended_properties ep ON col.id = ep.major_id 
                            AND col.colid = ep.minor_id 
                            AND ep.name = 'MS_Description'
                            LEFT JOIN sys.extended_properties epTwo ON obj.id = epTwo.major_id 
                            AND epTwo.minor_id = 0 
                            AND epTwo.name = 'MS_Description' 
                        WHERE
                            obj.name = @tableName
                        ) t 
                    WHERE
                        t.rn = 1 
                ORDER BY
                    t.colorder";
        }


        /// <summary>
        /// 2020.08.07完善PGSQL
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        private string GetPgSqlStructure(string tableName)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("SELECT ");
            stringBuilder.Append("	MM.\"TableName\", ");
            stringBuilder.Append("	MM.\"ColumnName\", ");
            stringBuilder.Append(" 	MM.\"ColumnCNName\", ");
            stringBuilder.Append("	MM.\"ColumnType\", ");
            stringBuilder.Append("	MM.\"Maxlength\", ");
            stringBuilder.Append("	MM.\"IsKey\", ");
            stringBuilder.Append("	MM.\"IsDisplay\", ");
            stringBuilder.Append("	MM.\"IsColumnData\", ");
            stringBuilder.Append("CASE ");
            stringBuilder.Append("		 ");
            stringBuilder.Append("		WHEN MM.\"ColumnType\" = 'DateTime' THEN ");
            stringBuilder.Append("		150  ");
            stringBuilder.Append("		WHEN MM.\"ColumnType\" = 'int' THEN ");
            stringBuilder.Append("		80  ");
            stringBuilder.Append("		WHEN MM.\"Maxlength\" < 110  ");
            stringBuilder.Append("		AND MM.\"Maxlength\" > 60 THEN ");
            stringBuilder.Append("			120  ");
            stringBuilder.Append("			WHEN MM.\"Maxlength\" < 200  ");
            stringBuilder.Append("			AND MM.\"Maxlength\" >= 110 THEN ");
            stringBuilder.Append("				180  ");
            stringBuilder.Append("				WHEN MM.\"Maxlength\" > 200 THEN ");
            stringBuilder.Append("				220 ELSE 110  ");
            stringBuilder.Append("			END AS \"ColumnWidth\", ");
            stringBuilder.Append("			MM.\"OrderNo\", ");
            stringBuilder.Append("		 case WHEN MM.\"IsKey\"=1 or \"lower\"(MM.\"IsNull\")='no' then 0 else 1 end as 	\"IsNull\" , ");
            stringBuilder.Append("			MM.\"IsReadDataset\", ");
            stringBuilder.Append("			MM.\"EditColNo\"  ");
            stringBuilder.Append("		FROM ");
            stringBuilder.Append("			( ");
            stringBuilder.Append("			SELECT ");
            stringBuilder.Append("				col.TABLE_NAME AS \"TableName\", ");
            stringBuilder.Append("				col.COLUMN_NAME AS \"ColumnName\", ");
            stringBuilder.Append("				attr.description AS \"ColumnCNName\", ");
            stringBuilder.Append("			CASE ");
            stringBuilder.Append("					 ");
            stringBuilder.Append("					WHEN col.udt_name = 'uuid' THEN ");
            stringBuilder.Append("					'guid'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'int2') THEN ");
            stringBuilder.Append("					'short'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'int4' ) THEN ");
            stringBuilder.Append("					'int'  ");
            stringBuilder.Append("					WHEN col.udt_name = 'int8' THEN ");
            stringBuilder.Append("					'long'  ");
            stringBuilder.Append("					WHEN col.udt_name = 'BIGINT' THEN ");
            stringBuilder.Append("					'long'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'char', 'varchar', 'text', 'xml', 'bytea' ) THEN ");
            stringBuilder.Append("					'string'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'bool' ) THEN ");
            stringBuilder.Append("					'bool'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'date','timestamp' ) THEN ");
            stringBuilder.Append("					'DateTime'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'decimal', 'money','numeric' ) THEN ");
            stringBuilder.Append("					'decimal'  ");
            stringBuilder.Append("					WHEN col.udt_name IN ( 'float4', 'float8' ) THEN ");
            stringBuilder.Append("					'float' ELSE'string '  ");
            stringBuilder.Append("				END \"ColumnType\", ");
            stringBuilder.Append("CASE ");
            stringBuilder.Append("	 ");
            stringBuilder.Append("	WHEN col.udt_name = 'varchar' THEN ");
            stringBuilder.Append("	col.character_maximum_length  ");
            stringBuilder.Append("	WHEN col.udt_name IN ( 'int2', 'int4', 'int8', 'float4', 'float8' ) THEN ");
            stringBuilder.Append("	col.numeric_precision ELSE 8000  ");
            stringBuilder.Append("	END \"Maxlength\", ");
            stringBuilder.Append("CASE ");
            stringBuilder.Append("	 ");
            stringBuilder.Append("	WHEN keyTable.IsKey = 1 THEN ");
            stringBuilder.Append("	1 ELSE 0  ");
            stringBuilder.Append("	END \"IsKey\", ");
            stringBuilder.Append("CASE ");
            stringBuilder.Append("	 ");
            stringBuilder.Append("	WHEN keyTable.IsKey = 1 THEN ");
            stringBuilder.Append("	0 ELSE 1  ");
            stringBuilder.Append("	END \"IsDisplay\", ");
            stringBuilder.Append("	1 AS \"IsColumnData\", ");
            stringBuilder.Append("	0 AS \"OrderNo\", ");
            stringBuilder.Append("	col.is_nullable AS \"IsNull\", ");
            stringBuilder.Append("CASE ");
            stringBuilder.Append("		 ");
            stringBuilder.Append("		WHEN keyTable.IsKey = 1 THEN ");
            stringBuilder.Append("		1 ELSE 0  ");
            stringBuilder.Append("	END \"IsReadDataset\", ");
            stringBuilder.Append("CASE ");
            stringBuilder.Append("	 ");
            stringBuilder.Append("	WHEN keyTable.IsKey IS NULL  ");
            stringBuilder.Append("	AND col.is_nullable = 'NO' THEN ");
            stringBuilder.Append("	0 ELSE NULL  ");
            stringBuilder.Append("	END AS \"EditColNo\"  ");
            stringBuilder.Append("FROM ");
            stringBuilder.Append("	information_schema.COLUMNS col  ");
            stringBuilder.Append("  LEFT JOIN ( ");
            stringBuilder.Append("	SELECT col_description(a.attrelid,a.attnum) as description,a.attname as name ");
            stringBuilder.Append("FROM pg_class as c,pg_attribute as a  ");
            stringBuilder.Append("where \"lower\"(c.relname) = \"lower\"(@tableName) and a.attrelid = c.oid and a.attnum>0 ");
            stringBuilder.Append("	) as attr on attr.name=col.COLUMN_NAME ");
            stringBuilder.Append("	LEFT JOIN ( ");
            stringBuilder.Append("	SELECT ");
            stringBuilder.Append("		pg_attribute.attname AS colname, ");
            stringBuilder.Append("		1 AS IsKey  ");
            stringBuilder.Append("	FROM ");
            stringBuilder.Append("		pg_constraint ");
            stringBuilder.Append("		INNER JOIN pg_class ON pg_constraint.conrelid = pg_class.oid ");
            stringBuilder.Append("		INNER JOIN pg_attribute ON pg_attribute.attrelid = pg_class.oid  ");
            stringBuilder.Append("		AND pg_attribute.attnum = pg_constraint.conkey [1]  ");
            stringBuilder.Append("	WHERE ");
            stringBuilder.Append("		\"lower\" ( pg_class.relname ) = \"lower\" ( @tableName )  ");
            stringBuilder.Append("		AND pg_constraint.contype = 'p'  ");
            stringBuilder.Append("	) keyTable ON col.COLUMN_NAME = keyTable.colname  ");
            stringBuilder.Append("WHERE ");
            stringBuilder.Append("	\"lower\" ( TABLE_NAME ) = \"lower\" ( @tableName )  ");
            stringBuilder.Append("ORDER BY ");
            stringBuilder.Append("	ordinal_position  ");
            stringBuilder.Append("	) MM; ");
            return stringBuilder.ToString();
        }

        /// <summary>
        /// 设置界面table td单元格的宽度
        /// </summary>
        /// <param name="columns"></param>
        private void SetMaxLength(List<Sys_TableColumn> columns)
        {
            columns.ForEach(x =>
            {
                if (x.ColumnName == "DateTime")
                {
                    x.ColumnWidth = 145;
                }
                else if (x.ColumnName == "Modifier" || x.ColumnName == "Creator")
                {
                    x.ColumnWidth = 100;
                }
                else if (x.ColumnName == "CreateID" || x.ColumnName == "ModifyID")
                {
                    x.ColumnWidth = 80;
                }
                else if (x.Maxlength > 200)
                {
                    x.ColumnWidth = 150;
                }
                else if (x.Maxlength > 110 && x.Maxlength <= 200)
                {
                    x.ColumnWidth = 180;
                }
                else if (x.Maxlength > 60 && x.Maxlength <= 110)
                {
                    x.ColumnWidth = 120;
                }
                else
                {
                    x.ColumnWidth = 110;
                }
            });
        }

        /// <summary>
        /// 初始化生成配置对应表的数据信息
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="tableName"></param>
        /// <param name="columnCNName"></param>
        /// <param name="nameSpace"></param>
        /// <param name="foldername"></param>
        /// <param name="tableId"></param>
        /// <param name="isTreeLoad"></param>
        /// <returns></returns>
        private int InitTable(int parentId, string tableName, string columnCNName, string nameSpace, string foldername, int tableId, bool isTreeLoad, string dbServer)
        {
            if (isTreeLoad)
                return tableId;
            if (string.IsNullOrEmpty(tableName))
                return -1;
            tableId = repository.Find(x => x.TableName == tableName, s => s.Table_Id).FirstOrDefault();
            if (tableId > 0)
                return tableId;
            bool isMySql = DBType.Name == DbCurrentType.MySql.ToString();
            Sys_TableInfo tableInfo = new Sys_TableInfo()
            {
                ParentId = parentId,
                ColumnCNName = columnCNName,
                CnName = columnCNName,
                TableName = tableName,
                Namespace = nameSpace,
                FolderName = foldername,
                Enable = 1,
                DBServer = dbServer
            };

            string connection = GetConnectionKey(tableInfo);
            //2024.06.20增加获取指定数据库与指定数据库类型
            List<Sys_TableColumn> columns = DBServerProvider.GetSqlDapperWidthDbService(dbServer)
                .QueryList<Sys_TableColumn>(GetCurrentSql(tableName, connection, tableInfo.DBServer), new { tableName });

            int orderNo = (columns.Count + 10) * 50;
            for (int i = 0; i < columns.Count; i++)
            {
                columns[i].OrderNo = orderNo;
                orderNo = orderNo - 50;
                columns[i].EditRowNo = 0;
            }

            SetMaxLength(columns);
            tableInfo.TableColumns = columns;
            repository.Add(tableInfo, true);
            //base.Add<Sys_TableColumn>(tableInfo, columns, false);
            return tableInfo.Table_Id;
        }

        /// <summary>
        /// 界面加载表的配置信息
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="tableName"></param>
        /// <param name="columnCNName"></param>
        /// <param name="nameSpace"></param>
        /// <param name="foldername"></param>
        /// <param name="tableId"></param>
        /// <param name="isTreeLoad">true只加载表数据</param>
        /// <returns></returns>
        public object LoadTable(int parentId, string tableName, string columnCNName, string nameSpace, string foldername, int tableId, bool isTreeLoad, string dbServer)
        {
            if (!UserContext.Current.IsSuperAdmin && !isTreeLoad)
            {
                return new WebResponseContent().Error("只有超级管理员才能进行此操作");
            }
            tableId = InitTable(parentId, tableName?.Trim(), columnCNName, nameSpace, foldername, tableId, isTreeLoad, dbServer);
            Sys_TableInfo tableInfo = repository
                .FindAsIQueryable(x => x.Table_Id == tableId)
                .Include(c => c.TableColumns)
                .ToList().FirstOrDefault();
            if (tableInfo.TableColumns != null)
            {
                tableInfo.TableColumns = tableInfo.TableColumns.OrderByDescending(x => x.OrderNo).ToList();

                tableInfo.TableColumns.ForEach(x =>
                {
                    if (!string.IsNullOrEmpty(x.ColumnCnName))
                    {
                        x.ColumnCnName = x.ColumnCnName.Trim().Replace("\r\n", "");
                    }
                    if (!string.IsNullOrEmpty(x.ColumnName))
                    {
                        x.ColumnName = x.ColumnName.Trim().Replace("\r\n", "");
                    }
                });
            }
            return new WebResponseContent().OK(null, tableInfo);
        }

        public async Task<WebResponseContent> DelTree(int table_Id)
        {
            if (table_Id == 0) return new WebResponseContent().Error("没有传入参数");
            Sys_TableInfo tableInfo = (await repository.FindAsIQueryable(x => x.Table_Id == table_Id)
                .Include(c => c.TableColumns)
                .ToListAsync()).FirstOrDefault();
            if (tableInfo == null) return new WebResponseContent().OK();
            if (tableInfo.TableColumns != null && tableInfo.TableColumns.Count > 0)
            {
                return new WebResponseContent().Error("当前删除的节点存在表结构信息,只能删除空节点");
            }
            if (repository.Exists(x => x.ParentId == table_Id))
            {
                return new WebResponseContent().Error("当前删除的节点存在子节点，不能删除");
            }
            repository.Delete(tableInfo, true);
            return new WebResponseContent().OK();
        }

        /// <summary>
        /// 生成表格的columns的配置信息
        /// </summary>
        /// <param name="list"></param>
        /// <param name="expressField"></param>
        /// <param name="detail"></param>
        /// <param name="vue"></param>
        /// <returns></returns>
        private StringBuilder GetGridColumns(List<Sys_TableColumn> list, string expressField, bool detail, bool vue = false, bool app = false, bool subCols = false)
        {
            totalCol = 0;
            totalWidth = 0;
            StringBuilder sb = new StringBuilder();

            //{ key: 1, value: "显示/查询/编辑" },
            //{ key: 2, value: "显示/编辑" },
            //{ key: 3, value: "显示/查询" },
            //{ key: 4, value: "显示" },
            //{ key: 5, value: "查询/编辑" },
            //{ key: 6, value: "查询" },
            //{ key: 7, value: "编辑" },
            Func<Sys_TableColumn, bool> func = x => true;
            bool sort = false;
            if (app)
            {
                func = x => new int[] { 1, 2, 3, 4 }.Any(c => c == x.Enable) && (x.IsDisplay == null || x.IsDisplay == 1);
            }
            foreach (Sys_TableColumn item in list.Where(func).OrderByDescending(x => x.OrderNo))
            {
                if (item.IsColumnData == 0) { continue; }
                sb.Append("{field:'" + item.ColumnName + "',");
                sb.Append("title:'" + (string.IsNullOrEmpty(item.ColumnCnName) ? item.ColumnName : item.ColumnCnName) + "',");
                if (vue)
                {
                    string colType = item.ColumnType.ToLower();
                    if (item.IsImage == 1)
                    {
                        colType = "img";
                    }
                    else if (item.IsImage == 2)
                    {
                        colType = "excel";
                    }
                    else if (item.IsImage == 3)
                    {
                        colType = "file";
                    }
                    //2021.07.27增加table列显示类型date(自动格式化)
                    else if (item.IsImage == 4)
                    {
                        colType = "date";
                    }
                    else if (item.IsImage == 5)
                    {
                        colType = "month";
                    }
                    sb.Append("type:'" + colType + "',");
                    if (!string.IsNullOrEmpty(item.DropNo))
                    {
                        sb.Append("bind:{ key:'" + item.DropNo + "',data:[]},");
                    }
                    if (expressField != null && expressField.ToLower() == item.ColumnName.ToLower())
                    {
                        sb.Append("link:true,");
                    }
                    //2021.01.09增加代码生成器设置table排序功能
                    if (item.Sortable == 1 && !app)
                    {
                        sb.Append("sort:true,");
                    }
                }
                else
                {
                    sb.Append("datatype:'" + item.ColumnType + "',");
                }

                //if (!app)
                //{
                    sb.Append("width:" + (item.ColumnWidth ?? 90) + ",");
               //}
                if (item.IsDisplay == 0)
                {
                    sb.Append("hidden:true,");
                }
                else
                {
                    totalCol++;
                    totalWidth += item.ColumnWidth == null ? 0 : Convert.ToInt32(item.ColumnWidth);
                }
                if (item.IsReadDataset == 1)
                {
                    sb.Append("readonly:true,");
                }
                //detail明细才启用表格编辑
                if (item.EditRowNo != null && item.EditRowNo > 0 && detail)//!string.IsNullOrEmpty(item.EditType))
                {
                    string editText = vue ? "edit" : "editor";
                    if (vue)
                    {
                        sb.Append("edit:{type:'" + item.EditType + "'},");
                    }
                    else
                    {

                        switch (item.EditType)
                        {
                            case "date":
                                sb.Append("editor:'datebox',");
                                break;
                            case "datetime":
                                sb.Append("editor:'datetimebox',");
                                break;
                            case "drop":
                            case "dropList":
                            case "select":
                            case "selectList":
                                if (!vue && !string.IsNullOrEmpty(item.DropNo))
                                {
                                    sb.Append(editText + ": { type: 'combobox', options: optionConfig" + item.DropNo + " },");
                                }
                                else
                                {
                                    sb.Append(editText + ": 'text',");
                                }
                                break;
                            default:
                                sb.Append(editText + ":'text',");
                                break;
                        }
                    }
                }
                if (!vue)
                {
                    //快速查看字段
                    if (expressField != null && expressField.ToLower() == item.ColumnName.ToLower())
                    {
                        sb.Append("formatter:function (val, row, index) { return $.fn.layOut('createViewField',{row:row,val:val,index:index})},");
                    }
                    else if (!string.IsNullOrEmpty(item.Script))
                    {
                        sb.Append("formatter:" + item.Script + ",");
                    }
                    else if (item.IsImage == 1)//启用图片
                    {
                        sb.Append("formatter:function (val, row, index) { return $.fn.layOut('createImageUrl',{row:row,key:'" + item.ColumnName + "'})},");
                    }
                    else if (!string.IsNullOrEmpty(item.DropNo) && !detail)
                    {
                        sb.AppendLine("formatter: function (val, row, index) {");
                        sb.AppendLine(string.Format("    return dataSource{0}.textFormatter(optionConfig{0}, val, row, index);", item.DropNo));
                        sb.AppendLine("    },");
                    }
                }

                if (item.IsNull == 0 && !app)
                {
                    sb.Append("require:true,");
                }

                if (!app && (item.ColumnType.ToLower() == "datetime" || (item.IsDisplay == 1 & !sort)))
                {
                    //2021.09.05修改排序名称
                    sb.Append("align:'left'},");
                    if (item.IsDisplay == 1)
                    {
                        sort = true;
                    }
                }
                else
                {
                    if (!app)
                    {
                        sb.Append("align:'left'},");
                    }
                }
                if (app)
                {
                    sb.Append("},").Replace(",},", "},");
                }

                sb.AppendLine();
                sb.Append("                       ");
                if (subCols)
                {
                    sb.Append("                       ");
                }
            }
            return sb;
        }

        /// <summary>
        /// 创建实体类
        /// </summary>
        /// <param name="sysColumn"></param>
        /// <param name="tableInfo"></param>
        /// <param name="createType">1、创建实体类,2创建apiinput类,3、创建apioutput类</param>
        private string CreateEntityModel(List<Sys_TableColumn> sysColumn, Sys_TableInfo tableInfo, List<TableColumnInfo> tableColumnInfoList, int createType)
        {
            string template = "";
            if (createType == 1)
            {
                template = "DomainModel.html";
            }
            else if (createType == 2)
            {
                template = "ApiInputDomainModel.html";
            }
            else
            {
                template = "ApiOutputDomainModel.html";
            }
            string domainContent = FileHelper.ReadFile("Template\\DomianModel\\" + template);
            string partialContent = domainContent;
            StringBuilder AttributeBuilder = new StringBuilder();
            sysColumn = sysColumn.OrderByDescending(c => c.OrderNo).ToList();
            bool addIgnore = false;
            foreach (Sys_TableColumn column in sysColumn)
            {
                column.ColumnType = (column.ColumnType ?? "").Trim();
                AttributeBuilder.Append("/// <summary>");
                AttributeBuilder.Append("\r\n");
                AttributeBuilder.Append("       ///" + column.ColumnCnName + "");
                AttributeBuilder.Append("\r\n");
                AttributeBuilder.Append("       /// </summary>");
                AttributeBuilder.Append("\r\n");
                if (column.IsKey == 1) { AttributeBuilder.Append(@"       [Key]" + ""); AttributeBuilder.Append("\r\n"); }
                AttributeBuilder.Append("       [Display(Name =\"" + (
                    string.IsNullOrEmpty(column.ColumnCnName) ? column.ColumnName : column.ColumnCnName
                    ) + "\")]");
                AttributeBuilder.Append("\r\n");

                TableColumnInfo tableColumnInfo = tableColumnInfoList.Where(x => x.ColumnName.ToLower().Trim() == column.ColumnName.ToLower().Trim()).FirstOrDefault();
                if (tableColumnInfo != null && (tableColumnInfo.ColumnType == "varchar" && column.Maxlength > 8000)
                             || (tableColumnInfo.ColumnType == "nvarchar" && column.Maxlength > 4000))
                {
                    column.Maxlength = 0;
                }

                if (column.ColumnType == "string" && column.Maxlength > 0 && column.Maxlength < 8000)
                {

                    AttributeBuilder.Append("       [MaxLength(" + column.Maxlength + ")]");
                    AttributeBuilder.Append("\r\n");
                }
                //不是数据列的，返回页面数据前不包含此列的数据
                if (column.IsColumnData == 0 && createType == 1)
                {
                    addIgnore = true;
                    AttributeBuilder.Append("       [JsonIgnore]");
                    AttributeBuilder.Append("\r\n");
                }
                //[Column(TypeName="bigint")]如果与字段类型不同会产生异常

                if (tableColumnInfo != null)
                {
                    if (!string.IsNullOrEmpty(tableColumnInfo.Prec_Scale) && !tableColumnInfo.Prec_Scale.EndsWith(",0"))
                    {
                        AttributeBuilder.Append("       [DisplayFormat(DataFormatString=\"" + tableColumnInfo.Prec_Scale + "\")]");
                        AttributeBuilder.Append("\r\n");
                    }

                    if (tableColumnInfo.ColumnType.ToLower() == "guid")
                    {
                        tableColumnInfo.ColumnType = "uniqueidentifier";
                    }

                    if ((column.IsKey == 1 && (column.ColumnType == "uniqueidentifier"))
                        || (IsMysql() && column.ColumnType == "string" && column.Maxlength == 36))
                    {
                        tableColumnInfo.ColumnType = "uniqueidentifier";
                    }

                    string maxLength = string.Empty;
                    if (tableColumnInfo.ColumnType != "uniqueidentifier")
                    {
                        if (column.IsKey != 1 && column.ColumnType.ToLower() == "string")
                        {
                            //没有指定长度的字符串字段 ，如varchar,nvarchar，text等都默认生成varchar(max),nvarchar(max)
                            if (column.Maxlength <= 0
                                || ((tableColumnInfo.ColumnType == "varchar" || tableColumnInfo.ColumnType == "string") && column.Maxlength >= 8000)
                                || ((tableColumnInfo.ColumnType == "nvarchar" || tableColumnInfo.ColumnType == "string") && column.Maxlength >= 4000))
                            {
                                maxLength = "(max)";
                            }
                            else
                            {
                                maxLength = "(" + column.Maxlength + ")";
                            }

                        }
                        if (column.IsKey == 1 && column.ColumnType.ToLower() == "string")
                        {
                            maxLength = "(" + (column.Maxlength ?? 100) + ")";
                        }
                    }
                    AttributeBuilder.Append("       [Column(TypeName=\"" + (tableColumnInfo.ColumnType + maxLength).ToLower() + "\")]");
                    AttributeBuilder.Append("\r\n");


                    //if ((tableColumnInfo.ColumnType == "int" || tableColumnInfo.ColumnType == "bigint" || tableColumnInfo.ColumnType == "long") && column.ColumnType.ToLower() == "string")
                    if (tableColumnInfo.ColumnType == "int" || tableColumnInfo.ColumnType == "bigint" || tableColumnInfo.ColumnType == "long")
                    {
                        column.ColumnType = tableColumnInfo.ColumnType == "int" ? "int" : "long";
                    }
                    if (tableColumnInfo.ColumnType == "bool")
                    {
                        column.ColumnType = "bool";
                    }
                }

                if (column.EditRowNo != null)
                {
                    AttributeBuilder.Append("       [Editable(true)]");
                    AttributeBuilder.Append("\r\n");
                }
                // && column.ColumnType.ToLower() == "string"
                if (column.IsNull == 0 || (createType == 2 && column.ApiIsNull == 0))
                {
                    AttributeBuilder.Append("       [Required(AllowEmptyStrings=false)]");
                    AttributeBuilder.Append("\r\n");
                }
                string columnType = (column.ColumnType == "Date" ? "DateTime" : column.ColumnType).Trim();
                if (tableColumnInfo?.ColumnType?.ToLower() == "guid")
                {
                    columnType = "Guid";
                }
                if (column.ColumnType.ToLower() != "string" && column.IsNull == 1)
                {
                    columnType = columnType + "?";
                }
                //如果主键是string,则默认为是Guid或者使用的是mysql数据，字段类型是字符串并且长度是36则默认为是Guid
                if ((column?.ColumnType?.ToLower() == "uniqueidentifier" || column?.ColumnType?.ToLower() == "guid")
                  || (IsMysql() && column.ColumnType == "string" && column.Maxlength == 36))
                {
                    //if (column.ColumnType == "string" && DBType.Name.ToLower() != DbCurrentType.MsSql.ToString().ToLower())
                    //{
                    columnType = "Guid" + (column.IsNull == 1 ? "?" : "");
                    //  }

                }
                AttributeBuilder.Append("       public " + columnType + " " + column.ColumnName + " { get; set; }");
                AttributeBuilder.Append("\r\n\r\n       ");
            }
            string[] detailTables = null;
            string[] detailNames = null;
            if (!string.IsNullOrEmpty(tableInfo.DetailName) && createType == 1)
            {
                //  'typeof('+[1,2].join('),typeof(')+')'
                tableInfo.DetailName = tableInfo.DetailName.Replace("，", "").Trim();
                detailTables = tableInfo.DetailName.Split(',');

                tableInfo.DetailCnName = tableInfo.DetailCnName.Replace("，", "").Trim();

                detailNames = tableInfo.DetailCnName.Split(',');

                for (int i = 0; i < detailTables.Length; i++)
                {
                    AttributeBuilder.Append("[Display(Name =\"" + detailNames[i] + "\")]");
                    AttributeBuilder.Append("\r\n       ");
                    //2019.12.20增加明细表属性的ForeignKey配置(EF Core 3.1配项)
                    AttributeBuilder.Append("[ForeignKey(\"" + sysColumn.Where(x => x.IsKey == 1).FirstOrDefault().ColumnName + "\")]");
                    AttributeBuilder.Append("\r\n       ");
                    AttributeBuilder.Append("public List<" + detailTables[i] + "> " + detailTables[i] + " { get; set; }");
                    AttributeBuilder.Append("\r\n");
                    AttributeBuilder.Append("\r\n\r\n       ");
                }
            }
            if (addIgnore && createType == 1)
            {
                domainContent = "using Newtonsoft.Json;\r\n" + domainContent + "\r\n";
            }
            //获取的是本地开发代码所在目录，不是布后的目录
            string mapPath = ProjectPath.GetProjectDirectoryInfo()?.FullName; //new DirectoryInfo(("~/").MapPath()).Parent.FullName;
                                                                              //  string folderPath= string.Format("\\VolPro.Framework.Core.\\DomainModels\\{0}\\", foldername);
            if (string.IsNullOrEmpty(mapPath))
            {
                return "未找到生成的目录!";
            }
            string[] splitArrr = tableInfo.Namespace.Split('.');
            //    foldername = splitArrr.Length == 2 ? splitArrr[1] : foldername;
            domainContent = domainContent.Replace("{TableName}", tableInfo.TableName).Replace("{AttributeList}", AttributeBuilder.ToString()).Replace("{StartName}", StratName);
            //  {AttributeManager}

            List<string> entityAttribute = new List<string>();
            entityAttribute.Add("TableCnName = \"" + tableInfo.ColumnCNName + "\"");
            if (!string.IsNullOrEmpty(tableInfo.TableTrueName))
            {
                //如果使用的是pgsql数据库，并且数据库表都是小写，请将下面的.ToLower()这段开启.2020.08.07
                //entityAttribute.Add("TableName = \"" + tableInfo.TableTrueName.ToLower() + "\"");
                entityAttribute.Add("TableName = \"" + tableInfo.TableTrueName + "\"");
            }

            if (!string.IsNullOrEmpty(tableInfo.DetailName) && createType == 1)
            {
                string typeArr = " new Type[] { typeof(" + string.Join("),typeof(", detailTables) + ")}";
                entityAttribute.Add("DetailTable = " + typeArr + "");
            }
            if (!string.IsNullOrEmpty(tableInfo.DetailCnName))
            {

                entityAttribute.Add("DetailTableCnName = \"" + tableInfo.DetailCnName + "\"");
            }
            if (!string.IsNullOrEmpty(tableInfo.DBServer) && createType == 1)
            {
                entityAttribute.Add("DBServer = \"" + tableInfo.DBServer + "\"");
            }

            if (createType == 1)
            {
                if (sysColumn.Any(x => x.ApiInPut > 0))
                {
                    entityAttribute.Add("ApiInput = typeof(Api" + tableInfo.TableName + "Input)");
                }
                if (sysColumn.Any(x => x.ApiOutPut > 0))
                {
                    entityAttribute.Add("ApiOutput = typeof(Api" + tableInfo.TableName + "Output)");
                }
            }
            string modelNameSpace = StratName + ".Entity";
            string tableAttr = string.Join(",", entityAttribute);
            if (tableAttr != "")
            {
                tableAttr = "[Entity(" + tableAttr + ")]";
            }
            //entityAttribute.Add("TableCnName = \"" + tableInfo.ColumnCNName + "\"");
            //if (!string.IsNullOrEmpty(tableInfo.TableTrueName) && tableInfo.TableName != tableInfo.TableTrueName)
            //{
            //    entityAttribute.Add("TableName = \"" + tableInfo.TableTrueName + "\"");
            //    entityAttribute.Add("Table(\"" + tableInfo.TableTrueName + "\")");
            //}
            if (!string.IsNullOrEmpty(tableInfo.TableTrueName) && tableInfo.TableName != tableInfo.TableTrueName)
            {
                string tableTrueName = tableInfo.TableTrueName;
                //2020.06.14 pgsql数据库，设置表名为小写(数据库创建表的时候也要使用小写)
                if (DBType.Name == DbCurrentType.PgSql.ToString())
                {
                    tableTrueName = tableTrueName.ToLower();
                }
                tableAttr = tableAttr + "\r\n[Table(\"" + tableInfo.TableTrueName + "\")]";
            }
            domainContent = domainContent.Replace("{AttributeManager}", tableAttr).Replace("{Namespace}", modelNameSpace);


            //(2020.08.22)增加model数据库划分
            string baseEntityName = DBServerProvider.GetDbEntityName(tableInfo.DBServer);

            //业务库,增加业务库这里同时需要修改下，baseEntityName为VolPro.Entity->SystemModels下面的entity文件名
            //if (tableInfo.DBServer == typeof(ServiceDbContext).Name)
            //{
            //    baseEntityName = typeof(ServiceEntity).Name;
            //}
            //else if (tableInfo.DBServer == typeof(TestDbContext).Name) //测试库
            //{
            //    baseEntityName = typeof(TestEntity).Name;
            //}
            //else//系统库
            //{
            //    baseEntityName = typeof(SysEntity).Name;
            //}

            domainContent = domainContent.Replace("{Temp_Entity}", baseEntityName);

            string folderName = tableInfo.FolderName;
            string tableName = tableInfo.TableName;
            if (createType == 2)
            {
                folderName = "ApiEntity\\Input";
                tableName = "Api" + tableInfo.TableName + "Input";
            }
            else if (createType == 3)
            {
                folderName = "ApiEntity\\OutPut";
                tableName = "Api" + tableInfo.TableName + "Output";
            }
            //mapPath +
            //  string.Format(
            //  "\\" + modelNameSpace + "\\DomainModels\\{0}\\", folderName
            //  )
            string modelPath = $"{mapPath}\\{modelNameSpace}\\DomainModels\\{folderName}\\";


            modelPath = $"{mapPath}\\{modelNameSpace}\\DomainModels\\{folderName}\\";



            FileHelper.WriteFile(modelPath, tableName + ".cs", domainContent);
            //partialContent
            modelPath += "partial\\";
            if (!FileHelper.FileExists(modelPath + tableName + ".cs"))
            {
                partialContent = partialContent.Replace("{AttributeManager}", "")
                    .Replace(":{Temp_Entity}", "")
                    .Replace("{AttributeList}", @"//此处配置字段(字段配置见此model的另一个partial),如果表中没有此字段请加上 [NotMapped]属性，否则会异常")
                    .Replace(":SysEntity", "")
                    .Replace("{TableName}", tableInfo.TableName).Replace("{Namespace}", modelNameSpace);
                FileHelper.WriteFile(modelPath, tableName + ".cs", partialContent);
            }
            if (createType == 1)
            {
                //  string mappingConfiguration = FileHelper.
                //ReadFile("Template\\DomianModel\\MappingConfiguration.html")
                //.Replace("{TableName}", tableInfo.TableName).Replace("{Namespace}", modelNameSpace).Replace("{StartName}", StratName);
                //  FileHelper.WriteFile(
                //      mapPath +
                //      string.Format("\\" + modelNameSpace + "\\MappingConfiguration\\{0}\\"
                //      , tableInfo.FolderName)
                //      , tableInfo.TableName + "MapConfig.cs",
                //      mappingConfiguration);
            }
            return "";
        }

        private static string[] formType = new string[] { "bigint", "int", "decimal", "float", "byte" };
        private string GetDisplayType(bool search, string searchType, string editType, string columnType)
        {
            string type = "";
            if (search)
            {
                type = searchType == "无" ? "" : searchType ?? "";
            }
            else
            {
                type = editType == "无" ? "" : editType ?? "";
            }
            if (type == "" && formType.Contains(columnType))
            {
                if (columnType == "decimal" || columnType == "float")
                {
                    type = "decimal";
                }
                else
                {
                    type = "number";
                }
            }
            return type;
        }

        private string GetDropString(string dropNo, bool vue)
        {
            if (string.IsNullOrEmpty(dropNo))
                return vue ? "''" : "__[]__";
            if (vue)
                return dropNo;
            return "__" + "optionConfig" + dropNo + "__";
        }

        /// <summary>
        /// 生成查询面板的数据对象结构
        /// </summary>
        /// <param name="list"></param>
        /// <param name="panelHtml"></param>
        /// <param name="keySelector"></param>
        /// <param name="predicate"></param>
        /// <param name="search"></param>
        /// <param name="orderBy"></param>
        /// <param name="vue"></param>
        private void GetPanelData(List<Sys_TableColumn> list, List<List<PanelHtml>> panelHtml, Func<Sys_TableColumn, int?> keySelector, Func<Sys_TableColumn, bool> predicate, bool search, Func<Sys_TableColumn, int?> orderBy, bool vue = false, bool app = false)
        {
            //{ key: 1, value: "显示/查询/编辑" },
            //{ key: 2, value: "显示/编辑" },
            //{ key: 3, value: "显示/查询" },
            //{ key: 4, value: "显示" },
            //{ key: 5, value: "查询/编辑" },
            //{ key: 6, value: "查询" },
            //{ key: 7, value: "编辑" },

            if (app)
            {
                list.ForEach(x =>
                {
                    if (x.EditRowNo == 0)
                    {
                        x.EditRowNo = 99999;
                    }
                });
                var arr = search ? new int[] { 1, 3, 5, 6 } : new int[] { 1, 2, 5, 7 };
                predicate = x => arr.Any(c => c == x.Enable);
            }

            var whereReslut = list.Where(predicate).OrderBy(orderBy).ThenByDescending(c => c.OrderNo).ToList();
            foreach (var item in whereReslut.GroupBy(keySelector))
            {
                panelHtml.Add(item.OrderBy(c => search ? c.SearchColNo : c.EditColNo).Select(
                    x => new PanelHtml
                    {
                        text = x.ColumnCnName ?? x.ColumnName,
                        id = x.ColumnName,
                        displayType = GetDisplayType(search, x.SearchType, x.EditType, x.ColumnType),
                        require = !search && x.IsNull == 0 ? true : false,
                        columnType = vue && x.IsImage == 1 ? "img" : (x.ColumnType ?? "string").ToLower(),
                        disabled = !search && x.IsReadDataset == 1 ? true : false,
                        dataSource = GetDropString(x.DropNo, vue),
                        colSize = search && x.SearchType != "checkbox" ? 0 : (x.ColSize ?? 0)
                    }).ToList());
            }
        }


        private static bool IsMysql()
        {
            return DBType.Name.ToLower() == DbCurrentType.MySql.ToString().ToLower()
                || DBType.Name.ToLower() == DbCurrentType.Oracle.ToString().ToLower();
        }
        private WebResponseContent ValidColumnString(Sys_TableInfo tableInfo)
        {
            WebResponseContent webResponse = new WebResponseContent(true);
            if (tableInfo.TableColumns == null || tableInfo.TableColumns.Count == 0) return webResponse;

            if (!string.IsNullOrEmpty(tableInfo.DetailName))
            {
                string[] names = (tableInfo.DetailCnName ?? "").Replace("，", ",").Replace("\r\n", "").Split(",");
                string[] tables = tableInfo.DetailName.Trim().Replace("，", ",").Replace("\r\n", "").Split(",").Distinct().ToArray();

                if (names.Length != tables.Length)
                {
                    return webResponse.Error("【明细表中文名】与【明细表】字段数量要一致，多张表与表名用逗号隔开");
                }


                Sys_TableColumn mainTableColumn = tableInfo.TableColumns
                     .Where(x => x.IsKey == 1)
                     // .Select(s => s.ColumnName)
                     .FirstOrDefault();
                if (mainTableColumn == null)
                    return webResponse.Error($"请勾选表[{tableInfo.TableName}]的主键");

                string key = mainTableColumn.ColumnName;

                //明细表外键列的配置信息
                var tableColumns = repository
                    .Find<Sys_TableColumn>(x => tables.Contains(x.TableName))
                    .ToList();



                var tableArr = tables.Where(c => !tableColumns.Any(x => x.TableName == c)).ToList();
                if (tableArr.Count > 0)
                {
                    return webResponse.Error($"明细表【{string.Join(",", tableArr)}】必须先生成代码");
                }

                tableArr = tables.Where(c => !tableColumns.Any(x => x.TableName == c && x.ColumnName == key && mainTableColumn.ColumnType?.ToLower() == x.ColumnType?.ToLower())).ToList();


                if (tableArr.Count > 0)
                {
                    return webResponse.Error($"明细表必须包括【{string.Join(",", tableArr)}】主表主键字段[{key}],并且字段类型要相同");
                }

                if (!IsMysql()) return webResponse;

                if (mainTableColumn.ColumnType?.ToLower() == "string"&&mainTableColumn.Maxlength==36)
                {
                    tableArr = tableColumns.Where(c => c.ColumnName == key && c.Maxlength != 36).Select(c => c.TableName).ToList();
                    if (tableArr.Count > 0)
                    {
                        return webResponse.Error($"主表主键类型为Guid，明细表[{string.Join(",", tableArr)}]配置的字段[{key}]长度必须是36，请重将明细表字段[{key}]长度设置为36，点击保存与生成Model");
                    }
                }
                //mysql如果主键使用的是guid，需要判断明细表的外键是否配置正确
            }

            //if (tableInfo.TableColumns.Exists(x => x.ColumnType == "string" && (x.Maxlength ?? 0) <= 0))
            //{
            //    webResponse.Error("数据类型为string的列，必须输入[列最大长度]的值");
            //}
            return webResponse;
        }


    }
    public class PanelHtml
    {
        public string text { get; set; }

        public string id { get; set; }
        public string displayType { get; set; }
        public string dataSource { get; set; }
        public string columnType { get; set; }
        public bool require { get; set; }
        public bool disabled { get; set; }
        public int colSize { get; set; }
        public int fileMaxCount { get; set; }
    }
}

