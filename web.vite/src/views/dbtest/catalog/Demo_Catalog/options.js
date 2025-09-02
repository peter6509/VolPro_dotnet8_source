export default function(){
        const editFormFields = {"CatalogCode":"","CatalogName":"","ParentId":[],"Enable":"","Remark":"","Img":""};
        const editFormOptions = [[{"title":"分類編號","required":true,"field":"CatalogCode"},
                               {"title":"分類名稱","required":true,"field":"CatalogName"}],
                              [{"dataKey":"分類级聯","data":[],"title":"上级分類","field":"ParentId","type":"cascader"},
                               {"dataKey":"商品分類可用","data":[],"title":"是否可用","field":"Enable","type":"radio"}],
                              [{"title":"備註","field":"Remark","colSize":12,"type":"textarea"}],
                              [{"title":"分類圖片","field":"Img","type":"img"}]];
        const tableName="Demo_Catalog";
        const tableCNName="商品分類";
        const newTabEdit=true;
        const key='CatalogId';
        const detail = {
            cnName: "",
            table: "",
            url:"api/Demo_Catalog/getDetailPage",
            columns: [],
            sortName: "",
            key: ""
        };

       const details=[]

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