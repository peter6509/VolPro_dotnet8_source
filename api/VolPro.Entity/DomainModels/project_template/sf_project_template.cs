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
    [Entity(TableCnName = "專案層級樣板",TableName = "sf_project_template",DBServer = "SysDbContext")]
    public partial class sf_project_template:SysEntity
    {
        /// <summary>
       ///主鍵
       /// </summary>
       [Key]
       [Display(Name ="主鍵")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int template_id { get; set; }

       /// <summary>
       ///名稱
       /// </summary>
       [Display(Name ="名稱")]
       [MaxLength(200)]
       [Column(TypeName="varchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string name { get; set; }

       /// <summary>
       ///描述
       /// </summary>
       [Display(Name ="描述")]
       [Column(TypeName="varchar(max)")]
       [Editable(true)]
       public string description { get; set; }

       /// <summary>
       ///上階名稱
       /// </summary>
       [Display(Name ="上階名稱")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? parentId { get; set; }

       /// <summary>
       ///階層名稱
       /// </summary>
       [Display(Name ="階層名稱")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? level_name { get; set; }

       /// <summary>
       ///
       /// </summary>
       [Display(Name ="CreateID")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? CreateID { get; set; }

       /// <summary>
       ///創建人
       /// </summary>
       [Display(Name ="創建人")]
       [MaxLength(30)]
       [Column(TypeName="varchar(30)")]
       [Editable(true)]
       public string Creator { get; set; }

       /// <summary>
       ///創建時間
       /// </summary>
       [Display(Name ="創建時間")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       public DateTime? CreateDate { get; set; }

       /// <summary>
       ///
       /// </summary>
       [Display(Name ="ModifyID")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? ModifyID { get; set; }

       /// <summary>
       ///修改人
       /// </summary>
       [Display(Name ="修改人")]
       [MaxLength(30)]
       [Column(TypeName="varchar(30)")]
       [Editable(true)]
       public string Modifier { get; set; }

       /// <summary>
       ///修改時間
       /// </summary>
       [Display(Name ="修改時間")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       public DateTime? ModifyDate { get; set; }

       
    }
}