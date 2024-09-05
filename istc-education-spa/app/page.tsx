import { getWeather } from "@/utils/api/getWeather";

const Home:React.FC = async () => {
  const weather = await getWeather();
  
  return (
    <div className="w-full flex flex-col justify-center items-center space-y-2">
      <p>Welcome to the ISTC Education website</p>
      <div className="border p-4 rounded-md text-white">
        <h1>Weather</h1>
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Home;
