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