'use client';
import { imageCdnUrl } from '@/constants';
import { AppContext } from '@/context/app.context';
import { ModalContext } from '@/context/modal.context';
import { Episode, MovieDetail } from '@/types';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';

export const MovieDetails = ({ movie }: { movie: MovieDetail }) => {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>();
  const [serverType, setServerType] = useState<'hls' | 'embed'>('embed');
  const { dispatch, state } = useContext(ModalContext);
  const appContext = useContext(AppContext);
  const isFavourite = appContext.state.favMovies.some(
    (m) => m.slug === movie?.slug
  );

  useEffect(() => {
    if (!state.hasShown && movie.category.some((c) => c.slug === 'phim-18')) {
      dispatch({
        type: 'WARNING',
        payload: {
          modalType: 'warning',
        },
      });
    }
    if (movie.status !== 'trailer') {
      setSelectedEpisode(movie.episodes[0].server_data[0]);
    }
  }, []);

  return (
    <>
      <div
        style={{ backgroundImage: `url(${imageCdnUrl + movie.poster_url})` }}
        className="bg-cover w-full aspect-video max-h-[800px] relative bg-center"
      >
        <div className="absolute inset-0 bg-black/95 flex items-center">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-8">
            <Image
              src={imageCdnUrl + movie.thumb_url}
              alt={movie.name}
              height={450}
              width={300}
              className="object-cover w-[300px] h-[450px] bg-stone-900 aspect-[2/3] rounded"
              draggable={false}
            />
            <div>
              <h2 className="text-5xl font-extrabold">{movie.name}</h2>
              <span className="text-primary font-bold">
                {movie.origin_name}
              </span>
              <div className="font-medium flex items-center gap-5 my-4">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-white px-2.5 py-1 text-black">
                    {movie.episode_current}
                  </span>
                  <span className="border-2 border-white px-2.5 py-0.5">
                    {movie.quality}
                  </span>
                </div>
                <ul className="flex items-center gap-2">
                  {movie.category.map((g, idx) => (
                    <Link
                      href={`/genres/${g.slug}`}
                      key={g.id}
                      className="hover:text-primary"
                    >
                      {g.name}
                      {idx + 1 !== movie.category.length ? ',' : ''}
                    </Link>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2">
                  <Icon
                    icon="bx:calendar"
                    className="text-primary"
                    height={16}
                  />
                  {movie.year}
                </span>
                <span className="flex items-center gap-2">
                  <Icon
                    icon="akar-icons:clock"
                    className="text-primary"
                    height={16}
                  />
                  {movie.time}
                </span>
                <span className="flex items-center gap-2">
                  <Icon
                    icon="tdesign:subtitle"
                    className="text-primary"
                    height={16}
                  />
                  {movie.lang}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2">
                  <Icon icon="jam:movie" className="text-primary" height={16} />
                  {movie.episode_current} /{' '}
                  {movie.episode_total === '1' ? 'Full' : movie.episode_total}
                </span>
                <div className="flex items-center gap-2 my-2">
                  <Icon
                    icon="grommet-icons:language"
                    className="text-primary"
                    height={16}
                  />
                  <ul className="flex items-center gap-2">
                    {movie.country.map((c, idx) => (
                      <Link
                        href={`/genres/${c.slug}`}
                        key={c.id}
                        className="hover:text-primary"
                      >
                        {c.name}
                        {idx + 1 !== movie.country.length ? ',' : ''}
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: movie.content }}
                className="text-sm"
              />
              <div className="border border-white/5 bg-white/5 px-7 py-4 flex items-center w-max rounded-lg mt-8 gap-5">
                <div className="flex flex-col items-center gap-1 text-sm">
                  <Icon icon="solar:share-bold" height={18} />
                  Share
                </div>
                <span className="block h-12 w-0.5 bg-white/10" />
                <div className="flex items-center gap-3 text-sm font-bold">
                  <button
                    className="rounded-full bg-primary text-black px-8 py-3 disabled:bg-zinc-600 disabled:hover:bg-zinc-600 disabled:text-white"
                    disabled={!movie.trailer_url}
                    onClick={() => {
                      dispatch({
                        type: 'TRAILER',
                        payload: {
                          videoTrailerId: movie.trailer_url.split('v=')[1],
                          modalType: 'trailer',
                        },
                      });
                    }}
                  >
                    Trailer
                  </button>
                  <button
                    className={`${
                      isFavourite
                        ? 'bg-[#f00] border-[#f00]'
                        : 'bg-black/70 border-primary hover:bg-primary hover:text-black'
                    } flex items-center gap-2 rounded-full border-2 px-5 py-2.5 duration-300`}
                    onClick={() => {
                      appContext.dispatch({
                        type: isFavourite ? 'REMOVE' : 'ADD',
                        payload: {
                          slug: movie.slug,
                          thumb_url: movie.thumb_url,
                          name: movie.name,
                        },
                      });
                    }}
                  >
                    <Icon
                      icon={
                        isFavourite
                          ? 'ph:heart-break-fill'
                          : 'solar:heart-linear'
                      }
                      height={20}
                    />
                    {isFavourite ? 'Bỏ yêu thích' : 'Yêu thích'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedEpisode && (
        <div className="mx-auto max-w-7xl">
          <div className="text-sm">
            {movie.episodes.map((server) => (
              <ul key={server.server_name}>
                <p className="text-base font-bold mb-4 mt-8">
                  {server.server_name}
                </p>
                <li
                  className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 text-center gap-2"
                  key={server.server_name}
                >
                  {server.server_data.map((ep) => (
                    <button
                      onClick={() => setSelectedEpisode(ep)}
                      key={ep.slug}
                      className={`
                    ${
                      selectedEpisode?.link_embed === ep.link_embed
                        ? 'bg-primary text-black'
                        : 'bg-white/5'
                    }
                     rounded hover:bg-primary duration-200 py-1 hover:text-black`}
                    >
                      {ep.name}
                    </button>
                  ))}
                </li>
              </ul>
            ))}
          </div>
          {selectedEpisode && (
            <div className="max-w-5xl mx-auto mt-16">
              <div className="flex items-center justify-center gap-2">
                <button
                  className={`rounded px-4 py-0.5 ${
                    serverType === 'embed' ? 'bg-blue-500' : 'bg-white/5'
                  }`}
                  onClick={() => setServerType('embed')}
                >
                  Server 1
                </button>
                <button
                  className={`rounded px-4 py-0.5 ${
                    serverType === 'hls' ? 'bg-blue-500' : 'bg-white/5'
                  }`}
                  onClick={() => setServerType('hls')}
                >
                  Server 2
                </button>
              </div>
              <p className="text-red-500 text-center text-sm mt-2 mb-5">
                Vui lòng đổi server nếu không xem được
              </p>
              <iframe
                src={
                  serverType === 'hls'
                    ? `https://www.hlsplayer.org/play?url=${selectedEpisode.link_m3u8}`
                    : selectedEpisode.link_embed
                }
                className="w-full aspect-video"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};