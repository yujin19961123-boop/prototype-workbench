import { ListDetailLayout } from "@/components/blocks/list-detail-layout";

export function ListDetailLayoutDemo() {
  return <div className="h-[560px] w-full"><ListDetailLayout header={<div className="p-4">列表与详情布局</div>} sidebar={<div className="p-4">导航插槽</div>} list={<div className="p-4">列表插槽</div>} detail={<div className="p-4">详情插槽</div>}/></div>;
}
