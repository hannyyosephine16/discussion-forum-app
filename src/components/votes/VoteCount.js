function VoteCount({ upVotesBy = [], downVotesBy = [] }) {
  const totalVotes = upVotesBy.length - downVotesBy.length;
  
  return (
    <div className="vote-count">
      <span className={`vote-score ${totalVotes > 0 ? 'positive' : totalVotes < 0 ? 'negative' : 'neutral'}`}>
        {totalVotes > 0 ? `+${totalVotes}` : totalVotes}
      </span>
    </div>
  );
}

export default VoteCount;