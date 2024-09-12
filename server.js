import fs from 'fs';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import process from 'process';
import App from './src/App'; // Make sure this path points to your App component

const app = express();

const templatePath = await import('./path/to/index.html').then(module => {
    return path.resolve(module.__dirname, 'dist', 'index.html');
  });
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.resolve(import.meta.url, 'dist')));

app.get('*', async (req, res) => {
  const context = {};

  // Render the app to a string
  const appHtml = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  // Use Helmet to get the head tags like meta tags
  const helmet = Helmet.renderStatic();

  // Read the index.html template
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Inject the rendered app and the helmet meta tags into the template
  const html = template
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--title-->`, helmet.title.toString())
    .replace(`<!--meta-->`, helmet.meta.toString());

  res.status(200).send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
