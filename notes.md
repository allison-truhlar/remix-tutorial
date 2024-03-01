# Generating a new Remix project

- Navigate to the directory you want to initialize in
- Run the command npx create-remix@latest
- Alternatively, once more comfortable with Remix, you can use a template from Remix Resources

# Project structure

Tree structure of the starter app:

```
directory_name
├── README.md
├── app
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx
│   └── routes
│       └── _index.tsx
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── remix.config.js
├── remix.env.d.ts
└── tsconfig.json
```

Key files:

- app/ - where all the Remix app code goes
- app/entry.client.tsx - the first bit of JS that runs when the app loads in the browser. Used to hydrate React components.
- app/entry.server.tsx - first bit of JS that runs when a request hits your server. Remix handles loading all the necessary data, and you're responsible for sending back the response. We'll use this file to render the React app to a string/stream and send that as our response to the client.
- app/root.tsx - this is where to put the root component for the application. Render the <html> element here!
- app/routes/ - where all your 'route modules' go. Remix uses the files in this directory to create the URL routes for your app based on the naming of the route modules (files).
- public/ - where static assets go (images/fonts/etc.)
- remix.config.js - Remix has some configuration options that you can set in this file

## More project structure - build

- Run npm run build to generate the production build.

- This will result in a build/ directory, public/build directory, and .cache directory (used interally by Remix). All are added to the .gitignore file.

- The build/ directory is the server-side code. It is a module that you run inside a server like Express, Netlify, Vercel, etc. If you don't care to set up your own server, you can use remix-serve, a simple express-based server maintained by the Remix team. However, it is expected that many, if not most, production apps will have their own server.
- public/build/ holds all our client-side code.

# Working on your project

- In app/root.tsx, add the <LiveReload /> component to auto-refresh the browser whenever you make a change. Like this:
  import { LiveReload } from "@remix-run/react";

```
export default function App() {
  return (
    <html lang="en">
      <head>
       ...
      </head>
      <body>
        Hello world
        <LiveReload />
      </body>
    </html>
  );
}
```

- Use npm run dev to start the dev server on http://localhost:3000

## Routing

- Use `<Outlet/>` components on parent routes, both the root at root.tsx and on any nested parent routes (e.g., `/jokes/`, which is the parent route for `jokes/_index`, `/jokes/:jokeId`, and `jokes/new`).

- Parameterized routes use the `$` character in the filename. E.g., `jokes/$jokeId` where `$jokeId` can be anything. You can look up that part of the URL and use it to find things in a database, for example.

##Styling

- Just like normal styling on the web (e.g., `<link rel="stylesheet" href="/path-to-file.css/>`), Remix uses `link` tags to add styling. In Remix, you associate `link` tags to routes. When the route is active, the `link` tag is on the page and CSS applies. When the route is not active (the user navigates away), the `link` tag is removed and CSS no longer applies.
- You add styling by
  1. Exporting a `links` function ([documentation](https://remix.run/docs/en/main/route/links)) in your route module you want the CSS applied to.
  2. Adding the built-in `<Links/>` component in the `<head>` of `app/root.tsx`. This is how Remix gets all the `link` function exports from the active rotues and adds `<link/>` tags to all of them.
- Note: any styles added at the root will be global styles.

## Loaders

- To load data in a Remix route module, you use a `loader`.
- A `loader` is an `async` function that you export from the route module. It returns a response, which you access in the route component through the `useLoaderData` hook.

Example:

```
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  return json({
    sandwiches: await db.sandwich.findMany(),
  });
};

export default function Sandwiches() {
  const data = useLoaderData<typeof loader>();
  return (
    <ul>
      {data.sandwiches.map((sandwich) => (
        <li key={sandwich.id}>{sandwich.name}</li>
      ))}
    </ul>
  );
}
```

- In the `loader`, you can filter out what data you want from the databaseor API before it is returned to the loader function. This way, you only send what is necessary to the client.
- To access URL parameters in your loader, like `/jokes/:jokeId`:

```
import type {LoaderFunctionArgs} from "@remix/node"

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  console.log(params); // <-- {jokeId: "123"}
};
```

And here's how you would access the individual joke from Prisma, inside the loader:

```
const joke = await db.joke.findUnique({
  where: { id: jokeId },
});
if (!joke){
  throw new Error("Joke not found")
}
return json({joke})
```

- **Note** - whatever is returned from the loader will be exposed to the client, even if you don't render it. Therefore, you should always filter out sensitive data you don't want exposed to the client, like passwords.
- **Note** - the tutorial does not cover using [assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) on the `data` you get back from `useLoaderData`. This is necessary to ensure the data you get back from the server is correct (type safety), in case someone messed with the server data. They recommend [zod](https://npm.im/zod) for this.
