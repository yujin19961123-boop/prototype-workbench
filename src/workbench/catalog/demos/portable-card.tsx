import { useState } from "react";

import * as Button from "@/components/ui/button";

import * as Card from "@/components/ui/card";

export function CardDemo() {
  const [message, setMessage] = useState("");
  return (
    <Card.Card className="w-full max-w-sm">
      <Card.CardHeader>
        <Card.CardTitle>卡片标题</Card.CardTitle>
        <Card.CardDescription>
          描述、内容与底部动作可自由组合。
        </Card.CardDescription>
        <Card.CardAction>
          <Button.Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage("已触发顶部动作")}
          >
            更多
          </Button.Button>
        </Card.CardAction>
      </Card.CardHeader>
      <Card.CardContent>
        <p className="text-sm">卡片内容区域。</p>
        <p role="status" className="mt-2 text-xs text-muted-foreground">
          {message}
        </p>
      </Card.CardContent>
      <Card.CardFooter>
        <Button.Button
          variant="outline"
          className="w-full"
          onClick={() => setMessage("已触发底部动作")}
        >
          底部操作
        </Button.Button>
      </Card.CardFooter>
    </Card.Card>
  );
}
