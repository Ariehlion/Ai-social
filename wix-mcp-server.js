#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const WIX_SITE_ID = '3276cc94-067b-4dd0-b91b-9c40b75ee130';
const WIX_METASITE_ID = '369e8246-4291-4cda-8fac-7329bb789fdc';
const WIX_ACCOUNT_ID = '1fdf8f7f-845e-4dec-be53-ba981fc9c691';
const WIX_API_KEY = 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjdjNmJiOTRjLTRiODItNGY0OC05ZmRiLTViMWQzMDg1NGRlNVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImU2NDA2NmRhLWE4NmUtNDhmYS05MDVhLWVlM2JmOTEyYjk4N1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIxZmRmOGY3Zi04NDVlLTRkZWMtYmU1My1iYTk4MWZjOWM2OTFcIn19IiwiaWF0IjoxNzUzMzU4ODQ4fQ.V9kFxJB_-0J1pPuRq2FFJWNiKrJOQFAxA06x3kRXSRRaGkpO2wve1wSFZKQBhAaO-AhGIeQ2uNJwtbRatqfNLlGDg46VvsJByK6G823vZKoZ-nnALhTfxZ8MbcQHwcRfQ3IBExUo7P84O4OO1HG80Wk8TFHmZpy7_j44yaCPstFlfimVAyrlM_2aamsfYO9Uf88zf1c7hlabfPFsTstqUczNYjNydngJGzjhaNv21ioHSAIfR13UwPgcMHBPwpD_ZymLGLsW6jVmKQ1LGK6eUyqsUHqvq_1QV450aN1fgI5MrwiOsDNkr3czETt-Ock1Q7s7OClh_rypLWBIPnO-tQ';

class WixMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'wix-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'wix_ping',
            description: 'Test connection to Wix API',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'wix_list_collections',
            description: 'List all Wix collections',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'wix_get_collection_items',
            description: 'Get items from a specific Wix collection',
            inputSchema: {
              type: 'object',
              properties: {
                collectionId: {
                  type: 'string',
                  description: 'The ID of the collection to fetch items from',
                },
              },
              required: ['collectionId'],
            },
          },
          {
            name: 'wix_create_blog_post',
            description: 'Create a new blog post in Wix',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the blog post',
                },
                content: {
                  type: 'string',
                  description: 'Content of the blog post',
                },
                slug: {
                  type: 'string',
                  description: 'URL slug for the blog post (optional)',
                },
                status: {
                  type: 'string',
                  enum: ['PUBLISHED', 'DRAFT'],
                  description: 'Status of the blog post',
                },
              },
              required: ['title', 'content'],
            },
          },
          {
            name: 'wix_publish_social_content',
            description: 'Publish social media content to Wix blog',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title for the social content post',
                },
                content: {
                  type: 'string',
                  description: 'Social media content to publish',
                },
                platform: {
                  type: 'string',
                  description: 'Social media platform (e.g., Twitter, LinkedIn, Facebook)',
                },
              },
              required: ['title', 'content', 'platform'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'wix_ping':
            return await this.pingWix();
          case 'wix_list_collections':
            return await this.listCollections();
          case 'wix_get_collection_items':
            return await this.getCollectionItems(args.collectionId);
          case 'wix_create_blog_post':
            return await this.createBlogPost(args);
          case 'wix_publish_social_content':
            return await this.publishSocialContent(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error.message}`
        );
      }
    });
  }

  get headers() {
    return {
      'Authorization': WIX_API_KEY,
      'wix-account-id': WIX_ACCOUNT_ID,
      'Content-Type': 'application/json'
    };
  }

  async pingWix() {
    try {
      const response = await axios.get('https://www.wixapis.com/wix-data/v2/collections', {
        headers: this.headers
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Wix API connection successful! Found ${response.data.collections?.length || 0} collections.`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `🚨 Wix API connection failed: ${error.response?.data || error.message}`
          }
        ]
      };
    }
  }

  async listCollections() {
    try {
      const response = await axios.get('https://www.wixapis.com/wix-data/v2/collections', {
        headers: this.headers
      });
      
      const collections = response.data.collections || [];
      const collectionsList = collections.map(col => 
        `- ${col.displayName} (ID: ${col.id})`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `📊 Wix Collections (${collections.length} found):\n${collectionsList || 'No collections found'}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to list collections: ${error.response?.data || error.message}`);
    }
  }

  async getCollectionItems(collectionId) {
    try {
      const response = await axios.get(
        `https://www.wixapis.com/wix-data/v2/collections/${collectionId}/items`,
        { headers: this.headers }
      );
      
      const items = response.data.items || [];
      
      return {
        content: [
          {
            type: 'text',
            text: `📋 Collection Items (${items.length} found):\n${JSON.stringify(items, null, 2)}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to get collection items: ${error.response?.data || error.message}`);
    }
  }

  async createBlogPost({ title, content, slug, status = 'DRAFT' }) {
    try {
      const response = await axios.post(
        'https://www.wixapis.com/blog/v3/posts',
        {
          post: {
            title,
            contentText: content,
            slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
            status
          }
        },
        { headers: this.headers }
      );
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Blog post created successfully!\nTitle: ${title}\nStatus: ${status}\nPost ID: ${response.data.post?.id || 'Unknown'}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create blog post: ${error.response?.data || error.message}`);
    }
  }

  async publishSocialContent({ title, content, platform }) {
    const blogContent = `
      <h2>Generated Social Media Content for ${platform}</h2>
      <div class="social-content">
        ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
      <p><em>Generated by SocialAI - AI-powered social media content generator</em></p>
    `;

    return await this.createBlogPost({
      title: `${platform} Content: ${title}`,
      content: blogContent,
      slug: `${platform.toLowerCase()}-${title.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Wix MCP server running on stdio');
  }
}

const server = new WixMCPServer();
server.run().catch(console.error);