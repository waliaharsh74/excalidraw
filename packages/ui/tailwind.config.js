// packages/ui/tailwind.config.js
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // Assuming your code is inside the `src` folder
        './dist/**/*.{js,jsx,ts,tsx}', // Assuming your code is inside the `src` folder
        './node_modules/@myorg/ui/**/*.{js,jsx,ts,tsx}', // If you want to include any other packages
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
