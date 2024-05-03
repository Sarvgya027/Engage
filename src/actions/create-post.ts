"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";
import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { redirect } from "next/dist/server/api-utils";
import { title } from "process";
import { z } from "zod";

const createPostschema = z.object({
  title: z.string().min(3),
  content: z.string().min(1),
});



interface CreatePostProps {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostProps,
  formData: FormData
): Promise<CreatePostProps> {
  const result = createPostschema.safeParse({
    title: formData.get("title"),
    content: formData.get("content") ?? "",
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  const session = await auth();

  if (!session || !session.user) {
    return {
      errors: {
        _form: ["Please Sign in to make a post"],
      },
    };
  }

  const topic = await db.topic.findFirst({
    where: { slug },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Topic not found"],
      },
    };
  }
  

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        topicId: topic.id,
        userId: session.user.id,
      },
      
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong, Failed to create Post"],
        },
      };
    }
  }

  
  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(slug, post.id));
  // revalidate topic show page

  return { errors: { _form: ['Something went wrong, Failed to create Post'] } };
    
}

