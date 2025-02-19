import React, { useState, useEffect } from "react";
import { fetchFriends } from "../api";
import "../styles/Friends.css";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getFriends = async () => {
      try {
        const data = await fetchFriends();
        setFriends(data.friends);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch friends.");
        setLoading(false);
      }
    };

    getFriends();
  }, []);

  return (
    <div className="friends-container">
      <h2>Friends List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend._id} className={`friend-item ${friend.status.toLowerCase()}`}>
              <img src={friend.profile_picture || "/default-avatar.png"} alt="Profile" className="friend-avatar" />
              <span className="friend-name">{friend.username}</span>
              <span className={`friend-status ${friend.status.toLowerCase()}`}>{friend.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
