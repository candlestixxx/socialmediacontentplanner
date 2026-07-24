# IDEAS

- **SQLite Transition [BLOCKED]:** Formally migrate the local and test environments to SQLite natively using Prisma's multi-schema/multi-provider capabilities instead of custom proxying. *Blocker: Prisma SQLite provider does not natively support Enums which are heavily utilized across this application schema.*
