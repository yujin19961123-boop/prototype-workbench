import { useState } from "react";

import * as Q from "@/components/ui/questionnaire";

export function QuestionnaireDemo() {
  const [result, setResult] = useState("");
  const items = [
    {
      name: "appearance",
      required: true,
      prompt: "你想查看哪种组件示例？",
      description: "单选示例，也可以输入其他答案。",
      choices: [
        {
          value: "basic",
          label: "基础原子",
          description: "查看按钮、输入等基础能力",
        },
        {
          value: "composed",
          label: "组合组件",
          description: "查看原子组合后的布局",
        },
      ],
    },
    {
      name: "detail",
      required: false,
      prompt: "还需要哪些演示内容？",
      description: "多选示例，可以跳过。",
      multiple: true,
      choices: [
        { value: "states", label: "交互状态", description: "聚焦、选中与禁用" },
        { value: "sizes", label: "尺寸变体", description: "默认与紧凑尺寸" },
      ],
    },
  ];
  return (
    <div className="w-full max-w-lg space-y-5">
      <Q.Questionnaire
        items={items}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setResult(
            `已提交本地样本：${data.get("appearance") ?? ""}；${data.getAll("detail").join("、") || "已跳过可选题"}`,
          );
        }}
      >
        <Q.QuestionnaireProgress />
        {items.map((item) => (
          <Q.QuestionnaireItem
            key={item.name}
            name={item.name}
            required={item.required}
            multiple={item.multiple}
          >
            <Q.QuestionnaireTitle>{item.prompt}</Q.QuestionnaireTitle>
            <Q.QuestionnaireDescription>
              {item.description}
            </Q.QuestionnaireDescription>
            <Q.QuestionnaireChoices>
              {item.choices.map((choice) => (
                <Q.QuestionnaireChoice key={choice.value} value={choice.value}>
                  <span>{choice.label}</span>
                  <Q.QuestionnaireChoiceDescription>
                    {choice.description}
                  </Q.QuestionnaireChoiceDescription>
                </Q.QuestionnaireChoice>
              ))}
              {item.name === "appearance" && (
                <Q.QuestionnaireInput
                  aria-label="其他示例答案"
                  placeholder="其他答案…"
                />
              )}
            </Q.QuestionnaireChoices>
            <Q.QuestionnaireError />
          </Q.QuestionnaireItem>
        ))}
        <Q.QuestionnaireActions>
          <Q.QuestionnairePrevious>上一题</Q.QuestionnairePrevious>
          <Q.QuestionnaireSkip>跳过</Q.QuestionnaireSkip>
          <Q.QuestionnaireNext>下一题</Q.QuestionnaireNext>
          <Q.QuestionnaireSubmit>提交样本</Q.QuestionnaireSubmit>
        </Q.QuestionnaireActions>
      </Q.Questionnaire>
      {result && (
        <p role="status" className="text-xs text-muted-foreground">
          {result}
        </p>
      )}
    </div>
  );
}
