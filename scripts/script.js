function showSection(sectionId, linkId) {
	document.querySelectorAll('.hidden-section').forEach(section => section.classList.add('hidden-section'));
	document.getElementById(sectionId).classList.remove('hidden-section');
	document.getElementById(sectionId).classList.add('fade-in');

	document.querySelectorAll('a').forEach(link => link.classList.remove('active'));
	document.getElementById(linkId).classList.add('active');
}

const recommendations = [
	"Stay hydrated: Drink at least 8 glasses of water a day. If you exercise or sweat more, increase your intake.",
	"Follow a balanced diet: Include lean proteins, whole grains, healthy fats, and a variety of colorful fruits and vegetables.",
	"Incorporate strength training: Aim for at least 2-3 sessions per week to improve muscle mass and metabolism.",
	"Prioritize sleep: Establish a bedtime routine to get 7-8 hours of sleep. Avoid screens 1 hour before bed.",
	"Manage stress: Practice mindfulness, yoga, or deep breathing for 10-15 minutes daily.",
	"Monitor your sugar intake: Reduce sugary drinks and snacks to prevent spikes in blood sugar levels.",
	"Stay active: Walk at least 10,000 steps daily or try a 30-minute workout to maintain cardiovascular health."
];

let recIndex = 0;
function rotateRecommendations() {
	document.getElementById('healthRecommendation').innerText = recommendations[recIndex];
	recIndex = (recIndex + 1) % recommendations.length;
}
setInterval(rotateRecommendations, 20000);
rotateRecommendations();

let chatStep = 0;
const chatBotFlow = [
	{
		question: "Hello! What health concern do you have?",
		options: ["fever", "fatigue", "headache"],
		responses: {
			"fever": "Got it, you have a fever. How long have you had this fever?",
			"fatigue": "You're feeling fatigued. How long have you been feeling this way?",
			"feadache": "A headache can be troubling. How long have you been experiencing this?"
		}
	},
	{
		question: "How long have you been experiencing this?",
		options: ["1 day", "1 week", "More than a week"],
		responses: {
			"1 day": "If it's just 1 day, monitor your symptoms and rest well.",
			"1 week": "A week of symptoms could indicate an underlying issue. Consider seeing a doctor.",
			"More than a week": "Persistent symptoms for over a week require medical attention."
		}
	},
	{
		question: "Are you currently on any medication?",
		options: ["yes", "no"],
		responses: {
			"yes": "Please continue with your medication and consult a doctor if symptoms persist.",
			"no": "Consider over-the-counter remedies, but consult a doctor if needed."
		}
	}
];

function handleChat(event) {
	if (event.key === 'Enter') {
		const input = event.target.value.trim();
		if (input) {
			document.getElementById('chatLog').innerHTML += `<div class="text-right my-1">${input}</div>`;
			processUserInput(input);
			event.target.value = '';
		}
	}
}

function processUserInput(input) {
	if (chatStep < chatBotFlow.length) {
		const step = chatBotFlow[chatStep];

		// Check for valid response in the current step
		const validOptions = step.options.map(option => option.toLowerCase());
		if (validOptions.includes(input.toLowerCase())) {
			const responseText = step.responses[input];
			document.getElementById('chatLog').innerHTML += `<div class="my-1">${responseText}</div>`;
			chatStep++;
			setTimeout(showChatResponse, 1000); // Move to the next question
		} else {
			document.getElementById('chatLog').innerHTML += `<div class="my-1">Please select a valid option: ${step.options.join(", ")}</div>`;
		}
	}
}

function showChatResponse() {
	if (chatStep < chatBotFlow.length) {
		const step = chatBotFlow[chatStep];
		document.getElementById('chatLog').innerHTML += `<div class="my-1">${step.question}</div>`;
		document.getElementById('chatLog').innerHTML += `<div class="my-1">Options: ${step.options.join(", ")}</div>`;
	} else {
		document.getElementById('chatLog').innerHTML += `<div class="my-1">Thank you for chatting! Stay healthy.</div>`;
	}
}

// Initialize the chatbot with the first question
document.addEventListener('DOMContentLoaded', () => {
	showChatResponse();
});

async function fetchData() {
	try {
		const response = await fetch('/latest-data');
		const data = await response.json();

		// Ensure that values are displayed only when they are properly fetched
		document.getElementById('temperatureValue').innerText = data.temperature ? `${data.temperature} °C` : "N/A";
		document.getElementById('spo2Value').innerText = data.spo2 !== undefined ? `${data.spo2} %` : "N/A";
		document.getElementById('heartRateValue').innerText = data.heartRate ? `${data.heartRate} bpm` : "N/A";
		document.getElementById('stepCountValue').innerText = data.stepCount ? `${data.stepCount} steps` : "N/A";
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

function renderWeeklyStepsChart() {
	const ctx = document.getElementById('weeklyStepsChart').getContext('2d');
	const weeklySteps = [5000, 8000, 6500, 9000, 7500, 11000, 7000]; // Example data

	new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			datasets: [{
				label: 'Steps',
				data: weeklySteps,
				backgroundColor: '#4caf50',
				borderColor: '#388e3c',
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: { beginAtZero: true }
			}
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	fetchData();
	renderWeeklyStepsChart();
	setInterval(fetchData, 100);
});