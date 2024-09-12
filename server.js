import fs from 'fs';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App'; // Ensure this points to your App component
import { fileURLToPath } from 'url';
import process from 'process';

// Set up path resolution for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
app.use(express.static(path.resolve(__dirname, 'dist')));

// Ensure the correct template path
const templatePath = path.resolve(__dirname, 'dist', 'index.html');

app.get('*', (req, res) => {
  const context = {};

  // Render the React app to a string
  const appHtml = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  // Use Helmet to extract the meta tags and other head elements
  const helmet = Helmet.renderStatic();

  // Read the index.html file from the dist folder
  fs.readFile(templatePath, 'utf-8', (err, template) => {
    if (err) {
      console.error('Error reading template:', err);
      return res.status(500).send('Error loading template');
    }

    // Inject the server-rendered app and Helmet meta tags into the template
    const html = template
      .replace(`<!--app-html-->`, appHtml)
      .replace(`<!--title-->`, helmet.title.toString())
      
      .replace(`<!--meta-->`, helmet.meta.toString());

    // Send the final HTML response
    res.status(200).send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
