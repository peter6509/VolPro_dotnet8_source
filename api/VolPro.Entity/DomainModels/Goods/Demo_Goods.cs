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
    [Entity(TableCnName = "商品信息",TableName = "Demo_Goods",DBServer = "SysDbContext")]
    public partial class Demo_Goods:SysEntity
    {
        /// <summary>
       ///商品ID
       /// </summary>
       [Key]
       [Display(Name ="商品ID")]
       [Column(TypeName="uniqueidentifier")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public Guid GoodsId { get; set; }

       /// <summary>
       ///商品名稱
       /// </summary>
       [Display(Name ="商品名稱")]
       [MaxLength(100)]
       [Column(TypeName="varchar(100)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string GoodsName { get; set; }

       /// <summary>
       ///所屬分類
       /// </summary>
       [Display(Name ="所屬分類")]
       [Column(TypeName="uniqueidentifier")]
       [Editable(true)]
       public Guid? CatalogId { get; set; }

       /// <summary>
       ///商品编號
       /// </summary>
       [Display(Name ="商品编號")]
       [MaxLength(100)]
       [Column(TypeName="varchar(100)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string GoodsCode { get; set; }

       /// <summary>
       ///商品圖片
       /// </summary>
       [Display(Name ="商品圖片")]
       [Column(TypeName="varchar(max)")]
       [Editable(true)]
       public string Img { get; set; }

       /// <summary>
       ///规格
       /// </summary>
       [Display(Name ="规格")]
       [MaxLength(50)]
       [Column(TypeName="varchar(50)")]
       [Editable(true)]
       public string Specs { get; set; }

       /// <summary>
       ///單價
       /// </summary>
       [Display(Name ="單價")]
       [Column(TypeName="decimal")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public decimal Price { get; set; }

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
       [MaxLength(200)]
       [Column(TypeName="varchar(200)")]
       [Editable(true)]
       public string Remark { get; set; }

       /// <summary>
       ///
       /// </summary>
       [Display(Name ="CreateID")]
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
       ///
       /// </summary>
       [Display(Name ="ModifyDate")]
       [Column(TypeName="datetime")]
       public DateTime? ModifyDate { get; set; }

       
    }
}