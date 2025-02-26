.clasp.jsonのscriptIdがデプロイ先のスクリプト

mainでglobalオブジェクトに渡された関数がデプロイされる

### initializeSheet
config.jsonを元にスプレッドシートを初期化

### postData
シートにあるカラムとdataのkeyがあっていれば保存する
{
    "sheetName": "name",
    "data": {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
    }
}

### updateData
任意のsearchKeysで検索して、一件に絞り込めたらupdateする
{
    "sheetName": "3-1-1",
    "searchKeys": {
        "searchKey1": "value1",
        "searchKey2": "value2"
    },
    "updateValues": {
        "key1": "value1",
        "key2": "value2"
    }
}