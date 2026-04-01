function WeatherCard({ city }) {
	return (
		<article className="card">
			<div className="card-top">
				<h2>{city.name}</h2>
				<span className="weather-emoji" aria-label={city.description}>
					{city.iconText}
				</span>
			</div>
			<p className="temp">{city.temp} degC</p>
			<p className="desc">{city.description}</p>
			<div className="meta">
				<span>Humidite: {city.humidity}%</span>
				<span>Vent: {city.wind} m/s</span>
			</div>
		</article>
	);
}

export default WeatherCard;
