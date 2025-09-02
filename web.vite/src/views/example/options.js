export default function () {
  const editFormFields = {
    ProjectCode: 'Q202408310001',
    ProjectName: '2024年採購招標',
    FacilityId: 'A组',
    FacilityNum: 'A00001',
    SetPurchaseAmount: 1000,
    PurchaseAmount: 2000,
    SetMaterialAmount: 1200,
    MaterialAmount: 450,
    SetWorkTimes: '0',
    WorkTimes: 8,
    SetDeliveryAmount: '1',
    DeliveryAmount: '厢式貨車',
    SetConstructAmount: 2000,
    ConstructAmount: 1400,
    SetConstructAmount1: '',
    ConstructAmount1: '',
    Company1: '',
    Phone1: '',
    Creator: '',
    CreateDate: '',
    Company: '',
    Phone: '',
    Modifier: '',
    ModifyDate: '',
    remark: [],
    img1: [],
    img2: [],
    img3: [],
    img4: []
  }
  const editFormOptions = [
    [
      { title: '銷售合同', field: 'ProjectCode', required: true },
      { title: '項目名稱', field: 'ProjectName' },
      { title: '機组名稱', field: 'FacilityId', required: true },
      { title: '機组編號', field: 'FacilityNum', required: true }
    ],
    [
      { title: '物料成本', field: 'SetPurchaseAmount', required: true, type: 'decimal' },
      { title: '外購金額', field: 'PurchaseAmount', required: true, type: 'decimal' },
      { title: '材料金額', field: 'SetMaterialAmount', required: true, type: 'decimal' },
      { title: '材料運費', field: 'MaterialAmount', required: true, type: 'decimal' }
    ],
    [
      { title: '運輸方式', field: 'DeliveryAmount' },
      { title: '累計工時', field: 'WorkTimes' },
      {
        title: '是否正常',
        field: 'SetDeliveryAmount',
        type: 'select',
        data: [],
        dataKey: 'enable'
      },
      { title: '是否立項', field: 'SetWorkTimes', type: 'radio', data: [], dataKey: 'enable' }
    ],
    [
      { title: '供應商名稱', field: 'SetConstructAmount1', type: '' },
      { title: '供應商編號', field: 'ConstructAmount1', type: '' },
      { title: '科目名稱', field: 'Company1' },
      { title: '電话號碼', field: 'Phone1' }
    ],
    [
      { title: '安装金額                                                                                                                                                                                                                                                 ', field: 'SetConstructAmount', type: 'decimal' },
      { title: '安装金額                                                                                                                                                                                                                                                 ', field: 'ConstructAmount', type: 'decimal' },
      { title: '服務公司', field: 'Company' },
      { title: '聯系方式', field: 'Phone' }
    ],
    [
      { title: '提交人员', field: 'Creator' },
      { title: '提交日期', field: 'CreateDate', type: 'date' },
      { title: '簽收人员', field: 'Modifier', type: '' },
      { title: '簽收日期', field: 'ModifyDate', type: 'date' }
    ],

    [
      { title: '廠家資質', field: 'img1', type: 'file' },
      { title: '營業執照', field: 'img2', type: 'file' },
      { title: '經營許可', field: 'img3', type: 'file' },
      { title: '合同附件', field: 'img4', type: 'file' }
    ],
    [{ title: '補充說明', field: 'remark', type: 'img', colSize: 12 }],
  ]
  const tableName = 'Demo_Order'
  const tableCNName = '項目成本控制'
  const newTabEdit = true
  const key = 'GoodsId'
  const detail = {
    cnName: '',
    table: '',
    url: '',
    columns: [],
    sortName: '',
    key: ''
  }

  const details = [
    {
      cnName: '成本控制分項',
      table: 'Pm_ControlDetail',
      columns: [
        { field: 'ItemName', title: '分項名稱', type: 'string', width: 110, edit: { type: '' }, align: 'left' },
        {
          field: 'PreCostAmount',
          title: '預計成本',
          type: 'decimal',
          width: 80,
          edit: { type: '' },
          align: 'left'
        },
        {
          field: 'CurrCostAmount',
          title: '當前累計成本',
          type: 'decimal',
          width: 110,
          readonly: true,
          edit: { type: '' },
          align: 'left'
        },
        {
          field: 'Memo',
          title: '備註',
          type: 'string',
          width: 120,
          edit: { type: '' },
          align: 'left'
        },
        {
          field: 'CreateID',
          title: 'CreateID',
          type: 'int',
          width: 80,
          hidden: true,
          align: 'left'
        },
        { field: 'Creator', title: '創建人', type: 'string', width: 100, align: 'left' },
        { field: 'CreateDate', title: '創建日期', type: 'datetime', width: 110, align: 'left' },
        {
          field: 'ModifyID',
          title: 'ModifyID',
          type: 'int',
          width: 80,
          hidden: true,
          align: 'left'
        },
        { field: 'Modifier', title: '修改人', type: 'string', width: 100, align: 'left' },
        { field: 'ModifyDate', title: '修改日期', type: 'datetime', width: 140, align: 'left' }
      ],
      sortName: 'ProjectCostDetailId',
      key: 'ProjectCostDetailId',
      buttons: [],
      delKeys: [],
      detail: null
    },
    {
      cnName: '外購價格表',
      table: 'Pm_PrePurchaseDetail',
      columns: [
        {
          field: 'ProductName',
          title: '物料名稱',
          type: 'string',
          width: 110,
          edit: { type: '' },
          align: 'left'
        },
        {
          field: 'ProductUnit',
          title: '單位',
          type: 'string',
          width: 110,
          edit: { type: '' },
          align: 'left'
        },
        {
          field: 'Amount',
          title: '金額',
          type: 'decimal',
          width: 110,
          edit: { type: '' },
          align: 'left'
        },
        { field: 'Company', title: '公司', type: 'string', width: 100, align: 'left' },
        {
          field: 'CreateID',
          title: 'CreateID',
          type: 'int',
          width: 80,
          hidden: true,
          align: 'left'
        },
        { field: 'Creator', title: '創建人', type: 'string', width: 100, align: 'left' },
        { field: 'CreateDate', title: '創建日期', type: 'datetime', width: 110, align: 'left' },
        {
          field: 'ModifyID',
          title: 'ModifyID',
          type: 'int',
          width: 80,
          hidden: true,
          align: 'left'
        },
        { field: 'Modifier', title: '修改人', type: 'string', width: 100, align: 'left' },
        { field: 'ModifyDate', title: '修改日期', type: 'datetime', width: 110, align: 'left' }
      ],
      sortName: 'PrePurchaseDetailId',
      key: 'PrePurchaseDetailId',
      buttons: [],
      delKeys: [],
      detail: null
    },
    {
      cnName: '外購件明细',
      table: 'Pm_PurchaseDetail',
      columns: [
        {
          field: 'PurchaseDetail',
          title: 'PurchaseDetail',
          type: 'int',
          width: 110,
          hidden: true,
          require: true,
          align: 'left'
        },
        {
          field: 'FacilityId',
          title: 'FacilityId',
          type: 'int',
          width: 110,
          hidden: true,
          align: 'left'
        },
        { field: 'PurchaseOrderNum', title: '單號', type: 'string', width: 110, align: 'left' },
        { field: 'ProductCode', title: '物料編碼', type: 'string', width: 110, align: 'left' },
        { field: 'ProductName', title: '物料名稱', type: 'string', width: 110, align: 'left' },
        { field: 'ProductUnit', title: '單位', type: 'string', width: 110, align: 'left' },
        { field: 'Quantity', title: '數量', type: 'decimal', width: 110, align: 'left' },
        { field: 'Price', title: '單價', type: 'decimal', width: 110, align: 'left' },
        { field: 'TaxAmount', title: '金額', type: 'decimal', width: 110, align: 'left' },
        { field: 'subProjectCode', title: '施工單號', type: 'string', width: 120, align: 'left' }
      ],
      sortName: 'PurchaseDetail',
      key: 'PurchaseDetail',
      buttons: [],
      delKeys: [],
      detail: null
    },
    {
      cnName: '原材料明细',
      table: 'Pm_MaterialDetail',
      columns: [
        {
          field: 'MaterialDetail',
          title: 'MaterialDetail',
          type: 'int',
          width: 110,
          hidden: true,
          require: true,
          align: 'left'
        },
        {
          field: 'FacilityId',
          title: 'FacilityId',
          type: 'int',
          width: 110,
          hidden: true,
          align: 'left'
        },
        { field: 'PurchaseOrderNum', title: '單號', type: 'string', width: 110, align: 'left' },
        { field: 'ProductCode', title: '物料編碼', type: 'string', width: 110, align: 'left' },
        { field: 'ProductName', title: '物料名稱', type: 'string', width: 110, align: 'left' },
        { field: 'ProductUnit', title: '單位', type: 'string', width: 110, align: 'left' },
        { field: 'Quantity', title: '數量', type: 'decimal', width: 110, align: 'left' },
        { field: 'Price', title: '單價', type: 'decimal', width: 110, align: 'left' },
        { field: 'TaxAmount', title: '金額', type: 'decimal', width: 110, align: 'left' },
        { field: 'subProjectCode', title: '施工單號', type: 'string', width: 120, align: 'left' }
      ],
      sortName: 'MaterialDetail',
      key: 'MaterialDetail',
      buttons: [],
      delKeys: [],
      detail: null
    },
    {
      cnName: '工時明细',
      table: 'Pm_WorkTimeDetail',
      columns: [
        {
          field: 'WorkTimeDetail',
          title: 'WorkTimeDetail',
          type: 'int',
          width: 110,
          hidden: true,
          require: true,
          align: 'left'
        },
        {
          field: 'FacilityId',
          title: 'FacilityId',
          type: 'int',
          width: 110,
          hidden: true,
          align: 'left'
        },
        { field: 'ProductCode', title: '產品編號', type: 'string', width: 110, align: 'left' },
        { field: 'ProductName', title: '產品名稱', type: 'string', width: 110, align: 'left' },
        { field: 'ProductUnit', title: '單位', type: 'string', width: 110, align: 'left' },
        { field: 'WorkTimeQuantity', title: '工時', type: 'decimal', width: 110, align: 'left' },
        { field: 'subProjectId', title: '施工單', type: 'int', width: 110, align: 'left' },
        { field: 'subProjectCode', title: '施工單號', type: 'string', width: 120, align: 'left' },
        { field: 'Memo', title: '備註', type: 'string', width: 120, align: 'left' },
        { field: 'Company', title: '公司', type: 'string', width: 120, align: 'left' }
      ],
      sortName: 'WorkTimeDetail',
      key: 'WorkTimeDetail',
      buttons: [],
      delKeys: [],
      detail: null
    },
    {
      cnName: '安装明细',
      table: 'Pm_ConstructionDetail',
      columns: [
        {
          field: 'ConstructionDetail',
          title: 'ConstructionDetail',
          type: 'int',
          width: 110,
          hidden: true,
          require: true,
          align: 'left'
        },
        {
          field: 'FacilityId',
          title: 'FacilityId',
          type: 'int',
          width: 110,
          hidden: true,
          align: 'left'
        },
        { field: 'ConstructionOrderNum', title: '單號', type: 'string', width: 110, align: 'left' },
        { field: 'ProductName', title: '產品名稱', type: 'string', width: 110, align: 'left' },
        { field: 'ProductUnit', title: '單位', type: 'string', width: 110, align: 'left' },
        { field: 'Quantity', title: '數量', type: 'decimal', width: 110, align: 'left' },
        { field: 'Price', title: '單價', type: 'decimal', width: 110, align: 'left' },
        { field: 'TaxAmount', title: '金額', type: 'decimal', width: 110, align: 'left' },
        { field: 'subProjectCode', title: '施工單號', type: 'string', width: 120, align: 'left' },
        { field: 'Memo', title: '備註', type: 'string', width: 120, align: 'left' }
      ],
      sortName: 'ConstructionDetail',
      key: 'ConstructionDetail',
      buttons: [],
      delKeys: [],
      detail: null
    }
  ]

  return {
    key,
    tableName,
    tableCNName,
    editFormFields,
    editFormOptions,
    detail,
    details,
    newTabEdit
  }
}
