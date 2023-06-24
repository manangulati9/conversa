function generateRoomId(str1, str2) {
  const combinedString = str1.concat(str2); // Combine the strings
  const alphanumericString = combinedString.replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters
  const sortedString = alphanumericString.split("").sort().join(""); // Sort the characters

  return sortedString;
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = hours + ":" + minutes;
  return currentTime;
}

module.exports = { generateRoomId, getCurrentTime };
