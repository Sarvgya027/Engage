import { db } from "..";
import type { Post } from "@prisma/client";

export type PostWIthData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

export function fetchPostsByPostTerm(term: string): Promise<PostWIthData[]> {
  return db.post.findMany({
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
  
  },
  where: {
    OR: [
      {
        title: { contains: term }, // Missing closing parenthesis
      },
      {
        content: { contains: term },
      },
    ],
  }
  });
}


export function fetchPostsByTopicSlug(slug: string): Promise<PostWIthData[]> {
  return db.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}

export function fetchTopPosts(): Promise<PostWIthData[]> {
  return db.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    take: 5,
  });
}


