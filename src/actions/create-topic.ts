'use server'

import { auth } from "@/auth";
import { z } from "zod";  
import type { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/db";
import paths from "@/paths";
import { revalidatePath } from "next/cache";



const createTopicSchema = z.object({
    title: z.string().min(3).regex(/[a-z-]/, {message: "Must be lowercase letters or dashes without spaces"}),
    description: z.string().min(10),
  })

interface CreateTopicFormState {
  errors: {
    title?: string[];
    description?: string[];
    _form?: string[];
  }
}

export async function createTopic(formStateData: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {

  const result = createTopicSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();

  if(!session || !session.user) {
    return {
      errors: {
        _form: ['Please Sign in to make a topic']
      }
    }
  }

  let topic: Topic
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.title,
        description: result.data.description
      }
    })

  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message]
        }
      }
  } else {
    return {
      errors: {
        _form: ['Something went wrong']
      }
    }
  }
}
  revalidatePath('/')
  redirect(paths.topicShow(topic.slug))


  // todo: revalidate homepage
 
}

