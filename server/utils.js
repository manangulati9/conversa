function generateRoomId(str1, str2) {
  const combinedString = str1.concat(str2); // Combine the strings
  const alphanumericString = combinedString.replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters
  const sortedString = alphanumericString.split("").sort().join(""); // Sort the characters

  return sortedString;
}

module.exports = generateRoomId;
