import {violet, mauve} from "@radix-ui/colors"

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./App.jsx"],
	theme: {
		extend: {
			colors: {
				...mauve,
				...violet,
			},
		},
	},
	plugins: [],
};
