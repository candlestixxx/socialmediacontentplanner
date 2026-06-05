# IDEAS.md: Future Expansions & Pivot Concepts

**Aggressive Expansions:**
1.  **AI Auto-Bidding (Ad Spend Pivot):** Instead of just tracking `AdSpend`, we can use the `packages/analytics/src/scoring` logic to automatically pause losing Facebook ads and double the budget on winning variants via the Meta Graph API.
2.  **Native Video/Audio Generation:** Integrate ElevenLabs for TTS and RunwayML/Sora for background B-Roll. Turn the current `VideoProject` script generator into a full end-to-end rendering pipeline.
3.  **Agency Sub-tenancy:** Enhance the `Workspace` model to support white-label domains. Agencies could pay $499/mo to give their clients a branded dashboard under `client.agency.com` to review and approve posts.
4.  **Desktop Port (Electron/Tauri):** Since the Next.js app is highly functional, porting it to Tauri would give users a lightweight, persistent desktop dock icon for instant idea logging and system notifications.
5.  **Multi-Agent RAG Orchestration:** Allow users to assign "Agent Personas" to specific brands. "Brand X is managed by a Sarcastic Tech Reviewer Agent." The agent autonomously scrapes tech news daily and queues draft posts without user prompting.
