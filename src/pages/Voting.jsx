import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Voting.css";

export default function Voting({ candidates, setCandidates }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("candidates")) || [];
    setCandidates(data);
  }, [setCandidates]);

  const vote = (candidate) => {
    let votedUsers = JSON.parse(localStorage.getItem("votedUsers")) || {};

    if (!votedUsers[currentUser]) {
      votedUsers[currentUser] = {};
    }

    if (votedUsers[currentUser][candidate.post]) {
      alert(`Already voted for ${candidate.post}`);
      return;
    }

    const updated = candidates.map((c) =>
      c.id === candidate.id ? { ...c, votes: c.votes + 1 } : c
    );

    setCandidates(updated);
    localStorage.setItem("candidates", JSON.stringify(updated));

    votedUsers[currentUser][candidate.post] = true;
    localStorage.setItem("votedUsers", JSON.stringify(votedUsers));
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getWinner = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  const winnerAnnounced = localStorage.getItem("winnerAnnounced") === "true";

  return (
    <div className="voting-page">
      <div className="vote-header">
        <div>
          <h2>⚡ Voting Dashboard</h2>
          <p>Choose your favorite candidate</p>
        </div>

        <div className="vote-header-buttons">
          <button onClick={() => navigate("/admin-login")} className="admin">⚙ Admin</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h2 className="vote-welcome">
        Welcome, {currentUser?.toUpperCase()} 👋
      </h2>

      <div className="vote-cards-container">
        {candidates.map((c) => {
          const votedUsers = JSON.parse(localStorage.getItem("votedUsers")) || {};
          const alreadyVoted = votedUsers[currentUser]?.[c.post] || false;

          return (
            <div key={c.id} className="vote-card">
              <img src={c.image} alt={c.name} />
              <div className="vote-card-content">
                <h3>{c.name}</h3>
                <p className="vote-post">{c.post}</p>
                <p>Votes: {c.votes}</p>
                <button onClick={() => vote(c)} disabled={alreadyVoted}>
                  👍 {alreadyVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {winnerAnnounced && (
        <div className="winner-section">
          {getWinner() ? (
            <h2>
              🏆 Winner: {getWinner().name} ({getWinner().post}) with {getWinner().votes} votes
            </h2>
          ) : (
            <h2>No winner yet</h2>
          )}
        </div>
      )}
    </div>
  );
}

