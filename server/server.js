const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
	const code = req.body.code;
	const spotifyApi = new SpotifyWebApi({
		redirectUri: "http://localhost:3000",
		clientId: "987ea6b51e3b4f4d8d37743bdd385448",
		clientSecret: "ddd97f5cdff1464282b36fe946655e13",
	});

	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

app.post("/refresh", (req, res) => {
	const refreshToken = req.body.refreshToken;
	const spotifyApi = new SpotifyWebApi({
		redirectUri: "http://localhost:3000",
		clientId: "987ea6b51e3b4f4d8d37743bdd385448",
		clientSecret: "ddd97f5cdff1464282b36fe946655e13",
		refreshToken,
	});

	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
		})
		.catch((err) => {
      console.log(err)
			res.sendStatus(400);
		});
});

app.listen(3001);
