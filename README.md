# BrightHR Technical Test

This is Tom Moore's tech test, please contact me if you've got any questions.

## Start up

1. Install Bun: https://bun.sh/docs/installation
2. Use correct node version
```bash
nvm use
```
4. Install packages:

```bash
bun install
```

4. Open dev server:

```bash
 bun run dev
```

## Test
```bash
bun run test
```

## Tech choices

Besides React and Typescript, I've not really used any of these technologies in a professional capacity before, but my usual stack of NextJS and Redux is overkill.

- Vite - As this app is only small, doesn't require SEO or server side logic a lightweight SPA server is the better choice.
- Tan Router - I've used this once before, but I found it very easy to setup and use.
- TypeScript - I cannot not use TypeScript anymore. Main reason is it saves time by catching bugs early.
- Tailwind -It's quick to build with, run, and is easily customisable if needed.

## Notes
I initially wrote the table component to handle absences specifically, but I spent more time on it and separated it out to make it reusable & typesafe.  I could've really kept it simple or used a package, but where's the fun in that?

## What I would add/change:
- In the `absencesToTableRows` function, the `data` (row) key is an array, which is supposed to map to the columns.  It works well and will give a ts warning if a column is missing, but it doesn't handle the order, there are probably some other ts safety improvements I could've made if the array was an object instead.
- On the `/employee/{id}` page the table displays the user's name in the table rows.  To fix this, in the `absencesToTableRows` function I would consider:
  - Add an argument to choose which columns the data will be paired with
  - Add an `employee` varient to the table that replaces the first column
  - Create a new function like `absencesToTableRows` just for the employee table.
- TDD: I don't always do TDD, and I didn't here because I haven't used Tan Router before, made & tested tables very often, nor did I have designs, so I chose to feel it out and make improvements as I went along.  If I had designs and was a bit more sure of how the file structure and UI would look and work I probably would have done more TDD.
- Test the `/employee/{id}` page, I didn't feel I needed to here because it would've been similar but less difficult tests as the index page.
