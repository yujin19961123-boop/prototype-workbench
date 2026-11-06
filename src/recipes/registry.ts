import { lazy } from "react";
import listSource from "./ListDetailRecipe.tsx?raw";
import formSource from "./FormDialogRecipe.tsx?raw";
import messageSource from "../project/IMPage.tsx?raw";
import messageModel from "../project/im-model.ts?raw";

export const recipes = [
  { id: "list-detail", title: "列表与详情", Page: lazy(() => import("./ListDetailRecipe")), sources: [{ file: "ListDetailRecipe.tsx", code: listSource }] },
  { id: "form-dialog", title: "表单与弹窗", Page: lazy(() => import("./FormDialogRecipe")), sources: [{ file: "FormDialogRecipe.tsx", code: formSource }] },
  { id: "message-feed", title: "消息流与输入", Page: lazy(() => import("./MessageFeedRecipe")), sources: [{ file: "IMPage.tsx", code: messageSource }, { file: "im-model.ts", code: messageModel }] },
];
