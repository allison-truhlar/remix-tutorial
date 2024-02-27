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

- Use `<Outlet/>` components on index routes, both the main index route (`/`) and on any nested index routes (e.g., `/jokes/`, which is the index for `/jokes/:jokeId` and `jokes/new`).