import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';

// API Configuration
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  // State for loading status, photos array, current page, search input, and final query
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  // Ref to skip effects on initial mount
  const mounted = useRef(false);
  // State to trigger fetching new photos on scroll
  const [newPhotos, setNewPhotos] = useState(false);

  /**
   * Fetches images from Unsplash API.
   * Dynamically switches between regular feed and search results based on 'query'.
   */
  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    // Determine URL based on whether a search query exists
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos((oldPhotos) => {
        // If it's a new search (page 1), replace old photos
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          // If searching but on subsequent pages, append results
          return [...oldPhotos, ...data.results];
        } else {
          // For the main feed, append data
          return [...oldPhotos, ...data];
        }
      });
      setNewPhotos(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // Trigger fetch whenever the page number changes
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [page]);

  /**
   * Effect to handle pagination trigger.
   * Only runs when 'newPhotos' changes and prevents redundant calls during loading.
   */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newPhotos) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
  }, [newPhotos]);

  /**
   * Scroll event handler to detect when user reaches the bottom of the page.
   */
  const scrollEvent = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewPhotos(true);
    }
  };

  // Add scroll listener on component mount and clean up on unmount
  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => window.removeEventListener('scroll', scrollEvent);
  }, []);

  /**
   * Handles search form submission.
   * Resets page to 1 and updates the 'query' state.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    setPage(1);
    setQuery(search);
  }

  return (
    <main>
      <section className="search">
        <form className='search-form'>
          <input
            type="text"
            placeholder='search'
            className='form-input'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={index} {...photo} />
          })}
        </div>
        {/* Display loading indicator at the bottom when fetching more photos */}
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
