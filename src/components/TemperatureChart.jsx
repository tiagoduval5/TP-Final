import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function TemperatureChart({ data }) {
  return (
    <section className="panel chart-panel">
      <h2>Comparaison des temperatures</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ville" />
            <YAxis unit=" degC" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default TemperatureChart

