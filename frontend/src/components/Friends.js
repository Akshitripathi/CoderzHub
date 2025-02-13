import React, { useState } from "react";
import "../styles/Friends.css";

export default function Friends() {
  const [friends, setFriends] = useState([
    { id: 1, name: "Alice", status: "Online" },
    { id: 2, name: "Bob", status: "Offline" },
    { id: 3, name: "Charlie", status: "Online" },
  ]);

  return (
    <div className="friends-container">
      <h2>Friends List</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className={`friend-item ${friend.status.toLowerCase()}`}>
            {friend.name} - {friend.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
