# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

# API Documentation

## Technologies Used

- **Node.js** – JavaScript runtime environment for building scalable and fast applications.
- **NestJS** – A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma** – ORM (Object Relational Mapper) for database management and querying.
- **Redis** – In-memory key-value store used for caching.
- **Docker** – Platform for developing, shipping, and running applications in containers.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Redis](https://www.memurai.com/get-memurai)

### Steps to Install and Run

1. **Clone the repository**:
   ```bash
   https://github.com/lucasvalentian/app-nodejs-codechallenge.git
   cd yape-codechallenge

   docker-compose up --build
   npx prisma migrate dev --name init

   API Endpoints

   curl --location 'http://localhost:3000/transaction' \
    --header 'Content-Type: application/json' \
    --data '{
      "accountExternalIdDebit": "a1f4e567-b8f4-4d72-b3de-97b8e6d33a8d",
      "accountExternalIdCredit": "d1b5f423-458b-4b2d-a6f0-16e8c999a57d",
      "tranferTypeId": 1,
      "value": 2000
    }'

    Get Transaction by ID

    curl --location 'http://localhost:3000/transaction?transactionId=a1f4e567-b8f4-4d72-b3de-97b8e6d33a8d' \
    --header 'Content-Type: application/json'

      {
      "code": 200,
      "message": "OK",
      "data": [
          {
              "transactionExternalId": "d6208b72-0a3f-4bf9-aaf3-b7e8758387b2",
              "transactionType": {
                  "name": "TRANSFER"
              },
              "transactionStatus": {
                  "name": "REJECTED"
              },
              "value": 2000,
              "createdAt": "2025-03-15T00:32:20.426Z"
          }
      ]
    }

