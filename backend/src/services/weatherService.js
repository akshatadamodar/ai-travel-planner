import axios from "axios";

export const getPackingSuggestions = async (destination) => {
  try {
    const apiKey =
      process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
    const encodedDestination = encodeURIComponent(destination);

    // Get coordinates
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodedDestination}&limit=1&appid=${apiKey}`
    );

    if (!geoResponse.data.length) {
      return [
        "Passport",
        "Travel documents",
        "Phone charger",
      ];
    }

    const { lat, lon } = geoResponse.data[0];

    // Get current weather
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const temperature = weatherResponse.data.main.temp;
    const condition =
      weatherResponse.data.weather[0].main.toLowerCase();

    let suggestions = [
      "Passport",
      "Travel documents",
      "Phone charger",
      "Power bank",
    ];

    if (temperature < 15) {
      suggestions.push(
        "Winter jacket",
        "Sweater",
        "Warm socks"
      );
    }

    if (temperature >= 15 && temperature <= 28) {
      suggestions.push(
        "Casual clothes",
        "Walking shoes"
      );
    }

    if (temperature > 28) {
      suggestions.push(
        "Light cotton clothes",
        "Sunscreen",
        "Cap",
        "Sunglasses"
      );
    }

    if (condition.includes("rain")) {
      suggestions.push(
        "Umbrella",
        "Waterproof shoes"
      );
    }

    return suggestions;
  } catch (error) {
    console.error("Weather API Error:", error.message);

    return [
      "Passport",
      "Travel documents",
      "Phone charger",
      "Power bank",
    ];
  }
};

export const getWeatherAndPacking = async (destination) => {
  try {
    const apiKey =
      process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
    const encodedDestination = encodeURIComponent(destination);

    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodedDestination}&limit=1&appid=${apiKey}`
    );

    if (!geoResponse.data.length) {
      return {
        weather: "Unavailable",
        temperature: null,
        packingList: [
          "Passport",
          "Travel documents",
          "Phone charger",
        ],
      };
    }

    const { lat, lon } = geoResponse.data[0];

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const temperature = weatherResponse.data.main.temp;
    const weather = weatherResponse.data.weather[0].main;
    const condition = weather.toLowerCase();

    const packingList = [
      "Passport",
      "Travel documents",
      "Phone charger",
      "Power bank",
    ];

    if (temperature < 15) {
      packingList.push(
        "Winter jacket",
        "Sweater",
        "Warm socks"
      );
    }

    if (temperature >= 15 && temperature <= 28) {
      packingList.push(
        "Casual clothes",
        "Walking shoes"
      );
    }

    if (temperature > 28) {
      packingList.push(
        "Light cotton clothes",
        "Sunscreen",
        "Cap",
        "Sunglasses"
      );
    }

    if (condition.includes("rain")) {
      packingList.push(
        "Umbrella",
        "Waterproof shoes"
      );
    }

    return {
      weather,
      temperature,
      packingList,
    };
  } catch (error) {
    console.error("Weather API Error:", error.message);

    return {
      weather: "Unavailable",
      temperature: null,
      packingList: [
        "Passport",
        "Travel documents",
        "Phone charger",
        "Power bank",
      ],
    };
  }
};
