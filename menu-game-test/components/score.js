class Score {
  constructor(scoreJSON) {
    this.initials = scoreJSON.initials
    this.score = scoreJSON.score
  }

  render() {
    return `${this.initials} - ${this.score}`
  }
}
