import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const name = body.get("name");
  const content = body.get("content");
  // we do this type check to be extra sure and to make TypeScript happy
  if (typeof content !== "string" || typeof name !== "string") {
    throw new Error("Form not submitted correctly.");
  }
  const fields = { content, name };
  const joke = await db.joke.create({
    data: fields,
  });
  return redirect(`/jokes/${joke.id}`);
}

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}
