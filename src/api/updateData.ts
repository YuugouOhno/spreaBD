import { getSheetByName } from "../utils";
import { spreadsheetId } from "../config/setting";

export function updateData(requestBody: string): object {
    try {
        // JSON パース
        const requestData = JSON.parse(requestBody);
        const sheetName: string = requestData.sheetName;
        const searchKeys: { [key: string]: any } = requestData.searchKeys; // 検索条件
        const updateValues: { [key: string]: any } = requestData.updateValues; // 更新する値

        console.log("searchKeys",searchKeys)
        console.log("updateValues",updateValues)

        // 必須データの確認
        if (!sheetName || !searchKeys || !updateValues) {
            return { success: false, message: "Invalid request: sheetName, searchKeys, and updateValues are required." };
        }

        let sheet = getSheetByName(spreadsheetId, sheetName);
        if (!sheet) {
            return { success: false, message: `Error: Sheet '${sheetName}' not found.` };
        }

        // シートのヘッダー取得 (1行目)
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

        // 検索条件のカラムがヘッダーに含まれているかチェック
        const searchColumns = Object.keys(searchKeys);
        if (!searchColumns.every(col => headers.includes(col))) {
            return {
                success: false,
                message: `Error: Some search criteria keys do not exist in sheet headers. Expected keys: ${headers.join(", ")}, but received: ${searchColumns.join(", ")}`
            };
        }

        // 更新対象のカラムがヘッダーに含まれているかチェック
        const updateColumns = Object.keys(updateValues);
        if (!updateColumns.every(col => headers.includes(col))) {
            return {
                success: false,
                message: `Error: Some update values keys do not exist in sheet headers. Expected keys: ${headers.join(", ")}, but received: ${updateColumns.join(", ")}`
            };
        }

        // シート内のデータ取得（1行目はヘッダーなのでスキップ）
        const dataRange = sheet.getDataRange().getValues();
        const dataRows = dataRange.slice(1); // ヘッダー行を除外
        console.log("dataRows",dataRows)
        // 検索条件に一致する行を探す
        const matchingRows = dataRows
            .map((row, index) => {
                return {
                    row: row.map((value, colIndex) => {
                        const headerName = headers[colIndex];
                        if (headerName === "datetime" && value instanceof Date){
                            return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") // `Date` の場合はフォーマット
                        } else if(headerName === "塩分濃度" && value instanceof Date) {
                            return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") // `Date` の場合はフォーマット
                        } else {
                            return value;
                        }
                    }),
                    index: index + 2 // スプレッドシートは1行目から始まるため +2（ヘッダーを除く）
                };
            })
            .filter(({ row }) => searchColumns.every(col => String(row[headers.indexOf(col)]) === String(searchKeys[col])));

        console.log("matchingRows",matchingRows)
        // 該当データが0件または複数ある場合のエラーハンドリング
        if (matchingRows.length === 0) {
            return { success: false, message: "Error: No matching records found for the given criteria." };
        }
        if (matchingRows.length > 1) {
            return { success: false, message: "Error: Multiple records match the given criteria. Please provide more specific search criteria." };
        }

        // 一致した行のインデックスを取得
        const targetRowIndex = matchingRows[0].index;

        // 更新データの適用
        updateColumns.forEach(col => {
            const colIndex = headers.indexOf(col);
            sheet.getRange(targetRowIndex, colIndex + 1).setValue(updateValues[col]); // スプレッドシートは1始まり
        });

        return { success: true, message: "Data successfully updated." };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Error: ${errorMessage}` };
    }
}


export function testUpdateData() {
    const testRequest = JSON.stringify({
        "sheetName": "3-1-1",
        "searchKeys": {
            "datetime": "2024-02-25 12:00:00",
            "外気温": 3
        },
        "updateValues": {
            "DO": 9.1,
            "水温": 25
        }
    });

    const result = updateData(testRequest);
    Logger.log(result);
}