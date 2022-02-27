# File Transfer
Azure Function to transfer files between storage containers

Part of five Azure Functions to validate file checksum, transfer to target blob and process acknowledgment

## Repositories
- [validate-checksum](https://github.com/johnwatson484/validate-checksum)
- [transfer-trigger](https://github.com/johnwatson484/transfer-trigger)
- [file-transfer](https://github.com/johnwatson484/file-transfer)
- [create-acknowledgement](https://github.com/johnwatson484/create-acknowledgement)
- [acknowledgement-trigger](https://github.com/johnwatson484/acknowledgement-trigger)

## Sequence

```mermaid
flowchart
batch[batch container] --> inbound
inbound[inbound directory] --> A
inbound --> B
A[PENDING_FILENAME.dat] --> validate-checksum
B[PENDING_FILENAME.txt] --> validate-checksum
validate-checksum(validate-checksum) --> C
C[FILENAME.dat] --> trigger-transfer
trigger-transfer(trigger-transfer) --> file-transfer
file-transfer(file-transfer) --> target
target[target container] --> create-acknowledgement
create-acknowledgement(create-acknowledgement) --> D
create-acknowledgement --> topic
D[FILENAME.dat.ack]
topic[acknowledgement topic] --> subscription
subscription[transfer subscription] --> acknowledgement-trigger
acknowledgement-trigger(acknowledgement-trigger) --> file-transfer
file-transfer --> inbound
```

## Prerequisites
- Node.js
- Azure blob storage
  - `batch` container with `inbound` virtual directory
  - `target` container
- Azure Service Bus
  - `acknowledgement` topic with `transfer` subscription
