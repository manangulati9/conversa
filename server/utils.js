function generateRoomId(client1Id, client2Id) {
  // Sort the client IDs alphabetically to ensure consistent room ID
  const sortedIds = [client1Id, client2Id].sort();

  // Concatenate the client IDs with a separator
  const roomId = sortedIds.join("-");

  return roomId;
}

module.exports = generateRoomId;
