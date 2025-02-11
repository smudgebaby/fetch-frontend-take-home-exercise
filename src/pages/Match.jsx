import { useState } from "react";
import './Match.css'

const Match = ({favDogs, onLogout}) => {
	const [matchedData, setMatchedData] = useState([]);

	const generateMatch = async() => {
		/**
		 * get matched dogs id by favorite array
		 */
		const matchResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/match',  {
			method: "POST",
			credentials: "include",
			headers: {"Content-type": "application/json"},
			body: JSON.stringify(favDogs),
		});
		if(!matchResponse.ok) {
			throw new Error('match response not ok!');
		}
		const {match} = await matchResponse.json();
		// console.log({match})

		/**
		 * get dog array by IDs
		 */
		const matchedDogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
			method: "POST",
			credentials: "include",
			headers: {"Content-type": "application/json"},
			body: JSON.stringify([match]),
		})
		if(!matchedDogsResponse.ok) {
			throw new Error('dog response not ok!');
		}
		const matchedDogs = await matchedDogsResponse.json();
		console.log(matchedDogs)
		setMatchedData(matchedDogs);
	}

	return (
		<div className="match-container">
			<button onClick={generateMatch} disabled={favDogs.length===0} className={favDogs.length===0?'disabled-button':'match-button'}>
				Find a match
			</button>
			{matchedData && 
			<div>
				{matchedData.map(dog=>(
					<div key={dog.id} className="dog-card">
						<img src={dog.img} alt={dog.name} className="dog-img" />
						<div className="dog-info">
							<p>name: {dog.name}</p>
							<p>age: {dog.age}</p>
							<p>breed: {dog.breed}</p>
							<p>zip: {dog.zip_code}</p>
						</div>
					</div>))
				}
			</div>}
			{favDogs.length === 0 && <p className="error-message">Please select your favorite dogs!</p>}
			<button onClick={onLogout} className="logout-button">Log out</button>
		</div>
	)
}

export default Match;
