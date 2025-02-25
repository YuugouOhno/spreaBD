// import * as dotenv from 'dotenv';
import config from "./config.json";

// dotenv.config();

export function initializeSheet() {
  const spreadsheetId = "1ikEvU2I88BuvYGxegNe8dLsQlcU-POjN7vlIUK4Bf7o"
  // const spreadsheetId: string = process.env.SPREAD_SHEET_ID ?? '';
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