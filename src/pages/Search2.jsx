import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = ({setFavDogs, onLogout}) => {
	const [breedsData, setBreedsData] = useState([]);
	const [dogsData, setDogsData] = useState([]);
	const pageSize = 25;
	const [curPage, setCurPage] = useState(1);
	const [order, setOrder] = useState('asc');
	const [totalNum, setTotalNum] = useState(0);
	const [favorites, setFavorites] = useState([]);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const [filters, setFilters] = useState({
		selectedBreed: '',
		zipcode: '',
		ageMin: '',
		ageMax: '',
	})

	useEffect(()=>{
		fetchBreeds();
	}, [])

	useEffect(() => {
		fetchDogs();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [order, curPage])

	const fetchDogs = async() =>{
		try{
			const params = new URLSearchParams();
			if(filters.selectedBreed) {
				params.append('breeds', filters.selectedBreed);
			}
			if(filters.zipcode) {
				params.append('zipCodes', filters.zipcode);
			}
			if(filters.ageMax) {
				params.append('ageMax', filters.ageMax);
			}
			if(filters.ageMin) {
				params.append('ageMin', filters.ageMin);
			}
			params.append('size', pageSize);
			params.append('from', (curPage-1)*pageSize);
			params.append('sort', `breed:${order}`);

			/**
			 * get search results
			 */
			const searchResponse = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`, {credentials: "include"})
			if(!searchResponse.ok) {
				throw new Error('Search response not ok!');
			} 
			const {resultIds, total}  = await searchResponse.json();
			// console.log(resultIds);
			console.log(total)
			setTotalNum(total);

			/**
			 * get dog array by IDs
			 */
			const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
				method: "POST",
				credentials: "include",
				headers: {"Content-type": "application/json"},
				body: JSON.stringify(resultIds),
			})
			if(!dogsResponse.ok) {
				throw new Error('dog response not ok!');
			} 

			// console.log(dogsResponse)
			const data = await dogsResponse.json();
			setDogsData(data);
			// console.log(data)
		} catch(error){
			console.error('Error fetching dogs!', error);
		}
	}

	/**
	 * fetch all breeds data
	 */
	const fetchBreeds = async() => {
		try{
			const breedsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {credentials: "include"});
			if(!breedsResponse.ok) {
				throw new Error('breeds response not ok!')
			}
			const breeds = await breedsResponse.json();
			// console.log(breeds)
			setBreedsData(breeds);
		} catch(error) {
			console.error('Error fetching breeds!', error)
		}
	}

	/**
	 * deal with filters
	 */
	const updateFilters = (e) => {
		setFilters({...filters, [e.target.name]: e.target.value})
	}

	const validateFilters = () => {
		const {ageMin, ageMax} = filters;
		if(ageMin < 0 || ageMin > 30 || ageMax < 0 || ageMax > 30) {
			setError('Age must be larger than 0 and less than 30!');
			return false;
		}
		if(ageMin > ageMax){
			setError('Max age must be larger than min age!');
			return false;
		}
		setError('');
		return true;
	}

	const applyFilters = () => {
		if(validateFilters()) {
			setCurPage(1);
			fetchDogs();
		}
	}

	const resetFilters = () =>{
		setFilters({
			selectedBreed: '',
			zipcode: '',
			ageMin: '',
			ageMax: '',
		})
	}

	const handleFavorite = (dog) =>{
		setFavorites(prevFav => prevFav.includes(dog.id)? prevFav.filter(id=>id!==dog.id):[...prevFav, dog.id])
	}

	const handleMatch = () => {
		if(favorites.length>0) {
			setFavDogs(favorites);
			navigate('/match')
		}
	}

	return (
		<div className='search-container'>
			<div className="selector">
				<h1>Search your favorite dogs</h1>
				<select name="selectedBreed" value={filters.selectedBreed}onChange={updateFilters}>
					<option value=''>All Breeds</option>
					{breedsData.map(breed=>(<option key={breed}>{breed}</option>))}
				</select>

				<div>
				<label>Zip code</label><input type="text" name="zipcode" placeholder="Enter Zip Code" value={filters.zipcode} onChange={updateFilters} />
				</div>

				<div>
				<label>Min Age</label><input type="number" name="ageMin" placeholder="Age Min" min='0' max='30' value={filters.ageMin} onChange={updateFilters} />
				<label>Max Age</label><input type="number" name="ageMax" placeholder="Age Max" min='0' max='30' value={filters.ageMax} onChange={updateFilters} />
				<p className="error-message ">{error}</p>
				</div>
				
				<button onClick={applyFilters} className="apply-button">Apply</button>
				<button onClick={resetFilters} className="reset-button">Reset</button>

				<button className="sort-button" onClick={()=>{setOrder(order==='asc' ? 'desc':'asc')}}>
					Sort by Breeds {order==='asc'? 'Ascending':'Descending'}
				</button>
			</div>

			<div className="pagination">
				<button disabled={curPage===1} onClick={()=>setCurPage(prevPage=>(prevPage-1))} className={curPage===1?'disabled-button':''}>
					Previous
				</button>
				<p className="page-num">{curPage}</p>
				<button disabled={curPage*pageSize>=totalNum} onClick={()=>setCurPage(prevPage=>(prevPage+1))} className={curPage*pageSize>=totalNum?'disabled-button':''}>
					Next
				</button>
			</div>

			{dogsData.map(dog=>(
				<div key={dog.id} className="dog-card">
					<img src={dog.img} alt={dog.name} className="dog-img" />
					<div className="dog-info">
						<p>name: {dog.name}</p>
						<p>age: {dog.age}</p>
						<p>breed: {dog.breed}</p>
						<p>zip: {dog.zip_code}</p>
					</div>
					<button className='favorite-button' onClick={()=>handleFavorite(dog)}>{favorites.includes(dog.id)? '★':'☆'}</button>
				</div>
			))}

			{dogsData.length >0 && <div className="pagination">
				<button disabled={curPage===1} onClick={()=>setCurPage(prevPage=>(prevPage-1))} className={curPage===1?'disabled-button':''}>
					Previous
				</button>
				<p className="page-num">{curPage}</p>
				<button disabled={curPage*pageSize>=totalNum} onClick={()=>setCurPage(prevPage=>(prevPage+1))} className={curPage*pageSize>=totalNum?'disabled-button':''}>
					Next
				</button>
			</div>}

			<button onClick={handleMatch} disabled={favorites.length===0} className={favorites.length===0?'disabled-button':''}>
				Go finding Matches
			</button>
			<button onClick={onLogout} className="logout-button">Log out</button>
		</div>
	)
}

export default Search;
