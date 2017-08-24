class ScoreList {
  constructor(){
    this.scoreList = []
    this.adapter = new ScoreListAdapter()
    this.fetchAndLoadScoreList()
  }

  fetchAndLoadScoreList(){
    return this.adapter.getScores()
        .then(scoreListJSON => scoreListJSON.forEach(score => this.scoreList.push(new Score(score) )))
            .catch( () => alert('The server does not appear to be running'))
  }

  addScore(newScore) {
    this.adapter.createScore(newScore)
    .then( scoreJSON => this.scoreList.push(new Score(scoreJSON)) )
  }

  deleteScore(oldScore) {
    this.adapter.deleteScore(oldScore)
  }

  renderAll() {
    let counter = 0
    this.sortScoreArray()
    return this.scoreList.map( score => {
      counter++
      return `${counter}. ` + score.render() })
  }

  sortScoreArray() {
    this.scoreList.sort(function(a, b) {
      return b.score - a.score;
      });
  }

}
