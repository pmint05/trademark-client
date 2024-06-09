function formatLongNum(num) {
	if (!num) return 0;
	const len = num.toString().length;
	if (len > 9) return (num / 1e9).toFixed(2) + "B";
	if (len > 6) return (num / 1e6).toFixed(2) + "M";
	if (len > 3) return (num / 1e3).toFixed(2) + "K";
	return num.toString();
}

export default formatLongNum;
