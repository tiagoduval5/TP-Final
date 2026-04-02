function Controls({
	search,
	onSearchChange,
	cityToAdd,
	onCityToAddChange,
	onAddCity,
	sortMode,
	onSortChange,
	targetTemp,
	onTargetTempChange,
	onRefresh,
	isLoading,
}) {
	return (
		<section className="panel controls">
			<label>
				Recherche de ville
				<input
					type="text"
					placeholder="Ex: Paris"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
				/>
			</label>

			<label>
				Ajouter une ville
				<div className="inline-actions">
					<input
						type="text"
						placeholder="Ex: Tokyo"
						value={cityToAdd}
						onChange={(event) => onCityToAddChange(event.target.value)}
					/>
					<button onClick={onAddCity} disabled={isLoading}>
						Ajouter
					</button>
				</div>
			</label>

			<label>
				Tri
				<select
					value={sortMode}
					onChange={(event) => onSortChange(event.target.value)}
				>
					<option value="none">Aucun tri</option>
					<option value="temp-asc">Température croissante</option>
					<option value="temp-desc">Température décroissante</option>
					<option value="target">Proximité température cible</option>
				</select>
			</label>

			<label>
				Température cible: <strong>{targetTemp}°C</strong>
				<input
					type="range"
					min="0"
					max="40"
					value={targetTemp}
					onChange={(event) => onTargetTempChange(Number(event.target.value))}
				/>
			</label>

			<button className="refresh-btn" onClick={onRefresh} disabled={isLoading}>
				{isLoading ? "Actualisation..." : "Actualiser les données"}
			</button>
		</section>
	);
}

export default Controls;
