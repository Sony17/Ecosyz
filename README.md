# Ecosyz

Ecosyz is the web presence for **Open Idea**, a platform focused on bringing together
open research, code, data and design resources. The goal is to help innovators
easily discover and collaborate on open knowledge so they can build, remix and
launch impactful projects.

## Requirements

- Python 3 or Node.js for a simple static web server
- A modern web browser


## Viewing the site locally

The site consists of static HTML and assets. To preview it you only need a
simple web server. If you have Python 3 installed, run:

```bash
python3 -m http.server
```

Then open `http://localhost:8000` in your browser. Any other lightweight static
server (for example `npx http-server` from Node.js) will work as well.

## Deployment

Because everything is static, deployment is straightforward. Copy the repository
contents to any web hosting service or drop them into a content delivery network.
Services like GitHub Pages, Vercel or Netlify can host the files with minimal
configuration.

