export function getSheetByName(spreadsheetId: string, sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`シート '${sheetName}' が見つかりません`);
    }
    return sheet;
  }
  
  
  /**
   * シートから指定した複数のヘッダーに対応する列の値を取得します。
   * 各ヘッダー名をキーとして、列の値（空文字列は除外）を配列として返します。
   * 
   * @param sheet - 値を取得する対象のシートオブジェクト
   * @param headers - 1行目に存在するヘッダー名の配列
   * @returns 各ヘッダー名をキーとし、対応する列の値の配列を値とするオブジェクト
   * @throws 指定したヘッダーのいずれかが見つからない場合
   */
  export function getColumnsValuesByHeaders(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    headers: string[]
  ): Record<string, string[]> {
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) return {}; // シートにデータがない場合は空オブジェクトを返す
  
    // 1行目（ヘッダー行）の全列を取得
    const sheetHeaders: string[] = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getDisplayValues()[0];
  
    // 指定した各ヘッダーがシートに存在するか確認し、インデックス（0始まり）を記録
    const headerIndices: Record<string, number> = {};
    headers.forEach((header) => {
      const index = sheetHeaders.indexOf(header);
      if (index === -1) {
        throw new Error(`Header "${header}" not found in the sheet.`);
      }
      headerIndices[header] = index;
    });
  
    // シート全体のデータ（全行・全列）を取得
    const data: string[][] = sheet.getRange(2, 1, lastRow, sheet.getLastColumn()).getDisplayValues();
  
    // 各ヘッダーに対応する列の値を抽出（ヘッダー行も含むため、必要に応じて取り除く処理を追加できます）
    const result: Record<string, string[]> = {};
    headers.forEach((header) => {
      const colIndex = headerIndices[header];
      // 各行の指定列の値を抽出し、空文字列は除外
      const columnValues = data.map((row) => row[colIndex]).filter((value) => value !== "");
      result[header] = columnValues;
    });
  
    return result;
  }