import * as Avatar from "@/components/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="space-y-7">
      <div className="flex items-center gap-5">
        <Avatar.Avatar>
          <Avatar.AvatarImage
            src="/avatars/shadcn.png"
            alt="shadcn 官方示例头像"
          />
          <Avatar.AvatarFallback>A</Avatar.AvatarFallback>
          <Avatar.AvatarBadge aria-label="装饰状态样本" />
        </Avatar.Avatar>
        <Avatar.Avatar size="lg">
          <Avatar.AvatarImage src="/avatars/shadcn.png" alt="大尺寸头像样本" />
          <Avatar.AvatarFallback className="bg-avatar-blue text-white">
            B
          </Avatar.AvatarFallback>
          <Avatar.AvatarBadge aria-label="大头像状态点" />
        </Avatar.Avatar>
        <Avatar.Avatar size="lg" className="size-16!">
          <Avatar.AvatarImage src="/avatars/shadcn.png" alt="64px 头像样本" />
          <Avatar.AvatarFallback>CN</Avatar.AvatarFallback>
          <Avatar.AvatarBadge
            className="group-data-[size=lg]/avatar:size-4"
            aria-label="64px 头像外置状态点"
          />
        </Avatar.Avatar>
        <Avatar.Avatar size="sm">
          <Avatar.AvatarFallback>C</Avatar.AvatarFallback>
        </Avatar.Avatar>
      </div>
      <Avatar.AvatarGroup aria-label="头像组样本">
        {["A", "B", "C"].map((name) => (
          <Avatar.Avatar key={name}>
            <Avatar.AvatarImage
              src={name === "A" ? "/avatars/shadcn.png" : undefined}
              alt={`头像 ${name}`}
            />
            <Avatar.AvatarFallback>{name}</Avatar.AvatarFallback>
          </Avatar.Avatar>
        ))}
        <Avatar.AvatarGroupCount>+2</Avatar.AvatarGroupCount>
      </Avatar.AvatarGroup>
    </div>
  );
}
