import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatch,
  watched,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    imdbRating: imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Writer: writer,
    BoxOffice: boxOffice,
    Runtime: runtime,
    Plot: plot,
  } = movieDetails;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };
    onAddWatch(newWatchedMovie);
    onCloseMovie();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onCloseMovie]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovieDetails(data);
      setIsLoading(false);
    };
    fetchMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `MOVIE | ${title}`;

    return () => {
      document.title = "usePopcorn";
      // console.log(`Clean up effect for movie ${title}`);
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}{" "}
              </p>
              <p>{genre} </p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already rated this movie - {watchedUserRating}{" "}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors} </p>
            <p> Directed by {director} </p>
          </section>
        </>
      )}
    </div>
  );
}
