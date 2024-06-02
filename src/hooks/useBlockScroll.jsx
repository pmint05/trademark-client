import { useState } from "react";

export default function useBlockScroll() {
	const [isBlocked, setIsBlocked] = useState(false);

	function blockScroll() {
		if (!isBlocked) {
			document.body.style.overflow = "hidden";
			setIsBlocked(true);
		}
	}

	function enableScroll() {
		if (isBlocked) {
			document.body.style.overflow = "auto";
			setIsBlocked(false);
		}
	}

	return [blockScroll, enableScroll, isBlocked];
}
