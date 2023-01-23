import React, { useState, useEffect, createContext } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import styles from "../styles/Discover.module.scss";
import Header from "../components/common/Header"
import SmallCardCarousel from "../components/common/SmallCardCarousel"

export async function getServerSideProps(context) {
	const releases = spotifyApi
		.getNewReleases({ limit: 10, offset: 0, country: "LA" })
		.then((res) => {
			res.body.albums.items.map((release) => {
				return {
					name: release.name,
					id: release.id,
					uri: release.uri,
					coverImage: release.images[1],
				};
			});
		});
	const playlists = spotifyApi
		.getFeaturedPlaylists({ limit: 10, offset: 0, country: "LA" })
		.then((res) => {
			res.body.playlists.items.map((playlist) => {
				return {
					name: playlist.name,
					id: playlist.id,
					uri: playlist.uri,
					coverImage: playlist.images[2],
				};
			});
		});
	return {
		props: { data: { releases, playlists } },
	};
}

export const componentContext = createContext({});

const spotifyApi = new SpotifyWebApi({
	clinentId: "987ea6b51e3b4f4d8d37743bdd385448",
});

function Discover({ code, data }) {
	console.log(data)
	const accessToken = useAuth(code);
	const [hotThisWeek, setHotThisWeek] = useState(data.releases);
	const [newReleases, setNewReleases] = useState(data.releases);
	const [featuredPlaylists, setFeaturedPlaylists] = useState(data.playlists);

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	// useEffect(() => {
	// 	if (!accessToken) return;
	// 	setNewReleases(spotifyApi
	// 		.getNewReleases({ limit: 10, offset: 0, country: "US" })
	// 		.then((res) => {
	// 			res.body.albums.items.map((release) => {
	// 				return {
	// 					name: release.name,
	// 					id: release.id,
	// 					uri: release.uri,
	// 					coverImage: release.images[1],
	// 				};
	// 			});
	// 		}));
	// });

	// useEffect(() => {
	// 	if (!accessToken) return;
	// 	setFeaturedPlaylists(spotifyApi
	// 		.getFeaturedPlaylists({ limit: 10, offset: 0, country: "US" })
	// 		.then((res) => {
	// 			res.body.playlists.items.map((playlist) => {
	// 				return {
	// 					name: playlist.name,
	// 					id: playlist.id,
	// 					uri: playlist.uri,
	// 					coverImage: playlist.images[2],
	// 				};
	// 			});
	// 		}));
	// });

	return (
		<div className={styles.container}>
			<componentContext.Provider value={{ spotifyApi, accessToken }}>
				<Header />
				<div className={styles.container__content}>
					<SmallCardCarousel header={"Hot This Week"} content={newReleases} />
					<SmallCardCarousel header={"New Releases"} content={newReleases} />
					<SmallCardCarousel
						header={"Playlists For You"}
						content={featuredPlaylists}
					/>
				</div>
			</componentContext.Provider>
		</div>
	);
}

export default Discover;
