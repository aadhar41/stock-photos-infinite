import React from 'react';

const Photo = ({
  id,
  urls: { regular, full },
  alt_description,
  likes,
  user: { name, portfolio_url, profile_image: { small } },
}) => {
  return (
    <>
      <article className='photo' key={id}>
        <img src={regular} alt={alt_description} className='photo' />
        <div className='photo-info'>
          <div>
            <h4 className="photo-title">{alt_description}</h4>
            <p>{likes} likes</p>
          </div>
          <a href={portfolio_url} className="user-img" target="_blank" >
            <img src={small} alt={name} className="user-img" />
          </a>
        </div>
      </article>
    </>
  );
}

export default Photo
