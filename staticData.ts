
import { DesignPhase } from './types';

export const STATIC_DESIGNS: Record<string, Partial<Record<DesignPhase, string>>> = {
  uber: {
    [DesignPhase.REQUIREMENTS]: `
# Uber System Design Requirements
### Functional Requirements
- **User Side**: View nearby drivers, request a ride, track driver location, pay for ride.
- **Driver Side**: Accept/Reject rides, update status.

### Non-Functional Requirements
- **Low Latency**: Location updates must be real-time (<200ms).
- **High Availability**: 99.99% uptime.
    `,
    [DesignPhase.MACHINE_CODING]: `
## 𝗧𝗵𝗲 𝗠𝗮𝗰𝗵𝗶𝗻𝗲 𝗖𝗼𝗱𝗶𝗻𝗴 (𝗧𝗵𝗲 "𝗖𝗿𝗮𝗳𝘁" 𝗧𝗲𝘀𝘁)
• **Format**: 2-hour session to build a working application.
• **The Knowledge**: You aren't just tested on the output. They look at your Class Diagram, Design Patterns (like Strategy or Factory), and how you handle concurrency.

### Task: Driver Matching Engine
Implement a system where a rider's location is matched to the nearest available driver using a Euclidean distance strategy.
    `,
    [DesignPhase.DEEPDIVE]: `
## Deep Dives & Scaling
### Common Task: Design a Kafka-backed Order Event Processor
• **The Knowledge**: This is where you discuss Consistency vs. Latency trade-offs. How do you handle 200k events/min with strict ordering? You need to know Kafka partitioning, Redis caching, and Idempotency inside out.

### Geo-Sharding with Kafka
Use Kafka topic partitioning based on 'Region ID'. This ensures all events for a specific city are processed in order by the same consumer group, maintaining strict sequence for ride status updates.
    `
  },
  'parking-lot': {
    [DesignPhase.REQUIREMENTS]: `
# Parking Lot Requirements
- Support multiple vehicle types (Car, Bike, Truck).
- Support multiple levels/floors.
- Automated ticketing and payment calculation based on duration.
    `,
    [DesignPhase.MACHINE_CODING]: `
## 𝗧𝗵𝗲 𝗠𝗮𝗰𝗵𝗶𝗻𝗲 𝗖𝗼𝗱𝗶𝗻𝗴 (𝗧𝗵𝗲 "𝗖𝗿𝗮𝗳𝘁" 𝗧𝗲𝘀𝘁)
• **Format**: Build a working application in 2 hours.
• **The Knowledge**: Class diagrams must show inheritance/interfaces clearly.

### Java Implementation Strategy
Use the **Factory Pattern** for vehicle creation and the **Singleton Pattern** for the Parking Manager.
    `,
    [DesignPhase.LLD]: `
\`\`\`java
public abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;
}

public class ParkingLot {
    private List<Level> levels;
    private static ParkingLot instance;
    
    public synchronized Ticket parkVehicle(Vehicle v) {
        // Handle concurrency with synchronized blocks
    }
}
\`\`\`
    `
  },
  splitwise: {
    [DesignPhase.MACHINE_CODING]: `
## 𝗧𝗵𝗲 𝗠𝗮𝗰𝗵𝗶𝗻𝗲 𝗖𝗼𝗱𝗶𝗻𝗴: Splitwise
• **Task**: Build a system to add expenses and show balances.
• **Pattern**: Use **Observer Pattern** to notify users of new expenses.
• **Advanced**: Implement the "Simplify Debts" algorithm using a Min/Max Heap to reduce the number of transactions.
    `,
    [DesignPhase.DEEPDIVE]: `
### Common Task: Transaction Event Processor
Discuss how to handle 200k balance updates per minute using Kafka to ensure that "Group Balances" are updated asynchronously but eventually consistent.
    `
  },
  'snake-ladder': {
    [DesignPhase.MACHINE_CODING]: `
## 𝗧𝗵𝗲 𝗠𝗮𝗰𝗵𝗶𝗻𝗲 𝗖𝗼𝗱𝗶𝗻𝗴: Snake & Ladder
• **Format**: Build the game logic for multiple players.
• **The Knowledge**: Clean code and extensibility. How easily can you add a "Super Snake" or a "Magic Portal"?
• **Design**: Use a **Jump interface** for both Snakes and Ladders to keep the code DRY.
    `
  }
};

export const STATIC_DIAGRAMS: Record<string, string> = {
  uber: `graph TD
    R[Rider App] --> AG[API Gateway]
    AG --> KS[Kafka Stream]
    KS --> TS[Trip Service]
    TS --> DB[(PostgreSQL)]`,
  'parking-lot': `graph TD
    E[Entrance] --> TM[Ticket Manager]
    TM --> S[Slot Search]
    S --> L1[Level 1]
    S --> L2[Level 2]`,
  splitwise: `graph TD
    U[User] --> ES[Expense Service]
    ES --> K[Kafka Topic]
    K --> AS[Async Balance Settler]
    AS --> DB[(NoSQL Balances)]`
};
