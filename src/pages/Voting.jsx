import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Voting.css";

export default function Voting({ candidates, setCandidates }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");

  // Redirect if no user
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Load candidates
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("candidates")) || [];
    setCandidates(data);
  }, [setCandidates]);

  // Load votedUsers ONCE
  const votedUsers =
    JSON.parse(localStorage.getItem("votedUsers")) || {};

  const vote = (candidate) => {
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

  // OPTIMIZED WINNER (runs only when candidates change)
  const winner = useMemo(() => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  }, [candidates]);

  const winnerAnnounced =
    localStorage.getItem("winnerAnnounced") === "true";

  return (
    <div className="voting-page">
      {/* HEADER */}
      <div className="vote-header">
        <div>
          <h2>⚡ Voting Dashboard</h2>
          <p>Choose your favorite candidate</p>
        </div>

        <div className="vote-header-buttons">
          <button
            onClick={() => navigate("/admin-login")}
            className="admin"
          >
            ⚙ Admin
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* WELCOME */}
      <h2 className="welcome">
        Welcome, {currentUser?.toUpperCase()} 👋
      </h2>

      {/* CARDS */}
      <div className="vote-cards-container">
        {candidates.map((c) => {
          const alreadyVoted =
            votedUsers[currentUser]?.[c.post] || false;

          return (
            <div key={c.id} className="vote-card">
              <img src={c.image} alt={c.name} />
              <div className="vote-card-content">
                <h3>{c.name}</h3>
                <p className="post">{c.post}</p>
                <p>Votes: {c.votes}</p>

                <button
                  onClick={() => vote(c)}
                  disabled={alreadyVoted}
                >
                  👍 {alreadyVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WINNER */}
      {winnerAnnounced && (
        <div className="winner-section">
          {winner ? (
            <h2>
              🏆 Winner: {winner.name} ({winner.post}) with{" "}
              {winner.votes} votes
            </h2>
          ) : (
            <h2>No winner yet</h2>
          )}
        </div>
      )}
    </div>
  );
}