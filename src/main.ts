import { initializeSheet } from "./api/initializeSheet";
import { postData, testPostData } from "./api/postData";
import { updateData, testUpdateData } from "./api/updateData";

// GASから参照したい変数はglobalオブジェクトに渡してあげる必要がある
(global as any).initializeSheet = initializeSheet;
(global as any).postData = postData;
(global as any).updateData = updateData;

(global as any).testPostData = testPostData;
(global as any).testUpdateData = testUpdateData;

