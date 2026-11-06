import { useState } from "react";

import { Inbox, Plus, MoreHorizontal, Settings, Folder } from "lucide-react";

import * as S from "@/components/ui/sidebar";

export function SidebarDemo() {
  const [section, setSection] = useState("收件箱");
  return (
    <S.SidebarProvider className="relative h-[440px] min-h-0 w-full overflow-hidden rounded-xl border">
      <S.Sidebar collapsible="icon" className="absolute! h-full!">
        <S.SidebarHeader>
          <S.SidebarInput aria-label="侧栏搜索" placeholder="搜索示例" />
        </S.SidebarHeader>
        <S.SidebarSeparator />
        <S.SidebarContent>
          <S.SidebarGroup>
            <S.SidebarGroupLabel>样本导航</S.SidebarGroupLabel>
            <S.SidebarGroupAction
              aria-label="新增分组"
              onClick={() => setSection("新增分组示例")}
            >
              <Plus />
            </S.SidebarGroupAction>
            <S.SidebarGroupContent>
              <S.SidebarMenu>
                <S.SidebarMenuItem>
                  <S.SidebarMenuButton
                    tooltip="收件箱"
                    isActive={section === "收件箱"}
                    onClick={() => setSection("收件箱")}
                  >
                    <Inbox />
                    <span>收件箱</span>
                  </S.SidebarMenuButton>
                  <S.SidebarMenuAction
                    aria-label="更多导航操作"
                    onClick={() => setSection("导航操作示例")}
                  >
                    <MoreHorizontal />
                  </S.SidebarMenuAction>
                  <S.SidebarMenuBadge>12</S.SidebarMenuBadge>
                  <S.SidebarMenuSub>
                    <S.SidebarMenuSubItem>
                      <S.SidebarMenuSubButton asChild>
                        <button onClick={() => setSection("示例子项")}>
                          示例子项
                        </button>
                      </S.SidebarMenuSubButton>
                    </S.SidebarMenuSubItem>
                  </S.SidebarMenuSub>
                </S.SidebarMenuItem>
                <S.SidebarMenuItem>
                  <S.SidebarMenuButton
                    tooltip="文件夹"
                    onClick={() => setSection("文件夹")}
                  >
                    <Folder />
                    <span>文件夹</span>
                  </S.SidebarMenuButton>
                </S.SidebarMenuItem>
                <S.SidebarMenuItem>
                  <S.SidebarMenuSkeleton showIcon />
                </S.SidebarMenuItem>
              </S.SidebarMenu>
            </S.SidebarGroupContent>
          </S.SidebarGroup>
        </S.SidebarContent>
        <S.SidebarFooter>
          <S.SidebarMenu>
            <S.SidebarMenuItem>
              <S.SidebarMenuButton
                tooltip="设置"
                onClick={() => setSection("设置")}
              >
                <Settings />
                <span>设置</span>
              </S.SidebarMenuButton>
            </S.SidebarMenuItem>
          </S.SidebarMenu>
        </S.SidebarFooter>
        <S.SidebarRail />
      </S.Sidebar>
      <S.SidebarInset className="min-w-0 bg-card">
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <S.SidebarTrigger />
          <span className="truncate text-sm">{section}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          切换侧栏；窄屏通过 Sheet 展开。
        </p>
      </S.SidebarInset>
    </S.SidebarProvider>
  );
}
