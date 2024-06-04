// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
	const container = useRef();

	useEffect(() => {
		const script = document.createElement("script");
		script.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "D",
          "timezone": "Asia/Ho_Chi_Minh",
          "theme": "dark",
          "style": "1",
          "locale": "vi_VN",
          "withdateranges": true,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
		container.current.appendChild(script);
	}, []);

	return (
		<div
			className="tradingview-widget-container !h-[90vh] mt-8"
			ref={container}
			style={{
				width: "100%",
				overflow: "hidden",
			}}
		>
			<div
				className="tradingview-widget-container__widget"
				style={{ height: "100%", width: "100%" }}
			></div>
		</div>
	);
}

export default memo(TradingViewWidget);
