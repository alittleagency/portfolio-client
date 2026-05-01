import { notFound } from "next/navigation";
import { PersonProfile } from "@/components/wiki/PersonProfile";
import { TopicPage } from "@/components/wiki/TopicPage";
import {
  FAMILY_PEOPLE,
  FAMILY_TOPICS,
  getNode,
} from "@/lib/jenkins-family";

export function generateStaticParams() {
  return [...FAMILY_PEOPLE, ...FAMILY_TOPICS].map((n) => ({ slug: n.id }));
}

export default function WikiNodePage({ params }: { params: { slug: string } }) {
  const node = getNode(params.slug);
  if (!node) notFound();
  return node.kind === "person" ? (
    <PersonProfile person={node} />
  ) : (
    <TopicPage topic={node} />
  );
}
