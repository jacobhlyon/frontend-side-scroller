class Score {
  constructor(scoreJSON) {
    this.id = scoreJSON.id
    this.initials = scoreJSON.initials
    this.score = scoreJSON.score
  }

  render() {
    return `${this.initials} - ${this.score}`
  }
}
