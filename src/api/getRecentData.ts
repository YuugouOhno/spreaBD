import { getSheetByName } from "../utils";
import { spreadsheetId } from "../config/setting";

/**
 * すべてのシートからそれぞれ最新の n 件を取得し、`updated_at` が新しいものを全体で n 件取得する
 */
export function getRecentData(n: number): object {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheets = ss.getSheets();
        let allData: any[] = [];

        sheets.forEach(sheet => {
            const sheetName = sheet.getName();
            const lastColumn = sheet.getLastColumn();
            const lastRow = sheet.getLastRow();

            // 空のシート（データなし）の場合はスキップ
            if (lastColumn === 0 || lastRow === 0) return;
            const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

            // `updated_at` カラムのインデックスを取得
            const updatedAtIndex = headers.indexOf("updated_at");
            if (updatedAtIndex === -1) return; // `updated_at` カラムがない場合はスキップ

            // シートの全データ取得（1行目はヘッダーなので除外）
            const dataRows = sheet.getDataRange().getValues().slice(1);

            // すべてのセルを文字列に変換 & `updated_at` を日付型に変換
            const formattedData = dataRows.map(row => {
                return headers.reduce((obj, header, index) => {
                    obj[header] = (index === updatedAtIndex && row[index] instanceof Date)
                        ? Utilities.formatDate(row[index], Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")
                        : String(row[index]);
                    return obj;
                }, {} as Record<string, string>);
            });

            // `updated_at` の降順でソートし、n 件取得
            const latestNData = formattedData
                .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))
                .slice(0, n)
                .map(entry => ({ ...entry, sheet: sheetName })); // シート名も付与

            allData = allData.concat(latestNData);
        });

        // 全シートのデータを `updated_at` で降順ソートし、最も新しい n 件を返す
        const recentData = allData
            .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))
            .slice(0, n);

        return { success: true, data: recentData };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Error: ${errorMessage}` };
    }
}

export function testGetRecentData() {
    const result = getRecentData(5); // 最新5件を取得
    console.log(result);
}
