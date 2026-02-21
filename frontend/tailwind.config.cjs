/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                aurum: {
                    gold: '#FFD700',
                    dark: '#0A0A0A',
                    slate: '#1E293B',
                    accent: '#3B82F6'
                },
                bloomberg: {
                    blue: '#132149',
                    orange: '#FF8A00',
                    terminal: '#00FF00'
                }
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
