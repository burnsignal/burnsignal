export const sortVotes = (_yesVotes, _noVotes) => {
  let totalVotes = _yesVotes.concat(_noVotes);

  totalVotes.sort((a,b) => { return a - b });
  totalVotes.unshift(0);

  return totalVotes;
}
