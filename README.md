
# City Explorer API

The City Explorer backend complements the City Explorer web application by providing essential APIs and data handling. It ensures seamless delivery of real-time information for urban exploration, including weather forecasts and movie data.

## Version

Current version: v1.0

## Features

- **API Integration**: Manages API calls for weather and movie data.
- **Data Processing**: Processes and formats data for the frontend application.
- **Security**: Ensures secure data handling and API usage.

## Installation

Set up the City Explorer backend with the following steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KatKho/city-explorer-api.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd city-explorer-api
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   - Create a `.env` file in the project root.
   - Add the following environment variables:
     ```
     PORT=your_port_number
     WEATHER_API_KEY=your_weather_api_key_here
     MOVIE_API_KEY=your_movie_api_key_here
     ```

5. **Run the Server**:
   ```bash
   npm start
   ```

## Domain Modeling

The backend architecture is designed to support efficient data handling and API management.

![Domain Modeling](./Domain.png)

## Technology Stack

- **Express.js**: The core framework for handling server-side operations and API requests.
- **Node.js**: Provides the runtime environment for the backend services.

## Contact

For questions or contributions, connect with:

- [Ekaterina Khoroshilova](https://www.linkedin.com/in/ekaterina-khoroshilova)
