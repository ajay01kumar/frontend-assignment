import React, { useState } from 'react';
import { TextField, Button, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import "./app.css"
const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	maxWidth: 400,
	margin: '0 auto',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(2),
}));

const App = () => {
	const [stockSymbol, setStockSymbol] = useState('');
	const [selectedDate, setSelectedDate] = useState('');
	const [tradeStatistics, setTradeStatistics] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
			console.log(stockSymbol, selectedDate)
			console.log("in post ")
			try {
				const response = await axios.post('http://localhost:5000/api/fetchStockData', {
					stockSymbol,
					selectedDate,
				});

				setTradeStatistics(response.data);
			} catch (error) {
				console.error('Error fetching trade statistics:', error);
			}
		

	};

	const handleDateChange = (e) => {
		const selectedDate = e.target.value;
		const today = new Date().toISOString().split('T')[0];

		// Check if the selected date is today or in the future
		if (selectedDate >= today) {
			// If the selected date is today or in the future, set it to an empty value
			setSelectedDate('');
		} else {
			// If the selected date is in the past, update the selected date state
			setSelectedDate(selectedDate);
		}
	};

	console.log("tradeStatistics?.length", tradeStatistics?.length)
	return (
		<div>
			<StyledPaper elevation={3}>
				<h2>Stock Trade Statistics</h2>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item sm={12}>
							<TextField
								label="Stock Symbol"
								variant="outlined"
								size='small'
								required
								value={stockSymbol}
								onChange={(e) => setStockSymbol(e.target.value)}
							/>
						</Grid>
						<Grid item sm={12}>
							<TextField
								label="Selected Date"
								type="date"
								variant="outlined"
								size='small'
								required
								InputLabelProps={{
									shrink: true,
								}}
								value={selectedDate}
								onChange={handleDateChange}
							/>

						</Grid>
						<Grid item sm={6}>
							<Button size='small' type="submit" variant="contained" color="primary">
								Get Trade Statistics
							</Button>
						</Grid>
					</Grid>
				</form>
			</StyledPaper>
			{tradeStatistics ?
				<StyledPaper style={{paddingBottom:"2px"}} elevation={3}>
					{tradeStatistics && (
						<div>
							<h2>Trade Statistics</h2>
							<p>Open: {tradeStatistics.open}</p>
							<p>High: {tradeStatistics.high}</p>
							<p>Low: {tradeStatistics.low}</p>
							<p>Close: {tradeStatistics.close}</p>
							<p>Volume: {tradeStatistics.volume}</p>
						</div>
					)}
				</StyledPaper>
				: ""}

		</div>
	);
};

export default App;
