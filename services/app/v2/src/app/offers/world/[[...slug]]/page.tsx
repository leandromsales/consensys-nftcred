import { notFound } from "next/navigation";

export default function World({ params, }: {
  params: { slug: string[]; };
}) {
  if (!params.slug || params.slug.length >= 3) {
    return notFound()
  }

  if (params.slug.length === 2) {
    return <h1>param1: {params.slug[0]} and param2: {params.slug[1]}</h1>
  }

  if (params.slug.length === 1) {
    return <h1>param1: {params.slug[0]}</h1>
  }
}