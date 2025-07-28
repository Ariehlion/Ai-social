import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Read the Wix API key from environment variables
const WIX_API_KEY = process.env.WIX_API_KEY || "your-wix-api-key-here";

const server = new Server(
  {
    name: "wix-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ping",
        description: "Test connection to Wix MCP server",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "listCollections",
        description: "List all CMS Collections from Wix",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "getCollectionItems",
        description: "Get all items from a specific Wix collection",
        inputSchema: {
          type: "object",
          properties: {
            collectionId: {
              type: "string",
              description: "The ID of the collection to retrieve items from",
            },
          },
          required: ["collectionId"],
        },
      },
      {
        name: "listMembers",
        description: "List all site members from Wix",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "createBlogPost",
        description: "Create a new blog post on Wix site",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Blog post title",
            },
            content: {
              type: "string", 
              description: "Blog post content (HTML)",
            },
            slug: {
              type: "string",
              description: "URL slug for the post",
            },
          },
          required: ["title", "content"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "ping":
        return {
          content: [
            {
              type: "text",
              text: "pong - Wix MCP server is running!",
            },
          ],
        };

      case "listCollections":
        try {
          const response = await axios.get(
            "https://www.wixapis.com/wix-data/v2/collections",
            {
              headers: { 
                Authorization: `Bearer ${WIX_API_KEY}`,
                "Content-Type": "application/json"
              },
            }
          );
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error listing collections: ${error.message}`,
              },
            ],
          };
        }

      case "getCollectionItems":
        const collectionId = args?.collectionId;
        if (!collectionId) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Missing collectionId parameter",
              },
            ],
          };
        }

        try {
          const response = await axios.get(
            `https://www.wixapis.com/wix-data/v2/collections/${collectionId}/items`,
            {
              headers: { 
                Authorization: `Bearer ${WIX_API_KEY}`,
                "Content-Type": "application/json"
              },
            }
          );
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text", 
                text: `Error getting collection items: ${error.message}`,
              },
            ],
          };
        }

      case "listMembers":
        try {
          const response = await axios.get(
            "https://www.wixapis.com/members/v1/members",
            {
              headers: { 
                Authorization: `Bearer ${WIX_API_KEY}`,
                "Content-Type": "application/json"
              },
            }
          );
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error listing members: ${error.message}`,
              },
            ],
          };
        }

      case "createBlogPost":
        const { title, content, slug } = args || {};
        if (!title || !content) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Missing title or content parameter",
              },
            ],
          };
        }

        try {
          const response = await axios.post(
            "https://www.wixapis.com/blog/v3/posts",
            {
              post: {
                title,
                contentText: content,
                slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
                status: "DRAFT"
              }
            },
            {
              headers: { 
                Authorization: `Bearer ${WIX_API_KEY}`,
                "Content-Type": "application/json"
              },
            }
          );
          return {
            content: [
              {
                type: "text",
                text: `Blog post created successfully: ${JSON.stringify(response.data, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error creating blog post: ${error.message}`,
              },
            ],
          };
        }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Wix MCP server running on stdio transport");
}

main().catch(console.error);