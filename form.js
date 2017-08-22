document.addEventListener('DOMContentLoaded', function() {


	form = document.getElementById('high-score')
	submit = document.getElementById('submit')
	initials = document.getElementById('initials')
	score = document.getElementById('score')

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		data = {
			initials: initials.value,
			score: score.value
		}

		fetch("http://localhost:3000/api/v1/scores", {
			method: "POST",
			body: JSON.stringify({data}),
			headers: {
				"Content-Type": "application/json"
			}
		})

	})

})