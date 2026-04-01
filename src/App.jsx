import { useCallback, useEffect, useMemo, useState } from "react";
import Controls from "./components/Controls";
import Pagination from "./components/Pagination";
import TemperatureChart from "./components/TemperatureChart";
import WeatherCard from "./components/WeatherCard";
import { fetchWeatherByCity, geocodeCityByName } from "./services/weatherApi";

const ITEMS_PER_PAGE = 4;
const DEFAULT_CITY_NAMES = [
	"Paris",
	"Lyon",
	"Marseille",
	"Toulouse",
	"Nice",
	"Bordeaux",
	"Nantes",
	"Lille",
	"Strasbourg",
	"Montpellier",
];

function App() {
	const [trackedCities, setTrackedCities] = useState([]);
	const [weatherData, setWeatherData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [cityToAdd, setCityToAdd] = useState("");
	const [sortMode, setSortMode] = useState("none");
	const [targetTemp, setTargetTemp] = useState(20);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const initCities = async () => {
			const results = await Promise.allSettled(
				DEFAULT_CITY_NAMES.map((name) => geocodeCityByName(name)),
			);

			const cityObjects = results
				.filter((item) => item.status === "fulfilled")
				.map((item) => item.value);

			setTrackedCities(cityObjects);
			if (cityObjects.length === 0) {
				setError(
					"Impossible d'initialiser les villes. Vérifie ta connexion internet.",
				);
			}
		};

		initCities();
	}, []);

	const refreshWeather = useCallback(async () => {
		setIsLoading(true);
		setError("");

		try {
			const result = await Promise.allSettled(
				trackedCities.map(async (city) => fetchWeatherByCity(city)),
			);

			const successful = result
				.filter((item) => item.status === "fulfilled")
				.map((item) => item.value);

			const rejected = result.filter((item) => item.status === "rejected");
			const failedCount = rejected.length;

			setWeatherData(successful);
			if (failedCount > 0) {
				setError(
					`Certaines villes n'ont pas pu être chargées (${failedCount}). Vérifie la connexion reseau.`,
				);
			}
		} catch {
			setError("Erreur reseau. Impossible de récupérer les donnees météo.");
		} finally {
			setIsLoading(false);
		}
	}, [trackedCities]);

	useEffect(() => {
		refreshWeather();
	}, [refreshWeather]);

	useEffect(() => {
		setCurrentPage(1);
	}, [search, sortMode, targetTemp]);

	const filteredAndSortedData = useMemo(() => {
		const filtered = weatherData.filter((city) =>
			city.name.toLowerCase().includes(search.toLowerCase().trim()),
		);

		const sorted = [...filtered];

		if (sortMode === "temp-asc") {
			sorted.sort((a, b) => a.temp - b.temp);
		} else if (sortMode === "temp-desc") {
			sorted.sort((a, b) => b.temp - a.temp);
		} else if (sortMode === "target") {
			sorted.sort(
				(a, b) => Math.abs(a.temp - targetTemp) - Math.abs(b.temp - targetTemp),
			);
		}

		return sorted;
	}, [weatherData, search, sortMode, targetTemp]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE),
	);
	const start = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedData = filteredAndSortedData.slice(
		start,
		start + ITEMS_PER_PAGE,
	);

	const chartData = filteredAndSortedData.map((city) => ({
		ville: city.name,
		temperature: city.temp,
	}));

	const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
	const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

	const addCity = async () => {
		const value = cityToAdd.trim();
		if (!value) {
			return;
		}

		const alreadyExists = trackedCities.some(
			(city) => city.name.toLowerCase() === value.toLowerCase(),
		);
		if (alreadyExists) {
			setError("Cette ville est deja présente dans la liste.");
			return;
		}

		setIsLoading(true);
		setError("");
		try {
			const newCity = await geocodeCityByName(value);
			setTrackedCities((prev) => [...prev, newCity]);
			setCityToAdd("");
		} catch {
			setError("Ville introuvable. Essaie un autre nom.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleTargetTempChange = (value) => {
		setTargetTemp(value);
		setSortMode("target");
	};

	return (
		<main className="app">
			<header className="hero">
				<h1>Tableau Météo React</h1>
				<p>
					Application modulaire avec API Open-Meteo, donnees dynamiques et
					interface optimisée.
				</p>
			</header>

			<Controls
				search={search}
				onSearchChange={setSearch}
				cityToAdd={cityToAdd}
				onCityToAddChange={setCityToAdd}
				onAddCity={addCity}
				sortMode={sortMode}
				onSortChange={setSortMode}
				targetTemp={targetTemp}
				onTargetTempChange={handleTargetTempChange}
				onRefresh={refreshWeather}
				isLoading={isLoading}
			/>

			{isLoading && <p className="state">Chargement des donnees...</p>}
			{error && <p className="state error">{error}</p>}

			{!isLoading && (
				<>
					<section className="cards-grid">
						{paginatedData.length === 0 ? (
							<p className="state">
								Aucune ville ne correspond a la recherche.
							</p>
						) : (
							paginatedData.map((city) => (
								<WeatherCard key={city.id} city={city} />
							))
						)}
					</section>

					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPrevPage={prevPage}
						onNextPage={nextPage}
					/>

					<TemperatureChart data={chartData} />
				</>
			)}
		</main>
	);
}

export default App;
