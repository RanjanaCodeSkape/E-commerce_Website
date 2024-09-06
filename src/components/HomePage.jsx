import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/style.module.css';
import { CiSearch } from "react-icons/ci";
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

const HomePage = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('currentPage');
    navigate('/');
  };

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/version')
        .then((response) => {
            setPokemonData(response.data.results);
            setOriginalData(response.data.results);
            const savedQuery = localStorage.getItem('searchQuery');
            const savedPage = localStorage.getItem('currentPage');
            if (savedQuery) {
              setSearchQuery(savedQuery); 
              const filteredData = response.data.results.filter(f => f.name.toLowerCase().includes(savedQuery.toLowerCase()));
              setPokemonData(filteredData);
            }

            if (savedPage) {
              setCurrentPage(Number(savedPage));
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
  }, []);

  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const PokemonData = pokemonData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(pokemonData.length / recordsPerPage);
  const numbers = [...Array(nPage).keys()].map(n => n + 1);

  const getImageUrl = (url) => {
    const id = url.split('/').filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  const nextPage = () => {
    if (currentPage !== nPage) {
        setCurrentPage(currentPage + 1);
        localStorage.setItem('currentPage', currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
        localStorage.setItem('currentPage', currentPage - 1);
    }
  };

  const changePage = (id) => {
    setCurrentPage(id);
    localStorage.setItem('currentPage', id); 
  };

  const Filter = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value); 
    localStorage.setItem('searchQuery', value); 

    if (value) {
      const filteredData = originalData.filter(f => f.name.toLowerCase().includes(value));
      setPokemonData(filteredData);
      setCurrentPage(1); 
    } else {
      setPokemonData(originalData);
      setCurrentPage(1); 
    }
  };
  const navigateToz = useNavigate()
const navigateToCat = () => {
  navigateToz('/categories')
}

  return (
    <>
      <div className={styles.HomePageWidth}>
        <div className={styles.HomeMainPage}>
          <div className={styles.HomeHeaderPage}>
            <div className={styles.LogoHeader}>
              <img src='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/photography-logo%2C-photography-studio-logo-design-template-42261fff3bd70db2b7e9b5338fa1c03a_screen.jpg?ts=1667205867' alt='' style={{ width: "100px", height: "50px", borderRadius: "10px" }} />
              <h5 style={{ marginLeft: "40px" }}>Home</h5>
              <h5>About</h5>
              <h5>Contact us</h5>
              <h5>Categories</h5>
            </div>
            <div style={{ position: "relative" }} className={styles.SearchDiv}>
              <input 
                type='text' 
                placeholder='Search' 
                style={{ width: "250px" }} 
                className={styles.inputHeader} 
                value={searchQuery} 
                onChange={Filter}
              />
              <CiSearch style={{ position: "absolute", left: "5px", top: "13px", fontSize: "25px" }} />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
        <div className={styles.PokemonDiv}>
          {PokemonData.length > 0 ? (
            PokemonData.map((pokemon) => (
              <div className={styles.pokemonPartDiv} key={pokemon.name}>
                <Card className={styles.pokemonPartDiv1}>
                  <Card.Img
                    src={getImageUrl(pokemon.url)}
                    alt={pokemon.name}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                  <Card.Body style={{ width: "100%", background: "#f0eeee", textAlign: "center" }}>
                    <Card.Title>{pokemon.name}</Card.Title>
                    <button className={styles.btnPokemon} onClick={navigateToCat}>Go Somewhere</button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%" }}>No data Found.....!</p>
          )}
        </div>

        <ul className={`pagination ${styles.pagination}`}>
          <li className='page-item'>
            <a href='#' className='page-link' onClick={prevPage}>Prev</a>
          </li>
          {numbers.map((n) => (
            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
              <a href='#' className='page-link' onClick={() => changePage(n)}>{n}</a>
            </li>
          ))}
          <li className='page-item'>
            <a href='#' className='page-link' onClick={nextPage}>Next</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HomePage;
