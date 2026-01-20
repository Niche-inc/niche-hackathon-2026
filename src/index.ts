import {
  client,
  createBusinessVoiceAgent,
  getBusinessVoiceAgents,
  deployBusinessVoiceAgent,
  type Agent,
} from "niche-api-ts";

// Configuration - replace with your actual values
const NICHE_API_BASE_URL = "https://app.nicheandleads.com";
const OAUTH_TOKEN = process.env.NICHE_OAUTH_TOKEN || "2691a9bf7f5307b52197ad92aa39a4d30f6cf20b3eaebf34dded731bb63fcb3b";
const BUSINESS_ID = process.env.NICHE_BUSINESS_ID || "a7a10b58-baff-4762-935c-fe95a7aeb9d4";

// Configure the API client
client.setConfig({
  baseUrl: NICHE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${OAUTH_TOKEN}`,
  },
});

async function createPhoneAgent() {
  console.log("Creating a new phone agent (voice agent)...\n");

  // Create a voice agent
  const { data, error, response } = await createBusinessVoiceAgent({
    path: {
      businessId: BUSINESS_ID,
    },
    body: {
      name: "Customer Support Agent",
      type: "INBOUND", // INBOUND for receiving calls, OUTBOUND for making calls
      conversationFlow: `Greet the caller warmly. Ask how you can help them today. 
        Listen to their question or concern. Provide helpful information or assistance.
        If needed, collect their name and contact information for follow-up.
        Thank them for calling and offer any additional help before ending the call.`,
      customInstructions: `You are a helpful customer support agent.
        Be friendly and professional.
        Help callers with their questions and collect their contact information if needed.`,
      firstMessage:
        "Hi there! Thanks for calling. How can I help you today?",
      personality: {
        tone: "friendly",
        style: "professional",
        description: "A helpful and knowledgeable support representative",
        useEmpathy: true,
        useHumor: false,
      },
      collectFields: ["name", "phone", "email"],
      // Optional: Set activated hours
      activatedHours: {
        timezone: "America/New_York",
        hours: [
          { day: "monday", startTime: "09:00", endTime: "17:00" },
          { day: "tuesday", startTime: "09:00", endTime: "17:00" },
          { day: "wednesday", startTime: "09:00", endTime: "17:00" },
          { day: "thursday", startTime: "09:00", endTime: "17:00" },
          { day: "friday", startTime: "09:00", endTime: "17:00" },
        ],
      },
    },
  });

  if (error) {
    console.error("Failed to create agent:", error);
    console.error("Status:", response.status);
    return null;
  }

  console.log("Agent created successfully!");
  console.log("Agent ID:", data?.id);
  console.log("Agent Name:", data?.name);
  console.log("Agent Type:", data?.type);

  return data;
}

async function listPhoneAgents() {
  console.log("\nListing all phone agents for business...\n");

  const { data, error } = await getBusinessVoiceAgents({
    path: {
      businessId: BUSINESS_ID,
    },
  });

  if (error) {
    console.error("Failed to list agents:", error);
    return;
  }

  console.log(`Found ${data?.items?.length || 0} agent(s):`);
  data?.items?.forEach((agent: Agent) => {
    console.log(`  - ${agent.name} (ID: ${agent.id})`);
    console.log(`    Type: ${agent.type}`);
    console.log(`    On Duty: ${agent.onDuty}`);
    if (agent.phoneNumber) {
      console.log(`    Phone: ${agent.phoneNumber}`);
    }
  });
}

async function deployAgent(voiceAgentId: string) {
  console.log(`\nDeploying agent ${voiceAgentId}...`);

  const { data, error } = await deployBusinessVoiceAgent({
    path: {
      businessId: BUSINESS_ID,
      voiceAgentId,
    },
    body: {},
  });

  if (error) {
    console.error("Failed to deploy agent:", error);
    return null;
  }

  console.log("Agent deployed successfully!");
  console.log("Phone Number:", data?.phoneNumber);

  return data;
}

// Main execution
async function main() {
  try {
    // List existing agents
    await listPhoneAgents();

    // Create a new agent
    const newAgent = await createPhoneAgent();

    if (newAgent?.id) {
      // Deploy the agent to get a phone number
      await deployAgent(newAgent.id);

      // List agents again to see the new one
      await listPhoneAgents();
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

main();
