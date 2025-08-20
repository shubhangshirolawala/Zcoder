import React from 'react'
import Avatar from 'react-avatar';

function getInitials(username) {
  if (!username) return "";

  // If name length <= 4, return full name
  if (username.length <= 4) {
    return username;
  }

  // Otherwise return initials (first letters of words)
  return username.substring(0, 3) + "..";
}

const client = ({ username }) => {
  const displayName = getInitials(username);

  return (
    <div className="client">
      <Avatar name={displayName} size={50} round="14px" />
      <span className="userName">{displayName}</span>
    </div>
  );
}

export default client
