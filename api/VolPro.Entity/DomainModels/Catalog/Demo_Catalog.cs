/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果数据库字段发生变化，请在代码生器重新生成此Model
 */
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VolPro.Entity.SystemModels;

namespace VolPro.Entity.DomainModels
{
    [Entity(TableCnName = "商品分類",TableName = "Demo_Catalog",DBServer = "SysDbContext")]
    public partial class Demo_Catalog:SysEntity
    {
        /// <summary>
       ///商品分類
       /// </summary>
       [Key]
       [Display(Name ="商品分類")]
       [Column(TypeName="uniqueidentifier")]
       [Required(AllowEmptyStrings=false)]
       public Guid CatalogId { get; set; }

       /// <summary>
       ///分類編號
       /// </summary>
       [Display(Name ="分類編號")]
       [MaxLength(100)]
       [Column(TypeName="varchar(100)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string CatalogCode { get; set; }

       /// <summary>
       ///分類名稱
       /// </summary>
       [Display(Name ="分類名稱")]
       [MaxLength(100)]
       [Column(TypeName="varchar(100)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string CatalogName { get; set; }

       /// <summary>
       ///上級分類
       /// </summary>
       [Display(Name ="上級分類")]
       [Column(TypeName="uniqueidentifier")]
       [Editable(true)]
       public Guid? ParentId { get; set; }

       /// <summary>
       ///分類圖片
       /// </summary>
       [Display(Name ="分類圖片")]
       [MaxLength(500)]
       [Column(TypeName="varchar(500)")]
       [Editable(true)]
       public string Img { get; set; }

       /// <summary>
       ///是否可用
       /// </summary>
       [Display(Name ="是否可用")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? Enable { get; set; }

       /// <summary>
       ///備註
       /// </summary>
       [Display(Name ="備註")]
       [MaxLength(500)]
       [Column(TypeName="varchar(500)")]
       [Editable(true)]
       public string Remark { get; set; }

       /// <summary>
       ///創建人id
       /// </summary>
       [Display(Name ="創建人id")]
       [Column(TypeName="int")]
       public int? CreateID { get; set; }

       /// <summary>
       ///創建人
       /// </summary>
       [Display(Name ="創建人")]
       [MaxLength(30)]
       [Column(TypeName="varchar(30)")]
       public string Creator { get; set; }

       /// <summary>
       ///創建時間
       /// </summary>
       [Display(Name ="創建時間")]
       [Column(TypeName="datetime")]
       public DateTime? CreateDate { get; set; }

       /// <summary>
       ///
       /// </summary>
       [Display(Name ="ModifyID")]
       [Column(TypeName="int")]
       public int? ModifyID { get; set; }

       /// <summary>
       ///修改人
       /// </summary>
       [Display(Name ="修改人")]
       [MaxLength(30)]
       [Column(TypeName="varchar(30)")]
       public string Modifier { get; set; }

       /// <summary>
       ///修改時間
       /// </summary>
       [Display(Name ="修改時間")]
       [Column(TypeName="datetime")]
       public DateTime? ModifyDate { get; set; }

       
    }
}