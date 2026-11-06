import { useState } from "react";

import * as N from "@/components/ui/navigation-menu";

export function NavigationMenuDemo() {
  const [selected, setSelected] = useState("请选择示例导航");
  return (
    <div className="flex w-full flex-col items-center gap-16">
      <N.NavigationMenu>
        <N.NavigationMenuList>
          <N.NavigationMenuItem>
            <N.NavigationMenuTrigger>组件</N.NavigationMenuTrigger>
            <N.NavigationMenuContent>
              <div className="grid w-60 gap-2 p-2">
                <N.NavigationMenuLink asChild>
                  <button onClick={() => setSelected("基础原子")}>
                    基础原子
                  </button>
                </N.NavigationMenuLink>
                <N.NavigationMenuLink asChild>
                  <button onClick={() => setSelected("组合组件")}>
                    组合组件
                  </button>
                </N.NavigationMenuLink>
              </div>
            </N.NavigationMenuContent>
          </N.NavigationMenuItem>
          <N.NavigationMenuItem>
            <N.NavigationMenuLink asChild>
              <button onClick={() => setSelected("设计规范")}>设计规范</button>
            </N.NavigationMenuLink>
          </N.NavigationMenuItem>
          <N.NavigationMenuIndicator />
        </N.NavigationMenuList>
      </N.NavigationMenu>
      <p role="status" className="text-xs text-muted-foreground">
        {selected}
      </p>
    </div>
  );
}
