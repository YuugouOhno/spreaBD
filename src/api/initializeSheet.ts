import config from "../config/config.json";
import {spreadsheetId} from "../config/setting"

export function initializeSheet() {
  const ss = SpreadsheetApp.openById(spreadsheetId);

  config.sheets.forEach(sheetConfig => {
    let sheet = ss.getSheetByName(sheetConfig.name);
    
    // シートがなければ新規作成
    if (!sheet) {
      sheet = ss.insertSheet(sheetConfig.name);
    }

    // 既存シートの場合、一旦クリア
    sheet.clear();

    // 1行目にカラム名を設定
    const headers = sheetConfig.columns.map(col => col.name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  });

  Logger.log("シートの作成・更新が完了しました。");
}