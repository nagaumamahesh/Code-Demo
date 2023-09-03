const express = require('express');
const app = express();
const cors = require('cors');

const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/' ,(req , res) => {
    res.send("Api is running")
});

const getToken = async () => {
    const response = await fetch("http://20.244.56.144/train/auth", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
            "companyName": "pvpsit",
            "clientID": "e8d88923-3f98-4ded-9593-593b7e236142",
            "clientSecret": "YzYMuIyMUIHBLdqd",
            "ownerName": "Uma Mahesh",
            "ownerEmail": "nandi.umamahesh.2003@gmail.com",
            "rollNo": "20501a05d1"
      }),
    });
    const result = await response.json();
    const { access_token } = result;
    return access_token;
};

app.get("/api/trains", async (req, res, next) => {
  const token = await getToken();
  const response = await fetch("http://20.244.56.144/train/trains", {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  const result = await response.json();

  result.sort((a, b) => {
      // Ascending order of price
      const priceComparison = a.price.sleeper - b.price.sleeper;

      // Descending order of tickets (sleeper)
      const sleeperComparison = b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;

      // Descending order of departure time (in hours)
      const departureComparison = b.departureTime.Hours - a.departureTime.Hours;

      // If price is the same, sort by sleeper tickets and departure time
      if (priceComparison === 0) {
          if (sleeperComparison === 0) {
              return departureComparison;
          }
          return sleeperComparison;
      }

      return priceComparison;
  });

  return res.json({
      success: true,
      result,
  });
});

  app.get("/api/trains/:id", async (req, res, next) => {
    const { id } = req.params;
    const token = await getToken();
    const response = await fetch(`http://20.244.56.144/train/trains/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return res.json({
      success: true,
      result,
    });
  });


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})