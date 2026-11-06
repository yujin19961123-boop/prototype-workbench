import * as P from "@/components/blocks/people-stack";

export function PeopleStackDemo() {
  const people = ["A", "B", "C", "D", "E"].map((name) => ({
    id: name,
    name: `示例参与者 ${name}`,
    initials: name,
  }));
  return (
    <div className="space-y-6">
      <P.PeopleStack people={people} />
      <P.PeopleStack people={people} limit={2} />
      <P.PeopleStack people={people.slice(0, 2)} />
    </div>
  );
}
