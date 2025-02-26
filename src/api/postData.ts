import {getSheetByName} from "../utils"
import {spreadsheetId} from "../config/setting"

export function postData(requestBody: string): object {
  try {
      // JSON パース
      const requestData = JSON.parse(requestBody);
      const sheetName: string = requestData.sheetName;
      const data: { [key: string]: any } = requestData.data;

      if (!sheetName || !data) {
          return { success: false, message: "Invalid request: sheetName and data are required." };
      }

      let sheet = getSheetByName(spreadsheetId, sheetName);
      if (!sheet) {
          return { success: false, message: `Error: Sheet '${sheetName}' not found.` };
      }

      // シートのヘッダー取得 (1行目)
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      // `data` のキーが `headers` と完全一致しているかチェック
      const dataKeys = Object.keys(data);
      if (!arraysEqual(dataKeys, headers)) {
          return {
              success: false,
              message: `Error: Request data keys do not match sheet headers. Expected keys: ${headers.join(", ")}, but received: ${dataKeys.join(", ")}`
          };
      }

      // データを追加する行を決定
      const newRow = headers.map(header => data[header] ?? ""); // ヘッダーの順序に沿ってデータをセット

      // 新しいデータを最終行に追加
      sheet.appendRow(newRow);

      return { success: true, message: "データを追加しました。" };
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      return { success: false, message: `Error: ${errorMessage}` };
  }
}

/**
* 配列が完全に一致するかチェック
*/
function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

export function testPostData() {
    const testRequest = JSON.stringify({
      "sheetName": "3-1-1",
      "data": {
        "datetime": "2024-02-25 11:00:00",
        "塩分濃度": "2024-02-25 11:00:00",
        "DO": 8.4,
        "水温": 2,
        "外気温":2,
      }
    });
  
    const result = postData(testRequest);
    Logger.log(result);
  }
  
  