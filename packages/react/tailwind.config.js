/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../core/src/**/*.{js,ts,jsx,tsx,css}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
