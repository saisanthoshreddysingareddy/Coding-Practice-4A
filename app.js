const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const InitializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};
const convertingToObject = (playerObject) => {
  return {
    playerId: playerObject.player_id,
    playerName: playerObject.player_name,
    jerseyNumber: playerObject.jersey_number,
    role: playerObject.role,
  };
};
// Get Players API
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const players = await db.all(getPlayersQuery);
  response.send(players.map((eachPlayer) => convertingToObject(eachPlayer)));
});
InitializeDbAndServer();

//Get Player API
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const singlePlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const singlePlayerResponse = await db.get(singlePlayerQuery);
  response.send(convertingToObject(singlePlayerResponse));
});

//POST Player API
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const finalPost = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});
