export default {
  panels: [
    {
      index: 0,
      name: 1,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 841.8897637795277,
      printElements: [
        {
          options: {
            left: 430.5,
            top: 9,
            height: 25,
            width: 155,
            title: 'OT2023080140000001',
            fontFamily: '微軟雅黑',
            textAlign: 'center',
            textType: 'barcode',
            right: 591.5000228881836,
            bottom: 34,
            vCenter: 514.0000228881836,
            hCenter: 21.5,
            coordinateSync: false,
            widthHeightSync: false,
            qrCodeLevel: 0
          },
          printElementType: { title: '自定義文本', type: 'text' }
        },
        {
          options: {
            left: 175.5,
            top: 10.5,
            height: 27,
            width: 259,
            title: '銷售訂單',
            fontSize: 19,
            fontWeight: '600',
            textAlign: 'center',
            lineHeight: 26,
            coordinateSync: true,
            widthHeightSync: true,
            draggable: false,
            qrCodeLevel: 0
          },
          printElementType: { title: '自定義文本', type: 'text' }
        },
        {
          options: {
            left: 166.5,
            top: 63,
            height: 16,
            width: 120,
            field: '訂單類型',
            testData: '2020-01-01',
            fontSize: 6.75,
            fontWeight: '700',
            textContentVerticalAlign: 'middle',
            title: '訂單類型',
            coordinateSync: false,
            widthHeightSync: false,
            qrCodeLevel: 0
          },
          printElementType: { title: '業務日期', type: 'text' }
        },
        {
          options: {
            left: 328.5,
            top: 63,
            height: 16,
            width: 120,
            field: '訂單狀態',
            testData: '2020-01-01',
            fontSize: 6.75,
            fontWeight: '700',
            textContentVerticalAlign: 'middle',
            title: '訂單狀態',
            right: 443.2500228881836,
            bottom: 80.5,
            vCenter: 383.2500228881836,
            hCenter: 72.5,
            coordinateSync: false,
            widthHeightSync: false,
            qrCodeLevel: 0
          },
          printElementType: { title: '業務日期', type: 'text' }
        },
        {
          options: {
            left: 468,
            top: 63,
            height: 16,
            width: 120,
            field: 'date',
            testData: '2020-01-01',
            fontSize: 6.75,
            fontWeight: '700',
            textContentVerticalAlign: 'middle',
            title: '訂單日期',
            coordinateSync: false,
            widthHeightSync: false,
            qrCodeLevel: 0
          },
          printElementType: { title: '業務日期', type: 'text' }
        },
        {
          options: {
            left: 13.5,
            top: 63,
            height: 16,
            width: 120,
            field: 'OrderNo',
            testData: 'T2023080140001',
            fontSize: 6.75,
            fontWeight: '700',
            textContentVerticalAlign: 'middle',
            title: '訂單編號',
            right: 139.5,
            bottom: 79,
            vCenter: 79.5,
            hCenter: 71,
            coordinateSync: false,
            widthHeightSync: false,
            qrCodeLevel: 0
          },
          printElementType: { title: '業務日期', type: 'text' }
        },
        {
          options: {
            left: 13.5,
            top: 90,
            height: 39,
            width: 573,
            field: 'table',
            fields: [
              { text: '名稱', field: 'name' },
              { text: '數量', field: 'SL' },
              { text: '規格', field: 'GG' },
              { text: '條碼', field: 'TM' },
              { text: '單價', field: 'DJ' },
              { text: '金額                                                                                                                                                                                                                                                 ', field: 'JE' },
              { text: '備註', field: 'DETAIL' }
            ],
            right: 592.5,
            bottom: 147,
            vCenter: 306,
            hCenter: 129,
            columns: [
              [
                {
                  width: 81.85714285714288,
                  title: '名稱',
                  field: 'name',
                  checked: true,
                  columnId: 'NAME',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                },
                {
                  width: 81.85714285714288,
                  title: '數量',
                  field: 'count',
                  checked: true,
                  columnId: 'count',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                },
                {
                  width: 81.85714285714288,
                  title: '條碼',
                  field: 'TM',
                  checked: true,
                  columnId: 'TM',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                },
                {
                  width: 81.85714285714288,
                  title: '規格',
                  field: 'GG',
                  checked: true,
                  columnId: 'GG',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                },
                {
                  width: 81.85714285714288,
                  title: '單價',
                  field: 'amount',
                  checked: true,
                  columnId: 'amount',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                },
                {
                  width: 81.85714285714288,
                  title: '金額                                                                                                                                                                                                                                                 ',
                  field: 'JE',
                  checked: true,
                  columnId: 'JE',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                },
                {
                  width: 81.85714285714288,
                  title: '備註',
                  field: 'DETAIL',
                  checked: true,
                  columnId: 'DETAIL',
                  fixed: false,
                  rowspan: 1,
                  colspan: 1,
                  align: 'center'
                }
              ]
            ]
          },
          printElementType: {
            title: '批量打印',
            type: 'table',
            editable: true,
            columnDisplayEditable: true,
            columnDisplayIndexEditable: true,
            columnTitleEditable: true,
            columnResizable: true,
            columnAlignEditable: true,
            isEnableEditField: true,
            isEnableContextMenu: true,
            isEnableInsertRow: true,
            isEnableDeleteRow: true,
            isEnableInsertColumn: true,
            isEnableDeleteColumn: true,
            isEnableMergeCell: true
          }
        }
      ],
      watermarkOptions: {}
    }
  ]
};
