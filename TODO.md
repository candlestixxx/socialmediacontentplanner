# TODO

## High Priority
- Finish styling the React Native app components (`apps/mobile`) utilizing Nativewind or standard StyleSheet configurations.
- Hook up the NextAuth Session Provider into the React tree (`apps/web/src/app/layout.tsx`) so protected routes block unauthorized access appropriately.

## Medium Priority
- Create the `apps/web/src/app/brand-kit` page matching the completed API schema.
- Implement the `docker-compose.yml` deployment scripts for AWS ECS.

## Low Priority
- Fine tune the RAG Web Scraper (`packages/ai`) to chunk massive articles using LangChain text splitters to avoid hitting OpenAI maximum token limits.
