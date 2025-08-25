import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';

@Controller('api/swagger')
export class SwaggerExportController {
  @Get('export/json')
  async exportJson(@Res() res: Response) {
    try {
      // Tạo Swagger document
      const document = SwaggerModule.createDocument(global.app, swaggerConfig);
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="akabotdn-api-spec.json"');
      
      // Send JSON response
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export Swagger JSON' });
    }
  }

  @Get('export/yaml')
  async exportYaml(@Res() res: Response) {
    try {
      // Tạo Swagger document
      const document = SwaggerModule.createDocument(global.app, swaggerConfig);
      
      // Convert to YAML (you'll need to install js-yaml package)
      const yaml = require('js-yaml').dump(document);
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/yaml');
      res.setHeader('Content-Disposition', 'attachment; filename="akabotdn-api-spec.yaml"');
      
      // Send YAML response
      res.send(yaml);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export Swagger YAML' });
    }
  }

  @Get('export/html')
  async exportHtml(@Res() res: Response) {
    try {
      // Tạo Swagger document
      const document = SwaggerModule.createDocument(global.app, swaggerConfig);
      
      // Generate HTML with embedded Swagger UI
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>AkabotDN API Documentation</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
          <style>
            body { margin: 0; padding: 20px; }
            .swagger-ui .topbar { display: none; }
            .swagger-ui .info .title { font-size: 2.5em; }
            .swagger-ui .info .description { font-size: 1.1em; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
          <script>
            window.onload = function() {
              const ui = SwaggerUIBundle({
                spec: ${JSON.stringify(document)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
              });
            };
          </script>
        </body>
        </html>
      `;
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="akabotdn-api-docs.html"');
      
      // Send HTML response
      res.send(html);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export Swagger HTML' });
    }
  }
}
