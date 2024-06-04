import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart(props) {
	const { data, title } = props;
	return (
		<Pie
			data={data}
			options={{
				responsive: true,
				plugins: {
					legend: {
						position: "bottom",
					},
					title: {
						display: true,
						text: title,
					},
				},
			}}
			title="Pie Chart"
		></Pie>
	);
}

export default PieChart;
