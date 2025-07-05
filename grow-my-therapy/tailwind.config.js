/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                para: ['"Noto Sans"', 'sans-serif'],
              },
            colors: {
                main1: "#B5DBDF"
            }
        }
    },
    plugins: [],
} 