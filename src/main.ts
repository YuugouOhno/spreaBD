import { initializeSheet } from "./initializeSheet";

// GASから参照したい変数はglobalオブジェクトに渡してあげる必要がある
(global as any).initializeSheet = initializeSheet;

