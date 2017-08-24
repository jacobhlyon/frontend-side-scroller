class ScoreListAdapter {
  constructor(){
    this.baseUrl = 'http://localhost:3000/api/v1/scores'
  }

  getScores(){
    return fetch(this.baseUrl)
      .then(res => res.json())
  }

  createScore(newScore){
    let data = {
      initials: newScore.initials,
      score: newScore.score
    }
    return fetch(this.baseUrl, {
			method: "POST",
			body: JSON.stringify({data}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(res => res.json)
  }

  deleteNote(scoreId) {
  const deleteUrl = `${this.baseUrl}/${noteId}`
  const noteDeleteParams = {
    method: 'DELETE',
    headers: {
      'Content-Type':'application/json'
      }
    }
    return fetch(deleteUrl,noteDeleteParams).then( resp => resp.json() )
  }




}
